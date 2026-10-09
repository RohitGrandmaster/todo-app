import React, {useState} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {useTheme} from '../../hooks/useTheme';

const FAQS = [
  {
    id: '1',
    question: 'How do I create a new task?',
    answer:
      'Open the Task screen and tap the + button. Enter your task details such as title, description, category, priority and due date, then save it.',
  },
  {
    id: '2',
    question: 'Can I edit an existing task?',
    answer:
      'Yes. Open a task from your task list and choose the Edit option. Update the information you need and save your changes.',
  },
  {
    id: '3',
    question: 'How do I mark a task as completed?',
    answer:
      'Tap the checkbox on an active task. The task will be marked as completed and will move into your completed tasks.',
  },
  {
    id: '4',
    question: 'Can I save tasks as favorites?',
    answer:
      'Yes. Important tasks can be marked as favorites and will appear in the Favorites section for quick access.',
  },
  {
    id: '5',
    question: 'What happens when I delete a task?',
    answer:
      'Deleted tasks are moved to the Trash section. From there they can later be restored or permanently deleted.',
  },
  {
    id: '6',
    question: 'Does TodoMaster support dark mode?',
    answer:
      'Yes. You can switch between light and dark mode from Settings. Your selected theme is saved on the device.',
  },
  {
    id: '7',
    question: 'Are my tasks saved after I close the app?',
    answer:
      'Tasks are stored locally on your device so your data can remain available when you reopen the app.',
  },
  {
    id: '8',
    question: 'Does the Pomodoro timer work in the background?',
    answer:
      'The current version focuses on the in-app timer experience. Background notifications and advanced timer behavior can be added later.',
  },
  {
    id: '9',
    question: 'Can I use different task categories?',
    answer:
      'Yes. Tasks can be organized into categories such as Personal, Work, Learning, Shopping, Health and Project.',
  },
  {
    id: '10',
    question: 'Will TodoMaster support cloud sync?',
    answer:
      'The current learning version uses local storage. API authentication and cloud synchronization can be connected later as part of the production setup.',
  },
];

function FAQScreen() {
  const {theme} = useTheme();
  const [openId, setOpenId] = useState(null);

  const toggleFAQ = id => {
    setOpenId(currentId => (currentId === id ? null : id));
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
        },
      ]}>
      <View style={styles.header}>
        <Text
          style={[
            styles.eyebrow,
            {
              color: theme.colors.primary,
            },
          ]}>
          NEED SOME HELP?
        </Text>

        <Text
          style={[
            styles.title,
            {
              color: theme.colors.text,
            },
          ]}>
          FAQ
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              color: theme.colors.textSecondary,
            },
          ]}>
          Find quick answers to the most common questions about
          TodoMaster.
        </Text>
      </View>

      <View
        style={[
          styles.helpCard,
          {
            backgroundColor: `${theme.colors.primary}10`,
          },
        ]}>
        <View
          style={[
            styles.helpIcon,
            {
              backgroundColor: `${theme.colors.primary}18`,
            },
          ]}>
          <Text
            style={[
              styles.helpIconText,
              {
                color: theme.colors.primary,
              },
            ]}>
            ?
          </Text>
        </View>

        <View style={styles.helpContent}>
          <Text
            style={[
              styles.helpTitle,
              {
                color: theme.colors.text,
              },
            ]}>
            Can't find your answer?
          </Text>

          <Text
            style={[
              styles.helpText,
              {
                color: theme.colors.textSecondary,
              },
            ]}>
            Send us feedback and tell us what you need help with.
          </Text>
        </View>
      </View>

      <Text
        style={[
          styles.sectionTitle,
          {
            color: theme.colors.text,
          },
        ]}>
        Frequently Asked Questions
      </Text>

      {FAQS.map(item => {
        const isOpen = openId === item.id;

        return (
          <View
            key={item.id}
            style={[
              styles.faqCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: isOpen
                  ? theme.colors.primary
                  : theme.colors.border,
              },
            ]}>
            <Pressable
              onPress={() => toggleFAQ(item.id)}
              style={styles.questionButton}>
              <View style={styles.questionNumber}>
                <Text
                  style={[
                    styles.questionNumberText,
                    {
                      color: isOpen
                        ? theme.colors.primary
                        : theme.colors.textSecondary,
                    },
                  ]}>
                  {item.id.padStart(2, '0')}
                </Text>
              </View>

              <Text
                style={[
                  styles.question,
                  {
                    color: theme.colors.text,
                  },
                ]}>
                {item.question}
              </Text>

              <View
                style={[
                  styles.expandButton,
                  {
                    backgroundColor: isOpen
                      ? `${theme.colors.primary}14`
                      : theme.colors.background,
                  },
                ]}>
                <Text
                  style={[
                    styles.expandIcon,
                    {
                      color: isOpen
                        ? theme.colors.primary
                        : theme.colors.textSecondary,
                    },
                  ]}>
                  {isOpen ? '−' : '+'}
                </Text>
              </View>
            </Pressable>

            {isOpen && (
              <View
                style={[
                  styles.answerContainer,
                  {
                    borderTopColor: theme.colors.border,
                  },
                ]}>
                <Text
                  style={[
                    styles.answer,
                    {
                      color: theme.colors.textSecondary,
                    },
                  ]}>
                  {item.answer}
                </Text>
              </View>
            )}
          </View>
        );
      })}

      <View style={styles.bottomSpace} />
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
    paddingBottom: 30,
  },

  header: {
    marginBottom: 20,
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

  helpCard: {
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 26,
  },

  helpIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  helpIconText: {
    fontSize: 21,
    fontWeight: '800',
  },

  helpContent: {
    flex: 1,
  },

  helpTitle: {
    fontSize: 14,
    fontWeight: '800',
  },

  helpText: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },

  faqCard: {
    borderWidth: 1,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 10,
  },

  questionButton: {
    minHeight: 68,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  questionNumber: {
    width: 34,
    alignItems: 'center',
    marginRight: 7,
  },

  questionNumberText: {
    fontSize: 10,
    fontWeight: '800',
  },

  question: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    paddingRight: 8,
  },

  expandButton: {
    width: 32,
    height: 32,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },

  expandIcon: {
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 22,
  },

  answerContainer: {
    borderTopWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 14,
  },

  answer: {
    fontSize: 13,
    lineHeight: 21,
  },

  bottomSpace: {
    height: 10,
  },
});

export default FAQScreen;