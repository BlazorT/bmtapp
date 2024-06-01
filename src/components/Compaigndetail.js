import moment from 'moment';
import React, {Fragment, PureComponent} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import {colors} from '../styles';
export default class Compaigndetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      value: '',
      Buttonsvisible: false,
      CancelVisible: false,
      CompleteVisible: false,
      logindata: 0,
      timeoforder: 0,
    };
  }
  CancelShow = () => {
    this.setState({CancelVisible: true});
  };
  CancelHide = () => {
    this.setState({CancelVisible: false});
  };
  render() {
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80,
    };
    var myCurrentDate = new Date();
    return (
      <Fragment>
        <GestureRecognizer
          onSwipeLeft={this.CancelHide.bind(this)}
          onSwipeRight={this.CancelShow.bind(this)}
          config={config}
          style={{
            flex: 1,
            backgroundColor: this.state.backgroundColor,
          }}
        >
          <View style={styles.item}>
            <View style={{width: 100 + '%', flexDirection: 'row'}}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 22,
                  marginTop: 5,
                  marginLeft: 5,
                }}
              >
                Recipient
              </Text>
              <Text
                style={{
                  color: 'white',
                  fontSize: 18,
                  marginTop: 8,
                  marginLeft: 30,
                }}
              >
                FaceBook
              </Text>
            </View>
            <View style={{width: 100 + '%', flexDirection: 'row'}}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 22,
                  marginTop: 5,
                  marginLeft: 5,
                }}
              >
                Massage
              </Text>
              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  marginTop: 8,
                  marginLeft: 30,
                }}
              >
                "Massage sent of facebook"
              </Text>
            </View>
            <View style={styles.rightbottomview}>
              <Text style={styles.Datebottom}>
                {moment(myCurrentDate).format('DD MMM YYYY hh mm A')}
              </Text>
            </View>
            {this.state.CancelVisible == true ? (
              <View style={{width: 100 + '%', flexDirection: 'row'}}>
                <TouchableOpacity
                  style={{width: 50 + '%'}}
                  onPress={this.CancelHide.bind(this)}
                >
                  <View style={styles.btnCancel}>
                    <Text style={styles.btnResend}>Cancel</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{width: 50 + '%'}}>
                  <View style={styles.btnCancel}>
                    <Text style={styles.btnResend}>Delete</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              <View></View>
            )}
          </View>
        </GestureRecognizer>
      </Fragment>
    );
  }
}
//onPress={this.CancelShow.bind(this)}
const styles = StyleSheet.create({
  rightbottomview: {
    flexDirection: 'row',
    position: 'absolute',
    right: 0,
    bottom: 0,
    //width: Dimensions.get('window').width,
  },
  Datebottom: {
    fontSize: 10,
    color: colors.white,
    position: 'absolute',

    right: 15,
    bottom: 5,
    marginTop: 5,
  },
  Ordervalue: {
    // fontWeight: 'bold',
    marginLeft: 5,
    fontSize: 15,
    color: colors.ValueColor,
  },
  imageStyle: {
    paddingRight: 7,
    paddingLeft: 13,
    fontSize: 22,
    color: colors.AwesomeIconColor,
  },
  btnComplete: {
    height: 30,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: '#008000a6',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    marginTop: 5,
  },
  btnCancel: {
    height: 30,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: '#ff0000a1',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    marginTop: 0,
  },
  btnResend: {
    fontSize: 16,
    color: colors.white,
  },

  TotalpackageAmount: {
    fontSize: 15,
    color: colors.ValueColor,
  },
  Date: {
    //marginLeft: 8 + '%',
    fontSize: 15,
    color: colors.ValueColor,
  },
  totalamount: {
    marginLeft: 10,
    fontSize: 15,
    color: colors.LabelColor,
  },
  totalamountvalue: {
    //marginLeft: 10,
    fontSize: 15,
    color: colors.ValueColor,
  },
  ButtonView: {
    position: 'absolute',
    bottom: 0,
    width: 100 + '%',
    backgroundColor: '#0116274f',
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 1,
  },
  ItemDetailView: {
    marginLeft: 3 + '%',
    flexDirection: 'row',
    marginTop: 2 + '%',
    width: 100 + '%',
    //bottom: 5,
  },
  ItemDetailViewsecond: {
    marginLeft: 3 + '%',
    flexDirection: 'row',
    marginTop: 3 + '%',
    width: 100 + '%',
    marginBottom: 3 + '%',
  },
  Itemdetail: {
    flexDirection: 'row',
    //width: Dimensions.get('window').width,
  },

  item: {
    marginTop: 5,
    width: 97 + '%',
    margin: 5,
    height: 100,
    //flexDirection: 'row',
    borderColor: colors.borderColor,
    backgroundColor: colors.BlazorBox,
    borderWidth: 0,
    borderRadius: 5,
    //justifyContent: 'space-around',
  },
  voiceitem: {
    marginTop: 5,
    margin: 5,
    width: 100 + '%',
    borderColor: 'orange',
    backgroundColor: '#ffa5004f',
    borderWidth: 0,
    borderRadius: 5,
    justifyContent: 'space-around',
  },
});
