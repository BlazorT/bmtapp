import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Toast from 'react-native-simple-toast';
import Alert from '../../components/Alert';
import {colors, fonts} from '../../styles';
import servicesettings from '../dataservices/servicesettings';
const chartIcon = require('../../../assets/images/pages/chart.png');
const compaign = require('../../../assets/images/drawer/compaign.png');
const compaignstatus = require('../../../assets/images/drawer/compaignstatus.png');
const dashboardIcon = require('../../../assets/images/pages/blog.png');
const loginIcon = require('../../../assets/images/pages/login.png');
const aboutIcon = require('../../../assets/images/tabbar/pencil.png');
const organizationIcon = require('../../../assets/images/tabbar/organization.png');
const mycampaignIcon = require('../../../assets/images/drawer/mycampaign.png');
const SettingIcon = require('../../../assets/images/tabbar/settings.png');
const signup = require('../../../assets/images/drawer/SignUp.png');
export default function PagesScreen(props) {
  const [loginlbl, setloginlbl] = useState('');
  const [Profilelbl, setProfilelbl] = useState('');
  const [Visible, setVisible] = useState(false);
  const [loginDisabled, setLoginDisabled] = useState(false);
  const CancelClick = () => {
    setVisible(true);
  };
  const hide = () => {
    setVisible(false);
  };
  const confirm = () => {
    setVisible(false);
    AsyncStorage.removeItem('LoginInformation');
    Toast.showWithGravity('LogOut successfully', Toast.LONG, Toast.CENTER);
    props.navigation.navigate('Home');
    global.img = 'data:image/png;base64,' + servicesettings.Default_User_Image;
    global.Email = '';
    global.Name = '';
  };
  const navigation = useNavigation();
  navigation.addListener('focus', route => {
    AsyncStorage.getItem('LoginInformation').then(function(res) {
      let Asyncdata = JSON.parse(res);
      if (Asyncdata == null) {
        setLoginDisabled(true);
        console.log('Asyncdata Data empty ', Asyncdata);
        setloginlbl('Login');
      } else {
        setLoginDisabled(false);
        setloginlbl('Log Out');
      }
    });
  });
  useEffect(() => {}, []);
  function OpenLogin() {
    AsyncStorage.getItem('LoginInformation').then(function(res) {
      let Asyncdata = JSON.parse(res);
      if (Asyncdata == null) {
        global.SignUp_Login = 1;
        props.navigation.navigate('Login');
      } else {
        CancelClick();
      }
    });
  }
  function LogoutClick() {
    AsyncStorage.getItem('LoginInformation').then(function(res) {
      let Asyncdata = JSON.parse(res);
      if (Asyncdata == null) {
        global.SignUp_Login = 1;
        props.navigation.navigate('Login');
      } else {
        CancelClick();
      }
    });
  }
  function AddNewCampaign() {
    AsyncStorage.getItem('LoginInformation').then(function(res) {
      let Asyncdata = JSON.parse(res);
      if (Asyncdata == null) {
        Toast.show('Please login first');
        global.UpdateCampaign = 0;
        global.SignUp_Login = 1;
        props.navigation.navigate('Login');
      } else {
        global.UpdateCampaign = 0;
        props.navigation.navigate('Campaign Schedule');
      }
    });
  }
  function EditProfile() {
    AsyncStorage.getItem('LoginInformation').then(function(res) {
      let Asyncdata = JSON.parse(res);
      if (Asyncdata == null) {
        Toast.show('Please login first');
        global.SignUp_Login = 1;
        props.navigation.navigate('Login');
      } else {
        props.navigation.navigate('Profile');
      }
    });
  }
  function MyCampaignClick() {
    AsyncStorage.getItem('LoginInformation').then(function(res) {
      let Asyncdata = JSON.parse(res);
      if (Asyncdata == null) {
        Toast.show('Please login first');
        global.SignUp_Login = 1;
        props.navigation.navigate('Login');
      } else {
        props.navigation.navigate('My Campaigns');
      }
    });
  }
  function ClickOrganization() {
    AsyncStorage.getItem('LoginInformation').then(function(res) {
      let Asyncdata = JSON.parse(res);
      if (Asyncdata == null) {
        Toast.show('Please login first');
        props.navigation.navigate('Login');
      } else {
        props.navigation.navigate('Add & Edit Organization');
      }
    });
  }
  function DashboardClick() {
    AsyncStorage.getItem('LoginInformation').then(function(res) {
      let Asyncdata = JSON.parse(res);
      if (Asyncdata == null) {
        Toast.show('Please login first');
        global.SignUp_Login = 1;
        props.navigation.navigate('Login');
      } else {
        props.navigation.navigate('Dashboard');
      }
    });
  }
  function CampaignStatisticsClick() {
    AsyncStorage.getItem('LoginInformation').then(function(res) {
      let Asyncdata = JSON.parse(res);
      if (Asyncdata == null) {
        Toast.show('Please login first');
        global.SignUp_Login = 1;
        props.navigation.navigate('Login');
      } else {
        props.navigation.navigate('Campaign Statistics');
      }
    });
  }
  return (
    <View style={styles.container}>
      <Alert
        massagetype={'warning'}
        hide={hide}
        confirm={confirm}
        Visible={Visible}
        alerttype={'confirmation'}
        Title={'Confirmation'}
        Massage={'Are you sure want to logout?'}
      ></Alert>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => OpenLogin()} style={styles.item}>
          <Image
            resizeMode="contain"
            source={loginIcon}
            tintColor={colors.NavbarIconColor}
            style={styles.itemImage}
          />
          <Text style={styles.itemText}>{loginlbl}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => AddNewCampaign()} style={styles.item}>
          <Image
            resizeMode="contain"
            source={compaign}
            tintColor={colors.NavbarIconColor}
            style={styles.itemImage}
          />
          <Text style={styles.itemText}>New Campaign</Text>
        </TouchableOpacity>
        {loginDisabled == true ? (
          <TouchableOpacity
            onPress={() => props.navigation.navigate('Signup')}
            style={styles.item}
          >
            <Image
              resizeMode="contain"
              source={signup}
              tintColor={colors.NavbarIconColor}
              style={styles.itemImage}
            />
            <Text style={styles.itemText}>Sign Up</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => EditProfile()} style={styles.item}>
            <Image
              resizeMode="contain"
              source={signup}
              tintColor={colors.NavbarIconColor}
              style={styles.itemImage}
            />
            <Text style={styles.itemText}>Profile</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          onPress={() => ClickOrganization()}
          style={styles.item}
        >
          <Image
            resizeMode="contain"
            source={organizationIcon}
            tintColor={colors.NavbarIconColor}
            style={styles.itemImage}
          />
          <Text style={styles.itemText}>Organization</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => MyCampaignClick()} style={styles.item}>
          <Image
            resizeMode="contain"
            source={mycampaignIcon}
            tintColor={colors.NavbarIconColor}
            style={styles.itemImage}
          />
          <Text style={styles.itemText}>My Campaigns</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => DashboardClick()} style={styles.item}>
          <Image
            resizeMode="contain"
            source={dashboardIcon}
            tintColor={colors.NavbarIconColor}
            style={styles.itemImage}
          />
          <Text style={styles.itemText}>Dashboard</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          onPress={() => CampaignStatisticsClick()}
          style={styles.item}
        >
          <Image
            resizeMode="contain"
            source={compaignstatus}
            tintColor={colors.NavbarIconColor}
            style={styles.itemImage}
          />
          <Text style={styles.itemText}>Statistics</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('About')}
          style={styles.item}
        >
          <Image
            resizeMode="contain"
            source={aboutIcon}
            tintColor={colors.NavbarIconColor}
            style={styles.itemImage}
          />
          <Text style={styles.itemText}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemEmpty}></TouchableOpacity>
      </View>
    </View>
  );
}
/*
   <TouchableOpacity
    style={styles.itemEmpty}
                   >
                   </TouchableOpacity>
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    //backgroundColor: colors.BlazorBg,
    paddingTop: 10,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  item: {
    backgroundColor: colors.PagePanelTab,
    flex: 1,
    height: 120,
    paddingVertical: 20,
    //borderColor: colors.primaryLight,
    //borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 4, height: 6},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  paymentitem: {
    backgroundColor: colors.BlazorBox,
    flex: 1,
    height: 120,
    paddingVertical: 20,
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: 5,
  },
  itemEmpty: {
    flex: 1,
    height: 120,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: 5,
  },
  itemText: {
    color: colors.NavbarTextColor,
    fontFamily: fonts.primary,
  },
  itemImage: {
    height: 45,
    tintColor: colors.NavbarIconColor,
  },
});
