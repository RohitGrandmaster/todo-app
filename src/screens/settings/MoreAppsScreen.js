import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {useTheme} from '../../hooks/useTheme';

const apps = [
  {
    id: 'notes',
    icon: 'N',
    title: 'Todo Notes',
    description: 'Capture ideas, meeting notes and quick thoughts.',
  },
  {
    id: 'focus',
    icon: 'F',
    title: 'Focus Mode',
    description: 'Stay focused with distraction-free work sessions.',
  },
  {
    id: 'habits',
    icon: 'H',
    title: 'Habit Tracker',
    description: 'Build consistent routines and track your progress.',
  },
  {
    id: 'calendar',
    icon: 'C',
    title: 'Smart Calendar',
    description: 'Plan your day and keep important deadlines visible.',
  },
];

function MoreAppsScreen() {
  const {theme} = useTheme();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
        },
      ]}>
      <View style={styles.header}>
        <Text
          style={[
            styles.eyebrow,
            {
              color: theme.colors.primary,
            },
          ]}>
          TATOMASTER ECOSYSTEM
        </Text>

        <Text
          style={[
            styles.title,
            {
              color: theme.colors.text,
            },
          ]}>
          More Apps
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              color: theme.colors.textSecondary,
            },
          ]}>
          Explore useful productivity tools designed to work
          alongside your task workflow.
        </Text>
      </View>

      <View
        style={[
          styles.featureCard,
          {
            backgroundColor: theme.colors.primary,
          },
        ]}>
        <View style={styles.featureIcon}>
          <Text style={styles.featureIconText}>T</Text>
        </View>

        <View style={styles.featureContent}>
          <Text style={styles.featureTitle}>
            One productivity workspace
          </Text>

          <Text style={styles.featureText}>
            Keep tasks, focus sessions, notes and planning
            connected in one simple experience.
          </Text>
        </View>
      </View>

      <Text
        style={[
          styles.sectionTitle,
          {
            color: theme.colors.text,
          },
        ]}>
        Productivity Tools
      </Text>

      {apps.map((app, index) => (
        <Pressable
          key={app.id}
          onPress={() => {}}
          style={({pressed}) => [
            styles.appCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              opacity: pressed ? 0.92 : 1,
            },
          ]}>
          <View
            style={[
              styles.appIcon,
              {
                backgroundColor:
                  index % 2 === 0
                    ? `${theme.colors.primary}14`
                    : `${theme.colors.success}14`,
              },
            ]}>
            <Text
              style={[
                styles.appIconText,
                {
                  color:
                    index % 2 === 0
                      ? theme.colors.primary
                      : theme.colors.success,
                },
              ]}>
              {app.icon}
            </Text>
          </View>

          <View style={styles.appInfo}>
            <Text
              style={[
                styles.appTitle,
                {
                  color: theme.colors.text,
                },
              ]}>
              {app.title}
            </Text>

            <Text
              numberOfLines={2}
              style={[
                styles.appDescription,
                {
                  color: theme.colors.textSecondary,
                },
              ]}>
              {app.description}
            </Text>

            <View
              style={[
                styles.comingSoonBadge,
                {
                  backgroundColor: `${theme.colors.primary}10`,
                },
              ]}>
              <Text
                style={[
                  styles.comingSoonText,
                  {
                    color: theme.colors.primary,
                  },
                ]}>
                COMING SOON
              </Text>
            </View>
          </View>

          <Text
            style={[
              styles.arrow,
              {
                color: theme.colors.textLight,
              },
            ]}>
            ›
          </Text>
        </Pressable>
      ))}

      <View
        style={[
          styles.footerCard,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}>
        <Text
          style={[
            styles.footerTitle,
            {
              color: theme.colors.text,
            },
          ]}>
          Built for better productivity
        </Text>

        <Text
          style={[
            styles.footerText,
            {
              color: theme.colors.textSecondary,
            },
          ]}>
          More tools will be added here as the TodoMaster
          ecosystem grows.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 22,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 6,
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.8,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },

  featureCard: {
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 28,
  },

  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  featureIconText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },

  featureContent: {
    flex: 1,
  },

  featureTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },

  featureText: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },

  appCard: {
    minHeight: 112,
    borderWidth: 1,
    borderRadius: 20,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  appIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  appIconText: {
    fontSize: 19,
    fontWeight: '800',
  },

  appInfo: {
    flex: 1,
    marginLeft: 13,
    paddingRight: 8,
  },

  appTitle: {
    fontSize: 16,
    fontWeight: '750',
  },

  appDescription: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },

  comingSoonBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 7,
    marginTop: 8,
  },

  comingSoonText: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.7,
  },

  arrow: {
    fontSize: 28,
    fontWeight: '300',
  },

  footerCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    marginTop: 10,
  },

  footerTitle: {
    fontSize: 15,
    fontWeight: '750',
  },

  footerText: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },
});

export default MoreAppsScreen;