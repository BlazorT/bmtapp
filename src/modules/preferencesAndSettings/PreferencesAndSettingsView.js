import React, {useState} from 'react';
import {Dimensions, Image, StyleSheet, Switch, Text, View} from 'react-native';
import userProfile from '../../../assets/images/User.png';
import {useTheme} from '../../hooks/useTheme';
import {useUser} from '../../hooks/useUser';
import {colors} from '../../styles';
import servicesettings from '../dataservices/servicesettings';
export default function PreferencesAndSettingsScreen() {
  const theme = useTheme();
  const {user} = useUser();
  const [switchValue, setSwitchValue] = useState(true);
  const [onImageError, setOnImageError] = useState(false);
  const toggleSwitch = value => {
    setSwitchValue(value);
  };

  const userImage = `${servicesettings.Imagebaseuri}${user.avatar?.replace(/\\/g, '/').replace(',', '').replace(' //', '')}`;
  console.log('userImage', user);

  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <View style={styles.ProfileImgView}>
        <Image
          source={
            user.avatar == '' || onImageError ? userProfile : {uri: userImage}
          }
          style={[styles.ProfileStyle, {tintColor: theme.buttonBackColor}]}
          onError={() => setOnImageError(true)}
        />
      </View>
      <View style={styles.lblView}>
        <Text style={[styles.lblName, {color: theme.textColor}]}>
          {user.firstname + user.lastname}
        </Text>
      </View>
      <View style={styles.lblView1}>
        <Text style={[styles.lblEmail, {color: theme.textColor}]}>
          {user.email}
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
      {user.roleId == 3 ? (
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
    borderWidth: 0,
    alignItems: 'center',
  },
  lblView: {
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 10 + '%',
  },
  lblView1: {
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 10 + '%',
    marginTop: 5 + '%',
  },
  ProfileStyle: {
    borderRadius: 90,
    borderColor: colors.profileBorderColor,
    borderWidth: 2,
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
