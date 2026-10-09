import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';

import useTheme from '../../hooks/useTheme';

const FILTERS = [
  {
    key: 'all',
    label: 'All',
  },
  {
    key: 'active',
    label: 'Active',
  },
  {
    key: 'completed',
    label: 'Done',
  },
];

function FilterTabs({
  selectedFilter,
  onChange,
}) {
  const {theme} = useTheme();

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {FILTERS.map(filter => {
        const selected =
          selectedFilter === filter.key;

        return (
          <Pressable
            key={filter.key}
            style={[
              styles.tab,
              selected && styles.selectedTab,
            ]}
            onPress={() =>
              onChange(filter.key)
            }
            accessibilityRole="tab"
            accessibilityState={{
              selected,
            }}>
            <Text
              style={[
                styles.text,
                selected &&
                  styles.selectedText,
              ]}>
              {filter.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      padding: 4,
      marginVertical: theme.spacing.lg,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.border,
    },

    tab: {
      flex: 1,
      minHeight: 44,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.radius.md,
    },

    selectedTab: {
      backgroundColor: theme.colors.surface,
    },

    text: {
      fontSize: theme.typography.bodySmall,
      fontWeight: '600',
      color: theme.colors.textSecondary,
    },

    selectedText: {
      fontWeight: '800',
      color: theme.colors.text,
    },
  });
}

export default FilterTabs;