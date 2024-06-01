import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Toast from 'react-native-simple-toast';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import AppView from './src/modules/AppViewContainer';
import servicesettings from './src/modules/dataservices/servicesettings';
import { store } from './src/redux/store';
export default function App(props) {
  const [Visible, setVisible] = useState(false);
  useEffect(() => {
    Loaddata();
    getbmtlovsdata();
    LoadBundLing();
    global.searchvalue = '';
    global.Storeid = 0;
  }, []);
  function Loaddata() {
    setVisible(true);
    var headerFetch = {
      method: 'POST',
      body: JSON.stringify({Id: 0, Name: '', Status: 1}),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: servicesettings.AuthorizationKey,
      },
    };
    console.log('headerFetch from orgs', headerFetch.body);
    fetch(servicesettings.baseuri + 'orgs', headerFetch)
      .then(response => response.json())
      .then(responseJson => {
        console.log('data response orgnization orgs =>', responseJson);
        if (responseJson.data != null) {
          global.OrgData = responseJson.data;
          AsyncStorage.setItem(
            'OrgInformation',
            JSON.stringify(responseJson.data),
          );
          setVisible(false);
        } else {
          global.OrgData = [];
          setVisible(false);
        }
      })
      .catch(error => {
        console.error('service error', error);
        Toast.showWithGravity(
          'Internet connection failed, try another time !!!',
          Toast.LONG,
          Toast.CENTER,
        );
        setVisible(false);
      });
  }
  function getbmtlovsdata() {
    var headerFetch = {
      method: 'POST',
      body: JSON.stringify({
        orgId: 0,
        email: '',
        firstName: '',
        lastName: '',
        roleName: '',
        address: '',
        stateName: '',
        userCode: '',
        title: '',
        traceId: 0,
        status: 1,
      }),
      //body: JSON.stringify({orgId:orgId,status:1,name:Search,networkId:0,id:0,lastUpdatedBy:userId}),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: servicesettings.AuthorizationKey,
      },
    };
    fetch(servicesettings.baseuri + 'bmtlovs', headerFetch)
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson != null) {
          console.log(
            'responseJson bmtlovs  ',
            JSON.stringify(responseJson.data),
          );
          var changeCountryName = responseJson.data.countries;
          var changeStateName = responseJson.data.states;
          var changeStatusList = responseJson.data.statuses;
          var changecurrencies = responseJson.data.currencies;
          var changePackagesList = responseJson.data.packages;
          var StateNameArray = changeStateName.map(element => ({
            id: element.id,
            name: element.desc,
          }));
          var CountryNameArray = changeCountryName.map(element => ({
            id: element.id,
            name: element.desc,
          }));
          var IntervalTypeData = responseJson.data.intervals;
          //console.log('responseJson bmtlovs  ', JSON.stringify(responseJson.data));
          //console.log('changecurrencies ', JSON.stringify(changecurrencies));
          AsyncStorage.setItem(
            'AllStateListData',
            JSON.stringify(changeStateName),
          );
          // AsyncStorage.setItem('AllCityListData', JSON.stringify(changecurrencies));
          AsyncStorage.setItem(
            'AllCurrenciesData',
            JSON.stringify(changecurrencies),
          );
          AsyncStorage.setItem(
            'AllStatusData',
            JSON.stringify(changeStatusList),
          );
          AsyncStorage.setItem(
            'AllPackagesData',
            JSON.stringify(changePackagesList),
          );
        }
      })
      .catch(error => {
        console.error(error);
        Toast.showWithGravity(
          'Internet connection failed, try another time !!!',
          Toast.LONG,
          Toast.CENTER,
        );
      });
  }
  function LoadBundLing() {
    var OrgId = 1;
    var headerFetch = {
      method: 'POST',
      body: JSON.stringify({Id: OrgId, rowVer: 0, Status: 1}),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: servicesettings.AuthorizationKey,
      },
    };
    console.log('headerFetch from mybundlings', headerFetch.body);
    fetch(servicesettings.baseuri + 'mybundlings', headerFetch)
      .then(response => response.json())
      .then(responseJson => {
        //console.log("data response mybundlings =>",responseJson.data);
        if (responseJson.data != null) {
          // global.OrgData=responseJson.data;
          // AsyncStorage.setItem('OrgInformation', JSON.stringify(responseJson.data));
          //setVisible(false);
        } else {
          console.log('empty data response mybundlings =>');
        }
      })
      .catch(error => {
        console.error('service error', error);
        Toast.showWithGravity(
          'Internet connection failed, try another time !!!',
          Toast.LONG,
          Toast.CENTER,
        );
        setVisible(false);
      });
  }
  let persistor = persistStore(store);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <PersistGate
          loading={
            <View style={styles.container}>
              <ActivityIndicator />
            </View>
          }
          persistor={persistor}
        >
          <AppView />
        </PersistGate>
      </NavigationContainer>
    </Provider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});