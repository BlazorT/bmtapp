import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Video from 'react-native-video';
import { Text } from '../../components/StyledText';
import { useTheme } from '../../hooks/useTheme';
import { useUser } from '../../hooks/useUser';
import { colors } from '../../styles';
const NetworkFailed = require('../../../assets/images/BDMT.png');
const mycampaignIcon = require('../../../assets/images/drawer/mycampaign.png');
const compaign = require('../../../assets/images/drawer/compaign.png');

export default function HomeScreen(props) {
  const theme = useTheme();
  const { isAuthenticated } = useUser();

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
      {global.NetworkFailed == 1 ? (
        <View style={styles.networkfailed}>
          <Image
            resizeMode="contain"
            source={NetworkFailed}
            style={styles.NetworkRequestFailed}
          />
        </View>
      ) : (
        <Video
          source={require('../../../assets/images/home.mp4')}
          style={styles.backgroundVideo}
          muted={true}
          repeat={true}
          resizeMode={'stretch'}
          rate={1.0}
          ignoreSilentSwitch={'obey'}
        />
      )}
      <View
        style={[styles.Buttoncontainer, { backgroundColor: theme.navBarBack }]}
      >
        {!isAuthenticated ? (
          <View style={styles.Buttoncontainer2}>
            {global.NetworkFailed == 1 ? null : (
              <View>
                <TouchableOpacity
                  onPress={() => LoginClick()}
                  style={[
                    styles.loginbutton,
                    { backgroundColor: theme.buttonBackColor },
                  ]}
                >
                  <Text style={styles.buttonText}>LOGIN</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => opensignup()}
                  style={[
                    styles.loginbutton,
                    { backgroundColor: theme.buttonBackColor },
                  ]}
                >
                  <Text style={styles.buttonText}>SIGNUP</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.Buttoncontainer2}>
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
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Campaigns')}
              style={[
                styles.Buy_SellButton,
                { backgroundColor: theme.buttonBackColor },
              ]}
            >
              <View style={styles.Buy_SellView}>
                <Image
                  resizeMode="contain"
                  source={mycampaignIcon}
                  style={styles.SellVehicleImg}
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
          </View>
        )}
      </View>
      <View style={styles.Buttoncontainer3}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: 100 + '%',
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
    width: Dimensions.get('window').width,
    height: 71 + '%',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  networkfailed: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: '#545454',
  },
  NetworkRequestFailed: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,

    position: 'absolute',

    top: -70,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  btnTryAgain: {
    position: 'absolute',
    bottom: 18 + '%',
    left: 27 + '%',

    paddingVertical: 9,
    paddingHorizontal: 8,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: '#242323b8',
    width: 170,
    alignItems: 'center',
  },
  Buy_SellView: {
    opacity: 0.8,
    padding: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'gray',
  },
  Buy_SellView1: {
    opacity: 0.8,
    padding: 5,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'gray',
  },
  BuyVehicleImg: {
    height: 35,
    width: 35,
    tintColor: colors.white,
  },
  SellVehicleImg: {
    height: 25,
    tintColor: colors.white,
    width: 25,
  },
  loginbutton: {
    flexDirection: 'row',
    paddingVertical: 14,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: colors.BlazorbuttonOpacity,
    width: Dimensions.get('window').width - 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Buy_SellDetail: {
    alignItems: 'center',
    marginLeft: 6,
    justifyContent: 'center',
  },
  Buy_SellButton: {
    fontFamily: 'Roboto',
    flexDirection: 'row',
    paddingVertical: 7,
    paddingHorizontal: 8,
    marginVertical: 7,
    borderRadius: 5,
    backgroundColor: colors.BlazorbuttonOpacity,
    alignItems: 'center',
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
    color: colors.white,
    fontSize: 20,
  },
  Buy_SellHeadDetailIOS: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100 + '%',
    color: colors.white,
    fontSize: 10,
  },
  Buy_SellHeadDetail: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100 + '%',
    color: colors.white,
    fontSize: 14,
  },
  Buttoncontainer2: {
    width: Dimensions.get('window').width - 30,
    marginHorizontal: 15,
    marginVertical: 12,
    height: 32 + '%',
  },
  Buttoncontainer: {
    marginTop: -10,
    width: Dimensions.get('window').width,
    height: 34 + '%',
    backgroundColor: colors.PagePanelTab,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  Buttoncontainer3: {
    width: 100 + '%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 4,
  },
  copyrirgttext: {
    marginTop: 5,
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.TextColorOther,
  },
});
