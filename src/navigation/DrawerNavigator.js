import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {
  useNavigation,
  useNavigationState,
  DrawerActions,
} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import useTheme from '../hooks/useTheme';
import useAuth from '../hooks/useAuth';

import MainNavigator from './MainNavigator';
import RemindersScreen from '../screens/reminders/RemindersScreen';
import FavoritesScreen from '../screens/todo/FavoritesScreen';
import CategoriesScreen from '../screens/todo/CategoriesScreen';
import TrashScreen from '../screens/todo/TrashScreen';
import VoiceMemosScreen from '../screens/voice/VoiceMemosScreen';
import ProfileScreen from '../screens/settings/ProfileScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import MoreAppsScreen from '../screens/settings/MoreAppsScreen';
import FeedbackScreen from '../screens/settings/FeedbackScreen';
import FAQScreen from '../screens/settings/FAQScreen';

const Drawer = createDrawerNavigator();

function IconBox({icon, active = false, theme}) {
  return (
    <View
      style={[
        styles.iconBox,
        {
          backgroundColor: active
            ? theme.colors.primary
            : theme.mode === 'dark'
            ? '#1E2438'
            : '#F1F2F7',
        },
      ]}>
      <Text
        style={[
          styles.iconText,
          {color: active ? '#FFFFFF' : theme.colors.textSecondary},
        ]}>
        {icon}
      </Text>
    </View>
  );
}

function DrawerMenuItem({icon, title, subtitle, active = false, onPress, theme}) {
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.menuItem,
        {
          backgroundColor: active
            ? theme.mode === 'dark'
              ? 'rgba(99,102,241,0.16)'
              : 'rgba(99,102,241,0.08)'
            : 'transparent',
          opacity: pressed ? 0.7 : 1,
        },
      ]}>
      <IconBox icon={icon} active={active} theme={theme} />
      <View style={styles.menuTextContainer}>
        <Text
          style={[
            styles.menuTitle,
            {color: active ? theme.colors.primary : theme.colors.text},
          ]}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.menuSubtitle, {color: theme.colors.textLight}]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {active ? (
        <View style={[styles.activeDot, {backgroundColor: theme.colors.primary}]} />
      ) : null}
    </Pressable>
  );
}

function SectionTitle({title, theme}) {
  return (
    <Text style={[styles.sectionTitle, {color: theme.colors.textLight}]}>
      {title}
    </Text>
  );
}

function getActiveRouteName(state) {
  if (!state) return null;
  const route = state.routes[state.index];
  if (route.state) return getActiveRouteName(route.state);
  return route.name;
}

function PremiumDrawerContent() {
  const navigation = useNavigation();
  const {theme, toggleTheme} = useTheme();
  const {user, logout} = useAuth();
  const insets = useSafeAreaInsets();
  const navState = useNavigationState(state => state);
  const activeRoute = getActiveRouteName(navState);

  function closeDrawer() {
    navigation.dispatch(DrawerActions.closeDrawer());
  }

  function closeAndGo(name, params) {
    closeDrawer();
    navigation.navigate(name, params);
  }

  function goToTask() {
    closeAndGo('Task', {screen: 'MainTabs', params: {screen: 'HomeTab'}});
  }
  function goToOverview() {
    closeAndGo('Task', {screen: 'MainTabs', params: {screen: 'Overview'}});
  }
  function goToCalendar() {
    closeAndGo('Task', {screen: 'MainTabs', params: {screen: 'Calendar'}});
  }
  function goToPomodoro() {
    closeAndGo('Task', {screen: 'MainTabs', params: {screen: 'Pomodoro'}});
  }

  async function handleLogout() {
    closeDrawer();
    await logout();
  }

  const isTasksActive =
    activeRoute === 'HomeTab' ||
    activeRoute === 'MainTabs' ||
    activeRoute === 'Task' ||
    activeRoute === 'AddTodo' ||
    activeRoute === 'EditTodo' ||
    activeRoute === 'TodoDetail';

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, {paddingBottom: insets.bottom + 28}]}>

        <View
          style={[
            styles.profileHeader,
            {backgroundColor: theme.colors.primary, paddingTop: insets.top + 18},
          ]}>
          <View style={styles.headerTopRow}>
            <View style={styles.brandIcon}>
              <Text style={styles.brandIconText}>✓</Text>
            </View>
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>PRO</Text>
            </View>
          </View>
          <Text style={styles.brandName}>TodoMaster</Text>
          <Text style={styles.brandSubtitle}>
            {user?.name ? `Hi, ${user.name}` : 'Plan less. Do more.'}
          </Text>
        </View>

        <SectionTitle title="WORKSPACE" theme={theme} />
        <DrawerMenuItem icon="✓" title="Tasks" subtitle="Your daily tasks" active={isTasksActive} onPress={goToTask} theme={theme} />
        <DrawerMenuItem icon="▥" title="Overview" subtitle="Progress & statistics" active={activeRoute === 'Overview'} onPress={goToOverview} theme={theme} />
        <DrawerMenuItem icon="□" title="Calendar" subtitle="Plan your schedule" active={activeRoute === 'Calendar'} onPress={goToCalendar} theme={theme} />
        <DrawerMenuItem icon="◷" title="Focus" subtitle="Pomodoro timer" active={activeRoute === 'Pomodoro'} onPress={goToPomodoro} theme={theme} />
        <DrawerMenuItem icon="🔔" title="Reminders" subtitle="Never miss a task" active={activeRoute === 'Reminders'} onPress={() => closeAndGo('Reminders')} theme={theme} />
        <DrawerMenuItem icon="★" title="Favorites" subtitle="Important tasks" active={activeRoute === 'Favorites'} onPress={() => closeAndGo('Favorites')} theme={theme} />
        <DrawerMenuItem icon="🎤" title="Voice Memos" subtitle="Record voice notes" active={activeRoute === 'VoiceMemos'} onPress={() => closeAndGo('VoiceMemos')} theme={theme} />

        <SectionTitle title="ORGANIZE" theme={theme} />
        <DrawerMenuItem icon="▦" title="Categories" subtitle="Manage categories" active={activeRoute === 'Categories'} onPress={() => closeAndGo('Categories')} theme={theme} />
        <DrawerMenuItem icon="⌫" title="Trash" subtitle="Deleted tasks" active={activeRoute === 'Trash'} onPress={() => closeAndGo('Trash')} theme={theme} />

        <SectionTitle title="ACCOUNT" theme={theme} />
        <DrawerMenuItem icon="👤" title="Profile" subtitle="Your account" active={activeRoute === 'Profile'} onPress={() => closeAndGo('Profile')} theme={theme} />
        <DrawerMenuItem icon="⚙" title="Settings" subtitle="App preferences" active={activeRoute === 'Settings'} onPress={() => closeAndGo('Settings')} theme={theme} />

        <SectionTitle title="APPEARANCE" theme={theme} />
        <View style={[styles.themeRow, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}>
          <IconBox icon={theme.mode === 'dark' ? '☾' : '☀'} theme={theme} />
          <View style={styles.menuTextContainer}>
            <Text style={[styles.menuTitle, {color: theme.colors.text}]}>
              {theme.mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </Text>
            <Text style={[styles.menuSubtitle, {color: theme.colors.textLight}]}>
              Switch app appearance
            </Text>
          </View>
          <Switch
            value={theme.mode === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{false: '#D6D8E0', true: theme.colors.primary}}
            thumbColor="#FFFFFF"
          />
        </View>

        <SectionTitle title="MORE" theme={theme} />
        <DrawerMenuItem icon="✦" title="More Apps" subtitle="Explore more" active={activeRoute === 'MoreApps'} onPress={() => closeAndGo('MoreApps')} theme={theme} />
        <DrawerMenuItem icon="♡" title="Feedback" subtitle="Help us improve" active={activeRoute === 'Feedback'} onPress={() => closeAndGo('Feedback')} theme={theme} />
        <DrawerMenuItem icon="?" title="FAQ" subtitle="Common questions" active={activeRoute === 'FAQ'} onPress={() => closeAndGo('FAQ')} theme={theme} />

        <Pressable
          onPress={handleLogout}
          style={({pressed}) => [
            styles.logoutBtn,
            {
              backgroundColor: theme.colors.dangerSoft || 'rgba(239,68,68,0.12)',
              opacity: pressed ? 0.75 : 1,
            },
          ]}>
          <Text style={[styles.logoutText, {color: theme.colors.danger}]}>Logout</Text>
        </Pressable>

        <View style={[styles.footerCard, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}>
          <Text style={[styles.footerTitle, {color: theme.colors.text}]}>TodoMaster</Text>
          <Text style={[styles.footerText, {color: theme.colors.textLight}]}>
            Stay focused. Stay productive.
          </Text>
          <Text style={[styles.version, {color: theme.colors.textLight}]}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function DrawerNavigator() {
  const {width} = useWindowDimensions();
  const drawerWidth = Math.min(width * 0.78, 320);

  return (
    <Drawer.Navigator
      drawerContent={() => <PremiumDrawerContent />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: {width: drawerWidth},
        overlayColor: 'rgba(0,0,0,0.45)',
        swipeEnabled: true,
      }}>
      <Drawer.Screen name="Task" component={MainNavigator} />
      <Drawer.Screen name="Reminders" component={RemindersScreen} />
      <Drawer.Screen name="Favorites" component={FavoritesScreen} />
      <Drawer.Screen name="VoiceMemos" component={VoiceMemosScreen} />
      <Drawer.Screen name="Categories" component={CategoriesScreen} />
      <Drawer.Screen name="Trash" component={TrashScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="MoreApps" component={MoreAppsScreen} />
      <Drawer.Screen name="Feedback" component={FeedbackScreen} />
      <Drawer.Screen name="FAQ" component={FAQScreen} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  scrollContent: {paddingBottom: 24},
  profileHeader: {
    paddingHorizontal: 20,
    paddingBottom: 22,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  brandIconText: {color: '#FFFFFF', fontSize: 24, fontWeight: '900'},
  headerBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  headerBadgeText: {color: '#FFFFFF', fontSize: 10, fontWeight: '900', letterSpacing: 1},
  brandName: {marginTop: 14, color: '#FFFFFF', fontSize: 24, fontWeight: '900'},
  brandSubtitle: {marginTop: 4, color: 'rgba(255,255,255,0.82)', fontSize: 13, fontWeight: '500'},
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.3,
    marginTop: 18,
    marginBottom: 6,
    marginHorizontal: 18,
  },
  menuItem: {
    minHeight: 58,
    marginHorizontal: 10,
    marginVertical: 2,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {fontSize: 16, fontWeight: '700'},
  menuTextContainer: {flex: 1, marginLeft: 12},
  menuTitle: {fontSize: 14, fontWeight: '700'},
  menuSubtitle: {fontSize: 11, marginTop: 2, fontWeight: '500'},
  activeDot: {width: 6, height: 6, borderRadius: 3, marginRight: 4},
  themeRow: {
    minHeight: 58,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutBtn: {
    marginHorizontal: 14,
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  logoutText: {fontSize: 14, fontWeight: '800'},
  footerCard: {
    marginTop: 16,
    marginHorizontal: 14,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  footerTitle: {fontSize: 13, fontWeight: '800'},
  footerText: {fontSize: 11, marginTop: 3},
  version: {fontSize: 10, marginTop: 8},
});

export default DrawerNavigator;