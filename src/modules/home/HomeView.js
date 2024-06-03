import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import Video from 'react-native-video';
import {Text} from '../../components/StyledText';
import {colors} from '../../styles';
import servicesettings from '../dataservices/servicesettings';
import {useTheme} from '../../hooks/useTheme';
import {head} from 'lodash';
const BuyVehicleIcon = require('../../../assets/images/BDMT.png');
const NetworkFailed = require('../../../assets/images/BDMT.png');
const mycampaignIcon = require('../../../assets/images/drawer/mycampaign.png');
const compaign = require('../../../assets/images/drawer/compaign.png');
const SellVehicleIcon = require('../../../assets/images/BDMT.png');
export default function HomeScreen(props) {
  const theme = useTheme();
  const [Visible, setVisible] = useState(false);
  const [tintColorChange, setTintColorChange] = useState('red');
  const [storeUrl, setstoreUrl] = useState('');
  const [orgID, setOrgID] = useState('');
  const [successVisible, setsuccessVisible] = useState(false);
  const navigation = useNavigation();
  //const image = require('../../../assets/images/background.png');
  const image = {
    uri: 'https://images.squarespace-cdn.com/content/v1/57f2dfd5d1758e267f3e8c68/1546989620686-NIVBIIEEIT2EEOZTK9WT/ke17ZwdGBToddI8pDm48kNZHyWCsxgfaVsw2n_GHaQpZw-zPPgdn4jUwVcJE1ZvWEtT5uBSRWt4vQZAgTJucoTqqXjS3CfNDSuuf31e0tVEGqZQu-a0HhO1lRw-F9VJFjoM1OHlSBW7GvmhU6cX5cZuG45vQwBxdpDrCGUSSl5w/snapchat+ad+gif.gif',
  };
  const home = require('../../../assets/images/home.mp4');
  useEffect(() => {
    AsyncStorage.getItem('LoginInformation').then(function (res) {
      let Asyncdata = res;
      if (Asyncdata == null) {
        //  );
        global.Storeid = '0';
        setVisible(false);
      } //
    });
  });
  //
  navigation.addListener('focus', route => {
    AsyncStorage.getItem('LoginInformation').then(function (res) {
      let Asyncdata = JSON.parse(res);
      if (Asyncdata == null) {
        global.Storeid = '0';
        setVisible(false);
      } else {
        global.Storeid = Asyncdata[0].orgid;
        setOrgID(Asyncdata[0].storeid);
        LoadBundLing();
        setVisible(true);
      }
    });
  });
  //function LoadBundLing() {
  const LoadBundLing = async () => {
    AsyncStorage.getItem('LoginInformation').then(function (res) {
      if (res == null) {
      } else {
        let Asyncdata = JSON.parse(res);

        var SelectOrgID = Asyncdata[0].orgid;
        var headerFetch = {
          method: 'POST',
          body: JSON.stringify({Id: 0, rowVer: 0, Status: 1}),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
            Authorization: servicesettings.AuthorizationKey,
          },
        };

        fetch(servicesettings.baseuri + 'mybundlings', headerFetch)
          .then(response => response.json())
          .then(responseJson => {
            console.log('data response mybundlings  =>', headerFetch.body);
            console.log('data response mybundlings  =>', responseJson);
            if (responseJson.data != null) {
              //var mybundlingsList = responseJson.data;
              //await AsyncStorage.setItem('mybundlingsList', mybundlingsList);
              AsyncStorage.setItem(
                'myBundlingsAsync',
                JSON.stringify(responseJson.data),
              );
            } else {
            }
          })
          .catch(error => {
            console.error('service error', error);
            Toast.showWithGravity(
              'Internet connection failed, try another time !!!',
              Toast.LONG,
              Toast.CENTER,
            );
            setVisible(false);
          });
      }
    });
  };
  const confirm = () => {
    setsuccessVisible(false);
    BackHandler.exitApp();
    Linking.openURL(storeUrl);
  };
  const successhide = () => {
    setsuccessVisible(false);
  };
  const checkUpdateNeeded = async () => {
    const latestVersion = await VersionCheck.getLatestVersion();
    const currentVersion = VersionCheck.getCurrentVersion();
    let updateNeeded = await VersionCheck.needUpdate();

    if (updateNeeded.isNeeded == true) {
      setsuccessVisible(true);
      setstoreUrl(updateNeeded.storeUrl);
    }
  };
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
        style={[styles.Buttoncontainer, {backgroundColor: theme.navBarBack}]}>
        {!Visible ? (
          <View style={styles.Buttoncontainer2}>
            {global.NetworkFailed == 1 ? null : (
              <View>
                <TouchableOpacity
                  onPress={() => LoginClick()}
                  style={[
                    styles.loginbutton,
                    {backgroundColor: theme.buttonBackColor},
                  ]}>
                  <Text style={styles.buttonText}>LOGIN</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => opensignup()}
                  style={[
                    styles.loginbutton,
                    {backgroundColor: theme.buttonBackColor},
                  ]}>
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
                {backgroundColor: theme.buttonBackColor},
              ]}>
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
                  }>
                  Settings & management of media campaigns
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Campaigns')}
              style={[
                styles.Buy_SellButton,
                {backgroundColor: theme.buttonBackColor},
              ]}>
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
                  ]}>
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
          }}>
          <Text style={[styles.copyrirgttext, {color: theme.textColor}]}>
            {'\u00A9'} Blazor Technologies Inc,{' '}
          </Text>
          <Text style={[styles.copyrirgttext, {color: theme.textColor}]}>
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
    //borderBottomLeftRadius:12,
    // borderBottomRightRadius:12,
    //height: Dimensions.get('window').height-50,
    //position: "absolute",
    //top: 0,
    //left: 0,
    // alignItems: "stretch",
    // bottom: 0,
    //right: 0
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    //backgroundColor:'#010211',
    //backgroundColor:'red',
  },
  networkfailed: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: '#545454',
  },
  NetworkRequestFailed: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    //height: 100 + '%',
    position: 'absolute',
    //color:'white',
    //fontSize:28,
    top: -70,
    // left: 11 + '%',
    //alignItems: "center",
    //alignItems: 'center',
    //justifyContent:'center',
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
    //flexDirection: 'row',
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
    //tintColor:'red',
  },
  BuyVehicleImg: {
    height: 35,
    width: 35,
    tintColor: colors.white,
    //backgroundColor:'red',
  },
  SellVehicleImg: {
    height: 25,
    tintColor: colors.white,
    //tintColor:colors.IconColor,
    width: 25,
    //backgroundColor:'red',
  },
  loginbutton: {
    flexDirection: 'row',
    paddingVertical: 14,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: colors.BlazorbuttonOpacity,
    //backgroundColor : '#4f4f4fb8',
    // backgroundColor : colors.ButtonDefaultColor,
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
    //width: Dimensions.get('window').width-40,
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
    //width: Dimensions.get('window').width-30,
    //paddingHorizontal:15,
    //marginTop:2,
    //backgroundColor:'red',
    height: 32 + '%',
    //height:45,
    // alignItems: 'center',
    //justifyContent:'center',
    // position:'absolute',
    //bottom:7 + '%',
    // backgroundColor:'white',
    //borderTopLeftRadius:40,
    // borderTopRightRadius:40,
  },
  Buttoncontainer: {
    marginTop: -10,
    width: Dimensions.get('window').width,
    height: 34 + '%',
    backgroundColor: colors.PagePanelTab,
    //elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 4, height: 6},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    //height:45,
    // alignItems: 'center',
    //justifyContent:'center',
    // position:'absolute',
    //bottom:7 + '%',
    //borderTopWidth:1,
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
