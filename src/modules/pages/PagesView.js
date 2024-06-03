import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
import {colors, fonts} from '../../styles';
import servicesettings from '../dataservices/servicesettings';

export default function PagesScreen(props) {
  const theme = useTheme();
  const [loginlbl, setloginlbl] = useState('');
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
    AsyncStorage.getItem('LoginInformation').then(function (res) {
      let Asyncdata = JSON.parse(res);
      if (Asyncdata == null) {
        setLoginDisabled(true);
        setloginlbl('Login');
      } else {
        setLoginDisabled(false);
        setloginlbl('Log Out');
      }
    });
  });
  useEffect(() => {}, []);
  function OpenLogin() {
    AsyncStorage.getItem('LoginInformation').then(function (res) {
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
    AsyncStorage.getItem('LoginInformation').then(function (res) {
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
    AsyncStorage.getItem('LoginInformation').then(function (res) {
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
    AsyncStorage.getItem('LoginInformation').then(function (res) {
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
    AsyncStorage.getItem('LoginInformation').then(function (res) {
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
    AsyncStorage.getItem('LoginInformation').then(function (res) {
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
    AsyncStorage.getItem('LoginInformation').then(function (res) {
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
    AsyncStorage.getItem('LoginInformation').then(function (res) {
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

  const items = [
    {
      onPress: OpenLogin,
      source: loginIcon,
      text: loginlbl,
      condition: true,
    },
    {
      onPress: AddNewCampaign,
      source: compaign,
      text: 'New Campaign',
      condition: true,
    },
    {
      onPress: loginDisabled
        ? () => props.navigation.navigate('Signup')
        : EditProfile,
      source: signup,
      text: loginDisabled ? 'Sign Up' : 'Profile',
      condition: true,
    },
    {
      onPress: ClickOrganization,
      source: organizationIcon,
      text: 'Organization',
      condition: true,
    },
    {
      onPress: MyCampaignClick,
      source: mycampaignIcon,
      text: 'My Campaigns',
      condition: true,
    },
    {
      onPress: DashboardClick,
      source: dashboardIcon,
      text: 'Dashboard',
      condition: true,
    },
    {
      onPress: CampaignStatisticsClick,
      source: compaignstatus,
      text: 'Statistics',
      condition: true,
    },
    {
      onPress: () => props.navigation.navigate('About'),
      icon: <AntdIcon name="infocirlceo" size={45} color={theme.tintColor} />,
      text: 'About',
      condition: true,
    },
  ];
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
          // justifyContent: 'space-evenly',
          // alignItems: 'center',
          flexWrap: 'wrap',
          // rowGap: 10,
          width: '100%',
          // columnGap: 10,
        }}>
        {items.map(
          (item, idx) =>
            item.condition && (
              <TouchableOpacity
                key={idx}
                onPress={item.onPress}
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
      {/* <View style={styles.row}>
        <TouchableOpacity
          onPress={() => OpenLogin()}
          style={[styles.item, {backgroundColor: theme.cardBackColor}]}>
          <Image
            resizeMode="contain"
            source={loginIcon}
            tintColor={theme.tintColor}
            style={styles.itemImage}
          />
          <Text style={[styles.itemText, {color: theme.textColor}]}>
            {loginlbl}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => AddNewCampaign()}
          style={[styles.item, {backgroundColor: theme.cardBackColor}]}>
          <Image
            resizeMode="contain"
            source={compaign}
            tintColor={theme.tintColor}
            style={styles.itemImage}
          />
          <Text style={[styles.itemText, {color: theme.textColor}]}>
            New Campaign
          </Text>
        </TouchableOpacity>
        {loginDisabled == true ? (
          <TouchableOpacity
            onPress={() => props.navigation.navigate('Signup')}
            style={[styles.item, {backgroundColor: theme.cardBackColor}]}>
            <Image
              resizeMode="contain"
              source={signup}
              tintColor={theme.tintColor}
              style={styles.itemImage}
            />
            <Text style={[styles.itemText, {color: theme.textColor}]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => EditProfile()}
            style={[styles.item, {backgroundColor: theme.cardBackColor}]}>
            <Image
              resizeMode="contain"
              source={signup}
              tintColor={theme.tintColor}
              style={styles.itemImage}
            />
            <Text style={[styles.itemText, {color: theme.textColor}]}>
              Profile
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          onPress={() => ClickOrganization()}
          style={[styles.item, {backgroundColor: theme.cardBackColor}]}>
          <Image
            resizeMode="contain"
            source={organizationIcon}
            tintColor={theme.tintColor}
            style={styles.itemImage}
          />
          <Text style={[styles.itemText, {color: theme.textColor}]}>
            Organization
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => MyCampaignClick()}
          style={[styles.item, {backgroundColor: theme.cardBackColor}]}>
          <Image
            resizeMode="contain"
            source={mycampaignIcon}
            tintColor={theme.tintColor}
            style={styles.itemImage}
          />
          <Text style={[styles.itemText, {color: theme.textColor}]}>
            My Campaigns
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => DashboardClick()}
          style={[styles.item, {backgroundColor: theme.cardBackColor}]}>
          <Image
            resizeMode="contain"
            source={dashboardIcon}
            tintColor={theme.tintColor}
            style={styles.itemImage}
          />
          <Text style={[styles.itemText, {color: theme.textColor}]}>
            Dashboard
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          onPress={() => CampaignStatisticsClick()}
          style={[styles.item, {backgroundColor: theme.cardBackColor}]}>
          <Image
            resizeMode="contain"
            source={compaignstatus}
            tintColor={theme.tintColor}
            style={styles.itemImage}
          />
          <Text style={[styles.itemText, {color: theme.textColor}]}>
            Statistics
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('About')}
          style={[styles.item, {backgroundColor: theme.cardBackColor}]}>
          <AntdIcon name="infocirlceo" size={45} color={theme.tintColor} />

          <Text style={[styles.itemText, {color: theme.textColor}]}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemEmpty}></TouchableOpacity>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  item: {
    backgroundColor: colors.PagePanelTab,
    // flex: 1,
    height: 120,
    width: 120,
    paddingVertical: 20,
    //borderColor: colors.primaryLight,
    //borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'space-around',
    // marginHorizontal: 5,
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
