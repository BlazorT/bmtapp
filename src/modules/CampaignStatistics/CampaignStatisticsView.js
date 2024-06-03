import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRoute} from '@react-navigation/native';
import Base64 from 'Base64';
import React, {useEffect, useState} from 'react';
import {Dimensions, Easing, StyleSheet, Text, View} from 'react-native';
import {BarChart} from 'react-native-chart-kit';
import {AnimatedCircularProgress} from 'react-native-circular-progress';

import Toast from 'react-native-simple-toast';
import Icona from 'react-native-vector-icons/EvilIcons';
import {colors} from '../../styles';
import servicesettings from '../dataservices/servicesettings';
import {useTheme} from '../../hooks/useTheme';
const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};
var canceltime = 40;
export default function CampaignStatisticsScreen(props) {
  const theme = useTheme();
  const route = useRoute();
  global.currentscreen = route.name;
  const [Visible, setVisible] = useState(false);
  const [percent, setpercent] = useState(0);
  const [datalist, setdatalist] = useState('');
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);
  useEffect(() => {
    const result = Math.round((30 / 100) * 100);
    setpercent(result);
    //Loaddata();
    //CompaignDetailsCall();
  }, []);
  function Opendetail() {
    props.navigation.navigate('Campaign Detail');
  }
  const data = {
    datasets: [{data: [100, 70, 50, 30, 20, 0, 50]}],
    labels: ['WA', 'Massage', 'Twitter', 'FB', 'Email', 'SMS', 'SMS'],
  };
  function Loaddata() {
    AsyncStorage.getItem('LoginInformation').then(function (res) {
      let Asyncdata = JSON.parse(res);
      //const date = new Date();
      var headerFetch = {
        method: 'POST',
        body: JSON.stringify({
          orgId: Asyncdata[0].orgid,
          status: 1,
          name: '',
          networkId: 0,
          id: 0,
          lastUpdatedBy: Asyncdata[0].id,
        }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: servicesettings.AuthorizationKey,
        },
      };
      fetch(servicesettings.baseuri + 'CompaignNetworks', headerFetch)
        .then(response => response.json())
        .then(responseJson => {
          //var myCampaignDetail = responseJson.data;
          // ));
          if (responseJson.data != null) {
            setdatalist(responseJson.data);
            // setspinner(false);
          } else {
            //setspinner(false);
          }
        })
        .catch(error => {
          console.error('service error', error);
          Toast.showWithGravity(
            'Internet connection failed, try another time !!!',
            Toast.LONG,
            Toast.CENTER,
          );
          //setspinner(false);
        });
    });
  }
  function CompaignDetailsCall() {
    var blazorHeader = new Headers();
    blazorHeader.append(
      'Authorization',
      'bearer ' + Base64.btoa(servicesettings.AuthorizationKey),
    );
    blazorHeader.append('Content-Type', 'application/json');
    var headerFetch = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: blazorHeader,
    };
    fetch(servicesettings.baseuri + 'CompaignDetails', headerFetch)
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.data != null) {
          //{"dataOfDay": "Monday", "totalAllies": 0, "totalLikes": 0, "totalVideos": 1}
        }
      })
      .catch(error => {
        Toast.showWithGravity(
          'Internet connection failed, try another time !!!',
          Toast.LONG,
          Toast.CENTER,
        );
        console.error('service error', error);
      });
    //console.disableYellowBox = true;
  }
  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <View style={styles.graphview}>
        <View style={styles.CircleDetailview}>
          <View
            style={[styles.DetailView, {backgroundColor: theme.cardBackColor}]}>
            <View style={styles.DetailViewTitle}>
              <Text style={[styles.ViewTitle, {color: theme.textColor}]}>
                {' Current Volume'}
              </Text>
              <Icona
                name={'arrow-up'}
                style={[styles.ViewTitleIcon, {color: theme.tintColor}]}
              />
            </View>
            <Text style={[styles.availableLable, {color: theme.textColor}]}>
              {parseFloat(7668798)
                .toFixed(1)
                .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
            </Text>
          </View>
          <View
            style={[styles.DetailView, {backgroundColor: theme.cardBackColor}]}>
            <View style={styles.DetailViewTitle}>
              <Text style={[styles.ViewTitle, {color: theme.textColor}]}>
                {' Sales of current month'}
              </Text>
              <Icona
                name={'arrow-up'}
                style={[styles.ViewTitleIcon, {color: theme.tintColor}]}
              />
            </View>
            <Text style={[styles.availableLable, {color: theme.textColor}]}>
              {parseFloat(87676)
                .toFixed(1)
                .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
            </Text>
          </View>
        </View>
        <View
          style={[styles.circleview, {backgroundColor: theme.cardBackColor}]}>
          <AnimatedCircularProgress
            size={120}
            width={15}
            rotation={360}
            delay={500}
            prefill={0}
            // lineCap="square"
            fillLineCap="round"
            easing={Easing.out(Easing.ease)}
            fill={percent}
            tintColor={theme.buttonBackColor}
            backgroundColor={theme.backgroundColor}>
            {fill => (
              <Text style={{fontSize: 30, color: theme.textColor}}>
                {fill.toFixed(0) + '%'}
              </Text>
            )}
          </AnimatedCircularProgress>
        </View>
      </View>
      <View style={styles.itemMainView}>
        <View
          style={[styles.ChartView, {backgroundColor: theme.cardBackColor}]}>
          <BarChart
            data={data}
            width={Dimensions.get('window').width - 28}
            height={Dimensions.get('window').height - 320}
            chartConfig={{
              color: (opacity = 1) => theme.textColor,
              backgroundGradientFrom: theme.cardBackColor,
              backgroundGradientTo: theme.cardBackColor,
              backgroundGradientToOpacity: 1,
              backgroundGradientFromOpacity: 1,
              decimalPlaces: 0,
            }}
            yAxisLabel=""
            showValuesOnTopOfBars={true}
            bezier
          />
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BlazorBg,
    width: Dimensions.get('window').width,
    //backgroundColor: colors.BlazorBg,
  },
  OrderNumber: {
    marginLeft: 0,
    fontSize: 20,
    color: colors.TextColorOther,
  },
  Title: {
    marginTop: 1,
    fontSize: 40,
    color: colors.TextColorOther,
  },
  itemMainView: {
    //marginTop: 15,
    //margin:10,
    // width: 95 + '%',
    // height:50 + '%',
    //flexDirection: 'row',
    borderColor: colors.borderColor,
    //width: Dimensions.get('window').width,
    // backgroundColor: colors.white,
    padding: 10,
    //backgroundColor: colors.BlazorBg,
    borderWidth: 0,
    borderRadius: 5,
    //justifyContent: 'space-around',
  },
  ChartView: {
    borderColor: colors.borderColor,
    padding: 4,
    //backgroundColor: colors.BlazorBg,
    borderWidth: 0,
    borderRadius: 5,
    backgroundColor: colors.PagePanelTab,
    elevation: 5,
    //paddingLeft:-40,
    paddingLeft: -40,
    shadowColor: 'black',
    shadowOffset: {width: 4, height: 6},
    shadowOpacity: 0.8,
  },
  graphview: {
    flexDirection: 'row',
    //width: 96 + '%',
    //height:45 + '%',
    // borderBottomWidth:0.3,
    //borderBottomColor: 'gray',
    paddingBottom: 10,
  },
  DetailViewTitle: {
    flexDirection: 'row',
  },
  CircleDetailview: {
    width: 63 + '%',
    //backgroundColor:'blue',
    //justifyContent: 'center',
  },
  circleview: {
    width: 35 + '%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    borderRadius: 6,
    backgroundColor: colors.PagePanelTab,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: {width: 4, height: 6},
    shadowOpacity: 0.8,
  },
  DetailView: {
    // alignItems: 'center',
    padding: 4,
    justifyContent: 'center',
    marginTop: 10,
    marginHorizontal: 12,
    borderRadius: 6,
    backgroundColor: colors.PagePanelTab,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: {width: 4, height: 6},
    shadowOpacity: 0.8,
    //justifyContent: 'center',
  },
  Volumelable: {
    fontSize: 16,
    color: colors.TextColorOther,
    marginTop: 1 + '%',
    textAlign: 'left',
  },
  ViewTitle: {
    fontSize: 16,
    color: colors.TextColorOther,
    marginTop: 1 + '%',
    width: 80 + '%',
    textAlign: 'left',
  },
  ViewTitleIcon: {
    fontSize: 22,
    color: colors.TextColorOther,
    marginTop: 1 + '%',
    width: 20 + '%',
    textAlign: 'right',
  },
  totalVolumelable: {
    fontSize: 14,
    color: colors.TextColorOther,
  },
  availableLable: {
    color: colors.TextColorOther,
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 0,
    marginLeft: 2 + '%',
    marginTop: 1 + '%',
    textAlign: 'center',
  },
  soldLable: {
    color: colors.TextColorOther,
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 0,
    marginTop: 6 + '%',
    marginLeft: 4 + '%',
  },
});
