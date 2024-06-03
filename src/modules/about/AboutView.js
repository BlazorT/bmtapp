import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import VersionCheck from 'react-native-version-check';
import {getAppstoreAppMetadata} from 'react-native-appstore-version-checker';
import Toast from 'react-native-simple-toast';
import {colors, fonts} from '../../styles';
import {useTheme} from '../../hooks/useTheme';
export default function AboutScreen(props) {
  const [AppVersion, setAppVersion] = useState('');
  const theme = useTheme();
  useEffect(() => {
    // VersionCheck.getLatestVersion().then(latestVersion => {
    //    // 0.1.2
    //   setAppVersion(latestVersion);
    // });
    const version = VersionCheck.getCurrentVersion();
    setAppVersion(version);
  }, []);
  //***************************************************** View ********************************************************************//
  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <View style={styles.componentsSection}>
        <Image
          style={styles.logo}
          source={require('../../../assets/images/BDMT.png')}
        />
      </View>
      <View style={{paddingBottom: 5}}>
        <Text style={[styles.headertitle, {color: theme.textColor}]}>
          Who We Are?
        </Text>
        <Text style={[styles.header, {color: theme.textColor}]}>
          BMT is advertisement app
        </Text>
      </View>
      <View style={styles.BottomView}>
        <Text style={{color: theme.textColor, fontSize: 22}}>
          ✆{' '}
          <TouchableOpacity>
            <Text style={[styles.ContactNo, {color: theme.textColor}]}>
              +923337069742
            </Text>
          </TouchableOpacity>
        </Text>
        <Text style={[styles.link, {color: theme.textColor}]}>
          {' '}
          www.blazortech.com
        </Text>
      </View>
      <View style={{paddingBottom: 5}}>
        <Text style={{color: theme.textColor}}>
          {'Version ' + (AppVersion == '' ? '2.5' : AppVersion)}
        </Text>
      </View>
      <View style={{paddingBottom: 5}}>
        <Text
          ellipsizeMode="tail"
          style={[styles.Paragraph, {color: theme.textColor}]}>
          Blazor Media Toolkit Campaign plays nice with others and integrates
          with over 700 apps and services like
          whatsapp,facebook,tweeter,messenger,youtube etc. Effective, seamless
          and continued presence in global world to increase product rating and
          sales. BMT can run media compaign on the following platforms,
          whatsapp, sms, email, facebook, linkedIn, twitter, Instagram. Its
          powered with integrable plugins.
        </Text>
      </View>
    </View>
  );
}
//******************************************************** Styles ************************************************************//
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    textAlign: 'center',
    paddingHorizontal: 15,
    flex: 1,
    backgroundColor: 'white',
    //backgroundColor: colors.BlazorBg,
    width: Dimensions.get('window').width,
  },
  componentsSection: {
    justifyContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-around',
    // backgroundColor:'red',
    width: Dimensions.get('window').width,
  },
  iconimage: {
    width: Dimensions.get('window').width,
    //height:170,
    //height: Dimensions.get('window').height-0,
    alignItems: 'center',
    marginTop: 5 + '%',
  },
  logo: {
    height: 180,
    width: 380,
    resizeMode: 'contain',
    //backgroundColor:'gray',
    //tintColor:'red'
  },
  headertitle: {
    fontFamily: 'Roboto',
    // fontFamily: fonts.primaryRegular,
    textAlign: 'center',
    color: colors.TextColorOther,
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10 + '%',
  },
  header: {
    fontFamily: fonts.primaryRegular,
    textAlign: 'center',
    color: colors.TextColorOther,
    fontSize: 20,
    marginTop: 1 + '%',
  },
  WatchAnywhere: {
    fontFamily: fonts.primaryRegular,
    textAlign: 'center',
    color: colors.TextColorOther,
    fontSize: 19,
    paddingTop: 15,
  },
  link: {
    paddingTop: 10,
    textAlign: 'center',
    color: colors.TextColorOther,
    fontSize: 15,
  },
  BottomView: {
    textAlign: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
  },
  ContactNo: {
    marginTop: 10,
    color: colors.TextColorOther,
    fontSize: 15,
  },
  Paragraph: {
    color: colors.TextColorOther,
    // flex: 1,
    // flexWrap: 'wrap',
    textAlign: 'justify',
    fontSize: 17,
    paddingBottom: 6,
    paddingTop: 6,
    fontFamily: 'Lato-Semibold',
  },
});
