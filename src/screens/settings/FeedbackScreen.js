import React, {useState} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {useTheme} from '../../hooks/useTheme';

const ratingOptions = [
  {value: 1, label: 'Poor'},
  {value: 2, label: 'Okay'},
  {value: 3, label: 'Good'},
  {value: 4, label: 'Great'},
  {value: 5, label: 'Amazing'},
];

function FeedbackScreen() {
  const {theme} = useTheme();

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!rating || !feedback.trim()) {
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <View
        style={[
          styles.successContainer,
          {
            backgroundColor: theme.colors.background,
          },
        ]}>
        <View
          style={[
            styles.successIcon,
            {
              backgroundColor: `${theme.colors.success}15`,
            },
          ]}>
          <Text
            style={[
              styles.successIconText,
              {
                color: theme.colors.success,
              },
            ]}>
            ✓
          </Text>
        </View>

        <Text
          style={[
            styles.successTitle,
            {
              color: theme.colors.text,
            },
          ]}>
          Thanks for your feedback!
        </Text>

        <Text
          style={[
            styles.successText,
            {
              color: theme.colors.textSecondary,
            },
          ]}>
          Your feedback helps us make TodoMaster better.
        </Text>

        <Pressable
          onPress={() => {
            setSubmitted(false);
            setRating(0);
            setFeedback('');
          }}
          style={({pressed}) => [
            styles.secondaryButton,
            {
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.surface,
              opacity: pressed ? 0.85 : 1,
            },
          ]}>
          <Text
            style={[
              styles.secondaryButtonText,
              {
                color: theme.colors.text,
              },
            ]}>
            Send Another
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
        },
      ]}
      contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text
          style={[
            styles.eyebrow,
            {
              color: theme.colors.primary,
            },
          ]}>
          WE VALUE YOUR OPINION
        </Text>

        <Text
          style={[
            styles.title,
            {
              color: theme.colors.text,
            },
          ]}>
          Feedback
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              color: theme.colors.textSecondary,
            },
          ]}>
          Tell us what you like, what could be better, or what
          you would love to see next.
        </Text>
      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: theme.colors.text,
            },
          ]}>
          How would you rate TodoMaster?
        </Text>

        <View style={styles.ratingRow}>
          {ratingOptions.map(option => {
            const selected = rating === option.value;

            return (
              <Pressable
                key={option.value}
                onPress={() => setRating(option.value)}
                style={[
                  styles.ratingItem,
                  {
                    backgroundColor: selected
                      ? `${theme.colors.primary}12`
                      : theme.colors.background,
                    borderColor: selected
                      ? theme.colors.primary
                      : theme.colors.border,
                  },
                ]}>
                <Text
                  style={[
                    styles.ratingNumber,
                    {
                      color: selected
                        ? theme.colors.primary
                        : theme.colors.text,
                    },
                  ]}>
                  {option.value}
                </Text>

                <Text
                  style={[
                    styles.ratingLabel,
                    {
                      color: selected
                        ? theme.colors.primary
                        : theme.colors.textSecondary,
                    },
                  ]}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: theme.colors.text,
            },
          ]}>
          Your feedback
        </Text>

        <TextInput
          value={feedback}
          onChangeText={setFeedback}
          placeholder="Write your feedback here..."
          placeholderTextColor={theme.colors.textLight}
          multiline
          maxLength={500}
          textAlignVertical="top"
          style={[
            styles.input,
            {
              color: theme.colors.text,
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.border,
            },
          ]}
        />

        <Text
          style={[
            styles.characterCount,
            {
              color: theme.colors.textLight,
            },
          ]}>
          {feedback.length}/500
        </Text>
      </View>

      <View
        style={[
          styles.infoCard,
          {
            backgroundColor: `${theme.colors.primary}0D`,
          },
        ]}>
        <Text
          style={[
            styles.infoTitle,
            {
              color: theme.colors.primary,
            },
          ]}>
          💡 What makes feedback useful?
        </Text>

        <Text
          style={[
            styles.infoText,
            {
              color: theme.colors.textSecondary,
            },
          ]}>
          Tell us about bugs, confusing screens, missing features,
          or anything that would make your daily workflow easier.
        </Text>
      </View>

      <Pressable
        onPress={handleSubmit}
        disabled={!rating || !feedback.trim()}
        style={({pressed}) => [
          styles.submitButton,
          {
            backgroundColor:
              rating && feedback.trim()
                ? theme.colors.primary
                : theme.colors.border,
            opacity: pressed ? 0.85 : 1,
          },
        ]}>
        <Text
          style={[
            styles.submitButtonText,
            {
              color:
                rating && feedback.trim()
                  ? '#FFFFFF'
                  : theme.colors.textLight,
            },
          ]}>
          Submit Feedback
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 22,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 6,
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.8,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },

  card: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 14,
  },

  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  ratingItem: {
    width: '18%',
    minHeight: 68,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  ratingNumber: {
    fontSize: 18,
    fontWeight: '800',
  },

  ratingLabel: {
    fontSize: 8,
    fontWeight: '700',
    marginTop: 4,
  },

  input: {
    minHeight: 150,
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 14,
    fontSize: 14,
    lineHeight: 21,
  },

  characterCount: {
    fontSize: 10,
    textAlign: 'right',
    marginTop: 6,
  },

  infoCard: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 6,
  },

  infoText: {
    fontSize: 12,
    lineHeight: 19,
  },

  submitButton: {
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  submitButtonText: {
    fontSize: 14,
    fontWeight: '800',
  },

  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },

  successIcon: {
    width: 82,
    height: 82,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  successIconText: {
    fontSize: 38,
    fontWeight: '800',
  },

  successTitle: {
    fontSize: 23,
    fontWeight: '800',
    textAlign: 'center',
  },

  successText: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 300,
  },

  secondaryButton: {
    marginTop: 24,
    minWidth: 150,
    height: 46,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
});

export default FeedbackScreen;