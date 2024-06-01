import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors, fonts} from '../../styles';
const EmailIcon = require('../../../assets/images/Email.png');
const WhatsappIcon = require('../../../assets/images/Whatsapp.png');
const TwitterIcon = require('../../../assets/images/Twitter.png');
const SMSIcon = require('../../../assets/images/SMS.png');
const FacebookIcon = require('../../../assets/images/Facebook.png');
export default function CreatcompainScreen(props) {
  const OpenCampaignEmail = () => {
    globalSelectNetworkId = 3;
    AsyncStorage.getItem('LoginInformation').then(function(res) {
      let Asyncdata = JSON.parse(res);
      if (Asyncdata == null) {
        props.navigation.navigate('Login');
      } else {
        props.navigation.navigate('Campaign Schedule');
      }
    });
  };
  const OpenCampaignWhatsapp = () => {
    globalSelectNetworkId = 2;
    AsyncStorage.getItem('LoginInformation').then(function(res) {
      let Asyncdata = JSON.parse(res);
      if (Asyncdata == null) {
        props.navigation.navigate('Login');
      } else {
        props.navigation.navigate('Campaign Schedule');
      }
    });
  };
  const OpenCampaignTwitter = () => {
    globalSelectNetworkId = 4;
    AsyncStorage.getItem('LoginInformation').then(function(res) {
      let Asyncdata = JSON.parse(res);
      if (Asyncdata == null) {
        props.navigation.navigate('Login');
      } else {
        props.navigation.navigate('Campaign Schedule');
      }
    });
  };
  const OpenCampaignMassage = () => {
    globalSelectNetworkId = 1;
    AsyncStorage.getItem('LoginInformation').then(function(res) {
      let Asyncdata = JSON.parse(res);
      if (Asyncdata == null) {
        props.navigation.navigate('Login');
      } else {
        props.navigation.navigate('Campaign Schedule');
      }
    });
  };
  const OpenCampaignFacebook = () => {
    globalSelectNetworkId = 5;
    AsyncStorage.getItem('LoginInformation').then(function(res) {
      let Asyncdata = JSON.parse(res);
      if (Asyncdata == null) {
        props.navigation.navigate('Login');
      } else {
        props.navigation.navigate('Campaign Schedule');
      }
    });
  };
  /******************************************************************  views  *****************************************************/
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => OpenCampaignWhatsapp()}
        style={styles.btnGetStarted1}
      >
        <View style={{width: 26 + '%'}}>
          <Image
            resizeMode="contain"
            source={WhatsappIcon}
            style={styles.itemImage}
          />
        </View>
        <View style={{width: 73 + '%'}}>
          <Text style={styles.itemText}>Whatsapp</Text>
          <Text style={styles.itemTextDetail}>
            Media campaign via whatsApp hander
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => OpenCampaignFacebook()}
        style={styles.btnGetStarted1}
      >
        <View style={{width: 26 + '%'}}>
          <Image
            resizeMode="contain"
            source={FacebookIcon}
            style={styles.itemImage}
          />
        </View>
        <View style={{width: 73 + '%'}}>
          <Text style={styles.itemText}>Facebook</Text>
          <Text style={styles.itemTextDetail}>
            Media campaign via facebook hander
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => OpenCampaignMassage()}
        style={styles.btnGetStarted1}
      >
        <View style={{width: 26 + '%'}}>
          <Image
            resizeMode="contain"
            source={SMSIcon}
            style={styles.itemImage}
          />
        </View>
        <View style={{width: 73 + '%'}}>
          <Text style={styles.itemText}>SMS</Text>
          <Text style={styles.itemTextDetail}>
            Media campaign via SMS hander
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => OpenCampaignTwitter()}
        style={styles.btnGetStarted1}
      >
        <View style={{width: 26 + '%'}}>
          <Image
            resizeMode="contain"
            source={TwitterIcon}
            style={styles.itemImage}
          />
        </View>
        <View style={{width: 73 + '%'}}>
          <Text style={styles.itemText}>Twitter</Text>
          <Text style={styles.itemTextDetail}>
            Media campaign via Twitter hander
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => OpenCampaignEmail()}
        style={styles.btnGetStarted1}
      >
        <View style={{width: 26 + '%'}}>
          <Image
            resizeMode="contain"
            source={EmailIcon}
            style={styles.itemImage}
          />
        </View>
        <View style={{width: 73 + '%'}}>
          <Text style={styles.itemText}>Email</Text>
          <Text style={styles.itemTextDetail}>Media campaign via emails</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
/************************************************************ styles ***************************************************/
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    //backgroundColor: colors.BlazorBg,
    flex: 1,
    alignItems: 'center',
  },
  btnGetStarted1: {
    flexDirection: 'row',
    //backgroundColor:'#480bc3',
    backgroundColor: colors.PanelTabList,
    //backgroundColor:'#43506c',
    //backgroundColor:colors.Blazorbutton,
    //borderColor:'white',
    width: 95 + '%',
    fontSize: 25,
    // height:15 + '%',
    marginTop: 10,
    marginBottom: 7,
    borderRadius: 6,
    // borderWidth: 1,
  },
  btnGetStarted: {
    borderColor: 'white',
    width: 95 + '%',
    fontSize: 25,
    height: 17.5 + '%',
    marginTop: 10,
    borderRadius: 6,
    borderWidth: 1,
  },
  itemImage: {
    height: 65,
    width: 65,
    // tintColor:colors.IconLightColor,
    // backgroundColor:'blue',
    marginTop: 12,
    marginBottom: 12,
    marginLeft: 12,
  },
  itemText: {
    color: colors.TextColorOther,
    fontFamily: fonts.primary,
    marginTop: 11,
    fontSize: 22,
    fontWeight: 'bold',
  },
  itemTextDetail: {
    color: colors.TextColorOther,
    fontFamily: fonts.primary,
    marginTop: 5,
    fontSize: 16,
    fontWeight: '600',
    paddingRight: 5,
  },
});
