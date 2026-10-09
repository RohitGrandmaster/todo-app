import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import useTodos from '../../hooks/useTodos';
import useTheme from '../../hooks/useTheme';

import {
  calculateTodoStats,
} from '../../utils/helpers';

function StatsScreen() {
  const {theme} = useTheme();
  const {tasks} = useTodos();

  const styles = createStyles(theme);

  const stats =
    calculateTodoStats(tasks);

  return (
    <SafeAreaView
      style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={
          styles.scrollContent
        }>
        <View style={styles.container}>
          <Text style={styles.title}>
            Statistics
          </Text>

          <Text style={styles.subtitle}>
            See how consistently you are getting things done.
          </Text>

          <View style={styles.progressCard}>
            <Text
              style={styles.progressLabel}>
              Completion
            </Text>

            <Text
              style={styles.progressNumber}>
              {stats.completionPercentage}%
            </Text>

            <View
              style={styles.progressTrack}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${stats.completionPercentage}%`,
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.grid}>
            <StatCard
              title="Total"
              value={stats.total}
              styles={styles}
            />

            <StatCard
              title="Completed"
              value={stats.completed}
              styles={styles}
            />

            <StatCard
              title="Active"
              value={stats.active}
              styles={styles}
            />

            <StatCard
              title="High Priority"
              value={stats.highPriority}
              styles={styles}
            />

            <StatCard
              title="Due Today"
              value={stats.dueToday}
              styles={styles}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({
  title,
  value,
  styles,
}) {
  return (
    <View style={styles.card}>
      <Text
        style={styles.cardTitle}>
        {title}
      </Text>

      <Text
        style={styles.cardValue}>
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

    title: {
      fontSize: 30,
      fontWeight: '800',
      color: theme.colors.text,
    },

    subtitle: {
      marginTop: theme.spacing.sm,
      fontSize: theme.typography.bodySmall,
      lineHeight: 20,
      color: theme.colors.textSecondary,
    },

    progressCard: {
      marginTop: theme.spacing.xxl,
      padding: theme.spacing.xl,
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.primary,
    },

    progressLabel: {
      fontSize: theme.typography.bodySmall,
      color: theme.colors.white,
    },

    progressNumber: {
      marginTop: theme.spacing.sm,
      fontSize: 40,
      fontWeight: '800',
      color: theme.colors.white,
    },

    progressTrack: {
      height: 10,
      marginTop: theme.spacing.lg,
      overflow: 'hidden',
      borderRadius: 5,
      backgroundColor: 'rgba(255,255,255,0.25)',
    },

    progressBar: {
      height: '100%',
      borderRadius: 5,
      backgroundColor: theme.colors.white,
    },

    grid: {
      gap: theme.spacing.md,
      marginTop: theme.spacing.xl,
    },

    card: {
      padding: theme.spacing.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.surface,
    },

    cardTitle: {
      fontSize: theme.typography.bodySmall,
      color: theme.colors.textSecondary,
    },

    cardValue: {
      marginTop: theme.spacing.sm,
      fontSize: 30,
      fontWeight: '800',
      color: theme.colors.text,
    },
  });
}

export default StatsScreen;