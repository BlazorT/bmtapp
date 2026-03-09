import React, { useState, useEffect } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../hooks/useTheme';
import RNSTextInput from '../../components/TextInput';
import WhatsAppTemplateEditor from './WhatsAppTemplateEditor';
import SocialMediaTemplateEditor from './SocialMediaTemplateEditor';
import EmailTemplateViewer from './EmailTemplateViewer';
import { useSelector } from 'react-redux';
import { safeJSONParse } from '../../helper/dateFormatter';

const TemplateEditorModal = ({ isOpen, onClose, template, onSave }) => {
  const theme = useTheme();
  const lovs = useSelector(state => state.lovs).lovs;
  const networks = lovs?.lovs?.networks || [];
  const [templateData, setTemplateData] = useState({
    id: 0,
    name: '',
    title: '',
    subject: '',
    template: '',
    templateJson: '',
    networkId: 1,
    status: 1,
  });
  const [loading, setLoading] = useState(false);

  // Load template data when modal opens
  useEffect(() => {
    if (!template || !isOpen) {
      // Reset to default when closing or no template
      setTemplateData({
        id: 0,
        name: '',
        title: '',
        subject: '',
        template: '',
        templateJson: '',
        networkId: 1,
        status: 1,
      });
      return;
    }

    setTemplateData({
      id: template.id,
      name: template?.name || '',
      networkId: template?.networkId,
      subject: template?.subject || '',
      template: template?.template || '',
      title: template?.title || '',
      status: template?.status || 1,
      templateJson:
        template?.networkId === 3 || template?.networkId === 2
          ? template?.templateJson || ''
          : '',
    });
  }, [template, isOpen]);

  const handleInputChange = (field, value) => {
    setTemplateData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Validation
    if (!templateData.name.trim()) {
      alert('Please enter a template name');
      return;
    }

    if (templateData.networkId === 2 && !templateData.templateJson) {
      alert('Please configure WhatsApp template parameters');
      return;
    }

    if (templateData.networkId === 3 && !templateData.subject.trim()) {
      alert('Please enter email subject');
      return;
    }

    if (
      templateData.networkId !== 2 &&
      templateData.networkId !== 3 &&
      !templateData.template.trim()
    ) {
      alert('Please enter template content');
      return;
    }

    setLoading(true);
    onSave(templateData);
    setLoading(false);
  };

  const renderTemplateEditor = () => {
    const templateType =
      safeJSONParse(templateData?.templateJson)?.templateType || 1;

    if (templateData.networkId === 2 && templateType == 1) {
      return (
        <WhatsAppTemplateEditor
          value={
            templateData.templateJson
              ? JSON.parse(templateData.templateJson)
              : null
          }
          onChange={updatedData => {
            handleInputChange('templateJson', JSON.stringify(updatedData));
          }}
          onClear={() => handleInputChange('templateJson', '')}
          theme={theme}
        />
      );
    } else if (templateData.networkId === 3) {
      return (
        <EmailTemplateViewer
          html={templateData.template}
          subject={templateData.subject}
          theme={theme}
        />
      );
    } else {
      return (
        <SocialMediaTemplateEditor
          value={templateData.template}
          onChange={value => handleInputChange('template', value)}
          networkId={templateData.networkId}
          theme={theme}
        />
      );
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isOpen}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: theme.backgroundColor }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View
          style={[
            styles.header,
            { borderBottomColor: theme.containerBorderColor },
          ]}
        >
          <TouchableOpacity onPress={onClose} style={styles.headerButton}>
            <Icon name="close" size={24} color={theme.textColor} />
          </TouchableOpacity>
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
              maxWidth: '50%',
            }}
          >
            <Text style={[styles.headerTitle, { color: theme.textColor }]}>
              {template ? 'Edit Template' : 'View Template'}
              {/* Network Type Badge */}
            </Text>
            <View style={styles.badgeContainer}>
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: getNetworkColor(templateData.networkId),
                  },
                ]}
              >
                <Text style={styles.badgeText}>
                  {getNetworkName(templateData.networkId, networks)}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSave}
            style={styles.headerButton}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={theme.textColor} />
            ) : (
              <Icon name="check" size={24} color={theme.textColor} />
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Template Name */}
          {/* <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.textColor }]}>
              Template Name *
            </Text>
            <RNSTextInput
              value={templateData.name}
              onChangeText={value => handleInputChange('name', value)}
              placeholder="Enter template name"
              placeholderTextColor={theme.placeholderColor}
              editable={false} // Read-only for viewing
              style={[
                styles.input,
                {
                  backgroundColor: theme.inputBackColor,
                  color: theme.textColor,
                },
              ]}
            />
          </View> */}

          {/* Template Title (for non-WhatsApp) */}
          {templateData.networkId == 3 && (
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.textColor }]}>
                Template Title
              </Text>
              <RNSTextInput
                value={templateData.title}
                onChangeText={value => handleInputChange('title', value)}
                placeholder="Enter template title"
                placeholderTextColor={theme.placeholderColor}
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.inputBackColor,
                    color: theme.textColor,
                  },
                ]}
              />
            </View>
          )}

          {/* Email Subject */}
          {templateData.networkId === 3 && (
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.textColor }]}>
                Email Subject *
              </Text>
              <RNSTextInput
                value={templateData.subject}
                onChangeText={value => handleInputChange('subject', value)}
                placeholder="Enter email subject"
                placeholderTextColor={theme.placeholderColor}
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.inputBackColor,
                    color: theme.textColor,
                  },
                ]}
              />
            </View>
          )}

          {/* Template Editor Section */}
          <View style={styles.editorContainer}>
            {/* <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
              Template Content
            </Text> */}
            {renderTemplateEditor()}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// Helper functions
const getNetworkName = (networkId, networks) => {
  const findNetwork = networks?.find(n => n?.id == networkId);
  return findNetwork?.name || 'Unknown';
};

const getNetworkColor = networkId => {
  const colors = {
    1: '#4CAF50',
    2: '#25D366',
    3: '#EA4335',
    4: '#1877F2',
    5: '#1DA1F2',
  };
  return colors[networkId] || '#666';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingTop: Platform.OS === 'ios' ? 50 : 12,
  },
  headerButton: {
    padding: 8,
    width: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  inputContainer: {
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  editorContainer: {
    marginTop: 5,
  },
  badgeContainer: {
    marginTop: 0,
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default TemplateEditorModal;
