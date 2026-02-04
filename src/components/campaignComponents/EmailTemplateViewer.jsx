import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../hooks/useTheme';

const EmailTemplateViewer = ({ html, subject }) => {
  const theme = useTheme();
  const { width } = useWindowDimensions();

  if (!html) {
    return (
      <View
        style={[
          styles.emptyContainer,
          { backgroundColor: theme.cardBackColor },
        ]}
      >
        <Icon name="email-off" size={48} color="#999" />
        <Text style={[styles.emptyText, { color: theme.secondaryTextColor }]}>
          No email template content available
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Info Banner */}
      {/* <View style={[styles.infoCard, { backgroundColor: theme.cardBackColor }]}>
        <Icon name="info" size={20} color="#2196F3" />
        <View style={styles.infoContent}>
          <Text style={[styles.infoTitle, { color: theme.textColor }]}>
            Email Template Preview
          </Text>
          <Text style={[styles.infoText, { color: theme.textColor }]}>
            This is a read-only preview of your email template. To edit, please
            use the web interface.
          </Text>
        </View>
      </View> */}

      {/* HTML Content Preview */}
      <View
        style={[styles.previewCard, { backgroundColor: theme.cardBackColor }]}
      >
        <View style={styles.previewHeader}>
          <Icon name="insert-drive-file" size={18} color={theme.textColor} />
          <Text style={[styles.previewLabel, { color: theme.textColor }]}>
            Template Content
          </Text>
        </View>

        <View
          style={[
            styles.htmlContainer,
            {
              backgroundColor: '#FFFFFF',
              borderColor: theme.borderColor,
            },
          ]}
        >
          <RenderHtml
            contentWidth={width - 80}
            source={{ html }}
            baseStyle={{
              color: '#000000',
              fontSize: 14,
              lineHeight: 20,
            }}
            tagsStyles={{
              body: {
                color: '#000000',
              },
              p: {
                marginVertical: 8,
              },
              a: {
                color: '#2196F3',
                textDecorationLine: 'underline',
              },
              h1: {
                fontSize: 24,
                fontWeight: 'bold',
                marginVertical: 12,
              },
              h2: {
                fontSize: 20,
                fontWeight: 'bold',
                marginVertical: 10,
              },
              h3: {
                fontSize: 18,
                fontWeight: 'bold',
                marginVertical: 8,
              },
              img: {
                borderRadius: 8,
              },
            }}
          />
        </View>
      </View>

      {/* Features Banner */}
      {/* <View
        style={[styles.featuresCard, { backgroundColor: theme.cardBackground }]}
      >
        <Text style={[styles.featuresTitle, { color: theme.textColor }]}>
          ✨ Email Template Features
        </Text>
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <Icon name="check-circle" size={16} color="#28A745" />
            <Text
              style={[styles.featureText, { color: theme.secondaryTextColor }]}
            >
              Rich HTML formatting with images and links
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="check-circle" size={16} color="#28A745" />
            <Text
              style={[styles.featureText, { color: theme.secondaryTextColor }]}
            >
              Professional email design layout
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="check-circle" size={16} color="#28A745" />
            <Text
              style={[styles.featureText, { color: theme.secondaryTextColor }]}
            >
              Responsive design for all devices
            </Text>
          </View>
        </View>
      </View> */}

      {/* Edit Reminder */}
      <View
        style={[styles.reminderCard, { backgroundColor: theme.cardBackColor }]}
      >
        <Icon name="warning" size={20} color="#FFC107" />
        <Text style={[styles.reminderText, { color: theme.textColor }]}>
          To edit this email template, please use the desktop web interface with
          the visual email editor.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    borderRadius: 12,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 18,
  },
  subjectCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  subjectLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  subjectText: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
  },
  previewCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  previewLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  htmlContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    minHeight: 200,
  },
  featuresCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featuresTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  featuresList: {
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  featureText: {
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  reminderText: {
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
});

export default EmailTemplateViewer;
