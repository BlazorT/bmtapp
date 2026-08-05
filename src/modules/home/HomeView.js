import React from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Video from 'react-native-video';
import { Text } from '../../components/StyledText';
import { useTheme } from '../../hooks/useTheme';
import { useUser } from '../../hooks/useUser';
const NetworkFailed = require('../../../assets/images/BDMT.png');
const mycampaignIcon = require('../../../assets/images/drawer/mycampaign.png');
const compaign = require('../../../assets/images/drawer/compaign.png');

export const isAdminOrSuperAdmin = roleId => {
  return roleId === 1 || roleId === 2;
};
export default function HomeScreen(props) {
  const theme = useTheme();
  const { isAuthenticated, user } = useUser();

  const opensignup = async () => {
    global.SignUp_Login = 0;
    props.navigation.navigate('Login');
  };
  const LoginClick = async () => {
    global.SignUp_Login = 1;
    props.navigation.navigate('Login');
  };
  function AddCampaignClick() {
    props.navigation.navigate('Campaign (+)');
    global.UpdateCampaign = 0;
  }

  return (
    <View style={styles.container}>
      <Video
        source={require('../../../assets/images/home.mp4')}
        style={[
          styles.backgroundVideo,
          // { height: isAuthenticated ? '70%' : '61%' },
        ]}
        muted={true}
        repeat={true}
        resizeMode={'stretch'}
        rate={1.0}
        ignoreSilentSwitch={'obey'}
      />
      <View
        style={[styles.bottomView, { backgroundColor: theme.modalBackColor }]}
      >
        {!isAuthenticated ? (
          <>
            <TouchableOpacity
              onPress={LoginClick}
              style={[
                styles.loginbutton,
                { backgroundColor: theme.buttonBackColor },
              ]}
            >
              <Text style={styles.buttonText}>LOGIN</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={opensignup}
              style={[
                styles.loginbutton,
                { backgroundColor: theme.buttonBackColor },
              ]}
            >
              <Text style={styles.buttonText}>SIGNUP</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Pricing Plans')}
              style={[
                styles.loginbutton,
                { backgroundColor: theme.buttonBackColor },
              ]}
            >
              <Text style={styles.buttonText}>Pricing Plans</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate('Add & Edit Organization')
              }
              style={[
                styles.loginbutton,
                { backgroundColor: theme.buttonBackColor },
              ]}
            >
              <Text style={styles.buttonText}>Register Organization</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {isAdminOrSuperAdmin(user?.roleId) && ( //!!only admin and superadmin can create campaign
              <TouchableOpacity
                onPress={() => AddCampaignClick()}
                style={[
                  styles.Buy_SellButton,
                  { backgroundColor: theme.buttonBackColor },
                ]}
              >
                <View style={styles.Buy_SellView1}>
                  <Image source={compaign} style={styles.BuyVehicleImg} />
                </View>
                <View style={styles.Buy_SellDetail}>
                  <Text style={styles.Buy_SellHead}>Campaigns</Text>
                  <Text
                    style={
                      Platform.OS === 'ios'
                        ? styles.Buy_SellHeadDetailIOS
                        : styles.Buy_SellHeadDetail
                    }
                  >
                    Settings & management of media campaigns
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => props.navigation.navigate('Campaigns')}
              style={[
                styles.Buy_SellButton,
                { backgroundColor: theme.buttonBackColor },
              ]}
            >
              <View style={styles.Buy_SellView1}>
                <Image
                  resizeMode="contain"
                  source={mycampaignIcon}
                  style={styles.BuyVehicleImg}
                />
              </View>
              <View style={styles.Buy_SellDetail}>
                <Text style={styles.Buy_SellHead}>My Campaigns</Text>
                <Text
                  style={[
                    Platform.OS === 'ios'
                      ? styles.Buy_SellHeadDetailIOS
                      : styles.Buy_SellHeadDetail,
                  ]}
                >
                  My compaigns, see status of campaigns
                </Text>
              </View>
            </TouchableOpacity>
          </>
        )}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={[styles.copyrirgttext, { color: theme.textColor }]}>
            {'\u00A9'} Blazor Technologies Inc,{' '}
          </Text>
          <Text style={[styles.copyrirgttext, { color: theme.textColor }]}>
            {new Date().getFullYear()}
          </Text>
        </View>
      </View>
    </View>
  );
} //  Login
const styles = StyleSheet.create({
  backgroundVideo: {
    ...StyleSheet.absoluteFill,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  bottomView: {
    position: 'absolute',
    bottom: 0,
    flex: 1, // Changed from height: '100%'
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    rowGap: 6,
  },
  Buy_SellView1: {
    opacity: 0.8,
    padding: 5,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'white',
  },
  BuyVehicleImg: {
    height: 35,
    width: 35,
    tintColor: 'white',
  },
  loginbutton: {
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 5,
    width: '95%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  Buy_SellDetail: {
    alignItems: 'center',
    marginLeft: 6,
    justifyContent: 'center',
  },
  Buy_SellButton: {
    flexDirection: 'row',
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderRadius: 5,
    alignItems: 'center',
    width: '95%',
    borderColor: 'white',
  },
  buttonText: {
    color: '#FFFAE4',
    fontSize: 20,
    paddingTop: -3,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
  },
  Buy_SellHead: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100 + '%',
    fontSize: 20,
    color: 'white',
  },
  Buy_SellHeadDetailIOS: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100 + '%',
    fontSize: 10,
    color: 'white',
  },
  Buy_SellHeadDetail: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100 + '%',
    fontSize: 14,
    color: 'white',
  },
  copyrirgttext: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});
