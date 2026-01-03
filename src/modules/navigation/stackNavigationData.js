import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import CampaignStatisticsScreen from '../../modules/CampaignStatistics/CampaignStatisticsViewContainer';
import {
  default as CampaigndetailScreen,
  default as CompaigndetailScreen,
} from '../../modules/Compaigndetail/CompaigndetailView';
import CreatcompainVersion from '../../modules/Creatcompain/CreatcompainViewContainer';
import OrganizationAddEditScreen from '../../modules/OrganizationAddEdit/OrganizationAddEditViewContainer';
import DashboardVersion from '../../modules/dashboard/DashboardViewContainer';
import ForgotPasswordScreen from '../../modules/forgotPassword/ForgotPasswordViewContainer';
import LoginScreen from '../../modules/login/LoginViewContainer';
import Preference_Settings from '../../modules/preferencesAndSettings/PreferencesAndSettingsViewContainer';
import { colors, fonts } from '../../styles';
import AboutScreen from '../about/AboutViewContainer';
import HomeScreen from '../home/HomeViewContainer';
import ProfileScreen from '../profile/ProfileViewContainer';
import RecipeitnsView from '../recipients/RecipeitnsViewContainer';
import TabNavigator from './MainTabNavigator';
import PaymentView from '../payment/PeymentViewContainer';
import PricingDetailsScreen from '../packages/PackagesScreen';

const headerLeftComponent = props => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
    >
      <Image
        source={require('../../../assets/images/icons/arrow-back.png')}
        resizeMode="contain"
        style={{
          height: 20,
          tintColor: theme.tintColor,
        }}
      />
    </TouchableOpacity>
  );
};

const headerBackground = require('../../../assets/images/ioGKFn.jpg');

const StackNavigationData = [
  {
    name: 'Blazor Media ToolKit',
    component: TabNavigator,
    headerLeft: null,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.NavbarTextColor,
      fontSize: 20,
      fontWeight: '400',
      fontFamily: fonts.primarySemiBold,
    },
  },
  {
    name: 'Dashboard',
    component: DashboardVersion,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.NavbarTextColor,
      fontSize: 18,
    },
  },
  {
    name: 'Home',
    component: HomeScreen,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.NavbarTextColor,
      fontSize: 18,
    },
  },
  {
    name: 'Campaign',
    component: CreatcompainVersion,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.NavbarTextColor,
      fontSize: 18,
    },
  },
  {
    name: 'Campaign Details',
    component: CompaigndetailScreen,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.NavbarTextColor,
      fontSize: 18,
    },
  },
  {
    name: 'Payment',
    component: PaymentView,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.NavbarTextColor,
      fontSize: 18,
    },
  },
  {
    name: 'About',
    component: AboutScreen,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.NavbarTextColor,
      fontSize: 18,
    },
  },
  {
    name: 'Signup',
    component: ProfileScreen,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.NavbarTextColor,
      fontSize: 18,
    },
  },
  // {
  //   name: 'Massage',
  //   component: MassageScreen,
  //   headerLeft: headerLeftComponent,
  //   headerBackground: {source: headerBackground},
  //   headerTitleStyle: {
  //     fontFamily: fonts.primaryRegular,
  //     color: colors.NavbarTextColor,
  //     fontSize: 18,
  //   },
  // },
  // {
  //   name: 'Twitter',
  //   component: TwitterScreen,
  //   headerLeft: headerLeftComponent,
  //   headerBackground: {source: headerBackground},
  //   headerTitleStyle: {
  //     fontFamily: fonts.primaryRegular,
  //     color: colors.NavbarTextColor,
  //     fontSize: 18,
  //   },
  // },
  {
    name: 'Campaign Detail',
    component: CampaigndetailScreen,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.NavbarTextColor,
      fontSize: 18,
    },
  },
  {
    name: 'Campaign Statistics',
    component: CampaignStatisticsScreen,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.NavbarTextColor,
      fontSize: 18,
    },
  },
  // {
  //   name: 'Facebook',
  //   component: FacebookScreen,
  //   headerLeft: headerLeftComponent,
  //   headerBackground: {source: headerBackground},
  //   headerTitleStyle: {
  //     fontFamily: fonts.primaryRegular,
  //     color: colors.NavbarTextColor,
  //     fontSize: 18,
  //   },
  // },
  // {
  //   name: 'Campaign Schedule',
  //   component: CampaignScheduleScreen,
  //   headerLeft: headerLeftComponent,
  //   headerBackground: { source: headerBackground },
  //   headerTitleStyle: {
  //     fontFamily: fonts.primaryRegular,
  //     color: colors.NavbarTextColor,
  //     fontSize: 18,
  //   },
  // },
  // {
  //   name: 'Email',
  //   component: EmailScreen,
  //   headerLeft: headerLeftComponent,
  //   headerBackground: {source: headerBackground},
  //   headerTitleStyle: {
  //     fontFamily: fonts.primaryRegular,
  //     color: colors.NavbarTextColor,
  //     fontSize: 18,
  //   },
  // },
  {
    name: 'Login',
    component: LoginScreen,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.NavbarTextColor,
      fontSize: 18,
    },
  },
  {
    name: 'Forgot Password',
    component: ForgotPasswordScreen,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.NavbarTextColor,
      fontSize: 18,
    },
  },
  // {
  //   name: 'My Campaigns',
  //   component: MyCampaignScreen,
  //   headerLeft: headerLeftComponent,
  //   headerBackground: { source: headerBackground },
  //   headerTitleStyle: {
  //     fontFamily: fonts.primaryRegular,
  //     color: colors.NavbarTextColor,
  //     fontSize: 18,
  //   },
  // },
  // {
  //   name: 'Organization',
  //   component: OrganizationScreen,
  //   headerLeft: headerLeftComponent,
  //   headerBackground: {source: headerBackground},
  //   headerTitleStyle: {
  //     fontFamily: fonts.primaryRegular,
  //     color: colors.NavbarTextColor,
  //     fontSize: 18,
  //   },
  // },
  {
    name: 'Add & Edit Organization',
    component: OrganizationAddEditScreen,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.NavbarTextColor,
      fontSize: 18,
    },
  },
  {
    name: 'Pricing Plans',
    component: PricingDetailsScreen,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.NavbarTextColor,
      fontSize: 18,
    },
  },
  {
    name: 'Profile',
    component: Preference_Settings,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.NavbarTextColor,
      fontSize: 18,
    },
  },
  {
    name: 'Recipients',
    component: RecipeitnsView,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.NavbarTextColor,
      fontSize: 18,
    },
  },
];
export default StackNavigationData;
