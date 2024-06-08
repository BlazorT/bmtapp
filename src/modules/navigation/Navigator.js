import {
  DrawerContentScrollView,
  DrawerItem,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import React, {useState} from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import AntdIcon from 'react-native-vector-icons/AntDesign';
import userProfile from '../../../assets/images/User.png';
import compaign from '../../../assets/images/drawer/compaign.png';
import iconPages from '../../../assets/images/drawer/grids.png';
import iconHome from '../../../assets/images/drawer/home.png';
import mycampaignIcon from '../../../assets/images/drawer/mycampaign.png';
import iconAbout from '../../../assets/images/drawer/pencil.png';
import Logout from '../../../assets/images/pages/Logout.png';
import Alert from '../../components/Alert';
import {useTheme} from '../../hooks/useTheme';
import {useUser} from '../../hooks/useUser';
import {colors} from '../../styles';
import servicesettings from '../dataservices/servicesettings';
import NavigatorView from './RootNavigation';

const Drawer = createDrawerNavigator();
function CustomDrawerContent(props) {
  const theme = useTheme();
  const {user, isAuthenticated, logoutUser} = useUser();
  // console.log('user', user);
  const [Visible, setVisible] = useState(false);
  const [isImageError, setIsImageError] = useState(false);
  const CancelClick = () => {
    setVisible(true);
  };
  const hide = () => {
    setVisible(false);
  };
  const drawerData = [
    {
      name: 'Home',
      icon: iconHome,
      condition: true,
    },
    {
      name: 'Campaign Schedule',
      icon: compaign,
      condition: true,
    },
    {
      name: 'My Campaigns',
      icon: mycampaignIcon,
      condition: true,
    },
    {
      name: 'Panel',
      icon: iconPages,
      condition: true,
    },
    {
      name: 'About',
      icon: iconAbout,
      condition: true,
    },
    {
      name: 'Log Out',
      icon: Logout,
      condition: isAuthenticated,
    },
  ];
  const confirm = () => {
    setVisible(false);
    logoutUser();
    Toast.showWithGravity('Logout successfully', Toast.LONG, Toast.CENTER);
    props.navigation.navigate('Login');
    global.img = 'data:image/png;base64,' + servicesettings.Default_User_Image;
    global.Email = '';
    global.Name = '';
  };

  function ProfileEdit() {
    props.navigation.navigate('Profile');
  }

  //<View style={styles.divider} />
  const userProfileImage = !isAuthenticated
    ? ''
    : servicesettings.Imagebaseuri +
      user.avatar.replace(/\\/g, '/').replace(',', '').replace(' //', '');
  return (
    <DrawerContentScrollView {...props} style={{padding: 0}}>
      {isAuthenticated && (
        <View style={styles.avatarContainer}>
          <Image
            source={
              userProfileImage == '' || isImageError
                ? userProfile
                : {uri: userProfileImage}
            }
            style={styles.avatar}
            onError={() => setIsImageError(true)}
          />
          <View style={{paddingLeft: 6}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={[styles.userName, {color: theme.textColor}]}>
                {user.firstname ||
                  user.firstName + ' ' + `${user.lastname || user.lastName}`}
              </Text>
              <TouchableOpacity
                onPress={() => ProfileEdit()}
                style={{position: 'absolute', right: -10}}>
                <Image
                  style={styles.EditIcon}
                  source={iconAbout}
                  tintColor={theme.tintColor}
                />
              </TouchableOpacity>
            </View>
            <Text style={{color: theme.textColor}}>{user.email}</Text>
          </View>
        </View>
      )}
      <Alert
        massagetype={'warning'}
        hide={hide}
        confirm={confirm}
        Visible={Visible}
        alerttype={'confirmation'}
        Title={'Confirmation'}
        Massage={'Are you sure want to logout?'}></Alert>
      {drawerData.map(
        (item, idx) =>
          item.condition && (
            <DrawerItem
              key={`drawer_item-${idx + 1}`}
              label={() => (
                <View
                  style={[
                    styles.menuLabelFlex,
                    {borderBottomColor: theme.textColor},
                  ]}>
                  {item.name == 'About' ? (
                    <AntdIcon
                      name="infocirlceo"
                      size={25}
                      style={styles.imgStyle}
                      color={theme.tintColor}
                    />
                  ) : (
                    <Image
                      style={styles.imgStyle}
                      source={item.icon}
                      tintColor={theme.tintColor}
                    />
                  )}
                  <Text style={[styles.menuTitle, {color: theme.textColor}]}>
                    {item.name}
                  </Text>
                </View>
              )}
              onPress={() =>
                item.name == 'Log Out'
                  ? CancelClick()
                  : props.navigation.navigate(item.name)
              }
            />
          ),
      )}
    </DrawerContentScrollView>
  );
}

export default function App() {
  const theme = useTheme();
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: theme.backgroundColor,
          opacity: Platform.OS === 'ios' ? 1 : 0.7,
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
    width: 40,
    height: 40,
    borderRadius: 25,
  },
  avatarContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',

    //margin: 15,
    // marginTop: 8,
    // marginBottom: 8
  },
});
