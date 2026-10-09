import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  CheckSquare2,
  CalendarDays,
  BarChart3,
  Timer,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import  useTheme  from '../hooks/useTheme';

import HomeScreen from '../screens/todo/HomeScreen';
import AddTodoScreen from '../screens/todo/AddTodoScreen';
import EditTodoScreen from '../screens/todo/EditTodoScreen';
import TodoDetailScreen from '../screens/todo/TodoDetailScreen';

import CalendarScreen from '../screens/calendar/CalendarScreen';
import OverviewScreen from '../screens/overview/OverviewScreen';
import PomodoroScreen from '../screens/pomodoro/PomodoroScreen';
import RemindersScreen from '../screens/reminders/RemindersScreen';

import FavoritesScreen from '../screens/todo/FavoritesScreen';
import CategoriesScreen from '../screens/todo/CategoriesScreen';
import TrashScreen from '../screens/todo/TrashScreen';

import ProfileScreen from '../screens/settings/ProfileScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import MoreAppsScreen from '../screens/settings/MoreAppsScreen';
import FeedbackScreen from '../screens/settings/FeedbackScreen';
import FAQScreen from '../screens/settings/FAQScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({ Icon, focused, theme }) {
  const activeColor = theme.colors.primary;
  const inactiveColor = theme.colors.textLight;

  // Soft pill background from theme (fallback if not present)
  const activeBg =
    theme.colors.primarySoft ||
    (theme.mode === 'dark' ? 'rgba(99, 102, 241, 0.18)' : 'rgba(99, 102, 241, 0.12)');

  return (
    <View
      style={[
        styles.iconContainer,
        focused && {
          backgroundColor: activeBg,
        },
      ]}>
      <Icon
        size={focused ? 23 : 22}
        strokeWidth={focused ? 2.4 : 2}
        color={focused ? activeColor : inactiveColor}
      />
    </View>
  );
}

function MainTabs() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textLight,
        tabBarHideOnKeyboard: true,

        tabBarStyle: {
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: Math.max(insets.bottom, 12) + 4,

          height: 72,

          paddingTop: 10,
          paddingBottom: 8,
          paddingHorizontal: 8,

          borderTopWidth: 0,
          borderRadius: 28,

          backgroundColor: theme.colors.surface,

          // Premium soft shadow
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: theme.mode === 'dark' ? 0.35 : 0.12,
          shadowRadius: 24,
          elevation: 16,

          // Subtle border for depth (optional but premium)
          borderWidth: theme.mode === 'dark' ? 1 : 0,
          borderColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'transparent',
        },

        tabBarItemStyle: {
          height: 54,
          borderRadius: 20,
          marginHorizontal: 2,
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.2,
          marginTop: 3,
        },

        tabBarIconStyle: {
          marginTop: 2,
        },
      }}>
      
      {/* TASK */}
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Tasks',
          tabBarLabel: 'Tasks',
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={CheckSquare2} focused={focused} theme={theme} />
          ),
        }}
      />

      {/* CALENDAR */}
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          title: 'Calendar',
          tabBarLabel: 'Calendar',
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={CalendarDays} focused={focused} theme={theme} />
          ),
        }}
      />

      {/* OVERVIEW */}
      <Tab.Screen
        name="Overview"
        component={OverviewScreen}
        options={{
          title: 'Overview',
          tabBarLabel: 'Overview',
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={BarChart3} focused={focused} theme={theme} />
          ),
        }}
      />

      {/* POMODORO */}
      <Tab.Screen
        name="Pomodoro"
        component={PomodoroScreen}
        options={{
          title: 'Focus',
          tabBarLabel: 'Focus',
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={Timer} focused={focused} theme={theme} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function MainNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: {
          backgroundColor: 'transparent',
        },
      }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="AddTodo" component={AddTodoScreen} />
      <Stack.Screen name="EditTodo" component={EditTodoScreen} />
      <Stack.Screen name="TodoDetail" component={TodoDetailScreen} />
      <Stack.Screen name="Reminders" component={RemindersScreen} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen name="Trash" component={TrashScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="MoreApps" component={MoreAppsScreen} />
      <Stack.Screen name="Feedback" component={FeedbackScreen} />
      <Stack.Screen name="FAQ" component={FAQScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 44,
    height: 32,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MainNavigator;