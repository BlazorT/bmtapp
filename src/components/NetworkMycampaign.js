import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import Icons from 'react-native-vector-icons/AntDesign';
import { useTheme } from '../hooks/useTheme';

// Social icons
import EMAIL from '../../assets/images/Email.png';
import FACEBOOK from '../../assets/images/Facebook.png';
import SMS from '../../assets/images/SMS.png';
import TWITTER from '../../assets/images/Twitter.png';
import WHATSAPP from '../../assets/images/Whatsapp.png';
import INSTAGRAM from '../../assets/images/instagram.png';
import LINKEDIN from '../../assets/images/linkedin.png';
import SNAPCHAT from '../../assets/images/snapchat.png';
import TIKTOK from '../../assets/images/tiktok.png';

// Action icons
import deleteicon from '../../assets/images/deleteicon.png';
import playicon from '../../assets/images/playicon.png';
import pauseicon from '../../assets/images/pauseicon.png';

const NetworkMycampaign = ({ networkId, compaignQouta = 0, freeQouta = 0 }) => {
  const theme = useTheme();
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // Map network IDs to icons
  const networkIcons = useMemo(
    () => ({
      1: SMS,
      2: WHATSAPP,
      3: EMAIL,
      4: TWITTER,
      5: FACEBOOK,
      6: INSTAGRAM,
      7: LINKEDIN,
      8: TIKTOK,
      9: SNAPCHAT,
    }),
    [],
  );

  const networkIcon = networkIcons[networkId] || SMS;

  const remaining = Math.max(compaignQouta - freeQouta, 0);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <View style={styles.ModalMainView}>
      <View style={[styles.card, { backgroundColor: theme.cardBackColor }]}>
        <View style={styles.row}>
          {/* Network icon */}
          <Image
            resizeMode="contain"
            source={networkIcon}
            style={styles.socialMediaIcon}
          />

          {/* Quotas */}
          <Text style={[styles.text, { color: theme.textColor, width: '25%' }]}>
            {compaignQouta}
          </Text>
          <Text style={[styles.text, { color: theme.textColor, width: '25%' }]}>
            {freeQouta}
          </Text>
          <Text style={[styles.text, { color: theme.textColor, width: '25%' }]}>
            {remaining}
          </Text>

          {/* Settings button */}
          <TouchableOpacity
            style={styles.settingIconView}
            onPress={toggleSidebar}
          >
            <Icons
              style={[styles.settingIcon, { color: theme.tintColor }]}
              name="setting"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sidebar Modal */}
      <Modal
        visible={sidebarVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setSidebarVisible(false)}
      >
        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={() => setSidebarVisible(false)}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        {/* Modal content wrapper */}
        <View style={styles.centeredContainer}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.backgroundColor },
            ]}
          >
            {/* Close button */}
            <TouchableOpacity
              style={styles.closeIconView}
              onPress={() => setSidebarVisible(false)}
            >
              <Icons
                name="close"
                style={[styles.closeIcon, { color: theme.tintColor }]}
              />
            </TouchableOpacity>

            {/* Action buttons */}
            {[
              {
                icon: deleteicon,
                title: 'Active',
                desc: 'Network all schedules will be activated',
              },
              {
                icon: deleteicon,
                title: 'Delete',
                desc: 'Your network all activity will be terminated',
              },
              {
                icon: playicon,
                title: 'Play',
                desc: 'Network all schedules will be resumed',
              },
              {
                icon: pauseicon,
                title: 'Pause',
                desc: 'Network all activities will be paused',
              },
            ].map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.actionButton,
                  { backgroundColor: theme.cardBackColor },
                ]}
                onPress={() => {
                  console.log(`${action.title} clicked`);
                  setSidebarVisible(false);
                }}
              >
                <View style={styles.iconWrapper}>
                  <Image source={action.icon} style={styles.ribbonIcon} />
                </View>
                <View style={styles.textWrapper}>
                  <Text
                    style={[styles.actionTitle, { color: theme.textColor }]}
                  >
                    {action.title}
                  </Text>
                  <Text style={[styles.actionDesc, { color: theme.textColor }]}>
                    {action.desc}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  ModalMainView: {
    marginHorizontal: 10,
    paddingTop: 9,
  },
  card: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  socialMediaIcon: {
    height: 29,
    width: 29,
  },
  text: {
    fontSize: 16,
    marginTop: 3,
    textAlign: 'center',
  },
  settingIconView: {
    width: '12%',
    alignItems: 'center',
  },
  settingIcon: {
    fontSize: 25,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  centeredContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '85%',
    borderRadius: 10,
    padding: 15,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIconView: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  closeIcon: {
    fontSize: 22,
  },
  actionButton: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  iconWrapper: {
    marginRight: 10,
    justifyContent: 'center',
  },
  ribbonIcon: {
    height: 28,
    width: 28,
  },
  textWrapper: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionDesc: {
    fontSize: 13,
    marginTop: 2,
  },
});

export default NetworkMycampaign;
