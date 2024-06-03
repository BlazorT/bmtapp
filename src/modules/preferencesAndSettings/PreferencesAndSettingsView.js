import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {Dimensions, Image, StyleSheet, Switch, Text, View} from 'react-native';
import Alert from '../../components/Alert';
import {colors} from '../../styles';
import servicesettings from '../dataservices/servicesettings';
import {useTheme} from '../../hooks/useTheme';
import userProfile from '../../../assets/images/User.png';
export default function PreferencesAndSettingsScreen(props) {
  const theme = useTheme();
  const [switchValue, setSwitchValue] = useState(true);
  const [visible, setVisible] = useState(false);
  const toggleSwitch = value => {
    setSwitchValue(value);
  };
  const [userInfo, setUserInfo] = useState({
    firstName: 'Muhammad',
    lastName: 'Hamza',
    email: 'hamza.shakeel@blazortech.com',
    roleId: 0,
    img: '',
  });
  const hide = () => {
    setVisible(false);
  };
  const confirm = () => {
    setVisible(false);
    props.navigation.navigate('Home');
  };

  useEffect(() => {
    const fetchLoginInformation = async () => {
      try {
        const res = await AsyncStorage.getItem('LoginInformation');
        if (res) {
          const [asyncData] = JSON.parse(res) || [];
          const {firstname, lastname, email, roleId, avatar} = asyncData;
          setUserInfo({
            firstName: firstname,
            lastName: lastname,
            email,
            roleId,
            img:
              avatar === ''
                ? ''
                : `${servicesettings.Imagebaseuri}${avatar?.replace(/\\/g, '/').replace(',', '').replace(' //', '')}`,
          });
        } else {
          setUserInfo(prev => ({
            ...prev,
            img: `data:image/png;base64,${servicesettings.Default_User_Image}`,
          }));
        }
      } catch (error) {
        console.error('Failed to fetch login information', error);
      }
    };

    fetchLoginInformation();
  }, []);

  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <Alert
        massagetype={'warning'}
        hide={hide}
        confirm={confirm}
        Visible={visible}
        alerttype={'confirmation'}
        Title={'Confirmation'}
        Massage={'Do you want to close ?'}></Alert>
      <View style={styles.ProfileImgView}>
        <Image
          source={userInfo.img == '' ? userProfile : {uri: userInfo.img}}
          style={styles.ProfileStyle}
        />
      </View>
      <View style={styles.lblView}>
        <Text style={[styles.lblName, {color: theme.textColor}]}>
          {userInfo.firstName + userInfo.lastName}
        </Text>
      </View>
      <View style={styles.lblView1}>
        <Text style={[styles.lblEmail, {color: theme.textColor}]}>
          {userInfo.email}
        </Text>
      </View>
      <View
        style={[
          styles.TogleView,
          {borderColor: theme.textColor, backgroundColor: theme.cardBackColor},
        ]}>
        <Text style={[styles.Notification, {color: theme.textColor}]}>
          {' '}
          App Notification{' '}
        </Text>
        <Switch
          style={styles.SwitchStl}
          trackColor={{
            false: theme.inputBackColor,
            true: theme.selectedCheckBox,
          }}
          thumbColor={theme.white}
          ios_backgroundColor="gray"
          onValueChange={toggleSwitch}
          value={switchValue}
        />
        <Text style={[styles.Notification, {color: theme.textColor}]}>
          {switchValue ? 'ON' : 'OFF'}
        </Text>
      </View>
      {userInfo.roleId == 3 ? (
        <View style={styles.lblapipathView}>
          <Text style={[styles.lblApiPath, {color: theme.textColor}]}>
            {servicesettings.baseuri}
          </Text>
        </View>
      ) : (
        <View></View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    //backgroundColor: colors.BlazorBg,
    flex: 1,
    alignItems: 'center',
  },
  TogleView: {
    height: 100,
    borderRadius: 10,
    borderColor: colors.TextColorOther,
    borderWidth: 1,
    marginBottom: 5 + '%',
    width: Dimensions.get('window').width - 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  SwitchStl: {
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 0 + '%',
  },
  Notification: {
    justifyContent: 'space-around',
    alignItems: 'center',
    fontSize: 18,
    color: colors.TextColorOther,
    marginTop: 10 + '%',
  },
  ProfileImgView: {
    marginTop: 15,
    padding: 5,
    height: 125,
    width: 125,
    //borderRadius: 90,
    //backgroundColor:'green',
    // borderColor: 'white',
    borderWidth: 0,
    alignItems: 'center',
  },
  lblView: {
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 10 + '%',
    //backgroundColor:'green',
  },
  lblView1: {
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 10 + '%',
    marginTop: 5 + '%',
    //backgroundColor:'red',
  },
  ProfileStyle: {
    borderRadius: 90,
    borderColor: colors.profileBorderColor,
    borderWidth: 2,
    //marginTop:2,
    height: 112,
    width: 112,
  },
  lblName: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 24,
    color: colors.TextColorOther,
    fontWeight: 'bold',
  },
  lblEmail: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16,
    color: colors.TextColorOther,
    fontWeight: 'bold',
  },
  lblapipathView: {
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  lblApiPath: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 14,
    color: colors.TextColorOther,
    fontWeight: 'bold',
  },
});
