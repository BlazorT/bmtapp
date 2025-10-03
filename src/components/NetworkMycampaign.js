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

const NetworkMycampaign = ({
  networkName,
  sent,
  status,
  delivered,
  failed,
  commentsCount,
  clicksCount,
  sharesCount,
  likesCount,
  readCount,
}) => {
  const theme = useTheme();
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // Map network IDs to icons
  const networkIcons = useMemo(
    () => ({
      SMS: SMS,
      WHATSAPP: WHATSAPP,
      EMAIL: EMAIL,
      TWITTER: TWITTER,
      FACEBOOK: FACEBOOK,
      INSTAGRAM: INSTAGRAM,
      LINKEDIN: LINKEDIN,
      TIKTOK: TIKTOK,
      SNAPCHAT: SNAPCHAT,
    }),
    [],
  );

  const networkIcon = networkIcons[networkName] || SMS;

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const columnWidths = [100, 60, 70, 70, 70, 70, 70, 70, 70];
  const totalWidth = columnWidths.reduce((a, b) => a + b, 0);

  return (
    <View style={styles.ModalMainView}>
      <View style={[styles.card, { backgroundColor: theme.cardBackColor }]}>
        <View style={[styles.rowContainer, { width: totalWidth }]}>
          {/* Network icon and name */}
          <View style={[styles.cell, { width: columnWidths[0] }]}>
            <Image
              resizeMode="contain"
              source={networkIcon}
              style={styles.socialMediaIcon}
            />
            <Text style={[styles.networkName, { color: theme.textColor }]}>
              {networkName}
            </Text>
          </View>

          {/* Quotas */}
          <View
            style={[
              styles.cell,
              {
                width: columnWidths[1],
                backgroundColor: theme.buttonBackColor,
                borderRadius: 50,
                paddingVertical: 8,
              },
            ]}
          >
            <Text style={[styles.text, { color: theme.white, fontSize: 10 }]}>
              {status}
            </Text>
          </View>
          <View style={[styles.cell, { width: columnWidths[1] }]}>
            <Text style={[styles.text, { color: theme.textColor }]}>
              {sent}
            </Text>
          </View>
          <View style={[styles.cell, { width: columnWidths[2] }]}>
            <Text style={[styles.text, { color: theme.textColor }]}>
              {failed}
            </Text>
          </View>
          <View style={[styles.cell, { width: columnWidths[3] }]}>
            <Text style={[styles.text, { color: theme.textColor }]}>
              {delivered}
            </Text>
          </View>
          <View style={[styles.cell, { width: columnWidths[4] }]}>
            <Text style={[styles.text, { color: theme.textColor }]}>
              {readCount}
            </Text>
          </View>
          <View style={[styles.cell, { width: columnWidths[5] }]}>
            <Text style={[styles.text, { color: theme.textColor }]}>
              {commentsCount}
            </Text>
          </View>
          <View style={[styles.cell, { width: columnWidths[6] }]}>
            <Text style={[styles.text, { color: theme.textColor }]}>
              {clicksCount}
            </Text>
          </View>
          <View style={[styles.cell, { width: columnWidths[7] }]}>
            <Text style={[styles.text, { color: theme.textColor }]}>
              {sharesCount}
            </Text>
          </View>
          <View style={[styles.cell, { width: columnWidths[8] }]}>
            <Text style={[styles.text, { color: theme.textColor }]}>
              {likesCount}
            </Text>
          </View>

          {/* Settings button */}
          {/* <TouchableOpacity
            style={styles.settingIconView}
            onPress={toggleSidebar}
          >
            <Icons
              style={[styles.settingIcon, { color: theme.tintColor }]}
              name="setting"
            />
          </TouchableOpacity> */}
        </View>
      </View>

      {/* Sidebar Modal */}
      {/* <Modal
        visible={sidebarVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setSidebarVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setSidebarVisible(false)}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <View style={styles.centeredContainer}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.backgroundColor },
            ]}
          >
            <TouchableOpacity
              style={styles.closeIconView}
              onPress={() => setSidebarVisible(false)}
            >
              <Icons
                name="close"
                style={[styles.closeIcon, { color: theme.tintColor }]}
              />
            </TouchableOpacity>

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
      </Modal> */}
    </View>
  );
};

const styles = StyleSheet.create({
  ModalMainView: {
    marginHorizontal: 0,
    paddingTop: 9,
  },
  card: {
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderRadius: 8,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  socialMediaIcon: {
    height: 29,
    width: 29,
  },
  networkName: {
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  text: {
    fontSize: 14,
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
