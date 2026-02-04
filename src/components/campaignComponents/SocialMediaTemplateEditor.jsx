import React, { useRef, useState } from 'react';
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

// Style mappings
const styleMap = {
  normal: null, // No transformation
  bold: {
    A: '𝐀',
    B: '𝐁',
    C: '𝐂',
    D: '𝐃',
    E: '𝐄',
    F: '𝐅',
    G: '𝐆',
    H: '𝐇',
    I: '𝐈',
    J: '𝐉',
    K: '𝐊',
    L: '𝐋',
    M: '𝐌',
    N: '𝐍',
    O: '𝐎',
    P: '𝐏',
    Q: '𝐐',
    R: '𝐑',
    S: '𝐒',
    T: '𝐓',
    U: '𝐔',
    V: '𝐕',
    W: '𝐖',
    X: '𝐗',
    Y: '𝐘',
    Z: '𝐙',
    a: '𝐚',
    b: '𝐛',
    c: '𝐜',
    d: '𝐝',
    e: '𝐞',
    f: '𝐟',
    g: '𝐠',
    h: '𝐡',
    i: '𝐢',
    j: '𝐣',
    k: '𝐤',
    l: '𝐥',
    m: '𝐦',
    n: '𝐧',
    o: '𝐨',
    p: '𝐩',
    q: '𝐪',
    r: '𝐫',
    s: '𝐬',
    t: '𝐭',
    u: '𝐮',
    v: '𝐯',
    w: '𝐰',
    x: '𝐱',
    y: '𝐲',
    z: '𝐳',
  },
  italic: {
    A: '𝐴',
    B: '𝐵',
    C: '𝐶',
    D: '𝐷',
    E: '𝐸',
    F: '𝐹',
    G: '𝐺',
    H: '𝐻',
    I: '𝐼',
    J: '𝐽',
    K: '𝐾',
    L: '𝐿',
    M: '𝑀',
    N: '𝑁',
    O: '𝑂',
    P: '𝑃',
    Q: '𝑄',
    R: '𝑅',
    S: '𝑆',
    T: '𝑇',
    U: '𝑈',
    V: '𝑉',
    W: '𝑊',
    X: '𝑋',
    Y: '𝑌',
    Z: '𝑍',
    a: '𝑎',
    b: '𝑏',
    c: '�c',
    d: '𝑑',
    e: '𝑒',
    f: '𝑓',
    g: '𝑔',
    h: 'ℎ',
    i: '𝑖',
    j: '𝑗',
    k: '𝑘',
    l: '𝑙',
    m: '𝑚',
    n: '𝑛',
    o: '𝑜',
    p: '𝑝',
    q: '𝑞',
    r: '𝑟',
    s: '𝑠',
    t: '𝑡',
    u: '𝑢',
    v: '𝑣',
    w: '𝑤',
    x: '𝑥',
    y: '𝑦',
    z: '𝑧',
  },
  underline: {
    A: 'A\u0332',
    B: 'B\u0332',
    C: 'C\u0332',
    D: 'D\u0332',
    E: 'E\u0332',
    F: 'F\u0332',
    G: 'G\u0332',
    H: 'H\u0332',
    I: 'I\u0332',
    J: 'J\u0332',
    K: 'K\u0332',
    L: 'L\u0332',
    M: 'M\u0332',
    N: 'N\u0332',
    O: 'O\u0332',
    P: 'P\u0332',
    Q: 'Q\u0332',
    R: 'R\u0332',
    S: 'S\u0332',
    T: 'T\u0332',
    U: 'U\u0332',
    V: 'V\u0332',
    W: 'W\u0332',
    X: 'X\u0332',
    Y: 'Y\u0332',
    Z: 'Z\u0332',
    a: 'a\u0332',
    b: 'b\u0332',
    c: 'c\u0332',
    d: 'd\u0332',
    e: 'e\u0332',
    f: 'f\u0332',
    g: 'g\u0332',
    h: 'h\u0332',
    i: 'i\u0332',
    j: 'j\u0332',
    k: 'k\u0332',
    l: 'l\u0332',
    m: 'm\u0332',
    n: 'n\u0332',
    o: 'o\u0332',
    p: 'p\u0332',
    q: 'q\u0332',
    r: 'r\u0332',
    s: 's\u0332',
    t: 't\u0332',
    u: 'u\u0332',
    v: 'v\u0332',
    w: 'w\u0332',
    x: 'x\u0332',
    y: 'y\u0332',
    z: 'z\u0332',
  },
  strikethrough: {
    A: 'A\u0336',
    B: 'B\u0336',
    C: 'C\u0336',
    D: 'D\u0336',
    E: 'E\u0336',
    F: 'F\u0336',
    G: 'G\u0336',
    H: 'H\u0336',
    I: 'I\u0336',
    J: 'J\u0336',
    K: 'K\u0336',
    L: 'L\u0336',
    M: 'M\u0336',
    N: 'N\u0336',
    O: 'O\u0336',
    P: 'P\u0336',
    Q: 'Q\u0336',
    R: 'R\u0336',
    S: 'S\u0336',
    T: 'T\u0336',
    U: 'U\u0336',
    V: 'V\u0336',
    W: 'W\u0336',
    X: 'X\u0336',
    Y: 'Y\u0336',
    Z: 'Z\u0336',
    a: 'a\u0336',
    b: 'b\u0336',
    c: 'c\u0336',
    d: 'd\u0336',
    e: 'e\u0336',
    f: 'f\u0336',
    g: 'g\u0336',
    h: 'h\u0336',
    i: 'i\u0336',
    j: 'j\u0336',
    k: 'k\u0336',
    l: 'l\u0336',
    m: 'm\u0336',
    n: 'n\u0336',
    o: 'o\u0336',
    p: 'p\u0336',
    q: 'q\u0336',
    r: 'r\u0336',
    s: 's\u0336',
    t: 't\u0336',
    u: 'u\u0336',
    v: 'v\u0336',
    w: 'w\u0336',
    x: 'x\u0336',
    y: 'y\u0336',
    z: 'z\u0336',
  },
  cursive: {
    A: '𝒜',
    B: '𝐵',
    C: '𝒞',
    D: '𝒟',
    E: '𝐸',
    F: '𝐹',
    G: '𝒢',
    H: '𝐻',
    I: '𝐼',
    J: '𝒥',
    K: '𝒦',
    L: '𝐿',
    M: '𝑀',
    N: '𝒩',
    O: '𝒪',
    P: '𝒫',
    Q: '𝒬',
    R: '𝑅',
    S: '𝒮',
    T: '𝒯',
    U: '𝒰',
    V: '𝒱',
    W: '𝒲',
    X: '𝒳',
    Y: '𝒴',
    Z: '𝒵',
    a: '𝒶',
    b: '𝒷',
    c: '𝒸',
    d: '𝒹',
    e: '𝑒',
    f: '𝒻',
    g: '𝑔',
    h: '𝒽',
    i: '𝒾',
    j: '𝒿',
    k: '𝓀',
    l: '𝓁',
    m: '𝓂',
    n: '𝓃',
    o: '𝑜',
    p: '𝓅',
    q: '𝓆',
    r: '𝓇',
    s: '𝓈',
    t: '𝓉',
    u: '𝓊',
    v: '𝓋',
    w: '𝓌',
    x: '𝓍',
    y: '𝓎',
    z: '𝓏',
  },
  doublestruck: {
    A: '𝔸',
    B: '𝔹',
    C: 'ℂ',
    D: '𝔻',
    E: '𝔼',
    F: '𝔽',
    G: '𝔾',
    H: 'ℍ',
    I: '𝕀',
    J: '𝕁',
    K: '𝕂',
    L: '𝕃',
    M: '𝕄',
    N: 'ℕ',
    O: '𝕆',
    P: 'ℙ',
    Q: 'ℚ',
    R: 'ℝ',
    S: '𝕊',
    T: '𝕋',
    U: '𝕌',
    V: '𝕍',
    W: '𝕎',
    X: '𝕏',
    Y: '𝕐',
    Z: 'ℤ',
    a: '𝕒',
    b: '𝕓',
    c: '𝕔',
    d: '𝕕',
    e: '𝕖',
    f: '𝕗',
    g: '𝕘',
    h: '𝕙',
    i: '𝕚',
    j: '𝕛',
    k: '𝕜',
    l: '𝕝',
    m: '𝕞',
    n: '𝕟',
    o: '𝕠',
    p: '𝕡',
    q: '𝕢',
    r: '𝕣',
    s: '𝕤',
    t: '𝕥',
    u: '𝕦',
    v: '𝕧',
    w: '𝕨',
    x: '𝕩',
    y: '𝕪',
    z: '𝕫',
  },
};

const SocialMediaTemplateEditor = ({ value, onChange, networkId }) => {
  const theme = useTheme();
  const textInputRef = useRef(null);
  const [activeStyle, setActiveStyle] = useState('normal');

  // Transform text with the active style
  const transformText = (text, style) => {
    if (style === 'normal' || !styleMap[style]) return text;
    const mapping = styleMap[style];
    return [...text].map(char => mapping[char] || char).join('');
  };

  // Handle text input with active style transformation
  const handleTextChange = newText => {
    const oldLength = (value || '').length;
    const newLength = newText.length;

    // User is adding text
    if (newLength > oldLength) {
      const addedText = newText.slice(oldLength);
      const styledText = transformText(addedText, activeStyle);
      const finalText = (value || '') + styledText;
      onChange(finalText);
    }
    // User is deleting text or replacing
    else {
      onChange(newText);
    }
  };

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
    setActiveStyle('normal');
    textInputRef.current?.focus();
  };

  const handleStyleSelect = style => {
    setActiveStyle(style);
    textInputRef.current?.focus();
  };

  const styleButtons = [
    { id: 'normal', label: 'Normal', icon: 'T', display: 'T' },
    { id: 'bold', label: 'Bold', icon: '𝐁', display: '𝐁' },
    { id: 'italic', label: 'Italic', icon: '𝐼', display: '𝐼' },
    {
      id: 'underline',
      label: 'Underline',
      icon: 'U',
      display: 'U',
      underline: true,
    },
    {
      id: 'strikethrough',
      label: 'Strike',
      icon: 'S',
      display: 'S',
      strikethrough: true,
    },
    { id: 'cursive', label: 'Cursive', icon: '𝒯', display: '𝒯' },
    { id: 'doublestruck', label: 'Double', icon: '𝕋', display: '𝕋' },
  ];

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
          { backgroundColor: theme.cardBackground },
        ]}
      >
        <Icon name="info" size={18} color="#2196F3" />
        <Text style={[styles.instructionText, { color: theme.textColor }]}>
          Select a text style below, then start typing. Your text will
          automatically be formatted.
        </Text>
      </View> */}

      {/* Styling Toolbar with Radio Selection */}
      {/* <View
        style={[styles.toolbarCard, { backgroundColor: theme.cardBackColor }]}
      >
        <View style={styles.toolbarHeader}>
          <Text style={[styles.toolbarTitle, { color: theme.textColor }]}>
            Text Styles
          </Text>
          <View style={styles.activeStyleBadge}>
            <Icon name="brush" size={14} color="#2196F3" />
            <Text style={styles.activeStyleText}>
              {styleButtons.find(s => s.id === activeStyle)?.label}
            </Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.toolbarButtons}
          keyboardShouldPersistTaps="handled"
        >
          {styleButtons.map(style => (
            <TouchableOpacity
              key={style.id}
              style={[
                styles.styleButton,
                { borderColor: theme.borderColor },
                activeStyle === style.id && styles.styleButtonActive,
              ]}
              onPress={() => handleStyleSelect(style.id)}
            >
              <View style={styles.radioContainer}>
                <View
                  style={[
                    styles.radioOuter,
                    activeStyle === style.id && styles.radioOuterActive,
                  ]}
                >
                  {activeStyle === style.id && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </View>

              <Text
                style={[
                  styles.styleButtonText,
                  style.underline && { textDecorationLine: 'underline' },
                  style.strikethrough && { textDecorationLine: 'line-through' },
                ]}
              >
                {style.display}
              </Text>
              <Text style={[styles.styleLabel, { color: theme.textColor }]}>
                {style.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
          onChangeText={handleTextChange}
          placeholder="Start typing with your selected style..."
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
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
    marginBottom: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  instructionText: {
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  toolbarCard: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toolbarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  toolbarTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  activeStyleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeStyleText: {
    fontSize: 11,
    color: '#2196F3',
    fontWeight: '600',
  },
  toolbarButtons: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 12,
  },
  styleButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 2,
    minWidth: 70,
    position: 'relative',
  },
  styleButtonActive: {
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  radioContainer: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  radioOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: {
    borderColor: '#2196F3',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2196F3',
  },
  styleButtonText: {
    fontSize: 20,
    marginBottom: 4,
  },
  styleLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  editorCard: {
    borderRadius: 12,
    padding: 16,
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
    marginBottom: 12,
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
});

export default SocialMediaTemplateEditor;
