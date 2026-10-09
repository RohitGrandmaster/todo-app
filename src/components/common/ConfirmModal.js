import {
  Modal,
  View,
  Text,
  StyleSheet,
} from 'react-native';

import AppButton from './AppButton';
import useTheme from '../../hooks/useTheme';

function ConfirmModal({
  visible,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  onCancel,
  onConfirm,
  danger = false,
}) {
  const {theme} = useTheme();

  const styles = createStyles(theme);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>
            {title}
          </Text>

          <Text style={styles.message}>
            {message}
          </Text>

          <View style={styles.actions}>
            <View style={styles.action}>
              <AppButton
                title={cancelText}
                variant="secondary"
                onPress={onCancel}
              />
            </View>

            <View style={styles.action}>
              <AppButton
                title={confirmText}
                variant={
                  danger ? 'danger' : 'primary'
                }
                onPress={onConfirm}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.45)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xl,
    },

    modal: {
      width: '100%',
      maxWidth: 390,
      borderRadius: theme.radius.xl,
      padding: theme.spacing.xxl,
      backgroundColor: theme.colors.surface,
    },

    title: {
      fontSize: theme.typography.heading,
      fontWeight: '800',
      color: theme.colors.text,
    },

    message: {
      marginTop: theme.spacing.sm,
      fontSize: theme.typography.body,
      lineHeight: 22,
      color: theme.colors.textSecondary,
    },

    actions: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      marginTop: theme.spacing.xxl,
    },

    action: {
      flex: 1,
    },
  });
}

export default ConfirmModal;