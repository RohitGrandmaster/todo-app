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

import {useMemo, useState} from 'react';

import useTodos from '../../hooks/useTodos';
import useTheme from '../../hooks/useTheme';

function CalendarScreen() {
  const {theme} = useTheme();
  const {tasks} = useTodos();

  const styles = createStyles(theme);

  const [selectedDay, setSelectedDay] =
    useState(8);

  const days = useMemo(
    () => [
      {day: 1, label: 'Thu'},
      {day: 2, label: 'Fri'},
      {day: 3, label: 'Sat'},
      {day: 4, label: 'Sun'},
      {day: 5, label: 'Mon'},
      {day: 6, label: 'Tue'},
      {day: 7, label: 'Wed'},
      {day: 8, label: 'Thu'},
      {day: 9, label: 'Fri'},
      {day: 10, label: 'Sat'},
      {day: 11, label: 'Sun'},
      {day: 12, label: 'Mon'},
      {day: 13, label: 'Tue'},
      {day: 14, label: 'Wed'},
    ],
    [],
  );

  const selectedTasks = tasks.filter(
    task => {
      if (selectedDay === 8) {
        return task.dueDate === 'Today';
      }

      if (selectedDay === 9) {
        return task.dueDate === 'Tomorrow';
      }

      if (selectedDay >= 14) {
        return task.dueDate === 'Next week';
      }

      return false;
    },
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <Text style={styles.title}>
            Calendar
          </Text>

          <Text style={styles.subtitle}>
            Plan your tasks and stay ahead.
          </Text>

          <View style={styles.monthHeader}>
            <Pressable
              style={styles.arrowButton}>
              <Text style={styles.arrow}>
                ‹
              </Text>
            </Pressable>

            <Text
              style={styles.monthTitle}>
              October 2026
            </Text>

            <Pressable
              style={styles.arrowButton}>
              <Text style={styles.arrow}>
                ›
              </Text>
            </Pressable>
          </View>

          <View style={styles.weekHeader}>
            {days.slice(0, 7).map(item => (
              <Text
                key={item.day}
                style={styles.weekLabel}>
                {item.label.slice(0, 1)}
              </Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {days.map(item => {
              const selected =
                selectedDay === item.day;

              return (
                <Pressable
                  key={item.day}
                  style={[
                    styles.day,
                    selected &&
                      styles.selectedDay,
                  ]}
                  onPress={() =>
                    setSelectedDay(item.day)
                  }>
                  <Text
                    style={[
                      styles.dayText,
                      selected &&
                        styles.selectedDayText,
                    ]}>
                    {item.day}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.selectedHeader}>
            <Text
              style={styles.selectedTitle}>
              {selectedDay === 8
                ? 'Today'
                : `October ${selectedDay}`}
            </Text>

            <Text
              style={styles.taskCount}>
              {selectedTasks.length}{' '}
              tasks
            </Text>
          </View>

          {selectedTasks.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>
                ✓
              </Text>

              <Text
                style={styles.emptyTitle}>
                No tasks for this day
              </Text>

              <Text
                style={styles.emptyText}>
                Your schedule is clear.
              </Text>
            </View>
          ) : (
            selectedTasks.map(task => (
              <View
                key={task.id}
                style={styles.taskCard}>
                <View
                  style={styles.taskIndicator}
                />

                <View
                  style={styles.taskContent}>
                  <Text
                    style={styles.taskTitle}>
                    {task.title}
                  </Text>

                  <Text
                    style={
                      styles.taskDescription
                    }>
                    {task.category} •{' '}
                    {task.priority}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
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

    monthHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: theme.spacing.xxl,
    },

    monthTitle: {
      fontSize:
        theme.typography.subheading,
      fontWeight: '800',
      color: theme.colors.text,
    },

    arrowButton: {
      width: 42,
      height: 42,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },

    arrow: {
      fontSize: 26,
      color: theme.colors.text,
    },

    weekHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.spacing.xl,
      paddingHorizontal: theme.spacing.sm,
    },

    weekLabel: {
      width: 34,
      textAlign: 'center',
      fontSize: theme.typography.caption,
      fontWeight: '700',
      color: theme.colors.textSecondary,
    },

    daysGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.md,
    },

    day: {
      width: 39,
      height: 42,
      borderRadius: 13,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },

    selectedDay: {
      backgroundColor:
        theme.colors.primary,
      borderColor:
        theme.colors.primary,
    },

    dayText: {
      fontSize: theme.typography.bodySmall,
      fontWeight: '700',
      color: theme.colors.text,
    },

    selectedDayText: {
      color: theme.colors.white,
    },

    selectedHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: theme.spacing.xxxl,
      marginBottom: theme.spacing.lg,
    },

    selectedTitle: {
      fontSize:
        theme.typography.subheading,
      fontWeight: '800',
      color: theme.colors.text,
    },

    taskCount: {
      fontSize: theme.typography.caption,
      fontWeight: '700',
      color: theme.colors.textSecondary,
    },

    empty: {
      alignItems: 'center',
      paddingVertical: theme.spacing.xxxl,
      paddingHorizontal: theme.spacing.xl,
      borderRadius: theme.radius.xl,
      backgroundColor:
        theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },

    emptyIcon: {
      width: 52,
      height: 52,
      borderRadius: 26,
      textAlign: 'center',
      textAlignVertical: 'center',
      fontSize: 26,
      fontWeight: '800',
      color: theme.colors.success,
      backgroundColor: '#DCFCE7',
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
      fontSize: theme.typography.bodySmall,
      color: theme.colors.textSecondary,
    },

    taskCard: {
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

    taskIndicator: {
      width: 5,
      height: 44,
      borderRadius: 3,
      backgroundColor:
        theme.colors.primary,
      marginRight: theme.spacing.md,
    },

    taskContent: {
      flex: 1,
    },

    taskTitle: {
      fontSize: theme.typography.body,
      fontWeight: '800',
      color: theme.colors.text,
    },

    taskDescription: {
      marginTop: 4,
      fontSize: theme.typography.caption,
      color: theme.colors.textSecondary,
      textTransform: 'capitalize',
    },
  });
}

export default CalendarScreen;