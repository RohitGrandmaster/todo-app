import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';
import {useState} from 'react';

import AppButton from '../../components/common/AppButton';
import useTheme from '../../hooks/useTheme';
import {useTodoContext} from '../../context/TodoContext';

const PRIORITIES = ['low', 'medium', 'high'];

const CATEGORIES = [
  'Personal',
  'Work',
  'Learning',
  'Shopping',
  'Health',
  'Project',
];

const DUE_DATE_OPTIONS = [
  'No date',
  'Today',
  'Tomorrow',
  'Next week',
];

function AddTodoScreen({navigation}) {
  const {addTodo} = useTodoContext();
  const {theme} = useTheme();
  const styles = createStyles(theme);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Personal');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('No date');
  const [reminder, setReminder] = useState(false);

  const [showCategoryList, setShowCategoryList] = useState(false);
  const [showDueDateList, setShowDueDateList] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSave() {
    setError('');

    const cleanTitle = title.trim();
    const cleanDescription = description.trim();

    if (!cleanTitle) {
      setError('Please enter a todo title.');
      return;
    }

    if (cleanTitle.length < 2) {
      setError('Todo title must be at least 2 characters.');
      return;
    }

    setLoading(true);

    const newTodo = {
      title: cleanTitle,
      description: cleanDescription,
      category,
      priority,
      dueDate,
      reminder,
    };

    setTimeout(() => {
      addTodo(newTodo);
      setLoading(false);
      navigation.goBack();
    }, 500);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Pressable
                style={styles.backButton}
                onPress={() => navigation.goBack()}>
                <Text style={styles.backText}>‹</Text>
              </Pressable>

              <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>New Todo</Text>

                <Text style={styles.headerSubtitle}>
                  Add something you want to get done.
                </Text>
              </View>
            </View>

            <View style={styles.form}>
              <View style={styles.field}>
                <Text style={styles.label}>Title</Text>

                <TextInput
                  style={styles.input}
                  placeholder="e.g. Learn React Native"
                  placeholderTextColor={
                    theme.colors.textLight
                  }
                  value={title}
                  onChangeText={setTitle}
                  maxLength={100}
                />

                <Text style={styles.helper}>
                  {title.length}/100
                </Text>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Description</Text>

                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Add some details..."
                  placeholderTextColor={
                    theme.colors.textLight
                  }
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                  maxLength={500}
                />

                <Text style={styles.helper}>
                  {description.length}/500
                </Text>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Priority</Text>

                <View style={styles.optionsRow}>
                  {PRIORITIES.map(item => {
                    const selected = priority === item;

                    return (
                      <Pressable
                        key={item}
                        style={[
                          styles.option,
                          selected && styles.selectedOption,
                        ]}
                        onPress={() => setPriority(item)}>
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
                <Text style={styles.label}>Category</Text>

                <Pressable
                  style={styles.select}
                  onPress={() =>
                    setShowCategoryList(current => !current)
                  }>
                  <Text style={styles.selectText}>
                    {category}
                  </Text>

                  <Text style={styles.selectArrow}>
                    {showCategoryList ? '⌃' : '⌄'}
                  </Text>
                </Pressable>

                {showCategoryList ? (
                  <View style={styles.dropdown}>
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
                          setShowCategoryList(false);
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
                <Text style={styles.label}>Due Date</Text>

                <Pressable
                  style={styles.select}
                  onPress={() =>
                    setShowDueDateList(current => !current)
                  }>
                  <Text style={styles.selectText}>
                    {dueDate}
                  </Text>

                  <Text style={styles.selectArrow}>
                    {showDueDateList ? '⌃' : '⌄'}
                  </Text>
                </Pressable>

                {showDueDateList ? (
                  <View style={styles.dropdown}>
                    {DUE_DATE_OPTIONS.map(item => (
                      <Pressable
                        key={item}
                        style={[
                          styles.dropdownItem,
                          item === dueDate &&
                            styles.selectedDropdownItem,
                        ]}
                        onPress={() => {
                          setDueDate(item);
                          setShowDueDateList(false);
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
                    ))}
                  </View>
                ) : null}
              </View>

              <View style={styles.reminderRow}>
                <View style={styles.reminderTextContainer}>
                  <Text style={styles.label}>Reminder</Text>

                  <Text style={styles.reminderDescription}>
                    Get reminded about this todo.
                  </Text>
                </View>

                <Switch
                  value={reminder}
                  onValueChange={setReminder}
                  trackColor={{
                    false: theme.colors.border,
                    true: theme.colors.primary,
                  }}
                  thumbColor={theme.colors.white}
                />
              </View>

              {error ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>
                    {error}
                  </Text>
                </View>
              ) : null}

              <AppButton
                title="Save Todo"
                onPress={handleSave}
                loading={loading}
              />

              <Pressable
                style={styles.cancelButton}
                onPress={() => navigation.goBack()}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
            </View>
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
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.lg,
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

    headerTextContainer: {
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
      color: theme.colors.textSecondary,
    },

    form: {
      width: '100%',
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
    },

    helper: {
      marginTop: theme.spacing.xs,
      textAlign: 'right',
      fontSize: theme.typography.caption,
      color: theme.colors.textLight,
    },

    optionsRow: {
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
      fontWeight: '700',
    },

    select: {
      minHeight: 52,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.lg,
      paddingHorizontal: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
    },

    selectText: {
      fontSize: theme.typography.body,
      color: theme.colors.text,
    },

    selectArrow: {
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
      fontWeight: '700',
      color: theme.colors.primary,
    },

    reminderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.md,
      marginBottom: theme.spacing.xl,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: theme.colors.border,
    },

    reminderTextContainer: {
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
      justifyContent: 'center',
      paddingVertical: theme.spacing.lg,
    },

    cancelText: {
      fontSize: theme.typography.bodySmall,
      fontWeight: '700',
      color: theme.colors.textSecondary,
    },
  });
}

export default AddTodoScreen;