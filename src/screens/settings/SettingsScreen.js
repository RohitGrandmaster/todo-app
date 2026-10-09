import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Switch,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {DrawerActions} from '@react-navigation/native';

import useTheme from '../../hooks/useTheme';
import useAuth from '../../hooks/useAuth';

function SettingsScreen({navigation}) {
  const {theme, toggleTheme} = useTheme();
  const {user, logout} = useAuth();
  const styles = createStyles(theme);

  function openDrawer() {
    navigation.dispatch(DrawerActions.openDrawer());
  }

  async function handleLogout() {
    await logout();
  }

  return (
    <SafeAreaView
      style={[styles.safe, {backgroundColor: theme.colors.background}]}
      edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Pressable onPress={openDrawer} style={styles.menuBtn}>
            <Text style={[styles.menuIcon, {color: theme.colors.text}]}>
              ☰
            </Text>
          </Pressable>
          <View style={styles.headerText}>
            <Text style={[styles.eyebrow, {color: theme.colors.primary}]}>
              PREFERENCES
            </Text>
            <Text style={[styles.title, {color: theme.colors.text}]}>
              Settings
            </Text>
          </View>
        </View>

        <Text style={[styles.subtitle, {color: theme.colors.textSecondary}]}>
          Customize how TodoMaster works for you.
        </Text>

        {/* Appearance */}
        <Text style={[styles.sectionLabel, {color: theme.colors.textLight}]}>
          APPEARANCE
        </Text>
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowIcon}>
                {theme.mode === 'dark' ? '☾' : '☀'}
              </Text>
              <View>
                <Text style={[styles.rowTitle, {color: theme.colors.text}]}>
                  {theme.mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </Text>
                <Text
                  style={[
                    styles.rowSub,
                    {color: theme.colors.textSecondary},
                  ]}>
                  Switch app appearance
                </Text>
              </View>
            </View>
            <Switch
              value={theme.mode === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{
                false: '#D6D8E0',
                true: theme.colors.primary,
              }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Account */}
        <Text style={[styles.sectionLabel, {color: theme.colors.textLight}]}>
          ACCOUNT
        </Text>
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}>
          <Pressable
            onPress={() => navigation.navigate('Profile')}
            style={({pressed}) => [
              styles.row,
              {opacity: pressed ? 0.7 : 1},
            ]}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowIcon}>👤</Text>
              <View>
                <Text style={[styles.rowTitle, {color: theme.colors.text}]}>
                  Profile
                </Text>
                <Text
                  style={[
                    styles.rowSub,
                    {color: theme.colors.textSecondary},
                  ]}>
                  {user?.name || user?.email || 'Your account'}
                </Text>
              </View>
            </View>
            <Text style={[styles.chevron, {color: theme.colors.textLight}]}>
              ›
            </Text>
          </Pressable>
        </View>

        {/* Support */}
        <Text style={[styles.sectionLabel, {color: theme.colors.textLight}]}>
          SUPPORT
        </Text>
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}>
          <Pressable
            onPress={() => navigation.navigate('FAQ')}
            style={({pressed}) => [
              styles.row,
              styles.rowBorder,
              {
                borderBottomColor: theme.colors.border,
                opacity: pressed ? 0.7 : 1,
              },
            ]}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowIcon}>?</Text>
              <Text style={[styles.rowTitle, {color: theme.colors.text}]}>
                FAQ
              </Text>
            </View>
            <Text style={[styles.chevron, {color: theme.colors.textLight}]}>
              ›
            </Text>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate('Feedback')}
            style={({pressed}) => [
              styles.row,
              styles.rowBorder,
              {
                borderBottomColor: theme.colors.border,
                opacity: pressed ? 0.7 : 1,
              },
            ]}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowIcon}>♡</Text>
              <Text style={[styles.rowTitle, {color: theme.colors.text}]}>
                Feedback
              </Text>
            </View>
            <Text style={[styles.chevron, {color: theme.colors.textLight}]}>
              ›
            </Text>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate('MoreApps')}
            style={({pressed}) => [
              styles.row,
              {opacity: pressed ? 0.7 : 1},
            ]}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowIcon}>✦</Text>
              <Text style={[styles.rowTitle, {color: theme.colors.text}]}>
                More Apps
              </Text>
            </View>
            <Text style={[styles.chevron, {color: theme.colors.textLight}]}>
              ›
            </Text>
          </Pressable>
        </View>

        {/* Logout */}
        <Pressable
          onPress={handleLogout}
          style={({pressed}) => [
            styles.logoutBtn,
            {
              backgroundColor: theme.colors.dangerSoft,
              opacity: pressed ? 0.75 : 1,
            },
          ]}>
          <Text style={[styles.logoutText, {color: theme.colors.danger}]}>
            Logout
          </Text>
        </Pressable>

        <Text style={[styles.version, {color: theme.colors.textLight}]}>
          TodoMaster · Version 1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    safe: {flex: 1},
    scroll: {paddingBottom: 40},
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 12,
    },
    menuBtn: {
      width: 42,
      height: 42,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
    },
    menuIcon: {fontSize: 22, fontWeight: '700'},
    headerText: {flex: 1},
    eyebrow: {
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 1.4,
      marginBottom: 4,
    },
    title: {fontSize: 28, fontWeight: '800', letterSpacing: -0.6},
    subtitle: {
      fontSize: 14,
      lineHeight: 20,
      marginTop: 6,
      marginBottom: 18,
      paddingHorizontal: 20,
    },
    sectionLabel: {
      fontSize: 10,
      fontWeight: '800',
      letterSpacing: 1.3,
      marginHorizontal: 20,
      marginBottom: 8,
      marginTop: 8,
    },
    card: {
      marginHorizontal: 16,
      borderRadius: 16,
      borderWidth: 1,
      marginBottom: 8,
      overflow: 'hidden',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 14,
      paddingVertical: 14,
      minHeight: 58,
    },
    rowBorder: {
      borderBottomWidth: 1,
    },
    rowLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: 12,
    },
    rowIcon: {
      fontSize: 18,
      width: 28,
      textAlign: 'center',
    },
    rowTitle: {fontSize: 15, fontWeight: '700'},
    rowSub: {fontSize: 12, marginTop: 2, fontWeight: '500'},
    chevron: {fontSize: 22, fontWeight: '300'},
    logoutBtn: {
      marginHorizontal: 16,
      marginTop: 20,
      paddingVertical: 14,
      borderRadius: 14,
      alignItems: 'center',
    },
    logoutText: {fontSize: 15, fontWeight: '800'},
    version: {
      textAlign: 'center',
      marginTop: 20,
      fontSize: 12,
      fontWeight: '500',
    },
  });
}

export default SettingsScreen;