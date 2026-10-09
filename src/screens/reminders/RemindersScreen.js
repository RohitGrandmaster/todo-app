import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';
import {DrawerActions} from '@react-navigation/native';

import useTodos from '../../hooks/useTodos';
import useTheme from '../../hooks/useTheme';

function RemindersScreen({navigation}) {
  const {theme} = useTheme();
  const {tasks} = useTodos();

  const styles = createStyles(theme);

  function openDrawer() {
    navigation.dispatch(DrawerActions.openDrawer());
  }

  const reminders = tasks.filter(
    task => task.reminder && !task.deleted,
  );

  const activeReminders =
    reminders.filter(
      task => !task.completed,
    );

  const completedReminders =
    reminders.filter(
      task => task.completed,
    );

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.scrollContent
        }>
        <View style={styles.container}>
          <View style={styles.header}>
            <Pressable onPress={openDrawer} style={styles.menuBtn}>
              <Text style={styles.menuIcon}>☰</Text>
            </Pressable>
            <View style={styles.headerContent}>
              <Text style={styles.title}>
                Reminders
              </Text>

              <Text style={styles.subtitle}>
                Stay on top of the things that matter.
              </Text>
            </View>

            <View style={styles.countBadge}>
              <Text
                style={styles.countNumber}>
                {activeReminders.length}
              </Text>

              <Text
                style={styles.countLabel}>
                Active
              </Text>
            </View>
          </View>

          <View style={styles.summaryCard}>
            <View
              style={styles.summaryIcon}>
              <Text
                style={styles.summaryIconText}>
                🔔
              </Text>
            </View>

            <View
              style={styles.summaryContent}>
              <Text
                style={styles.summaryTitle}>
                Your reminders
              </Text>

              <Text
                style={
                  styles.summaryDescription
                }>
                {activeReminders.length === 0
                  ? 'You have no active reminders.'
                  : `You have ${activeReminders.length} active reminder${
                      activeReminders.length === 1
                        ? ''
                        : 's'
                    }.`}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text
              style={styles.sectionTitle}>
              Upcoming
            </Text>

            {activeReminders.length ===
            0 ? (
              <View style={styles.emptyCard}>
                <View
                  style={styles.emptyIcon}>
                  <Text
                    style={
                      styles.emptyIconText
                    }>
                    ✓
                  </Text>
                </View>

                <Text
                  style={styles.emptyTitle}>
                  All clear
                </Text>

                <Text
                  style={styles.emptyText}>
                  Tasks with reminders will appear
                  here.
                </Text>
              </View>
            ) : (
              activeReminders.map(task => (
                <ReminderCard
                  key={task.id}
                  task={task}
                  styles={styles}
                />
              ))
            )}
          </View>

          {completedReminders.length >
          0 ? (
            <View style={styles.section}>
              <Text
                style={styles.sectionTitle}>
                Completed
              </Text>

              {completedReminders.map(
                task => (
                  <ReminderCard
                    key={task.id}
                    task={task}
                    completed
                    styles={styles}
                  />
                ),
              )}
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ReminderCard({
  task,
  completed = false,
  styles,
}) {
  return (
    <View
      style={[
        styles.card,
        completed && styles.completedCard,
      ]}>
      <View style={styles.reminderIcon}>
        <Text
          style={styles.reminderIconText}>
          🔔
        </Text>
      </View>

      <View style={styles.cardContent}>
        <Text
          style={[
            styles.cardTitle,
            completed &&
              styles.completedTitle,
          ]}
          numberOfLines={2}>
          {task.title}
        </Text>

        <Text
          style={styles.cardCategory}>
          {task.category}
        </Text>

        <View style={styles.metaRow}>
          <Text
            style={styles.dateText}>
            {task.dueDate}
          </Text>

          <View
            style={[
              styles.priority,
              task.priority === 'high' &&
                styles.high,
              task.priority === 'medium' &&
                styles.medium,
              task.priority === 'low' &&
                styles.low,
            ]}>
            <Text
              style={styles.priorityText}>
              {task.priority}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={[
          styles.statusDot,
          completed &&
            styles.completedStatusDot,
        ]}
      />
    </View>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor:
        theme.colors.background,
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
      justifyContent: 'space-between',
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
      color: theme.colors.text,
    },

    headerContent: {
      flex: 1,
      paddingRight: theme.spacing.md,
    },


    title: {
      fontSize: 30,
      fontWeight: '800',
      color: theme.colors.text,
    },

    subtitle: {
      marginTop: theme.spacing.sm,
      fontSize:
        theme.typography.bodySmall,
      lineHeight: 20,
      color: theme.colors.textSecondary,
    },

    countBadge: {
      width: 62,
      height: 62,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.radius.lg,
      backgroundColor:
        theme.colors.primary,
    },

    countNumber: {
      fontSize:
        theme.typography.subheading,
      fontWeight: '800',
      color: theme.colors.white,
    },

    countLabel: {
      marginTop: 1,
      fontSize: theme.typography.caption,
      color: theme.colors.white,
    },

    summaryCard: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.xxl,
      padding: theme.spacing.lg,
      borderRadius: theme.radius.xl,
      backgroundColor:
        theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },

    summaryIcon: {
      width: 52,
      height: 52,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 18,
      backgroundColor:
        theme.colors.background,
    },

    summaryIconText: {
      fontSize: 24,
    },

    summaryContent: {
      flex: 1,
      marginLeft: theme.spacing.md,
    },

    summaryTitle: {
      fontSize: theme.typography.body,
      fontWeight: '800',
      color: theme.colors.text,
    },

    summaryDescription: {
      marginTop: 4,
      fontSize: theme.typography.caption,
      lineHeight: 18,
      color: theme.colors.textSecondary,
    },

    section: {
      marginTop: theme.spacing.xxxl,
    },

    sectionTitle: {
      marginBottom: theme.spacing.md,
      fontSize:
        theme.typography.subheading,
      fontWeight: '800',
      color: theme.colors.text,
    },

    emptyCard: {
      alignItems: 'center',
      padding: theme.spacing.xxxl,
      borderRadius: theme.radius.xl,
      backgroundColor:
        theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },

    emptyIcon: {
      width: 58,
      height: 58,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 29,
      backgroundColor: '#DCFCE7',
    },

    emptyIconText: {
      fontSize: 26,
      fontWeight: '800',
      color: theme.colors.success,
    },

    emptyTitle: {
      marginTop: theme.spacing.lg,
      fontSize:
        theme.typography.subheading,
      fontWeight: '800',
      color: theme.colors.text,
    },

    emptyText: {
      marginTop: theme.spacing.xs,
      fontSize:
        theme.typography.bodySmall,
      lineHeight: 20,
      textAlign: 'center',
      color: theme.colors.textSecondary,
    },

    card: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
      padding: theme.spacing.lg,
      borderRadius: theme.radius.xl,
      backgroundColor:
        theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },

    completedCard: {
      opacity: 0.6,
    },

    reminderIcon: {
      width: 48,
      height: 48,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 16,
      backgroundColor:
        theme.colors.background,
    },

    reminderIconText: {
      fontSize: 21,
    },

    cardContent: {
      flex: 1,
      marginLeft: theme.spacing.md,
    },

    cardTitle: {
      fontSize:
        theme.typography.body,
      fontWeight: '800',
      color: theme.colors.text,
    },

    completedTitle: {
      textDecorationLine: 'line-through',
      color: theme.colors.textLight,
    },

    cardCategory: {
      marginTop: 4,
      fontSize: theme.typography.caption,
      color: theme.colors.textSecondary,
    },

    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.sm,
    },

    dateText: {
      fontSize: theme.typography.caption,
      fontWeight: '700',
      color: theme.colors.textSecondary,
    },

    priority: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 4,
      borderRadius: theme.radius.round,
    },

    high: {
      backgroundColor: '#FEE2E2',
    },

    medium: {
      backgroundColor: '#FEF3C7',
    },

    low: {
      backgroundColor: '#DCFCE7',
    },

    priorityText: {
      fontSize: theme.typography.caption,
      fontWeight: '700',
      textTransform: 'capitalize',
      color: theme.colors.text,
    },

    statusDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor:
        theme.colors.warning,
    },

    completedStatusDot: {
      backgroundColor:
        theme.colors.success,
    },
  });
}

export default RemindersScreen;