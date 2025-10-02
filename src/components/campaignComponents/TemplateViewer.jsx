import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import { useTheme } from '../../hooks/useTheme';

const TemplateViewer = ({ isOpen, onClose, template }) => {
  const { width } = useWindowDimensions();
  const theme = useTheme();
  if (!template) return null;
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View
          style={[styles.modalView, { backgroundColor: theme.modalBackColor }]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.textColor }]}>
              {template.title}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={{ color: theme.textColor, fontWeight: 'bold' }}>
                ✕
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            <Text style={[styles.label, { color: theme.textColor }]}>
              Subject
            </Text>
            <Text style={[styles.value, { color: theme.textColor }]}>
              {template.subject}
            </Text>

            {template.networkId === 3 ? (
              <RenderHtml
                contentWidth={width - 50}
                source={{ html: template.template }}
                baseStyle={{ color: theme.textColor, fontSize: 14 }}
              />
            ) : (
              <Text style={[styles.value, { color: theme.textColor }]}>
                {template.template}
              </Text>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '90%',
    maxHeight: '85%',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  label: {
    fontSize: 14,
    marginTop: 10,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 14,
    // marginBottom: 8,
  },
});

export default TemplateViewer;
