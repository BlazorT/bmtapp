import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Fragment, PureComponent} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
  Profile,
} from 'react-native-fbsdk-next';
import Icon from 'react-native-vector-icons/FontAwesome';
import {colors} from '../styles';
const Picture = [];
export default class SignupWithFacebook extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {text: ''};
    this.state = {
      modalVisiblecamera: false,
      modalVisible: false,
    };
  }
  logoutWithFacebook = () => {
    LoginManager.logOut();
    this.setState({userInfo: {}});
  };
  getInfoFromToken = token => {
    const PROFILE_REQUEST_PARAMS = {
      fields: {
        string: 'id,name,first_name,last_name, email',
      },
    };
    const profileRequest = new GraphRequest(
      '/me',
      {token, parameters: PROFILE_REQUEST_PARAMS},
      (error, user) => {
        if (error) {
        } else {
          AsyncStorage.removeItem('SignupWithFacebookEmail');
          this.setState({userInfo: user});
          // );
          // );
          var email_Token = {
            email: this.state.userInfo.email,
            authtoken: token,
          };
          AsyncStorage.setItem(
            'SignupWithFacebookEmail',
            JSON.stringify(email_Token),
          );

          global.USEREMAIL = this.state.userInfo.email;
          this.SendBackPage();
        }
      },
    );
    //AsyncStorage.setItem('SignupWithFacebookEmail', JSON.stringify(this.state.userInfo.email));
    new GraphRequestManager().addRequest(profileRequest).start();
  };
  loginWithFacebook = () => {
    LoginManager.setLoginBehavior('web_only');
    //
    //global.Signup_LoginWithGoogle == 2;
    global.SocialMedia = 2;
    // Attempt a login using the Facebook login dialog asking for default permissions.
    LoginManager.logInWithPermissions(['public_profile']).then(
      login => {
        if (login.isCancelled) {
        } else {
          AccessToken.getCurrentAccessToken().then(data => {
            const accessToken = data.accessToken.toString();
            this.getInfoFromToken(accessToken);
            this.SignupFacebookPicture();
          });
        }
      },
      error => {},
    );
  };
  SignupFacebookPicture = async () => {
    LoginManager.setLoginBehavior('web_only');
    const currentProfile = Profile.getCurrentProfile().then(
      function (currentProfile) {
        if (currentProfile) {
          AsyncStorage.removeItem('SignupWithGoogle_Facebook');
          AsyncStorage.getItem('SignupWithFacebookEmail').then(function (res) {
            let Asyncdata = JSON.parse(res);
            //var fcmToken = servicesettings.fcmToken;
            if (Asyncdata != null) {
              AsyncStorage.removeItem('SignupWithGoogle_Facebook');
              //var imgurl = Asyncdata.user.photo;
              //
              //
              //
              // );
              var userName =
                currentProfile.firstName + '.' + currentProfile.lastName;
              var facebookOS = 4;
              var facebookdata = {
                firstName: currentProfile.firstName,
                lastName: currentProfile.lastName,
                userName: userName,
                facebookOS: facebookOS,
                userID: currentProfile.userID,
                picture: currentProfile.imageURL,
                email: Asyncdata.email,
                authtoken: Asyncdata.authtoken,
              };
              //var SignupFacebook = (this.state.userInfo + global.USEREMAIL);
              AsyncStorage.setItem(
                'SignupWithGoogle_Facebook',
                JSON.stringify(facebookdata),
              );
            }
          });
        }
      },
    );
  };
  SendBackPage = () => {
    this.props.PressSignUp();
  };
  state = {userInfo: {}};
  render() {
    const {modalVisible} = this.state;
    const vehicleImages = [];
    return (
      <Fragment>
        <View style={styles.imgButtonView}>
          <View style={styles.fieldView}>
            <TouchableOpacity
              onPress={() => this.loginWithFacebook()}
              style={[
                styles.btnfacebook,
                {backgroundColor: this.props.theme.buttonBackColor},
              ]}>
              <Icon name={'facebook'} style={styles.Iconfacebook} />
              <Text
                style={
                  Platform.OS === 'ios'
                    ? styles.textfacebookIOS
                    : styles.textfacebook
                }>
                Sign Up With Facebook
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Fragment>
    );
  }
}
const styles = StyleSheet.create({
  imgButtonView: {
    //marginTop: 20,
    width: Dimensions.get('window').width,
    zIndex: 99,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  fieldView: {
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: 3,
    paddingVertical: 2,
  },
  MainView: {
    flexDirection: 'row',
    //alignItems: 'center',
    justifyContent: 'space-around',
  },
  btnfacebook: {
    backgroundColor: colors.Blazorbutton,
    flexDirection: 'row',
    width: Dimensions.get('window').width - 50,
    color: 'white',
    marginBottom: 1,
    height: 48,
    marginVertical: 2,
    alignItems: 'center',
    borderRadius: 4,
  },
  Iconfacebook: {
    fontSize: 32,
    paddingTop: 12,
    paddingHorizontal: 17,
    color: 'white',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    backgroundColor: '#22355a',
    width: 15 + '%',
    height: 48,
  },
  textfacebook: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    width: 87 + '%',
    textAlign: 'center',
  },
  textfacebookIOS: {
    color: 'white',
    fontSize: 14,
    fontWeight: '200',
    width: 87 + '%',
    textAlign: 'center',
  },
});
