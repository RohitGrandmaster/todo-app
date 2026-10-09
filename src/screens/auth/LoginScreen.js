import {
  Text,
  View,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {useState} from 'react';

import AppLogo from '../../components/common/AppLogo';
import AppButton from '../../components/common/AppButton';
import AppInput from '../../components/common/AppInput';

import useAuth from '../../hooks/useAuth';
import useTheme from '../../hooks/useTheme';

import {
  validateLogin,
} from '../../utils/validation';

import ROUTES from '../../constants/routes';

function LoginScreen({navigation}) {
  const {theme} = useTheme();
  const {login} = useAuth();

  const styles = createStyles(theme);

  const [email, setEmail] = useState('');
  const [password, setPassword] =
    useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] =
    useState(false);

  async function handleLogin() {
    setError('');

    const validationError =
      validateLogin(
        email,
        password,
      );

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    const result = await login(
      email.trim(),
      password,
    );

    setLoading(false);

    if (!result.success) {
      setError(result.message);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }>
        <ScrollView
          contentContainerStyle={
            styles.scrollContent
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <AppLogo />

            <View style={styles.heading}>
              <Text style={styles.title}>
                Welcome back
              </Text>

              <Text
                style={styles.subtitle}>
                Organize your day, one task at a time.
              </Text>
            </View>

            <AppInput
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <AppInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              rightLabel={
                showPassword
                  ? 'Hide'
                  : 'Show'
              }
              onRightPress={() =>
                setShowPassword(
                  current => !current,
                )
              }
              error={error}
            />

            <AppButton
              title="Login"
              onPress={handleLogin}
              loading={loading}
            />

            <Pressable
              style={styles.forgot}
              onPress={() =>
                navigation.navigate(
                  ROUTES.FORGOT_PASSWORD,
                )
              }>
              <Text
                style={styles.link}>
                Forgot password?
              </Text>
            </Pressable>

            <View
              style={styles.signupRow}>
              <Text
                style={styles.bottomText}>
                Don't have an account?
              </Text>

              <Pressable
                onPress={() =>
                  navigation.navigate(
                    ROUTES.SIGNUP,
                  )
                }>
                <Text
                  style={styles.signupLink}>
                  Sign up
                </Text>
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
      flex: 1,
      justifyContent: 'center',
      padding: theme.spacing.xxl,
      paddingVertical: theme.spacing.xxxl,
    },

    heading: {
      marginTop: 48,
      marginBottom: theme.spacing.xxl,
    },

    title: {
      fontSize: 32,
      fontWeight: '800',
      color: theme.colors.text,
    },

    subtitle: {
      marginTop: theme.spacing.sm,
      fontSize: theme.typography.body,
      lineHeight: 23,
      color: theme.colors.textSecondary,
    },

    forgot: {
      alignSelf: 'center',
      marginTop: theme.spacing.lg,
    },

    link: {
      fontSize: theme.typography.bodySmall,
      fontWeight: '700',
      color: theme.colors.primary,
    },

    signupRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: theme.spacing.xxxl,
    },

    bottomText: {
      fontSize: theme.typography.bodySmall,
      color: theme.colors.textSecondary,
    },

    signupLink: {
      marginLeft: theme.spacing.xs,
      fontSize: theme.typography.bodySmall,
      fontWeight: '800',
      color: theme.colors.primary,
    },
  });
}

export default LoginScreen;