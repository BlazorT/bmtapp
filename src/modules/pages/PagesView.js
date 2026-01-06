import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React, { useState, useCallback } from 'react';
import {
  FlatList,
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
import { isTab } from '../../constants';
import { useTheme } from '../../hooks/useTheme';
import { useUser } from '../../hooks/useUser';
import { colors, fonts } from '../../styles';
import servicesettings from '../dataservices/servicesettings';
import { isAdminOrSuperAdmin } from '../home/HomeView';

export default function PagesScreen(props) {
  const theme = useTheme();
  const { navigate } = useNavigation();
  const { isAuthenticated, user, logoutUser } = useUser();

  const [visible, setVisible] = useState(false);
  const [unsubscribeAlertVisible, setUnsubscribeAlertVisible] = useState(false);
  const [spinner, setSpinner] = useState(false);

  const hideUnsubscribeAlert = () => setUnsubscribeAlertVisible(false);
  const toggleUnsubscribeAlert = () =>
    setUnsubscribeAlertVisible(prev => !prev);

  const hideLogoutAlert = () => setVisible(false);

  const confirmLogout = useCallback(() => {
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
  }, [logoutUser, props.navigation]);

  const onUnsubscribe = async () => {
    toggleUnsubscribeAlert();

    const body = {
      id: user?.id,
      email: user?.email,
      roleId: user?.roleId,
      firstName: user?.firstName || user?.fullName?.split(' ')[0] || '',
      lastName: user?.lastName || user?.fullName?.split(' ')[1] || '',
      status: 2,
      rowVer: user?.rowVer,
      lastUpdatedBy: user?.id,
      UserCode: '',
      GenderId: 0,
      CreatedAt: moment().utc().format(),
    };

    const headerFetch = {
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
        throw new Error(`Request failed with status: ${response.status}`);
      }

      const res = await response.json();

      if (res?.status) {
        logoutUser();
        Toast.showWithGravity(
          'Unsubscribe successfully',
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

  const getMenuItems = useCallback(() => {
    return [
      {
        source: loginIcon,
        text: 'Login',
        path: 'Login',
        condition: !isAuthenticated,
        action: () => navigate('Login'),
      },
      {
        source: loginIcon,
        text: 'Logout',
        path: 'Login',
        condition: isAuthenticated,
        action: () => setVisible(true),
      },
      {
        source: signup,
        text: !isAuthenticated ? 'Sign Up' : 'Profile',
        path: !isAuthenticated ? 'Signup' : 'Profile',
        condition: true,
        action: () => navigate(!isAuthenticated ? 'Signup' : 'Profile'),
      },
      {
        source: compaign,
        text: 'New Campaign',
        path: 'Campaign (+)',
        condition: isAuthenticated && isAdminOrSuperAdmin(user?.roleId),
        action: () => navigate('Campaign (+)'),
      },
      {
        source: organizationIcon,
        text: 'Organization',
        path: 'Add & Edit Organization',
        condition: true,
        action: () => navigate('Add & Edit Organization'),
      },
      {
        source: mycampaignIcon,
        text: 'My Campaigns',
        path: 'Campaigns',
        condition: true,
        action: () => navigate('Campaigns'),
      },
      {
        source: dashboardIcon,
        text: 'Dashboard',
        path: 'Dashboard',
        condition: true,
        action: () => navigate('Dashboard'),
      },
      {
        source: compaignstatus,
        text: 'Statistics',
        path: 'Campaign Statistics',
        condition: true,
        action: () => navigate('Campaign Statistics'),
      },
      // Add missing items with proper icons when you have them
      {
        icon: <AntdIcon name="mail" size={45} color={theme.textColor} />,
        text: 'Recipients',
        path: 'Recipients',
        condition: isAuthenticated,
        action: () => navigate('Recipients'),
      },
      {
        icon: <AntdIcon name="creditcard" size={45} color={theme.textColor} />,
        text: 'Pricing Plans',
        path: 'Pricing Plans',
        condition: true,
        action: () => navigate('Pricing Plans'),
      },
      {
        icon: <AntdIcon name="logout" size={45} color={theme.textColor} />,
        text: 'Unsubscribe',
        path: 'Unsubscribe',
        condition: isAuthenticated,
        action: toggleUnsubscribeAlert,
      },
      {
        icon: <AntdIcon name="infocirlceo" size={45} color={theme.textColor} />,
        text: 'About',
        path: 'About',
        condition: true,
        action: () => navigate('About'),
      },
    ].filter(item => item.condition);
  }, [
    isAuthenticated,
    user?.roleId,
    navigate,
    theme.iconColor,
    toggleUnsubscribeAlert,
  ]);

  const handleCardPress = useCallback(
    item => {
      if (
        isAuthenticated ||
        ['About', 'Add & Edit Organization', 'Pricing Plans'].includes(
          item.path,
        )
      ) {
        item.action?.();
      } else {
        Toast.show('Please login first');
        navigate('Login');
      }
    },
    [isAuthenticated, navigate],
  );

  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handleCardPress(item)}
        style={[styles.item, { backgroundColor: theme.cardBackColor }]}
      >
        {item.source ? (
          <Image
            source={item.source}
            style={styles.itemImage}
            tintColor={theme.textColor}
            resizeMode="contain"
          />
        ) : (
          item.icon
        )}
        <Text style={[styles.itemText, { color: theme.textColor }]}>
          {item.text}
        </Text>
      </TouchableOpacity>
    ),
    [theme.cardBackColor, theme.textColor, handleCardPress],
  );

  const keyExtractor = useCallback(
    (item, index) => `${item.text}-${index}`,
    [],
  );

  return (
    <>
      <Spinner visible={spinner} />

      <Alert
        massagetype={'warning'}
        hide={hideLogoutAlert}
        confirm={confirmLogout}
        Visible={visible}
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
        style={[styles.container, { backgroundColor: theme.backgroundColor }]}
      >
        <FlatList
          data={getMenuItems()}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={3}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  item: {
    flex: 1,
    marginHorizontal: 4,
    height: isTab ? 160 : Platform.OS === 'ios' ? 110 : 120,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.8,
  },
  itemImage: {
    height: isTab ? 80 : 50,
    width: isTab ? 80 : 50,
  },
  itemText: {
    fontFamily: fonts.primary,
    marginTop: 8,
    fontSize: isTab ? 18 : 13,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
});
