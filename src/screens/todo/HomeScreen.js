import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import {useState, useRef, useEffect, useMemo} from 'react';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {DrawerActions} from '@react-navigation/native';
import {
  Menu,
  Bell,
  Plus,
  Calendar,
  Flame,
  Star,
  Inbox,
  Sparkles,
} from 'lucide-react-native';

import SearchBar from '../../components/todo/SearchBar';
import FilterTabs from '../../components/todo/FilterTabs';
import TodoList from '../../components/todo/TodoList';
import ConfirmModal from '../../components/common/ConfirmModal';
import Loader from '../../components/common/Loader';

import useTodos from '../../hooks/useTodos';
import useTheme from '../../hooks/useTheme';
import ROUTES from '../../constants/routes';

/* --------------------------- HELPERS --------------------------- */

const pad = v => String(v).padStart(2, '0');
const dateKey = d =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5) return 'Good Night';
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  if (h < 21) return 'Good Evening';
  return 'Good Night';
}

const QUICK_FILTERS = [
  {key: 'today', label: 'Today', Icon: Calendar, color: '#0EA5E9'},
  {key: 'high', label: 'High', Icon: Flame, color: '#EF4444'},
  {key: 'fav', label: 'Favorites', Icon: Star, color: '#F59E0B'},
];

/* --------------------------- COMPONENT ------------------------- */

function HomeScreen({navigation}) {
  const {theme} = useTheme();
  const insets = useSafeAreaInsets();
  const {tasks, loading, toggleTodo, deleteTodo, toggleFavorite} = useTodos();

  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [quickFilter, setQuickFilter] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const styles = createStyles(theme, insets);

  const greeting = useMemo(() => getGreeting(), []);
  const progressAnim = useRef(new Animated.Value(0)).current;

  function openDrawer() {
    navigation.dispatch(DrawerActions.openDrawer());
  }

  function confirmDelete() {
    if (deleteId !== null) {
      deleteTodo(deleteId);
      setDeleteId(null);
    }
  }

  const activeTasks = (tasks || []).filter(t => !t.deleted);
  const completedCount = activeTasks.filter(t => t.completed).length;
  const pendingCount = activeTasks.length - completedCount;
  const progressPercent =
    activeTasks.length === 0
      ? 0
      : Math.round((completedCount / activeTasks.length) * 100);

  const todayKey = dateKey(new Date());

  const filteredTasks = activeTasks.filter(task => {
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q ||
      (task.title || '').toLowerCase().includes(q) ||
      (task.description || '').toLowerCase().includes(q);

    const matchFilter =
      selectedFilter === 'all' ||
      (selectedFilter === 'active' && !task.completed) ||
      (selectedFilter === 'completed' && task.completed);

    const matchQuick =
      !quickFilter ||
      (quickFilter === 'today' && task.dueDate === todayKey) ||
      (quickFilter === 'high' && task.priority === 'high') ||
      (quickFilter === 'fav' && task.favorite);

    return matchSearch && matchFilter && matchQuick;
  });

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressPercent,
      duration: 700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [progressPercent, progressAnim]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Loader fullScreen />
      </SafeAreaView>
    );
  }

  const isEmpty = filteredTasks.length === 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* ============ COMPACT PREMIUM HEADER ============ */}
        <View style={styles.headerCard}>
          {/* Decorative soft circles */}
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />

          {/* TOP ROW: menu + greeting pill + bell */}
          <View style={styles.headerTopRow}>
            <Pressable
              onPress={openDrawer}
              style={styles.iconBtn}
              hitSlop={8}
              accessibilityLabel="Open menu">
              <Menu size={16} color="#FFFFFF" strokeWidth={2.6} />
            </Pressable>

            <View style={styles.greetingPill}>
              <Sparkles size={11} color="#FFFFFF" strokeWidth={2.6} />
              <Text style={styles.greetingText}>{greeting}</Text>
            </View>

            <Pressable
              style={styles.iconBtn}
              hitSlop={8}
              accessibilityLabel="Notifications">
              <Bell size={16} color="#FFFFFF" strokeWidth={2.6} />
              <View style={styles.bellDot} />
            </Pressable>
          </View>

          {/* TITLE + SUBTITLE — single compact row */}
          <View style={styles.titleRow}>
            <View style={{flex: 1}}>
              <Text style={styles.headerTitle}>My Tasks</Text>
              <Text style={styles.headerSubtitle} numberOfLines={1}>
                {activeTasks.length === 0
                  ? 'Ready when you are'
                  : pendingCount === 0
                  ? 'All done. Nice!'
                  : `${pendingCount} task${
                      pendingCount !== 1 ? 's' : ''
                    } to focus on`}
              </Text>
            </View>

            {/* Mini progress ring / pill */}
            {activeTasks.length > 0 && (
              <View style={styles.progressPill}>
                <Text style={styles.progressPillPercent}>
                  {progressPercent}%
                </Text>
                <Text style={styles.progressPillLabel}>
                  {completedCount}/{activeTasks.length}
                </Text>
              </View>
            )}
          </View>

          {/* THIN PROGRESS LINE */}
          {activeTasks.length > 0 && (
            <View style={styles.progressTrack}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
          )}
        </View>

        {/* ============ SEARCH ============ */}
        <SearchBar value={search} onChangeText={setSearch} />

        {/* ============ FILTER TABS ============ */}
        <FilterTabs
          selectedFilter={selectedFilter}
          onChange={setSelectedFilter}
        />

        {/* ============ QUICK CHIPS ============ */}
        <View style={styles.quickRow}>
          {QUICK_FILTERS.map(qf => {
            const active = quickFilter === qf.key;
            const Icon = qf.Icon;
            return (
              <Pressable
                key={qf.key}
                style={[
                  styles.quickChip,
                  active && {
                    backgroundColor: qf.color + '18',
                    borderColor: qf.color,
                  },
                ]}
                onPress={() =>
                  setQuickFilter(prev => (prev === qf.key ? null : qf.key))
                }>
                <Icon
                  size={12}
                  color={active ? qf.color : theme.colors.textSecondary}
                  strokeWidth={2.6}
                  fill={active && qf.key === 'fav' ? qf.color : 'transparent'}
                />
                <Text
                  style={[
                    styles.quickChipText,
                    {
                      color: active ? qf.color : theme.colors.textSecondary,
                    },
                  ]}>
                  {qf.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* ============ LIST / EMPTY ============ */}
        <View style={styles.list}>
          {isEmpty ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconWrap}>
                <Inbox
                  size={34}
                  color={theme.colors.textLight}
                  strokeWidth={1.8}
                />
              </View>
              <Text style={styles.emptyTitle}>
                {search.trim() || quickFilter
                  ? 'No matches found'
                  : selectedFilter === 'completed'
                  ? 'No completed tasks yet'
                  : selectedFilter === 'active'
                  ? 'All caught up!'
                  : 'Your list is empty'}
              </Text>
              <Text style={styles.emptyDesc}>
                {search.trim() || quickFilter
                  ? 'Try changing the filter or search keyword.'
                  : 'Add your first task and start getting things done.'}
              </Text>

              {!search.trim() && !quickFilter && (
                <Pressable
                  style={[
                    styles.emptyBtn,
                    {backgroundColor: theme.colors.primary},
                  ]}
                  onPress={() => navigation.navigate(ROUTES.ADD_TODO)}>
                  <Plus size={15} color="#FFFFFF" strokeWidth={2.8} />
                  <Text style={styles.emptyBtnText}>Add your first task</Text>
                </Pressable>
              )}
            </View>
          ) : (
            <TodoList
              todos={filteredTasks}
              onTodoPress={todo =>
                navigation.navigate(ROUTES.TODO_DETAIL, {todoId: todo.id})
              }
              onToggleTodo={toggleTodo}
              onEditTodo={todo =>
                navigation.navigate(ROUTES.EDIT_TODO, {todoId: todo.id})
              }
              onDeleteTodo={setDeleteId}
              onToggleFavorite={toggleFavorite}
            />
          )}
        </View>

        {/* ============ FAB ============ */}
        <Pressable
          style={styles.addButton}
          onPress={() => navigation.navigate(ROUTES.ADD_TODO)}
          accessibilityRole="button"
          accessibilityLabel="Add new task">
          <Plus size={24} color="#FFFFFF" strokeWidth={2.9} />
        </Pressable>
      </View>

      <ConfirmModal
        visible={deleteId !== null}
        title="Delete Todo?"
        message="This todo will be moved to Trash."
        confirmText="Delete"
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        danger
      />
    </SafeAreaView>
  );
}

/* --------------------------- STYLES ---------------------------- */

function createStyles(theme, insets) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    container: {
      flex: 1,
      paddingHorizontal: theme.spacing.xl,
    },

    /* ============ COMPACT HEADER CARD ============ */
    headerCard: {
      backgroundColor: theme.colors.primary,
      borderRadius: 20,
      paddingHorizontal: 14,
      paddingTop: 12,
      paddingBottom: 14,
      marginTop: 8,
      marginBottom: 14,
      overflow: 'hidden',
      shadowColor: theme.colors.primary,
      shadowOffset: {width: 0, height: 6},
      shadowOpacity: 0.28,
      shadowRadius: 14,
      elevation: 7,
    },

    decorCircle1: {
      position: 'absolute',
      width: 130,
      height: 130,
      borderRadius: 65,
      backgroundColor: 'rgba(255,255,255,0.08)',
      top: -50,
      right: -40,
    },
    decorCircle2: {
      position: 'absolute',
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: 'rgba(255,255,255,0.07)',
      bottom: -30,
      left: -20,
    },

    headerTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },

    iconBtn: {
      width: 34,
      height: 34,
      borderRadius: 11,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255,255,255,0.18)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.22)',
    },

    bellDot: {
      position: 'absolute',
      top: 7,
      right: 8,
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: '#FBBF24',
      borderWidth: 1.2,
      borderColor: '#FFFFFF',
    },

    greetingPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 20,
      backgroundColor: 'rgba(255,255,255,0.18)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.22)',
    },

    greetingText: {
      fontSize: 11,
      fontWeight: '800',
      color: '#FFFFFF',
      letterSpacing: 0.3,
    },

    /* Title row — title + progress pill side by side */
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },

    headerTitle: {
      fontSize: 22,
      fontWeight: '900',
      color: '#FFFFFF',
      letterSpacing: -0.5,
      marginBottom: 2,
    },

    headerSubtitle: {
      fontSize: 12,
      fontWeight: '600',
      color: 'rgba(255,255,255,0.88)',
      letterSpacing: 0.1,
    },

    /* Compact progress pill (right of title) */
    progressPill: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 12,
      backgroundColor: 'rgba(255,255,255,0.18)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.25)',
      minWidth: 56,
    },
    progressPillPercent: {
      fontSize: 14,
      fontWeight: '900',
      color: '#FFFFFF',
      letterSpacing: -0.3,
      lineHeight: 16,
    },
    progressPillLabel: {
      fontSize: 10,
      fontWeight: '700',
      color: 'rgba(255,255,255,0.85)',
      letterSpacing: 0.2,
      marginTop: 1,
    },

    /* Thin progress line */
    progressTrack: {
      height: 5,
      borderRadius: 4,
      backgroundColor: 'rgba(255,255,255,0.22)',
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 4,
      backgroundColor: '#FFFFFF',
    },

    /* ============ QUICK CHIPS ============ */
    quickRow: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 12,
    },
    quickChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 11,
      paddingVertical: 6,
      borderRadius: 11,
      backgroundColor: theme.colors.surface,
      borderWidth: 1.5,
      borderColor: theme.colors.border,
    },
    quickChipText: {
      fontSize: 11.5,
      fontWeight: '800',
      letterSpacing: 0.2,
    },

    /* ============ LIST ============ */
    list: {
      flex: 1,
    },

    /* ============ EMPTY STATE ============ */
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
      paddingBottom: 80,
    },
    emptyIconWrap: {
      width: 80,
      height: 80,
      borderRadius: 26,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surface,
      borderWidth: 1.5,
      borderColor: theme.colors.border,
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 17,
      fontWeight: '800',
      color: theme.colors.text,
      letterSpacing: -0.3,
      marginBottom: 6,
      textAlign: 'center',
    },
    emptyDesc: {
      fontSize: 12.5,
      fontWeight: '500',
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 18,
      maxWidth: 250,
      marginBottom: 20,
    },
    emptyBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 13,
      shadowColor: theme.colors.primary,
      shadowOffset: {width: 0, height: 5},
      shadowOpacity: 0.28,
      shadowRadius: 10,
      elevation: 5,
    },
    emptyBtnText: {
      color: '#FFFFFF',
      fontSize: 13.5,
      fontWeight: '800',
      letterSpacing: 0.2,
    },

    /* ============ FAB ============ */
    addButton: {
      position: 'absolute',
      right: theme.spacing.xl,
      bottom: Math.max(insets.bottom, 12) + 90,
      width: 58,
      height: 58,
      borderRadius: 29,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary,
      shadowColor: theme.colors.primary,
      shadowOffset: {width: 0, height: 8},
      shadowOpacity: 0.42,
      shadowRadius: 14,
      elevation: 10,
      borderWidth: 2,
      borderColor: 'rgba(255,255,255,0.25)',
    },
  });
}

export default HomeScreen;