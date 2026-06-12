import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  Platform,
} from 'react-native';
import SignatureCanvas from 'react-native-signature-canvas';
import Icon from 'react-native-vector-icons/AntDesign';
import { useTheme } from '../hooks/useTheme';
import moment from 'moment';
import RNSButton from './Button';
import { SvgXml } from 'react-native-svg';

const { width } = Dimensions.get('window');

const SignatureModal = ({
  visible,
  onClose,
  signature,
  setSignature,
  signatureJSON,
  setSignatureJSON,
  user,
  isAuthenticated,
  onSubmit,
}) => {
  const theme = useTheme();
  const ref = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);

  useEffect(() => {
    if (visible) {
      setShowCanvas(false);
      const timer = setTimeout(() => {
        setShowCanvas(true);
      }, 300); // 250–500ms is ideal

      return () => clearTimeout(timer);
    } else {
      setShowCanvas(false);
    }
  }, [visible]);

  const handleEmpty = () => {
    setIsLoading(false);
  };

  const handleClear = () => {
    ref?.current?.clearSignature();

    setShowCanvas(false);
    const timer = setTimeout(() => {
      setShowCanvas(true);
    }, 300); // 250–500ms is ideal

    setSignature(null);
  };

  const handleError = error => {
    console.error('Signature pad error:', error);
    setIsLoading(false);
  };

  const handleEnd = () => {
    setIsLoading(true);
    ref.current?.readSignature();
  };

  const handleSignature = data => {
    try {
      if (!data) return;

      const rawSvg = decodeSvgBase64(data);
      setSignature(rawSvg);

      setSignatureJSON({
        dt: moment().utc().format(),
        signature: rawSvg,
        adminId: user?.id,
        adminName: user?.fullName || '',
      });
    } catch (err) {
      console.error('Error decoding signature SVG:', err);
    }
  };

  const decodeSvgBase64 = base64Svg => {
    const base64 = base64Svg.replace('data:image/svg+xml;base64,', '');
    return decodeURIComponent(escape(window.atob(base64)));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: theme.modalBackColor },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: theme.textColor }]}>
              Terms & Conditions
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon
                name="close"
                size={24}
                color={theme.textColor}
                style={{ color: theme.textColor }}
              />
            </TouchableOpacity>
          </View>

          {/* Terms Content */}
          <ScrollView
            style={styles.termsContainer}
            showsVerticalScrollIndicator={true}
          >
            <Text style={[styles.termsTitle, { color: theme.textColor }]}>
              Guidelines and Privacy Policy
            </Text>

            <Text style={[styles.termsText, { color: theme.textColor }]}>
              BMT is created in the spirit of peaceful civic engagement. We do
              not permit the use of bigoted language, anti-government or
              anti-law enforcement rhetoric or the provocation of violence of
              any kind. BMT bears no tolerance for objectionable content or
              abusive users. We reserve the right to not post any vehicle that
              we deem inappropriate or subversive to the spirit of our platform.
            </Text>

            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
              Do not post, upload, stream, or share:
            </Text>

            {prohibitedItems.map((item, index) => (
              <View key={index} style={styles.bulletItem}>
                <Text style={[styles.bullet, { color: theme.textColor }]}>
                  •
                </Text>
                <Text style={[styles.bulletText, { color: theme.textColor }]}>
                  {item}
                </Text>
              </View>
            ))}

            <Text
              style={[
                styles.sectionTitle,
                { color: theme.textColor, marginTop: 20 },
              ]}
            >
              Content Integrity
            </Text>

            {integrityItems.map((item, index) => (
              <Text
                key={index}
                style={[styles.termsText, { color: theme.textColor }]}
              >
                {item}
              </Text>
            ))}

            <Text
              style={[styles.lastUpdated, { color: theme.placeholderColor }]}
            >
              Last Updated: February 14, 2023
            </Text>
          </ScrollView>

          {/* Signature Section */}
          {isAuthenticated && showCanvas && (
            <View style={styles.signatureSection}>
              <Text style={[styles.signatureLabel, { color: theme.textColor }]}>
                Add Your Signature
              </Text>
              {signature && (
                <SvgXml
                  xml={signature} // RAW SVG STRING — NOT base64
                  width="100%"
                  height={80}
                  style={{
                    backgroundColor: theme.black,
                  }}
                />
              )}
              <View style={{ height: 200, width: '100%' }}>
                <SignatureCanvas
                  ref={ref}
                  onEnd={handleEnd}
                  onOK={handleSignature}
                  onEmpty={handleEmpty}
                  onClear={handleClear}
                  onError={handleError}
                  autoClear={false}
                  penColor={'#ffffff'}
                  imageType="image/svg+xml"
                  backgroundColor={'#000000'}
                  scrollable={false}
                  webviewProps={{
                    // Custom WebView optimization
                    cacheEnabled: true,
                    androidLayerType: 'hardware',
                  }}
                  webStyle={`
                    .m-signature-pad {
                      background-color: #000000;
                    }
                    .m-signature-pad--body {
                      background-color: #000000;
                    }
                  `}
                  descriptionText="Sign here"
                  clearText="Clear"
                  confirmText={isLoading ? 'Processing...' : 'Save'}
                />
              </View>

              {/* Submit Button */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 5,
                }}
              >
                <RNSButton
                  style={[styles.button, { width: '48%' }]}
                  bgColor={theme.buttonBackColor}
                  caption="Clear"
                  onPress={handleClear}
                />
                <RNSButton
                  style={[styles.button, { width: '48%' }]}
                  bgColor={theme.buttonBackColor}
                  caption={signature ? 'Update' : 'Submit'}
                  onPress={() => {
                    if (!signature) {
                      alert('Please sign the agreement first');
                      return;
                    }
                    onClose();
                    if (onSubmit) {
                      setTimeout(
                        () => {
                          onSubmit();
                        },
                        Platform.OS === 'ios' ? 1000 : 0,
                      );
                    }
                  }}
                />
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const prohibitedItems = [
  'Content that boasts, praise or promotes past, present, or future crimes',
  'Unnecessary graphic details of crimes',
  "Yours or anyone else's legal paperwork including court documents, victim documents or official documents from government agencies",
  'Admissions of guilt for crimes you have not been convicted of',
  'Names of individuals other than yourself or the loved one you are speaking on behalf of',
  'Individual personal addresses of you or anyone else',
  'Names of victims, co-defendants, witnessed or perpetrators nor names of specific correctional officers',
  'Content that encourages aggressive / angry words or actions directed at public officials, officers of the court, correctional officers, judges or any employee of the state',
  'Gang names, symbols, flags, logos or gestures',
  'Content that ridicules victims or their families',
  'Firearms or weapons of any kind including ammunition and / or accessories',
  'Content that depicts or promotes the usage of drugs, and or alcohol',
  'Content that solicits money or financial assistance for you, your loved one or any one at all',
  'Content that expresses, insinuates, or hints at the guilt of non-convicted citizens',
  'Explicit language',
  'Violent threats against any individual or entity of any kind',
  'Nudity or obscenity',
  'Content that equates to conspiracy theories',
  'Misinformation, lies or half-truths',
  'Personal medical records of you or anyone else',
  'Personal identity information such as bank account information, bank statements, social security numbers and/or card, drivers license or any other sensitive content of similar nature',
  'Personal login codes, names or passwords for you or anyone else',
  "Content that violates or infringes on someone else's legally held copyright, trademark, intellectual property or patent",
];

const integrityItems = [
  'BMT expects every vehicle-share to contain authentic stories of truthfulness and honesty without lies fabrications or exaggerations.',
  'BMT is not responsible for stories or details within a story that may turn out to be falsified by the vehicle-share.',
  'BMT reserves the right to inquire with family, friends, law enforcement and policymakers about the truthfulness of your story including generalizations and / or details pertaining to people, places, things, and situations. We understand that situational evidence is subjective and that there may be numerous views and opinions about the same incident. If however, BMT discovers that any part of your story is false, your account will be suspended and your vehicle removed permanently.',
];

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '90%',
    borderRadius: 12,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  termsContainer: {
    maxHeight: 300,
    marginBottom: 20,
  },
  termsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  termsText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 10,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingRight: 10,
  },
  bullet: {
    fontSize: 14,
    marginRight: 8,
    marginTop: 2,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  lastUpdated: {
    fontSize: 12,
    marginTop: 20,
    fontStyle: 'italic',
  },
  signatureSection: {
    marginTop: 10,
  },
  signatureLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  signatureCanvas: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#cccccc',
  },
  clearButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  submitButton: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SignatureModal;
