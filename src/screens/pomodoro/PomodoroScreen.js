import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  AppState,
} from 'react-native';

import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import {useEffect, useRef, useState} from 'react';

import useTheme from '../../hooks/useTheme';

const FOCUS_MINUTES = [1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 45, 60];
const BREAK_MINUTES = [1, 2, 3, 4, 5, 10, 15];

const MODES = {
  work: {label: 'Focus'},
  shortBreak: {label: 'Short Break'},
  longBreak: {label: 'Long Break'},
};

function PomodoroScreen() {
  const {theme} = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme, insets);

  const [mode, setMode] = useState('work');
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  const endTimeRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);

  const minuteOptions =
    mode === 'work' ? FOCUS_MINUTES : BREAK_MINUTES;

  useEffect(() => {
    const sub = AppState.addEventListener('change', nextState => {
      const wasBackground =
        appStateRef.current === 'background' ||
        appStateRef.current === 'inactive';

      if (wasBackground && nextState === 'active' && running) {
        updateFromClock();
      }
      appStateRef.current = nextState;
    });

    return () => sub.remove();
  }, [running]);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      updateFromClock();
    }, 250);

    return () => clearInterval(interval);
  }, [running]);

  function updateFromClock() {
    if (!endTimeRef.current) return;

    const remaining = Math.max(
      0,
      Math.ceil((endTimeRef.current - Date.now()) / 1000),
    );

    setSecondsLeft(remaining);

    if (remaining === 0) {
      handleTimerComplete();
    }
  }

  function handleTimerComplete() {
    endTimeRef.current = null;
    setRunning(false);

    if (mode === 'work') {
      setCompletedSessions(c => c + 1);
    }
  }

  function startTimer() {
    if (running) return;
    endTimeRef.current = Date.now() + secondsLeft * 1000;
    setRunning(true);
  }

  function pauseTimer() {
    if (!running) return;
    updateFromClock();
    endTimeRef.current = null;
    setRunning(false);
  }

  function resetTimer() {
    endTimeRef.current = null;
    setRunning(false);
    setSecondsLeft(selectedMinutes * 60);
  }

  function changeMode(nextMode) {
    endTimeRef.current = null;
    setRunning(false);
    setMode(nextMode);

    const defaultMin = nextMode === 'work' ? 25 : nextMode === 'shortBreak' ? 5 : 15;
    setSelectedMinutes(defaultMin);
    setSecondsLeft(defaultMin * 60);
  }

  function selectMinutes(mins) {
    if (running) return;
    setSelectedMinutes(mins);
    setSecondsLeft(mins * 60);
  }

  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  const totalSeconds = selectedMinutes * 60;
  const progress = totalSeconds > 0 ? 1 - secondsLeft / totalSeconds : 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Focus</Text>
        <Text style={styles.subtitle}>
          Focus deeply. Take intentional breaks.
        </Text>

        {/* MODE TABS */}
        <View style={styles.modeTabs}>
          {Object.entries(MODES).map(([key, item]) => {
            const selected = mode === key;
            return (
              <Pressable
                key={key}
                style={[
                  styles.modeTab,
                  selected && styles.selectedModeTab,
                ]}
                onPress={() => changeMode(key)}>
                <Text
                  style={[
                    styles.modeText,
                    selected && styles.selectedModeText,
                  ]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* TIMER */}
        <View style={styles.timerCard}>
          <View style={styles.progressRing}>
            <View style={styles.progressBackground} />
            <View
              style={[
                styles.progressIndicator,
                {
                  transform: [{rotate: `${progress * 360}deg`}],
                },
              ]}
            />
            <View style={styles.timerCenter}>
              <Text style={styles.timer}>
                {formatTime(secondsLeft)}
              </Text>
              <Text style={styles.timerStatus}>
                {running ? 'FOCUSING' : 'READY'}
              </Text>
            </View>
          </View>
        </View>

        {/* DURATION CHIPS */}
        <Text style={styles.durationLabel}>
          Duration (minutes)
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}>
          {minuteOptions.map(mins => {
            const selected = selectedMinutes === mins;
            return (
              <Pressable
                key={mins}
                disabled={running}
                onPress={() => selectMinutes(mins)}
                style={[
                  styles.chip,
                  selected && styles.chipSelected,
                  running && styles.chipDisabled,
                ]}>
                <Text
                  style={[
                    styles.chipText,
                    selected && styles.chipTextSelected,
                  ]}>
                  {mins}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* CONTROLS */}
        <View style={styles.controls}>
          {running ? (
            <Pressable
              style={styles.primaryControl}
              onPress={pauseTimer}>
              <Text style={styles.primaryControlText}>
                Pause
              </Text>
            </Pressable>
          ) : (
            <Pressable
              style={styles.primaryControl}
              onPress={startTimer}>
              <Text style={styles.primaryControlText}>
                Start Focus
              </Text>
            </Pressable>
          )}

          <Pressable
            style={styles.resetControl}
            onPress={resetTimer}>
            <Text style={styles.resetText}>Reset</Text>
          </Pressable>
        </View>

        {/* SESSIONS */}
        <View style={styles.sessionCard}>
          <View>
            <Text style={styles.sessionNumber}>
              {completedSessions}
            </Text>
            <Text style={styles.sessionLabel}>
              Sessions completed
            </Text>
          </View>
          <View style={styles.sessionBadge}>
            <Text style={styles.sessionBadgeText}>
              {mode === 'work' ? 'Focus mode' : 'Break mode'}
            </Text>
          </View>
        </View>

        {/* TIP */}
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>Pro Tip</Text>
          <Text style={styles.tipText}>
            Work in focused blocks. Take short breaks to stay sharp all day.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(theme, insets) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: Math.max(insets.bottom, 12) + 110,
    },

    title: {
      fontSize: 28,
      fontWeight: '800',
      color: theme.colors.text,
      letterSpacing: -0.4,
    },

    subtitle: {
      marginTop: 6,
      fontSize: 14,
      lineHeight: 20,
      color: theme.colors.textSecondary,
    },

    modeTabs: {
      flexDirection: 'row',
      marginTop: 20,
      padding: 4,
      borderRadius: 14,
      backgroundColor: theme.colors.border,
    },

    modeTab: {
      flex: 1,
      minHeight: 42,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 11,
    },

    selectedModeTab: {
      backgroundColor: theme.colors.surface,
    },

    modeText: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.textSecondary,
    },

    selectedModeText: {
      fontWeight: '800',
      color: theme.colors.text,
    },

    timerCard: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 28,
      marginBottom: 8,
    },

    progressRing: {
      width: 240,
      height: 240,
      borderRadius: 120,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      backgroundColor: theme.colors.surface,
    },

    progressBackground: {
      position: 'absolute',
      width: 220,
      height: 220,
      borderRadius: 110,
      borderWidth: 16,
      borderColor: theme.colors.border,
    },

    progressIndicator: {
      position: 'absolute',
      width: 220,
      height: 220,
      borderRadius: 110,
      borderWidth: 16,
      borderColor: theme.colors.primary,
      borderLeftColor: 'transparent',
      borderBottomColor: 'transparent',
    },

    timerCenter: {
      alignItems: 'center',
    },

    timer: {
      fontSize: 48,
      fontWeight: '800',
      color: theme.colors.text,
      letterSpacing: 1,
    },

    timerStatus: {
      marginTop: 6,
      fontSize: 12,
      fontWeight: '800',
      letterSpacing: 1.5,
      color: theme.colors.primary,
    },

    durationLabel: {
      marginTop: 20,
      marginBottom: 10,
      fontSize: 13,
      fontWeight: '700',
      color: theme.colors.textSecondary,
    },

    chipsRow: {
      paddingRight: 8,
      gap: 8,
    },

    chip: {
      minWidth: 48,
      height: 44,
      paddingHorizontal: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
    },

    chipSelected: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },

    chipDisabled: {
      opacity: 0.5,
    },

    chipText: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.colors.text,
    },

    chipTextSelected: {
      color: '#FFFFFF',
    },

    controls: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 24,
    },

    primaryControl: {
      flex: 1,
      minHeight: 52,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 14,
      backgroundColor: theme.colors.primary,
    },

    primaryControlText: {
      fontSize: 16,
      fontWeight: '800',
      color: '#FFFFFF',
    },

    resetControl: {
      width: 96,
      minHeight: 52,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },

    resetText: {
      fontSize: 14,
      fontWeight: '800',
      color: theme.colors.text,
    },

    sessionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 20,
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },

    sessionNumber: {
      fontSize: 24,
      fontWeight: '800',
      color: theme.colors.text,
    },

    sessionLabel: {
      marginTop: 2,
      fontSize: 12,
      color: theme.colors.textSecondary,
    },

    sessionBadge: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 99,
      backgroundColor: theme.colors.primarySoft || theme.colors.background,
    },

    sessionBadgeText: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.colors.primary,
    },

    tipCard: {
      marginTop: 14,
      padding: 16,
      borderRadius: 16,
      backgroundColor: theme.colors.primary,
    },

    tipTitle: {
      fontSize: 15,
      fontWeight: '800',
      color: '#FFFFFF',
    },

    tipText: {
      marginTop: 6,
      fontSize: 13,
      lineHeight: 20,
      color: 'rgba(255,255,255,0.88)',
    },
  });
}

export default PomodoroScreen;