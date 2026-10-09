import {
  FlatList,
  Text,
  View,
  StyleSheet,
} from 'react-native';

import TodoItem from './TodoItem';
import useTheme from '../../hooks/useTheme';

function TodoList({
  todos,
  onTodoPress,
  onToggleTodo,
  onEditTodo,
  onDeleteTodo,
  onToggleFavorite,
}) {
  const {theme} = useTheme();

  const styles = createStyles(theme);

  return (
    <FlatList
      data={todos}
      keyExtractor={item =>
        String(item.id)
      }
      renderItem={({item}) => (
        <TodoItem
          todo={item}
          onPress={onTodoPress}
          onToggle={onToggleTodo}
          onEdit={onEditTodo}
          onDelete={onDeleteTodo}
          onToggleFavorite={onToggleFavorite}
        />
      )}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>
            No todos found
          </Text>

          <Text style={styles.emptyText}>
            Add a task or change your search/filter.
          </Text>
        </View>
      }
      contentContainerStyle={
        todos.length === 0
          ? styles.emptyList
          : styles.list
      }
      showsVerticalScrollIndicator={false}
    />
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    list: {
      paddingTop: theme.spacing.sm,
      paddingBottom: 100,
    },

    emptyList: {
      flexGrow: 1,
      padding: theme.spacing.xl,
      alignItems: 'center',
      justifyContent: 'center',
    },

    empty: {
      alignItems: 'center',
    },

    emptyTitle: {
      fontSize: theme.typography.subheading,
      fontWeight: '800',
      color: theme.colors.text,
    },

    emptyText: {
      marginTop: theme.spacing.sm,
      textAlign: 'center',
      fontSize: theme.typography.bodySmall,
      lineHeight: 20,
      color: theme.colors.textSecondary,
    },
  });
}

export default TodoList;