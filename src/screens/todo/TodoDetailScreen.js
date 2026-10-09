import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {useState} from 'react';

import AppButton from '../../components/common/AppButton';
import ConfirmModal from '../../components/common/ConfirmModal';
import Loader from '../../components/common/Loader';

import useTodos from '../../hooks/useTodos';
import useTheme from '../../hooks/useTheme';

import ROUTES from '../../constants/routes';

function TodoDetailScreen({
  navigation,
  route,
}) {
  const {theme} = useTheme();

  const {
    tasks,
    loading,
    toggleTodo,
    toggleFavorite,
    deleteTodo,
  } = useTodos();

  const styles = createStyles(theme);

  const [showDelete, setShowDelete] =
    useState(false);

  const todo = tasks.find(
    item =>
      String(item.id) ===
      String(route.params?.todoId),
  );

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!todo) {
    return (
      <SafeAreaView
        style={styles.safeArea}>
        <View style={styles.center}>
          <Text style={styles.title}>
            Todo not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  function handleDelete() {
    deleteTodo(todo.id);
    setShowDelete(false);
    navigation.goBack();
  }

  return (
    <SafeAreaView
      style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={
          styles.scrollContent
        }>
        <View style={styles.container}>
          <Pressable
            style={styles.backButton}
            onPress={() =>
              navigation.goBack()
            }>
            <Text
              style={styles.backText}>
              ‹
            </Text>
          </Pressable>

          <View style={styles.header}>
            <Text
              style={styles.title}>
              {todo.title}
            </Text>

            <View
              style={[
                styles.status,
                todo.completed &&
                  styles.statusCompleted,
              ]}>
              <Text
                style={styles.statusText}>
                {todo.completed
                  ? 'Completed'
                  : 'Active'}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text
              style={styles.sectionTitle}>
              Description
            </Text>

            <Text
              style={styles.description}>
              {todo.description ||
                'No description added.'}
            </Text>
          </View>

          <View style={styles.infoGrid}>
            <InfoBox
              title="Category"
              value={todo.category}
              styles={styles}
            />

            <InfoBox
              title="Priority"
              value={todo.priority}
              styles={styles}
            />

            <InfoBox
              title="Due Date"
              value={todo.dueDate}
              styles={styles}
            />

            <InfoBox
              title="Reminder"
              value={
                todo.reminder
                  ? 'On'
                  : 'Off'
              }
              styles={styles}
            />
          </View>

          <View style={styles.actions}>
            <AppButton
              title={
                todo.completed
                  ? 'Mark Active'
                  : 'Complete Todo'
              }
              onPress={() =>
                toggleTodo(todo.id)
              }
            />

            <AppButton
              title={
                todo.favorite
                  ? '★ Remove Favorite'
                  : '☆ Add to Favorites'
              }
              variant="secondary"
              onPress={() =>
                toggleFavorite(todo.id)
              }
            />

            <AppButton
              title="Edit Todo"
              variant="secondary"
              onPress={() =>
                navigation.navigate(
                  ROUTES.EDIT_TODO,
                  {
                    todoId: todo.id,
                  },
                )
              }
            />

            <AppButton
              title="Delete Todo"
              variant="danger"
              onPress={() =>
                setShowDelete(true)
              }
            />
          </View>
        </View>
      </ScrollView>

      <ConfirmModal
        visible={showDelete}
        title="Delete Todo?"
        message="This todo will be moved to Trash. You can restore it later."
        confirmText="Delete"
        onCancel={() =>
          setShowDelete(false)
        }
        onConfirm={handleDelete}
        danger
      />
    </SafeAreaView>
  );
}

function InfoBox({
  title,
  value,
  styles,
}) {
  return (
    <View style={styles.infoBox}>
      <Text
        style={styles.infoTitle}>
        {title}
      </Text>

      <Text
        style={styles.infoValue}>
        {value}
      </Text>
    </View>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    scrollContent: {
      flexGrow: 1,
    },

    container: {
      padding: theme.spacing.xl,
    },

    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },

    backButton: {
      width: 44,
      height: 44,
      justifyContent: 'center',
    },

    backText: {
      fontSize: 38,
      color: theme.colors.text,
    },

    header: {
      marginTop: theme.spacing.lg,
    },

    title: {
      fontSize: 30,
      fontWeight: '800',
      lineHeight: 38,
      color: theme.colors.text,
    },

    status: {
      alignSelf: 'flex-start',
      marginTop: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radius.round,
      backgroundColor: '#FEF3C7',
    },

    statusCompleted: {
      backgroundColor: '#DCFCE7',
    },

    statusText: {
      fontSize: theme.typography.caption,
      fontWeight: '800',
      color: theme.colors.text,
    },

    section: {
      marginTop: theme.spacing.xxxl,
    },

    sectionTitle: {
      fontSize: theme.typography.bodySmall,
      fontWeight: '800',
      color: theme.colors.text,
    },

    description: {
      marginTop: theme.spacing.sm,
      fontSize: theme.typography.body,
      lineHeight: 24,
      color: theme.colors.textSecondary,
    },

    infoGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
      marginTop: theme.spacing.xxxl,
    },

    infoBox: {
      width: '47%',
      padding: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.surface,
    },

    infoTitle: {
      fontSize: theme.typography.caption,
      color: theme.colors.textSecondary,
    },

    infoValue: {
      marginTop: theme.spacing.xs,
      fontSize: theme.typography.body,
      fontWeight: '800',
      color: theme.colors.text,
      textTransform: 'capitalize',
    },

    actions: {
      gap: theme.spacing.md,
      marginTop: theme.spacing.xxxl,
    },
  });
}

export default TodoDetailScreen;