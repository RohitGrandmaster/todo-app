import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const map = {
  light: 'impactLight',
  medium: 'impactMedium',
  success: 'notificationSuccess',
  error: 'notificationError',
};

export const haptic = (type = 'light') => {
  ReactNativeHapticFeedback.trigger(map[type] ?? 'impactLight', {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  });
};