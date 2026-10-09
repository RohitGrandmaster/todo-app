import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

import ROUTES from '../constants/routes';

const Stack =
  createNativeStackNavigator();

function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name={ROUTES.LOGIN}
        component={LoginScreen}
      />

      <Stack.Screen
        name={ROUTES.SIGNUP}
        component={SignupScreen}
      />

      <Stack.Screen
        name={ROUTES.FORGOT_PASSWORD}
        component={ForgotPasswordScreen}
      />
    </Stack.Navigator>
  );
}

export default AuthNavigator;