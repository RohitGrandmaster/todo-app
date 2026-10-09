import {
  View,
  Text,
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
  validateSignup,
} from '../../utils/validation';

function SignupScreen({navigation}) {
  const {theme} = useTheme();
  const {signup} = useAuth();

  const styles = createStyles(theme);

  const [name, setName] = useState('');
  const [email, setEmail] =
    useState('');
  const [password, setPassword] =
    useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  async function handleSignup() {
    setError('');

    const validationError =
      validateSignup(
        name,
        email,
        password,
        confirmPassword,
      );

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    const result = await signup(
      name.trim(),
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
            <Pressable
              style={styles.backButton}
              onPress={() =>
                navigation.goBack()
              }>
              <Text
                style={styles.backText}>
                ‹
              </Text>
            </Pressable>

            <AppLogo size="small" />

            <View style={styles.heading}>
              <Text
                style={styles.title}>
                Create your account
              </Text>

              <Text
                style={styles.subtitle}>
                Start organizing your tasks today.
              </Text>
            </View>

            <AppInput
              label="Name"
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

            <AppInput
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <AppInput
              label="Password"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={
                !showPassword
              }
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
            />

            <AppInput
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChangeText={
                setConfirmPassword
              }
              secureTextEntry={
                !showConfirmPassword
              }
              rightLabel={
                showConfirmPassword
                  ? 'Hide'
                  : 'Show'
              }
              onRightPress={() =>
                setShowConfirmPassword(
                  current => !current,
                )
              }
              error={error}
            />

            <AppButton
              title="Create Account"
              onPress={handleSignup}
              loading={loading}
            />

            <View
              style={styles.loginRow}>
              <Text
                style={styles.bottomText}>
                Already have an account?
              </Text>

              <Pressable
                onPress={() =>
                  navigation.goBack()
                }>
                <Text
                  style={styles.loginLink}>
                  Login
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
      padding: theme.spacing.xxl,
      paddingVertical: theme.spacing.lg,
    },

    backButton: {
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.lg,
    },

    backText: {
      fontSize: 38,
      color: theme.colors.text,
    },

    heading: {
      marginTop: theme.spacing.xxl,
      marginBottom: theme.spacing.xxl,
    },

    title: {
      fontSize: 30,
      fontWeight: '800',
      color: theme.colors.text,
    },

    subtitle: {
      marginTop: theme.spacing.sm,
      fontSize: theme.typography.body,
      lineHeight: 23,
      color: theme.colors.textSecondary,
    },

    loginRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: theme.spacing.xxxl,
    },

    bottomText: {
      fontSize: theme.typography.bodySmall,
      color: theme.colors.textSecondary,
    },

    loginLink: {
      marginLeft: theme.spacing.xs,
      fontSize: theme.typography.bodySmall,
      fontWeight: '800',
      color: theme.colors.primary,
    },
  });
}

export default SignupScreen;