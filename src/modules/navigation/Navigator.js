import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors} from '../../styles';
//import ProfileScreen from '../profile/ProfileViewContainer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DrawerContentScrollView,
  DrawerItem,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import Toast from 'react-native-simple-toast';
import compaign from '../../../assets/images/drawer/compaign.png';
import iconPages from '../../../assets/images/drawer/grids.png';
import iconHome from '../../../assets/images/drawer/home.png';
import mycampaignIcon from '../../../assets/images/drawer/mycampaign.png';
import iconAbout from '../../../assets/images/drawer/pencil.png';
import Logout from '../../../assets/images/pages/Logout.png';
import Alert from '../../components/Alert';
import servicesettings from '../dataservices/servicesettings';
import NavigatorView from './RootNavigation';
import {useTheme} from '../../hooks/useTheme';

const drawerData = [
  {
    name: 'Home',
    icon: iconHome,
  },
  {
    name: 'Campaign Schedule',
    icon: compaign,
  },
  {
    name: 'My Campaigns',
    icon: mycampaignIcon,
  },
  {
    name: 'Panel',
    icon: iconPages,
  },
  {
    name: 'About',
    icon: iconAbout,
  },
];
const Drawer = createDrawerNavigator();
function CustomDrawerContent(props) {
  const theme = useTheme();
  const [Email, setEmail] = useState('Jhondoe345@gmail.com');
  const [Name, setName] = useState('Jhon Doe');
  const [img, setimg] = useState('');
  const [Visible, setVisible] = useState(false);
  const CancelClick = () => {
    setVisible(true);
  };
  const hide = () => {
    setVisible(false);
  };
  const confirm = () => {
    setVisible(false);
    AsyncStorage.removeItem('LoginInformation');
    Toast.showWithGravity('Logout successfully', Toast.LONG, Toast.CENTER);
    props.navigation.navigate('Login');
    global.img = 'data:image/png;base64,' + servicesettings.Default_User_Image;
    global.Email = '';
    global.Name = '';
  };
  useEffect(() => {
    //global.UpdateCampaign = 0,
    AsyncStorage.getItem('LoginInformation').then(function (res) {
      let Asyncdata = JSON.parse(res);
      if (Asyncdata != null) {
        // global.img =  'data:image/png;base64,'+ Asyncdata.profileImage;
        // global.Email = Asyncdata[0].email;
        //  global.Name = Asyncdata.firstName +' '+ Asyncdata.lastName;
        //setimg('https://cdn-icons-png.flaticon.com/512/149/149071.png');
        setimg(
          servicesettings.Imagebaseuri +
            Asyncdata[0].avatar
              .replace(/\\/g, '/')
              .replace(',', '')
              .replace(' //', ''),
        );
        var EmailAddress = Asyncdata[0].email;
        var UserName = Asyncdata[0].username;
        setEmail(EmailAddress != '' ? EmailAddress : UserName);
        //setName(Asyncdata[0].username);
        setName(Asyncdata[0].firstname + ' ' + Asyncdata[0].lastname);
      } else {
        // setimg('https://cdn-icons-png.flaticon.com/512/149/149071.png');
        setimg('data:image/png;base64,' + servicesettings.Default_User_Image);
      }
    });
  });
  function ProfileEdit() {
    AsyncStorage.getItem('LoginInformation').then(function (res) {
      let Asyncdata = JSON.parse(res);
      if (Asyncdata == null) {
        Toast.showWithGravity('Please Login First', Toast.LONG, Toast.CENTER);
        props.navigation.navigate('Login');
      } else {
        props.navigation.navigate('Profile');
      }
    });
  }
  function OpenSell() {
    AsyncStorage.getItem('LoginInformation').then(function (res) {
      let Asyncdata = JSON.parse(res);
      if (Asyncdata == null) {
        Toast.showWithGravity('Please Login First', Toast.LONG, Toast.CENTER);
        props.navigation.navigate('Login');
      }
    });
  }
  //<View style={styles.divider} />
  return (
    <DrawerContentScrollView {...props} style={{padding: 0}}>
      <View style={styles.avatarContainer}>
        <Image source={{uri: img}} style={styles.avatar} />
        <View style={{paddingLeft: 6}}>
          <View style={{paddingLeft: 6, flexDirection: 'row'}}>
            <Text style={[styles.userName, {color: theme.textColor}]}>
              {Name}
            </Text>
            <TouchableOpacity onPress={() => ProfileEdit()}>
              <Image
                style={styles.EditIcon}
                source={iconAbout}
                tintColor={theme.tintColor}
              />
            </TouchableOpacity>
          </View>
          <Text style={{color: theme.textColor}}>{Email}</Text>
        </View>
      </View>
      <Alert
        massagetype={'warning'}
        hide={hide}
        confirm={confirm}
        Visible={Visible}
        alerttype={'confirmation'}
        Title={'Confirmation'}
        Massage={'Are you sure want to logout?'}></Alert>
      {drawerData.map((item, idx) => (
        <DrawerItem
          key={`drawer_item-${idx + 1}`}
          label={() => (
            <View
              style={[
                styles.menuLabelFlex,
                {borderBottomColor: theme.textColor},
              ]}>
              <Image
                style={styles.imgStyle}
                source={item.icon}
                tintColor={theme.tintColor}
              />
              <Text style={[styles.menuTitle, {color: theme.textColor}]}>
                {item.name}
              </Text>
            </View>
          )}
          onPress={() => props.navigation.navigate(item.name)}
        />
      ))}
      <DrawerItem
        label={() => (
          <View
            style={[
              styles.menuLabelFlex,
              {borderBottomColor: theme.textColor},
            ]}>
            <Image
              style={styles.imgStyle}
              source={Logout}
              tintColor={theme.tintColor}
            />
            <Text style={[styles.menuTitle, {color: theme.textColor}]}>
              Log Out
            </Text>
          </View>
        )}
        onPress={() => CancelClick()}
      />
    </DrawerContentScrollView>
  );
}
/*
        <View style={styles.divider}/>
        <View style={styles.divider} />
        <DrawerItem
        label={() => (
        <View style={styles.menuLabelFlex}>
        <Image
        style={styles.imgStyle}
        source={iconSettings}
        tintColor={colors.IconColor}
        />
        <Text style={styles.menuTitle}>Settings</Text>
        </View>
        )}
        />
 */
export default function App() {
  const theme = useTheme();
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: theme.backgroundColor,
          opacity: 0.7,
        },
        headerShown: false,
      }}>
      <Drawer.Screen name="Splashs" component={NavigatorView} />
    </Drawer.Navigator>
  );
}
const styles = StyleSheet.create({
  menuTitle: {
    marginLeft: 10,
    color: colors.NavbarTextColor,
    marginBottom: 1,
    marginTop: -8,
  },
  menuLabelFlex: {
    height: 25,
    display: 'flex',
    flexDirection: 'row',
    borderBottomColor: colors.NavbarTextColor,
    //borderTopColor: '#ffffff',
    //opacity: 0.8,
    borderBottomWidth: 1,
    //borderTopWidth: 1,
    alignItems: 'center',
  },
  userName: {
    color: colors.NavbarTextColor,
    fontSize: 16,
    marginRight: 22,
  },
  imgStyle: {
    width: 25,
    height: 25,
    marginBottom: 14,
    tintColor: colors.NavbarTextColor,
  },
  EditIcon: {
    width: 18,
    height: 18,
    marginBottom: 1,
    tintColor: colors.NavbarTextColor,
  },
  divider: {
    borderBottomColor: colors.NavbarTextColor,
    opacity: 0.8,
    borderBottomWidth: 1,
    // margin: 8,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
  },
  avatarContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',

    //margin: 15,
    // marginTop: 8,
    // marginBottom: 8
  },
});
