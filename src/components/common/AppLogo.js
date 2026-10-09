import {View, Text, StyleSheet} from 'react-native';

import useTheme from '../../hooks/useTheme';

function AppLogo({
  showName = true,
  size = 'large',
}) {
  const {theme} = useTheme();

  const styles = createStyles(theme);
  const isSmall = size === 'small';

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.logoMark,
          isSmall && styles.logoMarkSmall,
        ]}>
        <View
          style={[
            styles.logoInner,
            isSmall && styles.logoInnerSmall,
          ]}
        />
      </View>

      {showName ? (
        <Text
          style={[
            styles.logoText,
            isSmall && styles.logoTextSmall,
          ]}>
          TodoMaster
        </Text>
      ) : null}
    </View>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
    },

    logoMark: {
      width: 68,
      height: 68,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary,
    },

    logoMarkSmall: {
      width: 52,
      height: 52,
      borderRadius: 17,
    },

    logoInner: {
      width: 26,
      height: 26,
      borderRadius: 9,
      borderWidth: 4,
      borderColor: theme.colors.white,
    },

    logoInnerSmall: {
      width: 20,
      height: 20,
      borderRadius: 7,
      borderWidth: 3,
    },

    logoText: {
      marginTop: theme.spacing.md,
      fontSize: 24,
      fontWeight: '800',
      color: theme.colors.text,
    },

    logoTextSmall: {
      fontSize: 19,
      marginTop: theme.spacing.sm,
    },
  });
}

export default AppLogo;