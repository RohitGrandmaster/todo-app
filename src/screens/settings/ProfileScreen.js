import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';
import {DrawerActions} from '@react-navigation/native';

import {useState} from 'react';

import AppButton from '../../components/common/AppButton';
import AppInput from '../../components/common/AppInput';

import useAuth from '../../hooks/useAuth';
import useTheme from '../../hooks/useTheme';

function ProfileScreen({navigation}) {
  const {theme} = useTheme();
  const {user, updateProfile} =
    useAuth();

  const styles = createStyles(theme);

  const [name, setName] =
    useState(user?.name || '');

  const [loading, setLoading] =
    useState(false);

  function openDrawer() {
    navigation.dispatch(DrawerActions.openDrawer());
  }

  async function handleSave() {
    if (!name.trim()) {
      return;
    }

    setLoading(true);

    await updateProfile(
      name.trim(),
    );

    setLoading(false);
    navigation.goBack();
  }

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={openDrawer} style={styles.menuBtn}>
            <Text style={styles.menuIcon}>☰</Text>
          </Pressable>
          <Text style={styles.title}>
            Profile
          </Text>
        </View>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(
              user?.name || 'U'
            )
              .charAt(0)
              .toUpperCase()}
          </Text>
        </View>

        <AppInput
          label="Name"
          placeholder="Your name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <AppInput
          label="Email"
          placeholder="Your email"
          value={user?.email || ''}
          onChangeText={() => {}}
        />

        <AppButton
          title="Save Profile"
          onPress={handleSave}
          loading={loading}
        />
      </View>
    </SafeAreaView>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    container: {
      flex: 1,
      padding: theme.spacing.xl,
    },

    header: {
      marginBottom: theme.spacing.xxxl,
      flexDirection: 'row',
      alignItems: 'center',
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

    title: {
      fontSize: 28,
      fontWeight: '800',
      color: theme.colors.text,
    },


    avatar: {
      width: 90,
      height: 90,
      alignSelf: 'center',
      marginBottom: theme.spacing.xxxl,
      borderRadius: 45,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary,
    },

    avatarText: {
      fontSize: 36,
      fontWeight: '800',
      color: theme.colors.white,
    },
  });
}

export default ProfileScreen;