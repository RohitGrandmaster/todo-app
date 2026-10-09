import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import useTodos from '../../hooks/useTodos';
import useTheme from '../../hooks/useTheme';
import {calculateTodoStats} from '../../utils/helpers';

function StatCard({title, value, description, color, theme}) {
  return (
    <View
      style={[
        styles.statCard,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}>
      <View
        style={[
          styles.statDot,
          {backgroundColor: color || theme.colors.primary},
        ]}
      />
      <Text
        style={[
          styles.statTitle,
          {color: theme.colors.textSecondary},
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.statValue,
          {color: theme.colors.text},
        ]}>
        {value}
      </Text>
      <Text
        style={[
          styles.statDescription,
          {color: theme.colors.textLight},
        ]}>
        {description}
      </Text>
    </View>
  );
}

function OverviewScreen() {
  const {theme} = useTheme();
  const {tasks} = useTodos();
  const insets = useSafeAreaInsets();

  const stats = calculateTodoStats(tasks);
  const completion = stats.completionPercentage;

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {backgroundColor: theme.colors.background},
      ]}
      edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            // Tab bar (~76) + safe area + extra space
            paddingBottom: Math.max(insets.bottom, 12) + 110,
          },
        ]}>
        <View style={styles.container}>
          <Text
            style={[
              styles.title,
              {color: theme.colors.text},
            ]}>
            Overview
          </Text>

          <Text
            style={[
              styles.subtitle,
              {color: theme.colors.textSecondary},
            ]}>
            A clear view of your productivity.
          </Text>

          {/* HERO CARD */}
          <View
            style={[
              styles.heroCard,
              {backgroundColor: theme.colors.primary},
            ]}>
            <View style={styles.heroTop}>
              <View>
                <Text style={styles.heroLabel}>
                  Completion
                </Text>
                <Text style={styles.heroTitle}>
                  {completion}%
                </Text>
              </View>

              <View style={styles.heroCircle}>
                <Text style={styles.heroCircleText}>
                  {stats.completed}
                </Text>
                <Text style={styles.heroCircleLabel}>
                  done
                </Text>
              </View>
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressBar,
                  {width: `${Math.min(completion, 100)}%`},
                ]}
              />
            </View>

            <Text style={styles.heroFooter}>
              {stats.completed} of {stats.total} tasks completed
            </Text>
          </View>

          {/* STATS GRID */}
          <View style={styles.grid}>
            <StatCard
              title="Total Tasks"
              value={stats.total}
              description="All your tasks"
              color={theme.colors.primary}
              theme={theme}
            />
            <StatCard
              title="Active"
              value={stats.active}
              description="Still to do"
              color={theme.colors.warning}
              theme={theme}
            />
            <StatCard
              title="High Priority"
              value={stats.highPriority}
              description="Need attention"
              color={theme.colors.danger}
              theme={theme}
            />
            <StatCard
              title="Due Today"
              value={stats.dueToday}
              description="Scheduled today"
              color={theme.colors.success}
              theme={theme}
            />
          </View>

          {/* PRODUCTIVITY */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                {color: theme.colors.text},
              ]}>
              Productivity
            </Text>

            <View
              style={[
                styles.productivityCard,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}>
              <Text
                style={[
                  styles.productivityTitle,
                  {color: theme.colors.text},
                ]}>
                Keep going
              </Text>

              <Text
                style={[
                  styles.productivityText,
                  {color: theme.colors.textSecondary},
                ]}>
                Small progress every day adds up to big results.
              </Text>

              <View style={styles.productivityRow}>
                <View>
                  <Text
                    style={[
                      styles.productivityNumber,
                      {color: theme.colors.primary},
                    ]}>
                    {stats.completed}
                  </Text>
                  <Text
                    style={[
                      styles.productivityLabel,
                      {color: theme.colors.textSecondary},
                    ]}>
                    Completed
                  </Text>
                </View>

                <View>
                  <Text
                    style={[
                      styles.productivityNumber,
                      {color: theme.colors.primary},
                    ]}>
                    {stats.active}
                  </Text>
                  <Text
                    style={[
                      styles.productivityLabel,
                      {color: theme.colors.textSecondary},
                    ]}>
                    Remaining
                  </Text>
                </View>

                <View>
                  <Text
                    style={[
                      styles.productivityNumber,
                      {color: theme.colors.primary},
                    ]}>
                    {stats.favorites || 0}
                  </Text>
                  <Text
                    style={[
                      styles.productivityLabel,
                      {color: theme.colors.textSecondary},
                    ]}>
                    Favorites
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* QUICK INSIGHT */}
          <View
            style={[
              styles.insightCard,
              {backgroundColor: theme.colors.primarySoft},
            ]}>
            <Text
              style={[
                styles.insightTitle,
                {color: theme.colors.primary},
              ]}>
              Daily Tip
            </Text>
            <Text
              style={[
                styles.insightText,
                {color: theme.colors.textSecondary},
              ]}>
              {stats.active === 0
                ? 'All tasks done! Great work today.'
                : stats.highPriority > 0
                ? `You have ${stats.highPriority} high priority task${stats.highPriority > 1 ? 's' : ''}. Focus on those first.`
                : 'Stay consistent. Complete one task at a time.'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.4,
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
  },

  heroCard: {
    marginTop: 24,
    padding: 20,
    borderRadius: 20,
  },

  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  heroLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },

  heroTitle: {
    marginTop: 4,
    fontSize: 40,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  heroCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  heroCircleText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  heroCircleLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
  },

  progressTrack: {
    height: 8,
    overflow: 'hidden',
    marginTop: 18,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },

  progressBar: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },

  heroFooter: {
    marginTop: 12,
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  statCard: {
    width: '48%',
    padding: 16,
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 12,
  },

  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 10,
  },

  statTitle: {
    fontSize: 13,
    fontWeight: '600',
  },

  statValue: {
    marginTop: 6,
    fontSize: 28,
    fontWeight: '800',
  },

  statDescription: {
    marginTop: 4,
    fontSize: 11,
  },

  section: {
    marginTop: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },

  productivityCard: {
    marginTop: 12,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
  },

  productivityTitle: {
    fontSize: 16,
    fontWeight: '800',
  },

  productivityText: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 20,
  },

  productivityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  productivityNumber: {
    fontSize: 22,
    fontWeight: '800',
  },

  productivityLabel: {
    marginTop: 4,
    fontSize: 11,
  },

  insightCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
  },

  insightTitle: {
    fontSize: 13,
    fontWeight: '800',
  },

  insightText: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 20,
  },
});

export default OverviewScreen;