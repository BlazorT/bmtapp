import React from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import VersionCheck from 'react-native-version-check';
import { useTheme } from '../../hooks/useTheme';
import { colors, fonts } from '../../styles';

const { width, height } = Dimensions.get('window');

const fontSize = height > 800 || width > 800 ? 16 : 13; // Adjust threshold and sizes as desired
const isTablet = Math.min(width, height) >= 600;

export default function AboutScreen(props) {
  const theme = useTheme();
  const AppVersion = VersionCheck.getCurrentVersion();
  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
    >
      <View style={styles.componentsSection}>
        <Image
          style={styles.logo}
          source={require('../../../assets/images/BDMT.png')}
        />
      </View>

      <ScrollView
        style={{
          height: isTablet ? '20%' : '50%',
        }}
        contentContainerStyle={{
          paddingBottom: 60,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ rowGap: 6 }}>
          <Text style={[styles.headertitle, { color: theme.textColor }]}>
            Who We Are?
          </Text>
          <Text style={[styles.header, { color: theme.textColor }]}>
            Blazor Media Toolkit is an advertisement app
          </Text>
          <Text style={{ color: theme.textColor, textAlign: 'center' }}>
            {'Version ' + (AppVersion == '' ? '2.5' : AppVersion)}
          </Text>
        </View>
        <Text
          ellipsizeMode="tail"
          style={[
            styles.Paragraph,
            {
              textAlign: isTablet ? 'auto' : 'justify',
              lineHeight: fontSize * 1.7,
              letterSpacing: 0.1,
              fontSize, // Apply responsive font size
              color: theme.textColor,
              marginTop: 20,
            },
          ]}
        >
          Blazor Media Toolkit Campaign plays nice with others and integrates
          with over 700 apps and services like whatsapp, facebook, tweeter,
          messenger, youtube etc. Effective, seamless and continued presence in
          global world to increase product rating and sales. BMT can run media
          campaign on the following platforms, whatsapp, sms, email, facebook,
          linkedIn, twitter, Instagram. Its powered with integrable plugins.
        </Text>
      </ScrollView>
      <View
        style={[styles.BottomView, { backgroundColor: theme.backgroundColor }]}
      >
        <TouchableOpacity>
          <Text style={{ color: theme.textColor, fontSize: 20 }}>
            ✆{' '}
            <Text style={[styles.ContactNo, { color: theme.textColor }]}>
              +923337069742
            </Text>
          </Text>
        </TouchableOpacity>
        <Text style={[styles.link, { color: theme.textColor }]}>
          {' '}
          www.blazortech.com
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
    paddingHorizontal: 12,
    flexGrow: 1,
    backgroundColor: 'white',
  },
  componentsSection: {
    justifyContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: Dimensions.get('window').width,
  },
  iconimage: {
    width: Dimensions.get('window').width,
    alignItems: 'center',
    marginTop: 5 + '%',
  },
  logo: {
    height: 150,
    resizeMode: 'contain',
  },
  headertitle: {
    fontFamily: 'Roboto',
    textAlign: 'center',
    color: colors.TextColorOther,
    fontSize: 22,
    fontWeight: 'bold',
  },
  header: {
    fontFamily: fonts.primaryRegular,
    textAlign: 'center',
    color: colors.TextColorOther,
    fontSize: 20,
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
    paddingBottom: 20,
    bottom: 0,
    width: '100%',
  },
  ContactNo: {
    color: colors.TextColorOther,
    fontSize: 16,
  },
  Paragraph: {
    color: colors.TextColorOther,
    textAlign: 'justify',
    fontSize: 17,
    paddingBottom: 6,
    paddingTop: 6,
    fontFamily: 'Lato-Semibold',
  },
});
