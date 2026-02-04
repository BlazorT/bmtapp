import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RNSTextInput from '../TextInput';
import { useTheme } from '../../hooks/useTheme';

const WhatsAppTemplateEditor = ({ value, onChange, onClear }) => {
  const theme = useTheme();
  if (!value || !value.components) {
    return (
      <View
        style={[
          styles.alertContainer,
          { backgroundColor: theme.cardBackground },
        ]}
      >
        <Icon name="information" size={24} color="#2196F3" />
        <Text style={[styles.alertText, { color: theme.textColor }]}>
          No WhatsApp template selected
        </Text>
      </View>
    );
  }

  const { components, parameters, category } = value;

  const handleParameterChange = (section, index, newValue) => {
    const updatedParams = { ...parameters };

    if (updatedParams[section][index]) {
      if (updatedParams[section][index].type === 'text') {
        updatedParams[section][index].text = newValue;
      } else {
        const mediaType = updatedParams[section][index].type;
        updatedParams[section][index][mediaType] = { link: newValue };
      }
    }

    onChange({ ...value, parameters: updatedParams });
  };

  // Replace {{1}}, {{2}} etc. in text with parameter values
  const fillTextWithParams = (component, section) => {
    if (!component.text) return '';
    let text = component.text;
    let paramIndex = 0;

    return text.replace(/\{\{(\d+)\}\}/g, () => {
      const param = parameters[section]?.[paramIndex];
      paramIndex++;
      if (!param) return '';
      return param.type === 'text'
        ? `{{${param.text || 'empty'}}}`
        : `{{[${param.type.toUpperCase()}]}}`;
    });
  };

  const renderParameterInput = (section, index, param) => {
    const label = `${section.charAt(0).toUpperCase() + section.slice(1)} Param ${index + 1}`;

    if (param.type === 'text') {
      return (
        <View key={`${section}-${index}`} style={styles.paramInputContainer}>
          <Text style={[styles.paramLabel, { color: theme.textColor }]}>
            {label}
          </Text>
          <RNSTextInput
            value={param.text || ''}
            onChangeText={value => handleParameterChange(section, index, value)}
            placeholder={`Enter value for {{${index + 1}}}`}
            placeholderTextColor={theme.placeholderColor}
            style={[
              styles.paramInput,
              {
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
              },
            ]}
          />
        </View>
      );
    }

    const mediaLabels = {
      image: 'Header Image URL',
      video: 'Header Video URL',
      document: 'Header Document URL',
    };

    if (mediaLabels[param.type]) {
      return (
        <View key={`${section}-${index}`} style={styles.paramInputContainer}>
          <Text style={[styles.paramLabel, { color: theme.textColor }]}>
            {mediaLabels[param.type]}
          </Text>
          <RNSTextInput
            value={param[param.type]?.link || ''}
            onChangeText={value => handleParameterChange(section, index, value)}
            placeholder="Enter media URL..."
            placeholderTextColor={theme.placeholderColor}
            style={[
              styles.paramInput,
              {
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
              },
            ]}
            autoCapitalize="none"
            keyboardType="url"
          />
        </View>
      );
    }

    return null;
  };

  const headerComponent = components.find(c => c.type === 'HEADER');
  const bodyComponent = components.find(c => c.type === 'BODY');
  const footerComponent = components.find(c => c.type === 'FOOTER');
  const buttonsComponent = components.find(c => c.type === 'BUTTONS');

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ rowGap: 12 }}>
      {/* Template Preview */}
      <View
        style={[styles.previewCard, { backgroundColor: theme.cardBackColor }]}
      >
        <View style={styles.previewHeader}>
          <View style={styles.previewHeaderLeft}>
            <Text style={[styles.previewTitle, { color: theme.textColor }]}>
              Preview
            </Text>
            <View
              style={[styles.categoryBadge, { backgroundColor: '#6C757D' }]}
            >
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          </View>
          {/* {onClear && (
            <TouchableOpacity onPress={onClear} style={styles.clearButton}>
              <Icon name="close" size={24} color="#DC3545" />
            </TouchableOpacity>
          )} */}
        </View>

        {/* WhatsApp Message Bubble */}
        <View
          style={[
            styles.messageBubble,
            { backgroundColor: theme.backgroundColor },
          ]}
        >
          {/* HEADER */}
          {headerComponent && (
            <View style={styles.messageSection}>
              <View style={styles.sectionBadge}>
                <Text style={styles.sectionBadgeText}>HEADER</Text>
              </View>
              {headerComponent.format !== 'TEXT' ? (
                <View style={styles.mediaContainer}>
                  {parameters.header?.[0] &&
                  parameters.header[0][parameters.header[0].type]?.link ? (
                    parameters.header[0].type === 'image' ? (
                      <Image
                        source={{ uri: parameters.header[0].image.link }}
                        style={styles.mediaImage}
                        resizeMode="cover"
                      />
                    ) : parameters.header[0].type === 'video' ? (
                      <View style={styles.videoPlaceholder}>
                        <Icon name="video" size={40} color="#666" />
                        <Text style={styles.mediaText}>Video</Text>
                      </View>
                    ) : (
                      <View style={styles.documentPlaceholder}>
                        <Icon name="file-document" size={32} color="#666" />
                        <Text style={styles.mediaText} numberOfLines={1}>
                          {parameters.header[0].document.link}
                        </Text>
                      </View>
                    )
                  ) : (
                    <View style={styles.mediaPlaceholder}>
                      <Icon name="image-off" size={40} color="#999" />
                      <Text style={[styles.placeholderText, { color: '#999' }]}>
                        [{headerComponent.format}]
                      </Text>
                    </View>
                  )}
                </View>
              ) : (
                <Text style={styles.messageText}>
                  {fillTextWithParams(headerComponent, 'header')}
                </Text>
              )}
            </View>
          )}

          {/* BODY */}
          {bodyComponent && (
            <View style={styles.messageSection}>
              <View
                style={[styles.sectionBadge, { backgroundColor: '#FFC107' }]}
              >
                <Text style={styles.sectionBadgeText}>BODY</Text>
              </View>
              <Text style={[styles.messageText, { color: theme.textColor }]}>
                {fillTextWithParams(bodyComponent, 'body')}
              </Text>
            </View>
          )}

          {/* FOOTER */}
          {footerComponent && (
            <View style={styles.messageSection}>
              <View
                style={[styles.sectionBadge, { backgroundColor: '#6C757D' }]}
              >
                <Text style={styles.sectionBadgeText}>FOOTER</Text>
              </View>
              <Text
                style={[
                  styles.messageText,
                  { color: theme.placeholderColor, fontSize: 12 },
                ]}
              >
                {footerComponent.text}
              </Text>
            </View>
          )}

          {/* BUTTONS */}
          {buttonsComponent?.buttons?.length > 0 && (
            <View style={styles.messageSection}>
              <View
                style={[styles.sectionBadge, { backgroundColor: '#28A745' }]}
              >
                <Text style={styles.sectionBadgeText}>
                  BUTTONS ({buttonsComponent.buttons.length})
                </Text>
              </View>
              <View style={[styles.buttonsContainer]}>
                {buttonsComponent.buttons.map(
                  (btn, idx) => (
                    { backgroundColor: theme.buttonBackColor },
                    (
                      <View
                        key={idx}
                        style={[
                          styles.buttonItem,
                          {
                            backgroundColor: theme.buttonBackColor,
                            borderColor: theme.textColor,
                          },
                        ]}
                      >
                        <Icon
                          name={
                            btn.type === 'URL'
                              ? 'link'
                              : btn.type === 'PHONE_NUMBER'
                                ? 'phone'
                                : 'reply'
                          }
                          size={16}
                          color={theme.textColor}
                        />
                        <Text
                          style={[
                            styles.buttonText,
                            { color: theme.textColor },
                          ]}
                        >
                          {btn.text}
                        </Text>
                      </View>
                    )
                  ),
                )}
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Parameter Inputs */}
      <View
        style={[
          styles.parametersCard,
          { backgroundColor: theme.cardBackColor },
        ]}
      >
        <Text style={[styles.parametersTitle, { color: theme.textColor }]}>
          Fill Template Parameters
        </Text>

        {parameters.header?.length > 0 && (
          <View style={styles.paramSection}>
            <Text style={[styles.paramSectionTitle, { color: '#17A2B8' }]}>
              Header Parameters
            </Text>
            {parameters.header.map((param, index) =>
              renderParameterInput('header', index, param),
            )}
          </View>
        )}

        {parameters.body?.length > 0 && (
          <View style={styles.paramSection}>
            <Text style={[styles.paramSectionTitle, { color: '#007BFF' }]}>
              Body Parameters
            </Text>
            {parameters.body.map((param, index) =>
              renderParameterInput('body', index, param),
            )}
          </View>
        )}

        {parameters.header?.length === 0 && parameters.body?.length === 0 && (
          <View style={styles.noParamsContainer}>
            <Icon name="check-circle" size={24} color="#28A745" />
            <Text style={[styles.noParamsText, { color: theme.textColor }]}>
              This template has no parameters to fill
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 12,
  },
  alertText: {
    fontSize: 14,
    flex: 1,
  },
  previewCard: {
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  clearButton: {
    padding: 4,
  },
  messageBubble: {
    borderRadius: 8,
    padding: 12,
  },
  messageSection: {
    marginBottom: 12,
  },
  sectionBadge: {
    backgroundColor: '#17A2B8',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 6,
  },
  sectionBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  messageText: {
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
  },
  mediaContainer: {
    marginTop: 4,
  },
  mediaImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  videoPlaceholder: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    gap: 8,
  },
  mediaPlaceholder: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 12,
    marginTop: 8,
  },
  mediaText: {
    fontSize: 12,
    color: '#666',
  },
  buttonsContainer: {
    gap: 8,
  },
  buttonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2196F3',
    gap: 8,
  },
  buttonText: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '500',
  },
  parametersCard: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  parametersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  paramSection: {
    marginBottom: 0,
  },
  paramSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  paramInputContainer: {
    marginBottom: 12,
  },
  paramLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 6,
  },
  paramInput: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  noParamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 12,
  },
  noParamsText: {
    fontSize: 14,
  },
});

export default WhatsAppTemplateEditor;
