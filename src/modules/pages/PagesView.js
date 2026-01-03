import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
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
import { useTheme } from '../../hooks/useTheme';
import { useUser } from '../../hooks/useUser';
import { colors, fonts } from '../../styles';
import servicesettings from '../dataservices/servicesettings';
import { isAdminOrSuperAdmin } from '../home/HomeView';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native';
import { isTab } from '../../constants';

export default function PagesScreen(props) {
  const theme = useTheme();
  const { navigate } = useNavigation();

  const { isAuthenticated, user, logoutUser } = useUser();
  const [Visible, setVisible] = useState(false);
  const [unsubscribeAlertVisible, setUnsubscribeAlertVisible] = useState(false);
  const [spinner, setSpinner] = useState(false);

  const hideUnsubscribeAlert = () => setUnsubscribeAlertVisible(false);
  const toggleUnsubscribeAlert = () =>
    setUnsubscribeAlertVisible(prev => !prev);

  const hide = () => {
    setVisible(false);
  };

  const confirm = () => {
    setVisible(false);

    setTimeout(
      () => {
        logoutUser();
        Toast.showWithGravity('LogOut successfully', Toast.LONG, Toast.CENTER);
        props.navigation.navigate('Home');
        global.img =
          'data:image/png;base64,' + servicesettings.Default_User_Image;
        global.Email = '';
        global.Name = '';
      },
      Platform.OS === 'ios' ? 1000 : 0,
    );
  };

  const onUnsubscribe = async () => {
    toggleUnsubscribeAlert();
    const body = {
      id: user?.id,
      email: user?.email,
      roleId: user?.roleId,
      firstName: user?.firstName || user?.fullName?.split(' ')[0] || '',
      lastName: user?.lastName || user?.fullName?.split(' ')[1] || '',
      status: 2,
      rowVer: user?.rowVer, // MUST match DB rowVer
      lastUpdatedBy: user?.id,
      UserCode: '',
      GenderId: 0,
      CreatedAt: moment().utc().format(),
    };

    let headerFetch = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: servicesettings.AuthorizationKey,
      },
    };
    try {
      setSpinner(true);
      const response = await fetch(
        `${servicesettings.baseuri}BlazorApi/updateuserstatus`,
        headerFetch,
      );
      if (!response.ok) {
        throw new Error(`Request failed with status : ${response.status}`);
      }
      const res = await response.json();
      if (res?.status) {
        logoutUser();
        Toast.showWithGravity(
          'Unsubscrive successfully',
          Toast.LONG,
          Toast.CENTER,
        );
        navigate('Login');
        global.img =
          'data:image/png;base64,' + servicesettings.Default_User_Image;
        global.Email = '';
        global.Name = '';
      } else {
        Toast.show(res?.message || 'Something went wrong, please try again');
      }
    } catch (error) {
      Toast.show(error?.message || 'Something went wrong, please try again');
    } finally {
      setSpinner(false);
    }
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
      path: 'Campaign (+)',
      condition: isAuthenticated && isAdminOrSuperAdmin(user?.roleId),
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
      path: 'Campaigns',
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
      icon: <AntdIcon name="contacts" size={45} color={theme.tintColor} />,
      text: 'Recipients',
      path: 'Recipients',
      condition: isAuthenticated,
    },
    {
      icon: <AntdIcon name="gift" size={45} color={theme.tintColor} />,
      text: 'Pricing Plans',
      path: 'Pricing Plans',
      condition: true,
    },
    {
      icon: <AntdIcon name="user" size={45} color={theme.tintColor} />,
      text: 'Unsubscribe',
      path: 'Unsubscribe',
      condition: isAuthenticated,
    },
    {
      icon: <AntdIcon name="infocirlceo" size={45} color={theme.tintColor} />,
      text: 'About',
      path: 'About',
      condition: true,
    },
    // {
    //   // icon: <AntdIcon name="infocirlceo" size={45} color={theme.tintColor} />,
    //   // text: 'About',
    //   // path: 'About',
    //   condition: true,
    // },
  ];
  const onCardPress = path => {
    if (
      isAuthenticated ||
      path === 'About' ||
      path === 'Add & Edit Organization' ||
      path === 'Pricing Plans'
    ) {
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
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.backgroundColor },
      ]}
    >
      <Spinner
        visible={spinner}
        textContent="Submitting..."
        textStyle={{ color: theme.textColor }}
        color={theme.textColor}
      />
      <Alert
        massagetype={'warning'}
        hide={hide}
        confirm={confirm}
        Visible={Visible}
        alerttype={'confirmation'}
        Title={'Confirmation'}
        Massage={'Are you sure want to logout?'}
      ></Alert>
      <Alert
        massagetype={'warning'}
        hide={hideUnsubscribeAlert}
        confirm={onUnsubscribe}
        Visible={unsubscribeAlertVisible}
        alerttype={'confirmation'}
        Title={'Confirmation'}
        Massage={'Are you sure want to unsubscribe from bmt?'}
      ></Alert>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'flex-start',
          rowGap: 10,
          columnGap: 10,
        }}
      >
        {items.map(
          (item, idx) =>
            item.condition && (
              <TouchableOpacity
                key={idx}
                onPress={() =>
                  item.text == 'Unsubscribe'
                    ? toggleUnsubscribeAlert()
                    : item.text == 'Logout'
                      ? onLogout()
                      : onCardPress(item.path)
                }
                style={[
                  styles.item,
                  {
                    backgroundColor: theme.cardBackColor,
                  },
                ]}
              >
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
                <Text style={[styles.itemText, { color: theme.textColor }]}>
                  {item.text}
                </Text>
              </TouchableOpacity>
            ),
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  item: {
    height: isTab ? 160 : Platform.OS === 'ios' ? 110 : 120,
    width: isTab ? 160 : Platform.OS === 'ios' ? 110 : 120,
    paddingVertical: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'space-around',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 6 },
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
    marginTop: 4,
    fontSize: isTab ? 20 : Platform.OS === 'ios' ? 12 : 12,
  },
  itemImage: {
    height: isTab ? 80 : 50,
  },
});
