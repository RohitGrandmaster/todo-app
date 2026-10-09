import {View, Text, Pressable, StyleSheet} from 'react-native';
import {useState} from 'react';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {DrawerActions} from '@react-navigation/native';

import SearchBar from '../../components/todo/SearchBar';
import FilterTabs from '../../components/todo/FilterTabs';
import TodoList from '../../components/todo/TodoList';
import ConfirmModal from '../../components/common/ConfirmModal';
import Loader from '../../components/common/Loader';

import useTodos from '../../hooks/useTodos';
import useTheme from '../../hooks/useTheme';
import ROUTES from '../../constants/routes';

function HomeScreen({navigation}) {
  // ===== HOOKS — hamesha isi order mein, kabhi if ke andar mat dalna =====
  const {theme} = useTheme();                    // 1. useContext
  const insets = useSafeAreaInsets();            // 2. useContext
  const {tasks, loading, toggleTodo, deleteTodo, toggleFavorite} = useTodos(); // 3. useContext
  const [search, setSearch] = useState('');      // 4. useState
  const [selectedFilter, setSelectedFilter] = useState('all'); // 5. useState
  const [deleteId, setDeleteId] = useState(null); // 6. useState
  // ======================================================================

  const styles = createStyles(theme, insets);

  function openDrawer() {
    navigation.dispatch(DrawerActions.openDrawer());
  }

  function confirmDelete() {
    if (deleteId !== null) {
      deleteTodo(deleteId);
      setDeleteId(null);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Loader fullScreen />
      </SafeAreaView>
    );
  }

  const activeTasks = (tasks || []).filter(t => !t.deleted);

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
    return matchSearch && matchFilter;
  });

  const completedCount = activeTasks.filter(t => t.completed).length;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={openDrawer} style={styles.menuBtn}>
            <Text style={styles.menuIcon}>☰</Text>
          </Pressable>

          <View style={styles.headerContent}>
            <Text style={styles.greeting}>Hello 👋</Text>
            <Text style={styles.title}>My Tasks</Text>
            <Text style={styles.subtitle}>
              {completedCount} of {activeTasks.length} completed
            </Text>
          </View>

          <View style={styles.counter}>
            <Text style={styles.counterNumber}>{activeTasks.length}</Text>
            <Text style={styles.counterLabel}>Total</Text>
          </View>
        </View>

        <SearchBar value={search} onChangeText={setSearch} />
        <FilterTabs selectedFilter={selectedFilter} onChange={setSelectedFilter} />

        <View style={styles.list}>
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
        </View>

        <Pressable
          style={styles.addButton}
          onPress={() => navigation.navigate(ROUTES.ADD_TODO)}>
          <Text style={styles.addButtonText}>+</Text>
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
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    menuBtn: {
      width: 42,
      height: 42,
      borderRadius: 12,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    menuIcon: {
      fontSize: 20,
      color: theme.colors.text,
      fontWeight: '700',
    },
    headerContent: {flex: 1},
    greeting: {
      fontSize: theme.typography.bodySmall,
      color: theme.colors.textSecondary,
    },
    title: {
      marginTop: theme.spacing.xs,
      fontSize: 28,
      fontWeight: '800',
      color: theme.colors.text,
    },
    subtitle: {
      marginTop: theme.spacing.xs,
      fontSize: theme.typography.bodySmall,
      color: theme.colors.textSecondary,
    },
    counter: {
      width: 60,
      height: 60,
      borderRadius: theme.radius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary,
    },
    counterNumber: {
      fontSize: theme.typography.subheading,
      fontWeight: '800',
      color: theme.colors.white,
    },
    counterLabel: {
      marginTop: 2,
      fontSize: theme.typography.caption,
      color: theme.colors.white,
    },
    list: {flex: 1},
    addButton: {
      position: 'absolute',
      right: theme.spacing.xl,
      bottom: Math.max(insets.bottom, 12) + 90,
      width: 60,
      height: 60,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary,
      elevation: 7,
    },
    addButtonText: {
      fontSize: 34,
      lineHeight: 36,
      color: theme.colors.white,
    },
  });
}

export default HomeScreen;