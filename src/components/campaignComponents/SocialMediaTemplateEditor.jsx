import React, { useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../hooks/useTheme';

const SocialMediaTemplateEditor = ({ value, onChange, networkId }) => {
  const theme = useTheme();
  const textInputRef = useRef(null);

  // Calculate SMS parts for SMS network (networkId === 1)
  const calculateSmsParts = (text = '') => {
    const length = [...text].length;
    const gsm7Regex =
      /^[\x00-\x7F€£¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !"#$%&'()*+,\-./0-9:;<=>?@A-Z\[\\\]^_`a-z{|}~]*$/;
    const isGsm = gsm7Regex.test(text);

    if (isGsm) {
      if (length <= 160) return { parts: 1, perPart: 160, encoding: 'GSM-7' };
      return {
        parts: Math.ceil(length / 153),
        perPart: 153,
        encoding: 'GSM-7',
      };
    }

    // UCS-2 (emoji, styled text, unicode)
    if (length <= 70) return { parts: 1, perPart: 70, encoding: 'UCS-2' };
    return {
      parts: Math.ceil(length / 67),
      perPart: 67,
      encoding: 'UCS-2',
    };
  };

  const { parts, perPart, encoding } = calculateSmsParts(value || '');
  const charCount = [...(value || '')].length;

  const handleClear = () => {
    onChange('');
    textInputRef.current?.focus();
  };

  return (
    <View style={styles.container}>
      {/* SMS Info Banner (only for SMS network) */}
      {networkId === 1 && (
        <View
          style={[styles.infoCard, { backgroundColor: theme.cardBackColor }]}
        >
          <View style={styles.infoHeader}>
            <Icon name="lightbulb-outline" size={20} color="#FFC107" />
            <Text style={[styles.infoTitle, { color: theme.textColor }]}>
              SMS Tip - Keep it Short & Save!
            </Text>
          </View>
          <View
            style={[
              styles.statsContainer,
              { backgroundColor: theme.backgroundColor },
            ]}
          >
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: theme.textColor }]}>
                Characters
              </Text>
              <Text style={[styles.statValue, { color: theme.textColor }]}>
                {charCount}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: theme.textColor }]}>
                SMS Count
              </Text>
              <Text style={[styles.statValue, { color: theme.textColor }]}>
                {parts}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: theme.textColor }]}>
                Encoding
              </Text>
              <Text style={[styles.statValue, { color: theme.textColor }]}>
                {encoding}
              </Text>
            </View>
          </View>
          <Text style={[styles.infoDescription, { color: theme.textColor }]}>
            This message will be sent as{' '}
            <Text style={styles.bold}>{parts} SMS</Text> using{' '}
            <Text style={styles.bold}>{encoding}</Text> encoding.
          </Text>
        </View>
      )}

      {/* Instruction Text */}
      {/* <View
        style={[
          styles.instructionCard,
          { backgroundColor: theme.cardBackColor },
        ]}
      >
        <Icon name="info-outline" size={18} color="#2196F3" />
        <Text style={[styles.instructionText, { color: theme.textColor }]}>
          Enter your message template below. You can use emojis and special
          characters.
        </Text>
      </View> */}

      {/* Text Editor */}
      <View
        style={[styles.editorCard, { backgroundColor: theme.cardBackColor }]}
      >
        <View style={styles.editorHeader}>
          <Text style={[styles.editorLabel, { color: theme.textColor }]}>
            Message Template
          </Text>
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Icon name="close" size={20} color="#DC3545" />
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          ref={textInputRef}
          value={value || ''}
          onChangeText={onChange}
          placeholder="Type your message template here..."
          placeholderTextColor={theme.placeholderColor}
          multiline
          textAlignVertical="top"
          style={[
            styles.textInput,
            {
              backgroundColor: theme.backgroundColor,
              color: theme.textColor,
              borderColor: theme.borderColor,
            },
          ]}
        />

        {/* Character Counter */}
        <View style={styles.counterContainer}>
          <Icon name="short-text" size={16} color={theme.textColor} />
          <Text style={[styles.counterText, { color: theme.textColor }]}>
            {charCount} characters
          </Text>
        </View>
      </View>

      {/* Tips Section */}
      {/* <View
        style={[styles.tipsCard, { backgroundColor: theme.cardBackground }]}
      >
        <Text style={[styles.tipsTitle, { color: theme.textColor }]}>
          💡 Tips for Better Templates
        </Text>
        <View style={styles.tipsList}>
          <View style={styles.tipItem}>
            <Icon name="check-circle" size={16} color="#28A745" />
            <Text style={[styles.tipText, { color: theme.secondaryTextColor }]}>
              Keep messages clear and concise
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Icon name="check-circle" size={16} color="#28A745" />
            <Text style={[styles.tipText, { color: theme.secondaryTextColor }]}>
              Use variables like {'{'}name{'}'} for personalization
            </Text>
          </View>
          {networkId === 1 && (
            <View style={styles.tipItem}>
              <Icon name="check-circle" size={16} color="#28A745" />
              <Text
                style={[styles.tipText, { color: theme.secondaryTextColor }]}
              >
                Avoid special characters to reduce SMS count
              </Text>
            </View>
          )}
        </View>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    rowGap: 10,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 0,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    paddingVertical: 12,
    borderRadius: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  bold: {
    fontWeight: 'bold',
  },
  instructionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 0,
    gap: 10,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  instructionText: {
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  editorCard: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  editorLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  clearButtonText: {
    color: '#DC3545',
    fontSize: 13,
    fontWeight: '500',
  },
  textInput: {
    minHeight: 200,
    maxHeight: 400,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    lineHeight: 22,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  counterText: {
    fontSize: 12,
  },
  tipsCard: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  tipsList: {
    gap: 10,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  tipText: {
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
});

export default SocialMediaTemplateEditor;
