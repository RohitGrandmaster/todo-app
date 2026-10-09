import React, {useMemo, useState} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {DrawerActions} from '@react-navigation/native';

import useTodos from '../../hooks/useTodos';
import {useTheme} from '../../hooks/useTheme';
import ConfirmModal from '../../components/common/ConfirmModal';

function TrashScreen({navigation}) {
  const {theme} = useTheme();
  const {
    tasks,
    restoreTodo,
    permanentlyDeleteTodo,
  } = useTodos();

  const [confirmPermanentId, setConfirmPermanentId] = useState(null);
  const [confirmEmptyTrash, setConfirmEmptyTrash] = useState(false);

  const trashedTasks = useMemo(
    () => tasks.filter(task => task.deleted === true),
    [tasks],
  );

  function openDrawer() {
    navigation.dispatch(DrawerActions.openDrawer());
  }

  function handleRestore(id) {
    restoreTodo(id);
  }

  function handlePermanentDelete(id) {
    permanentlyDeleteTodo(id);
    setConfirmPermanentId(null);
  }

  function handleEmptyTrash() {
    trashedTasks.forEach(task => {
      permanentlyDeleteTodo(task.id);
    });
    setConfirmEmptyTrash(false);
  }

  const renderItem = ({item}) => {
    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}>
        <View style={styles.topRow}>
          <View
            style={[
              styles.trashIcon,
              {
                backgroundColor: `${theme.colors.danger}14`,
              },
            ]}>
            <Text
              style={[
                styles.trashIconText,
                {
                  color: theme.colors.danger,
                },
              ]}>
              🗑
            </Text>
          </View>

          <View style={styles.content}>
            <Text
              numberOfLines={1}
              style={[
                styles.cardTitle,
                {
                  color: theme.colors.text,
                },
              ]}>
              {item.title}
            </Text>

            {!!item.description && (
              <Text
                numberOfLines={2}
                style={[
                  styles.description,
                  {
                    color: theme.colors.textSecondary,
                  },
                ]}>
                {item.description}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.metaRow}>
          <View
            style={[
              styles.categoryBadge,
              {
                backgroundColor: `${theme.colors.primary}12`,
              },
            ]}>
            <Text
              style={[
                styles.categoryText,
                {
                  color: theme.colors.primary,
                },
              ]}>
              {item.category || 'General'}
            </Text>
          </View>

          <Text
            style={[
              styles.deletedText,
              {
                color: theme.colors.textSecondary,
              },
            ]}>
            In Trash
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={() => handleRestore(item.id)}
            style={({pressed}) => [
              styles.actionButton,
              styles.restoreButton,
              {
                borderColor: theme.colors.border,
                opacity: pressed ? 0.75 : 1,
              },
            ]}>
            <Text
              style={[
                styles.actionText,
                {
                  color: theme.colors.primary,
                },
              ]}>
              Restore
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setConfirmPermanentId(item.id)}
            style={({pressed}) => [
              styles.actionButton,
              {
                backgroundColor: `${theme.colors.danger}10`,
                opacity: pressed ? 0.75 : 1,
              },
            ]}>
            <Text
              style={[
                styles.actionText,
                {
                  color: theme.colors.danger,
                },
              ]}>
              Delete Forever
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
        },
      ]}
      edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={openDrawer} style={styles.menuBtn}>
          <Text style={[styles.menuIcon, {color: theme.colors.text}]}>☰</Text>
        </Pressable>

        <View style={styles.headerText}>
          <Text
            style={[
              styles.eyebrow,
              {
                color: theme.colors.danger,
              },
            ]}>
            RECYCLE BIN
          </Text>

          <Text
            style={[
              styles.title,
              {
                color: theme.colors.text,
              },
            ]}>
            Trash
          </Text>
        </View>

        <View
          style={[
            styles.countBadge,
            {
              backgroundColor: `${theme.colors.danger}12`,
            },
          ]}>
          <Text
            style={[
              styles.countText,
              {
                color: theme.colors.danger,
              },
            ]}>
            {trashedTasks.length}
          </Text>
        </View>
      </View>

      <Text
        style={[
          styles.subtitle,
          {
            color: theme.colors.textSecondary,
          },
        ]}>
        Deleted tasks are kept here until you restore or permanently remove
        them.
      </Text>

      {trashedTasks.length > 0 ? (
        <Pressable
          onPress={() => setConfirmEmptyTrash(true)}
          style={({pressed}) => [
            styles.emptyTrashBtn,
            {
              backgroundColor: `${theme.colors.danger}12`,
              opacity: pressed ? 0.75 : 1,
            },
          ]}>
          <Text style={[styles.emptyTrashText, {color: theme.colors.danger}]}>
            Empty Trash
          </Text>
        </Pressable>
      ) : null}

      <FlatList
        data={trashedTasks}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          trashedTasks.length === 0 && styles.emptyListContent,
        ]}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View
              style={[
                styles.emptyIcon,
                {
                  backgroundColor: `${theme.colors.success}14`,
                },
              ]}>
              <Text style={styles.emptyEmoji}>✓</Text>
            </View>

            <Text
              style={[
                styles.emptyTitle,
                {
                  color: theme.colors.text,
                },
              ]}>
              Trash is empty
            </Text>

            <Text
              style={[
                styles.emptyText,
                {
                  color: theme.colors.textSecondary,
                },
              ]}>
              Deleted tasks will appear here. You can restore them later or
              permanently remove them.
            </Text>
          </View>
        }
      />

      <ConfirmModal
        visible={confirmPermanentId !== null}
        title="Delete Forever?"
        message="This task will be permanently deleted and cannot be recovered."
        confirmText="Delete Forever"
        cancelText="Cancel"
        onConfirm={() => handlePermanentDelete(confirmPermanentId)}
        onCancel={() => setConfirmPermanentId(null)}
        danger
      />

      <ConfirmModal
        visible={confirmEmptyTrash}
        title="Empty Trash?"
        message={`Permanently delete all ${trashedTasks.length} task(s)? This cannot be undone.`}
        confirmText="Empty Trash"
        cancelText="Cancel"
        onConfirm={handleEmptyTrash}
        onCancel={() => setConfirmEmptyTrash(false)}
        danger
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  header: {
    paddingTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  menuBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  menuIcon: {
    fontSize: 22,
    fontWeight: '700',
  },

  headerText: {
    flex: 1,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 5,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.8,
  },

  countBadge: {
    minWidth: 42,
    height: 42,
    paddingHorizontal: 12,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },

  countText: {
    fontSize: 16,
    fontWeight: '800',
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 12,
  },

  emptyTrashBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 12,
  },

  emptyTrashText: {
    fontSize: 13,
    fontWeight: '700',
  },

  listContent: {
    paddingTop: 4,
    paddingBottom: 30,
  },

  emptyListContent: {
    flexGrow: 1,
  },

  card: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  trashIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  trashIconText: {
    fontSize: 20,
  },

  content: {
    flex: 1,
    marginLeft: 12,
    paddingRight: 8,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },

  description: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },

  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },

  categoryText: {
    fontSize: 11,
    fontWeight: '700',
  },

  deletedText: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 'auto',
  },

  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
  },

  actionButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  restoreButton: {
    borderWidth: 1,
  },

  actionText: {
    fontSize: 12,
    fontWeight: '700',
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingBottom: 80,
  },

  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  emptyEmoji: {
    fontSize: 30,
    color: '#22C55E',
    fontWeight: '800',
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    maxWidth: 310,
  },
});

export default TrashScreen;