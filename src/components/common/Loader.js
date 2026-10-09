import {
  ActivityIndicator,
  View,
  StyleSheet,
} from 'react-native';

import useTheme from '../../hooks/useTheme';

function Loader({
  size = 'large',
  fullScreen = false,
}) {
  const {theme} = useTheme();

  const styles = createStyles(theme);

  return (
    <View
      style={[
        styles.container,
        fullScreen && styles.fullScreen,
      ]}>
      <ActivityIndicator
        size={size}
        color={theme.colors.primary}
      />
    </View>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.lg,
    },

    fullScreen: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  });
}

export default Loader;