import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-simple-toast';
import Icons from 'react-native-vector-icons/FontAwesome';
import { TextInput } from '../../components';
import { colors } from '../../styles';

import { useRoute } from '@react-navigation/native';
import CapaignItem from '../../components/CapaignItem';
import { useTheme } from '../../hooks/useTheme';
import { useUser } from '../../hooks/useUser';
import servicesettings from '../dataservices/servicesettings';
import { isAdminOrSuperAdmin } from '../home/HomeView';

export default function MyCampaignScreen(props) {
  const { user, isAuthenticated } = useUser();
  const theme = useTheme();
  const route = useRoute();
  global.currentscreen = route.name;

  const [shouldShow, setShouldShow] = useState(false);
  const [data, setdata] = useState([]);
  const [userId, setUserId] = useState('');
  const [orgId, setOrgId] = useState('');
  const [Search, setSearch] = useState('');
  const [searchBudget, setSearchBudget] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [spinner, setspinner] = useState(true);
  const isReload = props?.route?.params?.isReload;

  useEffect(() => {
    if (isReload) Loaddata();
  }, [isReload]);

  useEffect(() => {
    if (!isReload) Loaddata();
  }, [isReload]);

  function Loaddata() {
    setspinner(true);
    if (isAuthenticated) {
      setUserId(user.id);
      setOrgId(user.orgId);
      let headerFetch = {
        method: 'POST',
        body: JSON.stringify({
          orgId: user.orgId,
          status: 0,
          name: '',
          networkId: 0,
          id: 0,
          lastUpdatedBy: user.id,
        }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: servicesettings.AuthorizationKey,
        },
      };
      // bmtcompaigns
      fetch(
        servicesettings.baseuri + 'Compaigns/detailedcompaigns',
        headerFetch,
      )
        .then(response => response.json())
        .then(responseJson => {
          console.log('data response bmtcompaigns  =>', headerFetch.body);
          console.log('data response bmtcompaigns  =>', responseJson.data);

          if (responseJson.data != null) {
            setdata(responseJson.data);
            setRefreshing(false);
            setspinner(false);
          } else {
            setRefreshing(false);
            setspinner(false);
          }
        })
        .catch(error => {
          console.error('service error', error);
          Toast.showWithGravity(
            'Internet connection failed, try another time !!!',
            Toast.LONG,
            Toast.CENTER,
          );
          setRefreshing(false);
          setspinner(false);
        });
    } else {
      global.SignUp_Login = 1;
      props.navigation.reset({
        index: 1,
        routes: [
          { name: 'BMT' }, // Home is at index 0
          { name: 'Login' }, // Login is at index 1 (active screen)
        ],
      });
    }
  }

  function searchDataClick() {
    var headerFetch = {
      method: 'POST',
      body: JSON.stringify({
        orgId: orgId,
        status: 0,
        name: Search,
        networkId: 0,
        id: 0,
        lastUpdatedBy: userId,
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: servicesettings.AuthorizationKey,
      },
    };
    setspinner(true);

    fetch(servicesettings.baseuri + 'Compaigns/detailedcompaigns', headerFetch)
      .then(response => response.json())
      .then(responseJson => {
        console.log(
          'search bmtcompaigns response  =>',
          JSON.stringify(responseJson),
        );
        functionCombined();
        console.log(
          'search data response bmtcompaign  =>',
          JSON.stringify(responseJson),
        );
        if (responseJson.data != null) {
          setdata(responseJson.data);
          setspinner(false);
        } else {
          setspinner(false);
        }
      })
      .catch(error => {
        console.error('service error', error);
        Toast.showWithGravity(
          'Internet connection failed, try another time !!!',
          Toast.LONG,
          Toast.CENTER,
        );
        setspinner(false);
        functionCombined();
      })
      .finally(() => {
        setspinner(false);
      });
  }

  function AddNewCampaignClick() {
    ((global.UpdateCampaign = 0), props.navigation.navigate('Campaign (+)'));
  }

  function functionCombined() {
    setShouldShow(!shouldShow);
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
    >
      <Spinner
        visible={spinner}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
      />

      {shouldShow == false ? (
        <View
          style={[
            styles.AddNewCampaign,
            { backgroundColor: theme.cardBackColor },
          ]}
        >
          {isAuthenticated && isAdminOrSuperAdmin(user?.roleId) && (
            <View style={styles.AddNewCampaignView}>
              <TouchableOpacity
                style={[
                  styles.btnDetail_Delete,
                  { backgroundColor: theme.buttonBackColor },
                ]}
                onPress={() => AddNewCampaignClick()}
              >
                <Text style={styles.Delete_Play_PauseTxt}>New Campaign</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.SearchButtonView}>
            <TouchableOpacity onPress={() => functionCombined()}>
              <Icons name={'search'} style={styles.cameraicon} />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View
          style={[styles.searchStyle, { backgroundColor: theme.cardBackColor }]}
        >
          <View style={styles.SectionView}>
            <TextInput
              placeholderTextColor={theme.placeholderColor}
              style={[
                styles.searchFieldText,
                {
                  backgroundColor: theme.inputBackColor,
                  color: theme.textColor,
                },
              ]}
              value={Search}
              onChangeText={value => setSearch(value)}
              placeholder={' Search'}
              clearTextOnFocus={true}
              keyboardAppearance={'dark'}
              KeyboardType={'default'}
              maxLength={50}
            />
            <TextInput
              placeholderTextColor={theme.placeholderColor}
              style={[
                styles.searchFieldText,
                {
                  backgroundColor: theme.inputBackColor,
                  color: theme.textColor,
                },
              ]}
              value={searchBudget}
              onChangeText={value => setSearchBudget(value)}
              placeholder={' Budget ≥'}
              clearTextOnFocus={true}
              keyboardAppearance={'dark'}
              KeyboardType={'default'}
              maxLength={50}
            />
          </View>
          <View style={styles.SearchButtonView}>
            <TouchableOpacity onPress={() => searchDataClick()}>
              <Icons name={'search'} style={styles.cameraicon} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        data={data}
        refreshing={refreshing}
        keyExtractor={(item, id) => id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} />}
        onRefresh={Loaddata}
        renderItem={({ item }) => (
          <CapaignItem item={item} loadCampiagns={Loaddata} />
        )}
        contentContainerStyle={{
          paddingBottom: 3 + '%',
          marginTop: 3 + '%',
          marginLeft: 2 + '%',
          marginRight: 2 + '%',
          width: 96 + '%',
          rowGap: 10,
        }}
        numColumns={1}
        horizontal={false}
        initialNumToRender={10} // Render only a few initial items
        windowSize={21} // Maintain a small window for efficient rendering
        removeClippedSubviews={true} // Unload off-screen views
        onEndReachedThreshold={0.1} // Load more data when the user is within 10% of the end
        maxToRenderPerBatch={5} // Render a small batch at a time
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: 100 + '%',
    height: 100 + '%',
    backgroundColor: 'white',
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
  IconText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    width: 70 + '%',
    // fontWeight: "bold",
  },
  IconTextDetail: {
    color: '#00000091',
    fontSize: 13,
    width: 100 + '%',
    //backgroundColor:'red'
    // fontWeight: "bold",
  },
  SectionView: {
    //marginBottom:23,
    //flexDirection: 'row',
    alignItems: 'center',
    //margin: 5,
    //height:8 + '%',
    // height:55,
    paddingRight: 12,
    fontSize: 16,
    color: colors.white,
    width: 83 + '%',
    //backgroundColor: colors.red,
    //backgroundColor: colors.PagePanelTab,
    borderWidth: 0,
    borderColor: 'white',
    borderRadius: 4,
  },
  AddNewCampaignView: {
    width: 80 + '%',
  },
  AddNewCampaignButton: {
    fontSize: 16,
    color: colors.white,
    borderWidth: 0,
    borderColor: 'white',
    borderRadius: 2,
  },
  SearchButtonView: {
    //marginBottom:23,
    //flexDirection: 'row',
    alignItems: 'center',
    //margin: 5,
    //height:8 + '%',
    // height:55,
    fontSize: 16,
    color: colors.white,
    width: 17 + '%',
    // backgroundColor: 'green',
    //backgroundColor: colors.PagePanelTab,
    borderWidth: 0,
    borderColor: 'white',
    borderRadius: 4,
  },
  AddNewCampaign: {
    //position: 'absolute',
    // top: 12,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    //justifyContent:'center',
    //height:55,
    width: Dimensions.get('window').width,
    borderTopWidth: 1,
    borderColor: colors.InputControlBorderColor,
    backgroundColor: colors.PagePanelTab,
    // backgroundColor:'blue'
  },
  searchStyle: {
    //position: 'absolute',
    // top: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    //height:55,
    width: Dimensions.get('window').width,
    borderTopWidth: 1,
    borderColor: colors.InputControlBorderColor,
    backgroundColor: colors.PagePanelTab,
    // backgroundColor:'blue'
  },
  searchFieldText: {
    marginLeft: 10,
    height: 43,
    //padding:10,
    marginVertical: 10,
    // marginHorizontal:5,
    borderRadius: 4,
    textDecorationLine: 'none',
    alignItems: 'center',
    fontSize: 15,
    //backgroundColor: "red",
    backgroundColor: colors.white,
    color: 'black',
    // width: Dimensions.get('window').width-70,
    //width: 80 + '%'
  },
  cameraicon: {
    //resizeMode: 'stretch',
    marginRight: 5,
    borderRadius: 1,
    borderColor: colors.white,
    color: 'gray',
    fontSize: 31,
    marginLeft: 10,
  },
  btnDetail_Delete: {
    marginHorizontal: 10,
    width: 152,
    height: 38,
    borderRadius: 6,
    borderWidth: 0,
    backgroundColor: colors.Blazorbutton,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
  },
  Delete_Play_PauseTxt: {
    fontSize: 15,
    paddingHorizontal: 15,
    fontWeight: 'bold',
    color: 'white',
  },
});
