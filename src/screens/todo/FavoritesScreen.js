import React, {useMemo} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {DrawerActions} from '@react-navigation/native';

import {useTheme} from '../../hooks/useTheme';
import useTodos from '../../hooks/useTodos';

function FavoritesScreen({navigation}) {
  const {theme} = useTheme();
  const {tasks} = useTodos();

  const favoriteTasks = useMemo(
    () => tasks.filter(task => task.favorite === true && !task.deleted),
    [tasks],
  );

  function openDrawer() {
    navigation.dispatch(DrawerActions.openDrawer());
  }

  function openTodoDetail(todoId) {
    navigation.navigate('Task', {
      screen: 'TodoDetail',
      params: {todoId},
    });
  }

  const renderItem = ({item}) => {
    const priorityColor =
      item.priority === 'high'
        ? theme.colors.danger
        : item.priority === 'medium'
        ? theme.colors.warning
        : theme.colors.success;

    return (
      <Pressable
        onPress={() => openTodoDetail(item.id)}

        style={({pressed}) => [
          styles.card,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            opacity: pressed ? 0.92 : 1,
          },
        ]}>
        <View style={styles.topRow}>
          <View
            style={[
              styles.starCircle,
              {
                backgroundColor: `${theme.colors.warning}18`,
              },
            ]}>
            <Text style={styles.star}>★</Text>
          </View>

          <View style={styles.titleContainer}>
            <Text
              numberOfLines={1}
              style={[
                styles.title,
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

          <View
            style={[
              styles.priorityDot,
              {
                backgroundColor: priorityColor,
              },
            ]}
          />
        </View>

        <View style={styles.metaRow}>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: `${theme.colors.primary}12`,
              },
            ]}>
            <Text
              style={[
                styles.badgeText,
                {
                  color: theme.colors.primary,
                },
              ]}>
              {item.category || 'General'}
            </Text>
          </View>

          {!!item.dueDate && (
            <Text
              style={[
                styles.dueDate,
                {
                  color: theme.colors.textSecondary,
                },
              ]}>
              {item.dueDate}
            </Text>
          )}

          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: item.completed
                    ? theme.colors.success
                    : theme.colors.warning,
                },
              ]}
            />

            <Text
              style={[
                styles.statusText,
                {
                  color: theme.colors.textSecondary,
                },
              ]}>
              {item.completed ? 'Done' : 'Active'}
            </Text>
          </View>
        </View>
      </Pressable>
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
                color: theme.colors.primary,
              },
            ]}>
            YOUR COLLECTION
          </Text>

          <Text
            style={[
              styles.headerTitle,
              {
                color: theme.colors.text,
              },
            ]}>
            Favorites
          </Text>
        </View>

        <View
          style={[
            styles.countBadge,
            {
              backgroundColor: `${theme.colors.primary}15`,
            },
          ]}>
          <Text
            style={[
              styles.countText,
              {
                color: theme.colors.primary,
              },
            ]}>
            {favoriteTasks.length}
          </Text>
        </View>
      </View>

      {favoriteTasks.length > 0 && (
        <Text
          style={[
            styles.subtitle,
            {
              color: theme.colors.textSecondary,
            },
          ]}>
          Your most important tasks, saved in one place.
        </Text>
      )}

      <FlatList
        data={favoriteTasks}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          favoriteTasks.length === 0 && styles.emptyListContent,
        ]}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View
              style={[
                styles.emptyIcon,
                {
                  backgroundColor: `${theme.colors.warning}18`,
                },
              ]}>
              <Text style={styles.emptyStar}>★</Text>
            </View>

            <Text
              style={[
                styles.emptyTitle,
                {
                  color: theme.colors.text,
                },
              ]}>
              No favorites yet
            </Text>

            <Text
              style={[
                styles.emptyText,
                {
                  color: theme.colors.textSecondary,
                },
              ]}>
              Mark important tasks as favorites and they will appear here.
            </Text>

            <Pressable
              onPress={() =>
                navigation.navigate('Task', {
                  screen: 'MainTabs',
                  params: {screen: 'HomeTab'},
                })
              }
              style={({pressed}) => [
                styles.actionButton,
                {
                  backgroundColor: theme.colors.primary,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}>
              <Text style={styles.actionButtonText}>View My Tasks</Text>
            </Pressable>
          </View>
        }
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

  headerTitle: {
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
    marginBottom: 18,
  },

  listContent: {
    paddingTop: 4,
    paddingBottom: 30,
  },

  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  starCircle: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  star: {
    fontSize: 20,
    color: '#F59E0B',
  },

  titleContainer: {
    flex: 1,
    paddingRight: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },

  description: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },

  priorityDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginTop: 5,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 16,
    gap: 10,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },

  dueDate: {
    fontSize: 12,
    fontWeight: '600',
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },

  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },

  emptyListContent: {
    flexGrow: 1,
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

  emptyStar: {
    fontSize: 32,
    color: '#F59E0B',
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
    maxWidth: 300,
  },

  actionButton: {
    marginTop: 22,
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 14,
  },

  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default FavoritesScreen;