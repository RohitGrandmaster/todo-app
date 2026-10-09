import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';
import {useEffect, useState} from 'react';

import AppButton from '../common/AppButton';

import useTheme from '../../hooks/useTheme';
import {getDueDateOptions} from '../../utils/dateUtils';

const PRIORITIES = [
  'low',
  'medium',
  'high',
];

const CATEGORIES = [
  'Personal',
  'Work',
  'Learning',
  'Shopping',
  'Health',
  'Project',
];

function TodoForm({
  title = 'New Todo',
  subtitle = 'Add something you want to get done.',
  initialTodo = null,
  onSubmit,
  onCancel,
}) {
  const {theme} = useTheme();

  const styles = createStyles(theme);

  const [todoTitle, setTodoTitle] =
    useState(initialTodo?.title || '');

  const [description, setDescription] =
    useState(initialTodo?.description || '');

  const [category, setCategory] =
    useState(
      initialTodo?.category || 'Personal',
    );

  const [priority, setPriority] =
    useState(
      initialTodo?.priority || 'medium',
    );

  const [dueDate, setDueDate] =
    useState(
      initialTodo?.dueDate || 'No date',
    );

  const [reminder, setReminder] =
    useState(
      Boolean(initialTodo?.reminder),
    );

  const [showCategory, setShowCategory] =
    useState(false);

  const [showDueDate, setShowDueDate] =
    useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTodoTitle(initialTodo?.title || '');
    setDescription(
      initialTodo?.description || '',
    );
    setCategory(
      initialTodo?.category || 'Personal',
    );
    setPriority(
      initialTodo?.priority || 'medium',
    );
    setDueDate(
      initialTodo?.dueDate || 'No date',
    );
    setReminder(
      Boolean(initialTodo?.reminder),
    );
  }, [initialTodo]);

  async function handleSubmit() {
    setError('');

    const cleanTitle =
      todoTitle.trim();

    const cleanDescription =
      description.trim();

    if (!cleanTitle) {
      setError(
        'Please enter a todo title.',
      );
      return;
    }

    if (cleanTitle.length < 2) {
      setError(
        'Todo title must be at least 2 characters.',
      );
      return;
    }

    setLoading(true);

    try {
      await onSubmit({
        title: cleanTitle,
        description: cleanDescription,
        category,
        priority,
        dueDate,
        reminder,
      });
    } catch {
      setError(
        'Unable to save todo. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }>
        <ScrollView
          contentContainerStyle={
            styles.scrollContent
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Pressable
                style={styles.backButton}
                onPress={onCancel}>
                <Text style={styles.backText}>
                  ‹
                </Text>
              </Pressable>

              <View
                style={styles.headerContent}>
                <Text
                  style={styles.headerTitle}>
                  {title}
                </Text>

                <Text
                  style={styles.headerSubtitle}>
                  {subtitle}
                </Text>
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>
                Title
              </Text>

              <TextInput
                style={styles.input}
                placeholder="e.g. Learn React Native"
                placeholderTextColor={
                  theme.colors.textLight
                }
                value={todoTitle}
                onChangeText={setTodoTitle}
                maxLength={100}
              />

              <Text style={styles.counter}>
                {todoTitle.length}/100
              </Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>
                Description
              </Text>

              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                ]}
                placeholder="Add some details..."
                placeholderTextColor={
                  theme.colors.textLight
                }
                value={description}
                onChangeText={setDescription}
                multiline
                maxLength={500}
              />

              <Text style={styles.counter}>
                {description.length}/500
              </Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>
                Priority
              </Text>

              <View style={styles.row}>
                {PRIORITIES.map(item => {
                  const selected =
                    priority === item;

                  return (
                    <Pressable
                      key={item}
                      style={[
                        styles.option,
                        selected &&
                          styles.selectedOption,
                      ]}
                      onPress={() =>
                        setPriority(item)
                      }>
                      <Text
                        style={[
                          styles.optionText,
                          selected &&
                            styles.selectedOptionText,
                        ]}>
                        {item}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>
                Category
              </Text>

              <Pressable
                style={styles.select}
                onPress={() =>
                  setShowCategory(
                    current => !current,
                  )
                }>
                <Text
                  style={styles.selectText}>
                  {category}
                </Text>

                <Text
                  style={styles.arrow}>
                  {showCategory
                    ? '⌃'
                    : '⌄'}
                </Text>
              </Pressable>

              {showCategory ? (
                <View
                  style={styles.dropdown}>
                  {CATEGORIES.map(item => (
                    <Pressable
                      key={item}
                      style={[
                        styles.dropdownItem,
                        item === category &&
                          styles.selectedDropdownItem,
                      ]}
                      onPress={() => {
                        setCategory(item);
                        setShowCategory(
                          false,
                        );
                      }}>
                      <Text
                        style={[
                          styles.dropdownText,
                          item === category &&
                            styles.selectedDropdownText,
                        ]}>
                        {item}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              ) : null}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>
                Due Date
              </Text>

              <Pressable
                style={styles.select}
                onPress={() =>
                  setShowDueDate(
                    current => !current,
                  )
                }>
                <Text
                  style={styles.selectText}>
                  {dueDate}
                </Text>

                <Text
                  style={styles.arrow}>
                  {showDueDate
                    ? '⌃'
                    : '⌄'}
                </Text>
              </Pressable>

              {showDueDate ? (
                <View
                  style={styles.dropdown}>
                  {getDueDateOptions().map(
                    item => (
                      <Pressable
                        key={item}
                        style={[
                          styles.dropdownItem,
                          item === dueDate &&
                            styles.selectedDropdownItem,
                        ]}
                        onPress={() => {
                          setDueDate(item);
                          setShowDueDate(
                            false,
                          );
                        }}>
                        <Text
                          style={[
                            styles.dropdownText,
                            item === dueDate &&
                              styles.selectedDropdownText,
                          ]}>
                          {item}
                        </Text>
                      </Pressable>
                    ),
                  )}
                </View>
              ) : null}
            </View>

            <View
              style={styles.reminderRow}>
              <View
                style={
                  styles.reminderContent
                }>
                <Text
                  style={styles.label}>
                  Reminder
                </Text>

                <Text
                  style={
                    styles.reminderDescription
                  }>
                  Get reminded about this task.
                </Text>
              </View>

              <Switch
                value={reminder}
                onValueChange={setReminder}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primary,
                }}
              />
            </View>

            {error ? (
              <View
                style={styles.errorBox}>
                <Text
                  style={styles.errorText}>
                  {error}
                </Text>
              </View>
            ) : null}

            <AppButton
              title={
                initialTodo
                  ? 'Save Changes'
                  : 'Save Todo'
              }
              onPress={handleSubmit}
              loading={loading}
            />

            <Pressable
              style={styles.cancelButton}
              onPress={onCancel}>
              <Text
                style={styles.cancelText}>
                Cancel
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    keyboard: {
      flex: 1,
    },

    scrollContent: {
      flexGrow: 1,
    },

    container: {
      padding: theme.spacing.xl,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xxl,
    },

    backButton: {
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.sm,
    },

    backText: {
      fontSize: 38,
      lineHeight: 38,
      color: theme.colors.text,
    },

    headerContent: {
      flex: 1,
    },

    headerTitle: {
      fontSize: theme.typography.heading,
      fontWeight: '800',
      color: theme.colors.text,
    },

    headerSubtitle: {
      marginTop: 4,
      fontSize: theme.typography.bodySmall,
      lineHeight: 20,
      color: theme.colors.textSecondary,
    },

    field: {
      marginBottom: theme.spacing.xl,
    },

    label: {
      marginBottom: theme.spacing.sm,
      fontSize: theme.typography.bodySmall,
      fontWeight: '700',
      color: theme.colors.text,
    },

    input: {
      minHeight: 52,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.lg,
      paddingHorizontal: theme.spacing.lg,
      fontSize: theme.typography.body,
      color: theme.colors.text,
      backgroundColor: theme.colors.surface,
    },

    textArea: {
      minHeight: 130,
      paddingTop: theme.spacing.lg,
      textAlignVertical: 'top',
    },

    counter: {
      marginTop: theme.spacing.xs,
      textAlign: 'right',
      fontSize: theme.typography.caption,
      color: theme.colors.textLight,
    },

    row: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },

    option: {
      flex: 1,
      minHeight: 46,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.surface,
    },

    selectedOption: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary,
    },

    optionText: {
      fontSize: theme.typography.bodySmall,
      fontWeight: '600',
      color: theme.colors.textSecondary,
      textTransform: 'capitalize',
    },

    selectedOptionText: {
      color: theme.colors.white,
      fontWeight: '800',
    },

    select: {
      minHeight: 52,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.surface,
    },

    selectText: {
      fontSize: theme.typography.body,
      color: theme.colors.text,
    },

    arrow: {
      fontSize: 20,
      color: theme.colors.textSecondary,
    },

    dropdown: {
      marginTop: theme.spacing.sm,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.surface,
    },

    dropdownItem: {
      minHeight: 48,
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },

    selectedDropdownItem: {
      backgroundColor: theme.colors.background,
    },

    dropdownText: {
      fontSize: theme.typography.bodySmall,
      color: theme.colors.text,
    },

    selectedDropdownText: {
      fontWeight: '800',
      color: theme.colors.primary,
    },

    reminderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.xl,
      paddingVertical: theme.spacing.md,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: theme.colors.border,
    },

    reminderContent: {
      flex: 1,
    },

    reminderDescription: {
      marginTop: -theme.spacing.xs,
      fontSize: theme.typography.caption,
      color: theme.colors.textSecondary,
    },

    errorBox: {
      marginBottom: theme.spacing.lg,
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
      backgroundColor: '#FEE2E2',
    },

    errorText: {
      fontSize: theme.typography.bodySmall,
      lineHeight: 20,
      color: theme.colors.danger,
    },

    cancelButton: {
      alignItems: 'center',
      paddingVertical: theme.spacing.lg,
    },

    cancelText: {
      fontSize: theme.typography.bodySmall,
      fontWeight: '700',
      color: theme.colors.textSecondary,
    },
  });
}

export default TodoForm;