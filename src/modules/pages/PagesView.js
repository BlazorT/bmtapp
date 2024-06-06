import React, {useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Toast from 'react-native-simple-toast';
import AntdIcon from 'react-native-vector-icons/AntDesign';
import signup from '../../../assets/images/drawer/SignUp.png';
import compaign from '../../../assets/images/drawer/compaign.png';
import compaignstatus from '../../../assets/images/drawer/compaignstatus.png';
import mycampaignIcon from '../../../assets/images/drawer/mycampaign.png';
import dashboardIcon from '../../../assets/images/pages/blog.png';
import loginIcon from '../../../assets/images/pages/login.png';
import organizationIcon from '../../../assets/images/tabbar/organization.png';
import Alert from '../../components/Alert';
import {useTheme} from '../../hooks/useTheme';
import {useUser} from '../../hooks/useUser';
import {colors, fonts} from '../../styles';
import servicesettings from '../dataservices/servicesettings';

export default function PagesScreen(props) {
  const theme = useTheme();
  const {isAuthenticated, user, logoutUser} = useUser();
  const [Visible, setVisible] = useState(false);

  const hide = () => {
    setVisible(false);
  };
  const confirm = () => {
    setVisible(false);
    logoutUser();
    Toast.showWithGravity('LogOut successfully', Toast.LONG, Toast.CENTER);
    props.navigation.navigate('Home');
    global.img = 'data:image/png;base64,' + servicesettings.Default_User_Image;
    global.Email = '';
    global.Name = '';
  };

  const items = [
    {
      source: loginIcon,
      text: 'Login',
      path: 'Login',
      condition: !isAuthenticated,
    },
    {
      source: loginIcon,
      text: 'Logout',
      path: 'Login',
      condition: isAuthenticated,
    },
    {
      source: signup,
      text: !isAuthenticated ? 'Sign Up' : 'Profile',
      path: !isAuthenticated ? 'Signup' : 'Profile',
      condition: true,
    },
    {
      source: compaign,
      text: 'New Campaign',
      path: 'Campaign Schedule',
      condition: true,
    },
    {
      source: organizationIcon,
      text: 'Organization',
      path: 'Add & Edit Organization',
      condition: true,
    },
    {
      source: mycampaignIcon,
      text: 'My Campaigns',
      path: 'My Campaigns',
      condition: true,
    },
    {
      source: dashboardIcon,
      text: 'Dashboard',
      path: 'Dashboard',
      condition: true,
    },
    {
      source: compaignstatus,
      text: 'Statistics',
      path: 'Campaign Statistics',
      condition: true,
    },
    {
      icon: <AntdIcon name="infocirlceo" size={45} color={theme.tintColor} />,
      text: 'About',
      path: 'About',
      condition: true,
    },
  ];
  const onCardPress = path => {
    if (isAuthenticated) {
      props.navigation.navigate(path);
    } else {
      Toast.show('Please login first');
      props.navigation.navigate('Login');
    }
  };
  const onLogout = () => {
    setVisible(true);
  };
  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <Alert
        massagetype={'warning'}
        hide={hide}
        confirm={confirm}
        Visible={Visible}
        alerttype={'confirmation'}
        Title={'Confirmation'}
        Massage={'Are you sure want to logout?'}></Alert>

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          width: '100%',
        }}>
        {items.map(
          (item, idx) =>
            item.condition && (
              <TouchableOpacity
                key={idx}
                onPress={() =>
                  item.text == 'Logout' ? onLogout() : onCardPress(item.path)
                }
                style={[
                  styles.item,
                  {
                    backgroundColor: theme.cardBackColor,
                    marginVertical: 5,
                    marginHorizontal: 5,
                  },
                ]}>
                {item.source ? (
                  <Image
                    resizeMode="contain"
                    source={item.source}
                    tintColor={theme.tintColor}
                    style={styles.itemImage}
                  />
                ) : (
                  item.icon
                )}
                <Text style={[styles.itemText, {color: theme.textColor}]}>
                  {item.text}
                </Text>
              </TouchableOpacity>
            ),
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  item: {
    backgroundColor: colors.PagePanelTab,
    height: 120,
    width: 120,
    paddingVertical: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'space-around',
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
  },
});
