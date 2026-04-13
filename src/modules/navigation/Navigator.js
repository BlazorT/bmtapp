import {
  DrawerContentScrollView,
  DrawerItem,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { useCallback, useMemo, useState } from 'react';
import {
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-simple-toast';
import AntdIcon from 'react-native-vector-icons/AntDesign';
import { useSelector } from 'react-redux';
import userProfile from '../../../assets/images/User.png';
import compaign from '../../../assets/images/drawer/compaign.png';
import iconPages from '../../../assets/images/drawer/grids.png';
import iconHome from '../../../assets/images/drawer/home.png';
import mycampaignIcon from '../../../assets/images/drawer/mycampaign.png';
import iconAbout from '../../../assets/images/drawer/pencil.png';
import Logout from '../../../assets/images/pages/Logout.png';
import Login from '../../../assets/images/pages/login.png';
import { useAlert } from '../../context/AlertContext';
import { useTheme } from '../../hooks/useTheme';
import { useUser } from '../../hooks/useUser';
import { colors } from '../../styles';
import servicesettings from '../dataservices/servicesettings';
import { isAdminOrSuperAdmin } from '../home/HomeView';
import NavigatorView from './RootNavigation';

const Drawer = createDrawerNavigator();

// Utility Functions
const resetGlobalUserData = () => {
  global.img = 'data:image/png;base64,' + servicesettings.Default_User_Image;
  global.Email = '';
  global.Name = '';
};

const getUserProfileImage = (user, isAuthenticated) => {
  if (!isAuthenticated || !user?.avatar) return '';

  return (
    servicesettings.Imagebaseuri +
    '/' +
    user.avatar.replace(/\\/g, '/').replace(',', '').replace(' //', '')
  );
};

// Custom Hooks
const useUnsubscribe = (user, logoutUser, navigate) => {
  const [isLoading, setIsLoading] = useState(false);

  const unsubscribe = useCallback(async () => {
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
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json',
        Authorization: servicesettings.AuthorizationKey,
      },
    };

    setIsLoading(true);
    try {
      const response = await fetch(
        servicesettings.baseuri + 'BlazorApi/updateuserstatus',
        headerFetch,
      );

      if (!response.ok) {
        Toast.show('Something went wrong, please try again');
        return;
      }

      const res = await response.json();

      if (res?.status) {
        logoutUser();
        Toast.showWithGravity(
          'Unsubscribed successfully',
          Toast.LONG,
          Toast.CENTER,
        );
        navigate('Login');
        resetGlobalUserData();
      } else {
        Toast.show(res?.message || 'Something went wrong, please try again');
      }
    } catch (error) {
      Toast.show('Network error, please try again');
      console.error('Unsubscribe error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, logoutUser, navigate]);

  return { unsubscribe, isLoading };
};

// Components
const UserProfileSection = ({
  user,
  theme,
  onEditPress,
  userProfileImage,
  isImageError,
  setIsImageError,
}) => {
  const displayName =
    user?.fullName ||
    `${user?.firstName || ''} ${user?.lastName || user?.lastname || ''}`.trim();

  return (
    <View style={styles.avatarContainer}>
      <Image
        source={
          !userProfileImage || isImageError
            ? userProfile
            : { uri: userProfileImage }
        }
        style={styles.avatar}
        onError={() => setIsImageError(true)}
      />
      <View style={styles.userInfo}>
        <View style={styles.nameRow}>
          <Text style={[styles.userName, { color: theme.textColor }]}>
            {displayName}
          </Text>
          <TouchableOpacity
            onPress={onEditPress}
            style={styles.editButton}
            accessibilityLabel="Edit profile"
          >
            <Image
              style={styles.editIcon}
              source={iconAbout}
              tintColor={theme.tintColor}
            />
          </TouchableOpacity>
        </View>
        <Text style={[styles.userEmail, { color: theme.textColor }]}>
          {user.email}
        </Text>
      </View>
    </View>
  );
};

const DrawerMenuItem = ({ item, theme, onPress }) => {
  const renderIcon = () => {
    if (item.name === 'Recipients') {
      return (
        <AntdIcon
          name="contacts"
          size={25}
          style={styles.imgStyle}
          color={theme.tintColor}
        />
      );
    }
    if (item.name === 'About') {
      return (
        <AntdIcon
          name="infocirlceo"
          size={25}
          style={styles.imgStyle}
          color={theme.tintColor}
        />
      );
    }
    if (item.name === 'Delete Account') {
      return (
        <AntdIcon
          name="user"
          size={25}
          style={styles.imgStyle}
          color={theme.tintColor}
        />
      );
    }
    if (item.name === 'Pricing Plans') {
      return (
        <AntdIcon
          name="creditcard"
          size={25}
          style={styles.imgStyle}
          color={theme.tintColor}
        />
      );
    }
    return (
      <Image
        style={styles.imgStyle}
        source={item.icon}
        tintColor={theme.tintColor}
      />
    );
  };

  return (
    <DrawerItem
      label={() => (
        <View
          style={[styles.menuLabelFlex, { borderBottomColor: theme.textColor }]}
        >
          {renderIcon()}
          <Text style={[styles.menuTitle, { color: theme.textColor }]}>
            {item.name}
          </Text>
        </View>
      )}
      onPress={onPress}
    />
  );
};

// Main Component
function CustomDrawerContent(props) {
  const theme = useTheme();
  const { showConfirm } = useAlert();
  const { navigate } = useNavigation();
  const { user, isAuthenticated, logoutUser } = useUser();

  const [isImageError, setIsImageError] = useState(false);

  const { unsubscribe, isLoading } = useUnsubscribe(user, logoutUser, navigate);

  const handleLogout = useCallback(() => {
    setTimeout(
      () => {
        logoutUser();
        Toast.showWithGravity(
          'Logged out successfully',
          Toast.LONG,
          Toast.CENTER,
        );
        navigate('Login');
        resetGlobalUserData();
      },
      Platform.OS === 'ios' ? 1000 : 0,
    );
  }, [logoutUser, navigate]);

  const handleUnsubscribe = useCallback(async () => {
    await unsubscribe();
  }, [unsubscribe]);

  const drawerData = useMemo(
    () => [
      {
        name: 'Home',
        icon: iconHome,
        condition: true,
      },
      {
        name: 'Campaign (+)',
        icon: compaign,
        condition: isAuthenticated && isAdminOrSuperAdmin(user?.roleId),
      },
      {
        name: 'Campaigns',
        icon: mycampaignIcon,
        condition: true,
      },
      {
        name: 'Recipients',
        icon: iconPages,
        condition: isAuthenticated,
      },
      // {
      //   name: 'Panel',
      //   icon: iconPages,
      //   condition: true,
      // },
      {
        name: 'Pricing Plans',
        icon: iconPages,
        condition: true,
      },
      {
        name: 'About',
        icon: iconAbout,
        condition: true,
      },
      {
        name: 'Delete Account',
        icon: 'user-delete',
        condition: isAuthenticated,
      },
      {
        name: 'Log Out',
        icon: Logout,
        condition: isAuthenticated,
      },
      {
        name: 'Log In',
        icon: Login,
        condition: !isAuthenticated,
      },
    ],
    [isAuthenticated, user?.roleId],
  );

  const handleMenuPress = useCallback(
    async itemName => {
      if (itemName === 'Log In') {
        global.SignUp_Login = 1;
        navigate('Login');
      } else if (itemName === 'Delete Account') {
        const confirmed = await showConfirm({
          title: 'Confirmation',
          message: `Are you sure you want to delete your account from Blazor Media ToolKit?\n\nYour account will be no more available.`,
          type: 'warning',
        });
        if (confirmed) await handleUnsubscribe();
      } else if (itemName === 'Log Out') {
        const confirmed = await showConfirm({
          title: 'Confirmation',
          message: 'Are you sure you want to logout?',
          type: 'warning',
        });
        if (confirmed) handleLogout();
      } else {
        navigate(itemName);
      }
    },
    [navigate],
  );

  const userProfileImage = useMemo(
    () => getUserProfileImage(user, isAuthenticated),
    [user, isAuthenticated],
  );

  return (
    <>
      <Spinner
        visible={isLoading}
        textContent="Processing..."
        textStyle={{ color: theme.textColor }}
        color={theme.textColor}
      />

      <DrawerContentScrollView {...props} style={styles.scrollView}>
        {isAuthenticated && (
          <UserProfileSection
            user={user}
            theme={theme}
            onEditPress={() => navigate('Profile')}
            userProfileImage={userProfileImage}
            isImageError={isImageError}
            setIsImageError={setIsImageError}
          />
        )}

        {drawerData.map((item, idx) =>
          item.condition ? (
            <DrawerMenuItem
              key={`drawer_item-${idx}`}
              item={item}
              theme={theme}
              onPress={() => handleMenuPress(item.name)}
            />
          ) : null,
        )}
      </DrawerContentScrollView>
    </>
  );
}

export default function App() {
  const theme = useTheme();
  const themeMode = useSelector(state => state.theme.mode);

  return (
    <>
      <StatusBar
        barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
      />
      <Drawer.Navigator
        drawerContent={props => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerStyle: {
            backgroundColor: theme.backgroundColor,
            opacity: Platform.OS === 'ios' ? 0.7 : 0.7,
          },
          headerShown: false,
        }}
      >
        <Drawer.Screen name="Splashs" component={NavigatorView} />
      </Drawer.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    padding: 0,
  },
  avatarContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfo: {
    flex: 1,
    paddingLeft: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  userEmail: {
    fontSize: 14,
    marginTop: 4,
    opacity: 0.8,
  },
  editButton: {
    padding: 4,
  },
  editIcon: {
    width: 18,
    height: 18,
    tintColor: colors.NavbarTextColor,
  },
  menuLabelFlex: {
    height: 25,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.NavbarTextColor,
  },
  menuTitle: {
    marginLeft: 10,
    marginBottom: 1,
    marginTop: -8,
  },
  imgStyle: {
    width: 25,
    height: 25,
    marginBottom: 14,
    tintColor: colors.NavbarTextColor,
  },
});
