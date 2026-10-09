import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  PermissionsAndroid,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {DrawerActions} from '@react-navigation/native';
import Sound, {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
} from 'react-native-nitro-sound';

import useTheme from '../../hooks/useTheme';
import {getItem, setItem} from '../../storage/storage';
import APP_CONFIG from '../../constants/appConfig';
import {createId} from '../../utils/helpers';
import ConfirmModal from '../../components/common/ConfirmModal';

// Sound is a singleton instance from react-native-nitro-sound

function formatDuration(ms) {
  const totalSec = Math.floor((ms || 0) / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function VoiceMemosScreen({navigation}) {
  const {theme} = useTheme();
  const styles = createStyles(theme);

  const [memos, setMemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSecs, setRecordSecs] = useState(0);
  const [playingId, setPlayingId] = useState(null);
  const [playSecs, setPlaySecs] = useState(0);
  const [titleDraft, setTitleDraft] = useState('');
  const [pendingPath, setPendingPath] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const recordListener = useRef(null);
  const playListener = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const saved = await getItem(APP_CONFIG.STORAGE_KEYS.VOICE_MEMOS, []);
        setMemos(Array.isArray(saved) ? saved : []);
      } catch (e) {
        console.log('Failed to load voice memos', e);
        setMemos([]);
      } finally {
        setLoading(false);
      }
    }
    load();

    return () => {
      // Cleanup: fire-and-forget (don't await in cleanup)
      Sound.stopRecorder().catch(() => {});
      Sound.removeRecordBackListener();
      Sound.stopPlayer().catch(() => {});
      Sound.removePlayBackListener();
      Sound.removePlaybackEndListener();
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      setItem(APP_CONFIG.STORAGE_KEYS.VOICE_MEMOS, memos).catch(e =>
        console.log('Failed to save voice memos', e),
      );
    }
  }, [memos, loading]);

  function openDrawer() {
    navigation.dispatch(DrawerActions.openDrawer());
  }

  const stopPlayback = useCallback(async () => {
    try {
      await Sound.stopPlayer();
      Sound.removePlayBackListener();
      Sound.removePlaybackEndListener();
    } catch (_) {}
    setPlayingId(null);
    setPlaySecs(0);
  }, []);

  async function requestMicPermission() {
    if (Platform.OS !== 'android') return true;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message:
            'TodoMaster needs access to your microphone to record voice memos.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Permission error:', err);
      return false;
    }
  }

  async function startRecording() {
    try {
      // Request microphone permission on Android before recording
      const hasPermission = await requestMicPermission();
      if (!hasPermission) {
        Alert.alert(
          'Permission Required',
          'Microphone access is required to record voice memos. Please allow it in Settings.',
        );
        return;
      }

      await stopPlayback();

      const path = Platform.select({
        ios: `voice_${Date.now()}.m4a`,
        android: `${Date.now()}.mp3`,
      });

      const audioSet = {
        AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
        AudioSourceAndroid: AudioSourceAndroidType.MIC,
        AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
        AVNumberOfChannelsKeyIOS: 2,
        AVFormatIDKeyIOS: AVEncodingOption.aac,
      };

      await Sound.startRecorder(path, audioSet);
      setIsRecording(true);
      setRecordSecs(0);

      Sound.addRecordBackListener(e => {
        setRecordSecs(e.currentPosition ?? e.current_position ?? 0);
      });
    } catch (e) {
      console.log('Record error', e);
      Alert.alert(
        'Microphone',
        'Unable to start recording. Please allow microphone permission in settings.',
      );
      setIsRecording(false);
    }
  }

  async function stopRecording() {
    try {
      const result = await Sound.stopRecorder();
      Sound.removeRecordBackListener();
      setIsRecording(false);

      if (result) {
        setPendingPath(result);
        setTitleDraft(`Memo ${new Date().toLocaleString()}`);
        setShowSaveModal(true);
      }
    } catch (e) {
      console.log('Stop record error', e);
      setIsRecording(false);
    }
  }

  function saveMemo() {
    if (!pendingPath) {
      setShowSaveModal(false);
      return;
    }

    const title = titleDraft.trim() || `Memo ${new Date().toLocaleString()}`;
    const newMemo = {
      id: createId(),
      title,
      path: pendingPath,
      duration: recordSecs,
      createdAt: Date.now(),
    };

    setMemos(prev => [newMemo, ...prev]);
    setPendingPath(null);
    setTitleDraft('');
    setRecordSecs(0);
    setShowSaveModal(false);
  }

  function cancelSave() {
    setPendingPath(null);
    setTitleDraft('');
    setRecordSecs(0);
    setShowSaveModal(false);
  }

  async function playMemo(memo) {
    try {
      if (playingId === memo.id) {
        await stopPlayback();
        return;
      }

      await stopPlayback();

      await Sound.startPlayer(memo.path);
      setPlayingId(memo.id);
      setPlaySecs(0);

      Sound.addPlayBackListener(e => {
        const pos = e.currentPosition ?? e.current_position ?? 0;
        setPlaySecs(pos);
      });

      Sound.addPlaybackEndListener(e => {
        stopPlayback();
      });
    } catch (e) {
      console.log('Play error', e);
      Alert.alert('Playback', 'Unable to play this memo.');
      setPlayingId(null);
    }
  }

  function handleDelete(id) {
    if (playingId === id) {
      stopPlayback();
    }
    setMemos(prev => prev.filter(m => String(m.id) !== String(id)));
    setDeleteId(null);
  }

  const renderItem = ({item}) => {
    const isPlaying = playingId === item.id;

    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}>
        <View style={styles.cardTop}>
          <View
            style={[
              styles.micIcon,
              {
                backgroundColor: isPlaying
                  ? theme.colors.primarySoft
                  : `${theme.colors.primary}12`,
              },
            ]}>
            <Text style={styles.micEmoji}>{isPlaying ? '🔊' : '🎤'}</Text>
          </View>

          <View style={styles.cardContent}>
            <Text
              numberOfLines={1}
              style={[styles.cardTitle, {color: theme.colors.text}]}>
              {item.title}
            </Text>
            <Text style={[styles.cardMeta, {color: theme.colors.textSecondary}]}>
              {formatDuration(isPlaying ? playSecs : item.duration)}
              {' · '}
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={styles.cardActions}>
          <Pressable
            onPress={() => playMemo(item)}
            style={({pressed}) => [
              styles.actionBtn,
              {
                backgroundColor: isPlaying
                  ? theme.colors.primary
                  : theme.colors.primarySoft,
                opacity: pressed ? 0.8 : 1,
              },
            ]}>
            <Text
              style={[
                styles.actionBtnText,
                {color: isPlaying ? '#FFF' : theme.colors.primary},
              ]}>
              {isPlaying ? 'Stop' : 'Play'}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setDeleteId(item.id)}
            style={({pressed}) => [
              styles.actionBtn,
              {
                backgroundColor: theme.colors.dangerSoft,
                opacity: pressed ? 0.8 : 1,
              },
            ]}>
            <Text style={[styles.actionBtnText, {color: theme.colors.danger}]}>
              Delete
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.safe, {backgroundColor: theme.colors.background}]}
      edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={openDrawer} style={styles.menuBtn}>
          <Text style={[styles.menuIcon, {color: theme.colors.text}]}>☰</Text>
        </Pressable>

        <View style={styles.headerText}>
          <Text style={[styles.eyebrow, {color: theme.colors.primary}]}>
            AUDIO
          </Text>
          <Text style={[styles.title, {color: theme.colors.text}]}>
            Voice Memos
          </Text>
        </View>

        <View
          style={[
            styles.countBadge,
            {backgroundColor: theme.colors.primarySoft},
          ]}>
          <Text style={[styles.countText, {color: theme.colors.primary}]}>
            {memos.length}
          </Text>
        </View>
      </View>

      <Text style={[styles.subtitle, {color: theme.colors.textSecondary}]}>
        Record quick voice notes and play them anytime.
      </Text>

      {/* Record bar */}
      <View
        style={[
          styles.recordBar,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}>
        <View style={styles.recordInfo}>
          <Text style={[styles.recordLabel, {color: theme.colors.text}]}>
            {isRecording ? 'Recording…' : 'Tap to record'}
          </Text>
          <Text
            style={[
              styles.recordTime,
              {color: isRecording ? theme.colors.danger : theme.colors.textSecondary},
            ]}>
            {formatDuration(recordSecs)}
          </Text>
        </View>

        <Pressable
          onPress={isRecording ? stopRecording : startRecording}
          style={({pressed}) => [
            styles.recordBtn,
            {
              backgroundColor: isRecording
                ? theme.colors.danger
                : theme.colors.primary,
              opacity: pressed ? 0.85 : 1,
            },
          ]}>
          <Text style={styles.recordBtnText}>
            {isRecording ? '⏹ Stop' : '🎤 Record'}
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={memos}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.list,
          memos.length === 0 && styles.emptyList,
        ]}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <View
                style={[
                  styles.emptyIcon,
                  {backgroundColor: theme.colors.primarySoft},
                ]}>
                <Text style={styles.emptyEmoji}>🎤</Text>
              </View>
              <Text style={[styles.emptyTitle, {color: theme.colors.text}]}>
                No voice memos yet
              </Text>
              <Text
                style={[styles.emptyText, {color: theme.colors.textSecondary}]}>
                Tap Record to capture your first voice note.
              </Text>
            </View>
          ) : null
        }
      />

      {/* Save title modal */}
      {showSaveModal ? (
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalCard,
              {backgroundColor: theme.colors.surface},
            ]}>
            <Text style={[styles.modalTitle, {color: theme.colors.text}]}>
              Save Voice Memo
            </Text>
            <Text
              style={[styles.modalSub, {color: theme.colors.textSecondary}]}>
              Duration: {formatDuration(recordSecs)}
            </Text>
            <TextInput
              style={[
                styles.modalInput,
                {
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.background,
                },
              ]}
              value={titleDraft}
              onChangeText={setTitleDraft}
              placeholder="Memo title"
              placeholderTextColor={theme.colors.textLight}
              autoFocus
            />
            <View style={styles.modalActions}>
              <Pressable
                onPress={cancelSave}
                style={[
                  styles.modalBtn,
                  {backgroundColor: theme.colors.border},
                ]}>
                <Text style={[styles.modalBtnText, {color: theme.colors.text}]}>
                  Discard
                </Text>
              </Pressable>
              <Pressable
                onPress={saveMemo}
                style={[
                  styles.modalBtn,
                  {backgroundColor: theme.colors.primary},
                ]}>
                <Text style={[styles.modalBtnText, {color: '#FFF'}]}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      ) : null}

      <ConfirmModal
        visible={deleteId !== null}
        title="Delete Memo?"
        message="This voice memo will be permanently deleted."
        confirmText="Delete"
        cancelText="Cancel"
        danger
        onConfirm={() => handleDelete(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </SafeAreaView>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    safe: {flex: 1},
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 12,
    },
    menuBtn: {
      width: 42,
      height: 42,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
    },
    menuIcon: {fontSize: 22, fontWeight: '700'},
    headerText: {flex: 1},
    eyebrow: {
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 1.4,
      marginBottom: 4,
    },
    title: {fontSize: 28, fontWeight: '800', letterSpacing: -0.6},
    countBadge: {
      minWidth: 42,
      height: 42,
      borderRadius: 21,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 12,
    },
    countText: {fontSize: 16, fontWeight: '800'},
    subtitle: {
      fontSize: 14,
      lineHeight: 20,
      marginTop: 6,
      marginBottom: 14,
      paddingHorizontal: 20,
    },
    recordBar: {
      marginHorizontal: 16,
      marginBottom: 14,
      padding: 14,
      borderRadius: 18,
      borderWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    recordInfo: {flex: 1},
    recordLabel: {fontSize: 15, fontWeight: '700'},
    recordTime: {fontSize: 13, marginTop: 3, fontWeight: '600'},
    recordBtn: {
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 14,
    },
    recordBtnText: {color: '#FFF', fontSize: 14, fontWeight: '800'},
    list: {paddingHorizontal: 16, paddingBottom: 40},
    emptyList: {flexGrow: 1},
    card: {
      borderWidth: 1,
      borderRadius: 18,
      padding: 14,
      marginBottom: 12,
    },
    cardTop: {flexDirection: 'row', alignItems: 'center'},
    micIcon: {
      width: 46,
      height: 46,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    micEmoji: {fontSize: 20},
    cardContent: {flex: 1, marginLeft: 12},
    cardTitle: {fontSize: 15, fontWeight: '700'},
    cardMeta: {fontSize: 12, marginTop: 3, fontWeight: '500'},
    cardActions: {flexDirection: 'row', gap: 10, marginTop: 12},
    actionBtn: {
      flex: 1,
      minHeight: 40,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionBtnText: {fontSize: 13, fontWeight: '700'},
    empty: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 30,
      paddingBottom: 60,
    },
    emptyIcon: {
      width: 72,
      height: 72,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    emptyEmoji: {fontSize: 30},
    emptyTitle: {fontSize: 20, fontWeight: '800', marginBottom: 8},
    emptyText: {
      fontSize: 14,
      lineHeight: 21,
      textAlign: 'center',
      maxWidth: 280,
    },
    modalOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.45)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    },
    modalCard: {
      width: '100%',
      maxWidth: 360,
      borderRadius: 20,
      padding: 22,
    },
    modalTitle: {fontSize: 20, fontWeight: '800'},
    modalSub: {fontSize: 13, marginTop: 4, marginBottom: 14},
    modalInput: {
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 15,
      marginBottom: 16,
    },
    modalActions: {flexDirection: 'row', gap: 10},
    modalBtn: {
      flex: 1,
      minHeight: 44,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalBtnText: {fontSize: 14, fontWeight: '700'},
  });
}

export default VoiceMemosScreen;