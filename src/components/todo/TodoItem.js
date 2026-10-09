import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';

import useTheme from '../../hooks/useTheme';

function TodoItem({
  todo,
  onPress,
  onToggle,
  onEdit,
  onDelete,
  onToggleFavorite,
}) {
  const {theme} = useTheme();
  const styles = createStyles(theme);

  const priorityBg =
    todo.priority === 'high'
      ? theme.colors.dangerSoft
      : todo.priority === 'medium'
      ? theme.colors.warningSoft
      : theme.colors.successSoft;

  const priorityTextColor =
    todo.priority === 'high'
      ? theme.colors.danger
      : todo.priority === 'medium'
      ? theme.colors.warning
      : theme.colors.success;

  return (
    <View style={styles.card}>
      <View style={styles.mainRow}>
        <Pressable
          style={[
            styles.checkbox,
            todo.completed && styles.checkboxCompleted,
          ]}
          onPress={() => onToggle(todo.id)}
          accessibilityRole="checkbox"
          accessibilityState={{
            checked: todo.completed,
          }}>
          {todo.completed ? (
            <Text style={styles.checkmark}>✓</Text>
          ) : null}
        </Pressable>

        <Pressable
          style={styles.content}
          onPress={() => onPress(todo)}>
          <View style={styles.titleRow}>
            <Text
              style={[
                styles.title,
                todo.completed && styles.completedTitle,
              ]}
              numberOfLines={2}>
              {todo.title}
            </Text>

            {todo.favorite ? (
              <Text style={styles.favBadge}>★</Text>
            ) : null}
          </View>

          {todo.description ? (
            <Text
              style={styles.description}
              numberOfLines={2}>
              {todo.description}
            </Text>
          ) : null}

          <View style={styles.metaRow}>
            <Text style={styles.category}>
              {todo.category}
            </Text>

            <View
              style={[
                styles.priority,
                {backgroundColor: priorityBg},
              ]}>
              <Text
                style={[
                  styles.priorityText,
                  {color: priorityTextColor},
                ]}>
                {todo.priority}
              </Text>
            </View>

            {todo.dueDate && todo.dueDate !== 'No date' ? (
              <Text style={styles.dueDate}>
                {todo.dueDate}
              </Text>
            ) : null}

            {todo.reminder ? (
              <Text style={styles.reminderBadge}>🔔</Text>
            ) : null}
          </View>
        </Pressable>
      </View>

      <View style={styles.actions}>
        {onToggleFavorite ? (
          <Pressable
            style={styles.favButton}
            onPress={() => onToggleFavorite(todo.id)}>
            <Text
              style={[
                styles.favText,
                todo.favorite && styles.favTextActive,
              ]}>
              {todo.favorite ? '★ Favorited' : '☆ Favorite'}
            </Text>
          </Pressable>
        ) : null}

        <Pressable
          style={styles.editButton}
          onPress={() => onEdit(todo)}>
          <Text style={styles.editText}>Edit</Text>
        </Pressable>

        <Pressable
          style={styles.deleteButton}
          onPress={() => onDelete(todo.id)}>
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...theme.shadows.card,
    },

    mainRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },

    checkbox: {
      width: 26,
      height: 26,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
      marginTop: 1,
    },

    checkboxCompleted: {
      borderColor: theme.colors.success,
      backgroundColor: theme.colors.success,
    },

    checkmark: {
      color: theme.colors.white,
      fontSize: 15,
      fontWeight: '800',
    },

    content: {
      flex: 1,
    },

    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },

    title: {
      flex: 1,
      fontSize: theme.typography.body,
      fontWeight: '700',
      lineHeight: 22,
      color: theme.colors.text,
    },

    favBadge: {
      fontSize: 14,
      color: theme.colors.warning,
    },

    completedTitle: {
      textDecorationLine: 'line-through',
      color: theme.colors.textLight,
    },

    description: {
      marginTop: theme.spacing.xs,
      fontSize: theme.typography.bodySmall,
      lineHeight: 20,
      color: theme.colors.textSecondary,
    },

    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.md,
    },

    category: {
      fontSize: theme.typography.caption,
      fontWeight: '600',
      color: theme.colors.textSecondary,
    },

    priority: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 4,
      borderRadius: theme.radius.round,
    },

    priorityText: {
      fontSize: theme.typography.caption,
      fontWeight: '700',
      textTransform: 'capitalize',
    },

    dueDate: {
      fontSize: theme.typography.caption,
      color: theme.colors.textSecondary,
      fontWeight: '500',
    },

    reminderBadge: {
      fontSize: 12,
    },

    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: theme.spacing.md,
      marginTop: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },

    favButton: {
      marginRight: 'auto',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
    },

    favText: {
      fontSize: theme.typography.caption,
      fontWeight: '700',
      color: theme.colors.textSecondary,
    },

    favTextActive: {
      color: theme.colors.warning,
    },

    editButton: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
    },

    editText: {
      fontSize: theme.typography.caption,
      fontWeight: '700',
      color: theme.colors.primary,
    },

    deleteButton: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
    },

    deleteText: {
      fontSize: theme.typography.caption,
      fontWeight: '700',
      color: theme.colors.danger,
    },
  });
}

export default TodoItem;