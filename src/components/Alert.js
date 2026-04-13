import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Pressable,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { isTab } from '../constants';

const ICON_MAP = {
  warning: { emoji: '⚠️', color: '#F59E0B', bg: '#FEF3C7' },
  error: { emoji: '✕', color: '#EF4444', bg: '#FEE2E2' },
  success: { emoji: '✓', color: '#10B981', bg: '#D1FAE5' },
  default: { emoji: 'ℹ️', color: '#6366F1', bg: '#EEF2FF' },
};

export default function CustomAlert(props) {
  const theme = useTheme();
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const iconInfo = ICON_MAP[props.massagetype] ?? ICON_MAP.default;
  const isConfirmation = props.alerttype === 'confirmation';

  useEffect(() => {
    if (props.Visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          damping: 18,
          stiffness: 220,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.85);
      opacityAnim.setValue(0);
    }
  }, [props.Visible]);

  if (!props.Visible) return null;

  return (
    <Modal
      visible={props.Visible}
      transparent
      animationType="none"
      onRequestClose={props.hide}
    >
      {/* Backdrop */}
      <Pressable
        style={styles.backdrop}
        onPress={isConfirmation ? undefined : props.hide}
      >
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: theme.modalBackColor,
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
              shadowColor: '#000',
            },
          ]}
        >
          {/* Icon Badge */}
          <View style={[styles.iconBadge, { backgroundColor: iconInfo.bg }]}>
            <Text style={[styles.iconText, { color: iconInfo.color }]}>
              {iconInfo.emoji}
            </Text>
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: theme.textColor }]}>
            {props.Title}
          </Text>

          {/* Message */}
          <Text
            style={[
              styles.message,
              { color: theme.placeholderColor ?? '#888' },
            ]}
          >
            {props.Massage}
          </Text>

          {/* Divider */}
          <View
            style={[
              styles.divider,
              { backgroundColor: theme.textColor + '18' },
            ]}
          />

          {/* Buttons */}
          {isConfirmation ? (
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.btn,
                  styles.cancelBtn,
                  { borderColor: theme.textColor + '30' },
                ]}
                onPress={props.hide}
                activeOpacity={0.7}
              >
                <Text style={[styles.cancelText, { color: theme.textColor }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.btn,
                  styles.confirmBtn,
                  { backgroundColor: iconInfo.color },
                ]}
                onPress={props.confirm}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.btn,
                  styles.okBtn,
                  { backgroundColor: iconInfo.color },
                ]}
                onPress={props.OK}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmText}>OK</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: isTab ? '55%' : '100%',
    borderRadius: 20,
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  iconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  iconText: {
    fontSize: 28,
    fontWeight: '700',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  message: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  divider: {
    width: '100%',
    height: 1,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  btn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  confirmBtn: {},
  okBtn: {
    width: '100%',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
  },
  confirmText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});
