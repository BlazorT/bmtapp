import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {Dimensions, Image, StyleSheet, Switch, Text, View} from 'react-native';
import Alert from '../../components/Alert';
import {colors} from '../../styles';
import servicesettings from '../dataservices/servicesettings';
export default function PreferencesAndSettingsScreen(props) {
  const [FirstName, setFirstName] = useState('Muhammad');
  const [LastName, setLastName] = useState('Hamza');
  const [Email, setEmail] = useState('hamza.shakeel@blazortech.com');
  const [img, setimg] = useState('');
  const [RoleId, setRoleid] = useState(0);
  const [switchValue, setSwitchValue] = useState(true);
  const [Visible, setVisible] = useState(false);
  const toggleSwitch = value => {
    setSwitchValue(value);
  };
  const hide = () => {
    setVisible(false);
  };
  const confirm = () => {
    setVisible(false);
    props.navigation.navigate('Home');
  };
  useEffect(() => {
    AsyncStorage.getItem('LoginInformation').then(function(res) {
      let Asyncdata = JSON.parse(res);
      console.log('Asyncdata ', Asyncdata);
      console.log('Asyncdata.firstname ', Asyncdata[0].firstname);
      console.log(
        'Asyncdata.avatar ',
        servicesettings.Imagebaseuri + Asyncdata[0].avatar,
      );
      if (Asyncdata != null) {
        setFirstName(Asyncdata[0].firstname);
        setLastName(Asyncdata[0].lastname);
        setEmail(Asyncdata[0].email);
        setRoleid(Asyncdata[0].roleId);
        // setimg(Asyncdata[0].avatar);
        setimg(
          servicesettings.Imagebaseuri +
            Asyncdata[0].avatar
              .replace(/\\/g, '/')
              .replace(',', '')
              .replace(' //', ''),
        );
      } else {
        setimg('data:image/png;base64,' + servicesettings.Default_User_Image);
      }
    });
  }, []);
  return (
    <View style={styles.container}>
      <Alert
        massagetype={'warning'}
        hide={hide}
        confirm={confirm}
        Visible={Visible}
        alerttype={'confirmation'}
        Title={'Confirmation'}
        Massage={'Do you want to close ?'}
      ></Alert>
      <View style={styles.ProfileImgView}>
        <Image source={{uri: img}} style={styles.ProfileStyle} />
      </View>
      <View style={styles.lblView}>
        <Text style={styles.lblName}>{FirstName + '  ' + LastName}</Text>
      </View>
      <View style={styles.lblView1}>
        <Text style={styles.lblEmail}>{Email}</Text>
      </View>
      <View style={styles.TogleView}>
        <Text style={styles.Notification}> App Notification </Text>
        <Switch
          style={styles.SwitchStl}
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor="white"
          ios_backgroundColor="gray"
          onValueChange={toggleSwitch}
          value={switchValue}
        />
        <Text style={styles.Notification}>{switchValue ? 'ON' : 'OFF'}</Text>
      </View>
      {RoleId == 3 ? (
        <View style={styles.lblapipathView}>
          <Text style={styles.lblApiPath}>{servicesettings.baseuri}</Text>
        </View>
      ) : (
        <View></View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    //backgroundColor: colors.BlazorBg,
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
    //borderRadius: 90,
    //backgroundColor:'green',
    // borderColor: 'white',
    borderWidth: 0,
    alignItems: 'center',
  },
  lblView: {
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 10 + '%',
    //backgroundColor:'green',
  },
  lblView1: {
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 10 + '%',
    marginTop: 5 + '%',
    //backgroundColor:'red',
  },
  ProfileStyle: {
    borderRadius: 90,
    borderColor: colors.profileBorderColor,
    borderWidth: 2,
    //marginTop:2,
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
