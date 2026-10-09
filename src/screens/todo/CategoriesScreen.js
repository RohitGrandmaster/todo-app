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

import useTodos from '../../hooks/useTodos';
import {useTheme} from '../../hooks/useTheme';

const CATEGORY_CONFIG = {
  Personal: {
    icon: '◉',
  },
  Work: {
    icon: '▣',
  },
  Learning: {
    icon: '◆',
  },
  Shopping: {
    icon: '◇',
  },
  Health: {
    icon: '♥',
  },
  Project: {
    icon: '▰',
  },
  General: {
    icon: '●',
  },
};

function CategoriesScreen({navigation}) {
  const {theme} = useTheme();
  const {tasks} = useTodos();

  function openDrawer() {
    navigation.dispatch(DrawerActions.openDrawer());
  }

  function goToTasks() {
    navigation.navigate('Task', {
      screen: 'MainTabs',
      params: {screen: 'HomeTab'},
    });
  }

  const categories = useMemo(() => {
    const categoryMap = {};

    tasks
      .filter(task => !task.deleted)
      .forEach(task => {
        const category = task.category || 'General';

        if (!categoryMap[category]) {
          categoryMap[category] = {
            name: category,
            total: 0,
            completed: 0,
          };
        }

        categoryMap[category].total += 1;

        if (task.completed) {
          categoryMap[category].completed += 1;
        }
      });

    return Object.values(categoryMap).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [tasks]);

  const renderItem = ({item, index}) => {
    const remaining = item.total - item.completed;

    const config =
      CATEGORY_CONFIG[item.name] || CATEGORY_CONFIG.General;

    const progress =
      item.total === 0 ? 0 : item.completed / item.total;

    return (
      <Pressable
        onPress={goToTasks}

        style={({pressed}) => [
          styles.card,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            opacity: pressed ? 0.92 : 1,
          },
        ]}>
        <View style={styles.cardTop}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: `${theme.colors.primary}14`,
              },
            ]}>
            <Text
              style={[
                styles.icon,
                {
                  color: theme.colors.primary,
                },
              ]}>
              {config.icon}
            </Text>
          </View>

          <View style={styles.categoryInfo}>
            <Text
              style={[
                styles.categoryName,
                {
                  color: theme.colors.text,
                },
              ]}>
              {item.name}
            </Text>

            <Text
              style={[
                styles.taskCount,
                {
                  color: theme.colors.textSecondary,
                },
              ]}>
              {item.total} {item.total === 1 ? 'task' : 'tasks'}
            </Text>
          </View>

          <View style={styles.arrowContainer}>
            <Text
              style={[
                styles.arrow,
                {
                  color: theme.colors.textLight,
                },
              ]}>
              ›
            </Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View
            style={[
              styles.progressTrack,
              {
                backgroundColor: theme.colors.border,
              },
            ]}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress * 100}%`,
                  backgroundColor: theme.colors.primary,
                },
              ]}
            />
          </View>

          <Text
            style={[
              styles.progressText,
              {
                color: theme.colors.textSecondary,
              },
            ]}>
            {item.completed}/{item.total} completed
          </Text>
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.statusItem}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: theme.colors.success,
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
              {item.completed} completed
            </Text>
          </View>

          <View style={styles.statusItem}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: theme.colors.warning,
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
              {remaining} active
            </Text>
          </View>
        </View>

        {index === 0 && (
          <View
            style={[
              styles.featuredBadge,
              {
                backgroundColor: `${theme.colors.primary}12`,
              },
            ]}>
            <Text
              style={[
                styles.featuredText,
                {
                  color: theme.colors.primary,
                },
              ]}>
              MOST USED
            </Text>
          </View>
        )}
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
            ORGANIZE YOUR WORK
          </Text>

          <Text
            style={[
              styles.title,
              {
                color: theme.colors.text,
              },
            ]}>
            Categories
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
            {categories.length}
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
        Keep your tasks organized by purpose and priority.
      </Text>

      <FlatList
        data={categories}
        keyExtractor={item => item.name}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          categories.length === 0 && styles.emptyListContent,
        ]}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View
              style={[
                styles.emptyIcon,
                {
                  backgroundColor: `${theme.colors.primary}14`,
                },
              ]}>
              <Text
                style={[
                  styles.emptyIconText,
                  {
                    color: theme.colors.primary,
                  },
                ]}>
                ◆
              </Text>
            </View>

            <Text
              style={[
                styles.emptyTitle,
                {
                  color: theme.colors.text,
                },
              ]}>
              No categories yet
            </Text>

            <Text
              style={[
                styles.emptyText,
                {
                  color: theme.colors.textSecondary,
                },
              ]}>
              Categories will automatically appear when you
              create tasks.
            </Text>

            <Pressable
              onPress={() => navigation.navigate('AddTodo')}
              style={({pressed}) => [
                styles.button,
                {
                  backgroundColor: theme.colors.primary,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}>
              <Text style={styles.buttonText}>
                Create a Task
              </Text>
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
    marginBottom: 18,
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

  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    fontSize: 20,
    fontWeight: '800',
  },

  categoryInfo: {
    flex: 1,
    marginLeft: 13,
  },

  categoryName: {
    fontSize: 17,
    fontWeight: '750',
  },

  taskCount: {
    fontSize: 12,
    marginTop: 3,
  },

  arrowContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  arrow: {
    fontSize: 28,
    fontWeight: '300',
  },

  progressSection: {
    marginTop: 18,
  },

  progressTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 3,
  },

  progressText: {
    fontSize: 11,
    marginTop: 7,
  },

  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    gap: 18,
  },

  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },

  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },

  featuredBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },

  featuredText: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.8,
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
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

  emptyIconText: {
    fontSize: 30,
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

  button: {
    marginTop: 22,
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 14,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default CategoriesScreen;