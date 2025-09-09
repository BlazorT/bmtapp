import {
  View,
  Modal,
  StyleSheet,
  Dimensions,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  Text,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import MapView, {
  Animated,
  AnimatedRegion,
  PROVIDER_GOOGLE,
  MarkerAnimated,
  Circle,
  Callout,
} from 'react-native-maps';
import { useSelector } from 'react-redux';
import Geolocation from '@react-native-community/geolocation';
import { mapStyle } from '../../mapStyle';
import RNSRangeSlider from '../RangeSlider';
import Icon from 'react-native-vector-icons/Entypo';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { GET_ADDRESS, GET_ADDRESS_LIST } from '../../constants';
import Toast from 'react-native-simple-toast';
import { add } from 'lodash';
import RNSButton from '../Button';
import RNSTextInput from '../TextInput';

const CampaignMap = ({ isOpen, toggleOpen, campaignInfo, setCampaignInfo }) => {
  const theme = useTheme();
  const themeMode = useSelector(state => state.theme?.mode);
  const ipinfo = useSelector(state => state?.lovs?.lovs?.ipinfo);

  const mapRef = useRef(null);
  const region = useRef(
    new AnimatedRegion({
      latitude: parseFloat(ipinfo?.hoskes_locplugin_latitude || 37.78825),
      longitude: parseFloat(ipinfo?.hoskes_locplugin_longitude || -122.4324),
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }),
  ).current;

  const [marker, setMarker] = useState({
    latitude: parseFloat(ipinfo?.hoskes_locplugin_latitude || 37.78825),
    longitude: parseFloat(ipinfo?.hoskes_locplugin_longitude || -122.4324),
  });

  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [addressListloading, setAddressListLoading] = useState(false);
  const [addressList, setAddressList] = useState([]);
  const [query, setQuery] = useState('');
  // Debounced query state
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query); // ✅ update debounced query after delay
    }, 500); // delay in ms (500 = 0.5s)

    return () => {
      clearTimeout(handler); // cleanup on typing
    };
  }, [query]);

  useEffect(() => {
    if (debouncedQuery) {
      fetchAdressList(debouncedQuery);
    }
  }, [debouncedQuery]);

  // 🔹 Check & request permission
  useEffect(() => {
    const checkPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (granted) {
          locateUser();
        } else {
          const req = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message:
                'We need your location to show your position on the map.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (req === PermissionsAndroid.RESULTS.GRANTED) {
            locateUser();
          }
        }
      } else {
        // iOS
        const authStatus = await Geolocation.requestAuthorization('whenInUse');
        if (authStatus === 'granted') {
          locateUser();
        }
      }
    };

    if (isOpen) {
      checkPermission();
    }
  }, [isOpen]);

  // 🔹 Get user location
  const locateUser = () => {
    Geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        moveToLocation(latitude, longitude);
      },
      error => {
        console.log('Location error:', error);
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 },
    );
  };

  // 🔹 Smoothly animate map + update marker
  const moveToLocation = (latitude, longitude) => {
    const newRegion = {
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    setMarker({ latitude, longitude });
    region.setValue(newRegion);
    if (mapRef.current) {
      mapRef.current.animateToRegion(newRegion, 1000); // animate in 1 sec
    }
    fetchAdress(latitude, longitude);
  };

  const fetchAdress = async (lat, lng) => {
    setLoading(true);
    try {
      const res = await fetch(GET_ADDRESS(lat, lng), {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'bmt/1.0',
        },
      });
      if (!res.ok) {
        const err = new Error(`Req failed with code : ${res.status}`);
        throw err;
      }
      const response = await res.json();
      setAddress(response?.display_name || '');
      //   setAddressList(response || []);
    } catch (e) {
      Toast.show(e?.message || 'Something went wrong, please try again');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdressList = async q => {
    setAddressListLoading(true);
    try {
      const res = await fetch(
        GET_ADDRESS_LIST(q, ipinfo?.hoskes_locplugin_countryCode || 'PK'),
        {
          headers: {
            'Accept-Language': 'en',
            'User-Agent': 'bmt/1.0',
          },
        },
      );
      if (!res.ok) {
        const err = new Error(`Req failed with code : ${res.status}`);
        throw err;
      }
      const response = await res.json();
      console.log({ response });
      setAddressList(response || []);
    } catch (e) {
      Toast.show(e?.message || 'Something went wrong, please try again');
    } finally {
      setAddressListLoading(false);
    }
  };

  const onAdressClick = () => {
    if (!address) return;

    setCampaignInfo(prev => {
      const alreadyExists = prev.locations?.some(
        loc =>
          loc.AreaName === (address || '') &&
          parseFloat(loc.lat) === parseFloat(marker.latitude) &&
          parseFloat(loc.lng) === parseFloat(marker.longitude),
      );

      if (alreadyExists) {
        Toast.show('This location is already added');
        return prev;
      }

      return {
        ...prev,
        locations: [
          ...(prev.locations || []),
          {
            AreaName: address || '',
            lat: marker.latitude,
            lng: marker.longitude,
            radius: campaignInfo?.radius,
          },
        ],
      };
    });
  };

  return (
    <Modal visible={isOpen} onRequestClose={toggleOpen}>
      <View style={styles.container}>
        <Animated
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          userInterfaceStyle={themeMode}
          showsUserLocation
          showsMyLocationButton={false}
          showsCompass={false}
          mapType="standard"
          initialRegion={region}
          // customMapStyle={mapStyle}
          onPoiClick={e => {
            const { latitude, longitude } = e.nativeEvent.coordinate;
            moveToLocation(latitude, longitude);
          }}
          onPress={e => {
            const { latitude, longitude } = e.nativeEvent.coordinate;
            moveToLocation(latitude, longitude);
          }}
        >
          {campaignInfo?.radius && (
            <Circle
              radius={campaignInfo?.radius * 1000}
              center={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              strokeWidth={0}
              strokeColor={'blue'}
              fillColor="rgba(0, 150, 255, 0.15)"
            />
          )}
          <MarkerAnimated
            coordinate={marker}
            draggable
            onDragEnd={e => {
              const { latitude, longitude } = e.nativeEvent.coordinate;
              moveToLocation(latitude, longitude);
            }}
            description={address}
          />
        </Animated>
        <View style={styles.topView}>
          <View
            style={{ flexDirection: 'row', columnGap: 4, alignItems: 'center' }}
          >
            <AntDesignIcon
              name="left"
              color={theme.textColor}
              size={24}
              onPress={toggleOpen}
            />
            <View
              style={{
                width: '90%',
              }}
            >
              <RNSTextInput
                placeholder="Search Area..."
                placeholderTextColor={theme.placeholderColor}
                value={query}
                onChangeText={setQuery}
                style={{
                  backgroundColor: theme.inputBackColor,
                  color: theme.textColor,
                  borderRadius: 6,
                  paddingHorizontal: 10,
                  fontSize: 16,
                  // maxHeight: 60,
                  // maxWidth: '90%',
                }}
              />
              {addressListloading && (
                <ActivityIndicator
                  style={styles.loader}
                  size={'small'}
                  color={theme.selectedCheckBox}
                />
              )}
              {query && !addressListloading && (
                <TouchableOpacity
                  style={styles.crossIcon}
                  onPress={() => setQuery('')}
                >
                  <Icon name="cross" size={18} color={theme.buttonBackColor} />
                </TouchableOpacity>
              )}
            </View>
          </View>
          {query && addressList?.length > 0 && (
            <FlatList
              data={addressList}
              keyExtractor={(_, i) => i.toString()}
              style={[
                styles.addressContainer,
                { backgroundColor: theme.cardBackColor },
              ]}
              contentContainerStyle={{ paddingBottom: 15 }}
              ItemSeparatorComponent={
                <View
                  style={[
                    styles.seprator,
                    { backgroundColor: theme.lightGray },
                  ]}
                />
              }
              nestedScrollEnabled
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    moveToLocation(parseFloat(item?.lat), parseFloat(item.lon));
                    setAddressList([]);
                  }}
                >
                  <Text
                    style={[{ color: theme.textColor, fontWeight: 'bold' }]}
                  >
                    {item?.name}
                  </Text>
                  <Text style={[{ color: theme.lightGray, fontSize: 12 }]}>
                    {item?.display_name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
        <View
          style={[styles.bottomView, { backgroundColor: theme.cardBackColor }]}
        >
          {address && (
            <View>
              <Text style={[styles.label, { color: theme.textColor }]}>
                Address
              </Text>
              <Text style={[{ color: theme.textColor }]}>{address}</Text>
            </View>
          )}
          <RNSRangeSlider
            disableRange={true}
            min={1}
            max={500}
            step={1}
            low={campaignInfo.radius}
            high={500}
            onChange={(low, high) => {
              // console.log({ low, high });
              setCampaignInfo(prev => {
                if (prev.radius === low) {
                  return prev; // ✅ prevent unnecessary re-renders
                }
                return { ...prev, radius: low };
              });
            }}
            label={'Radius (km)'}
          />
          {campaignInfo?.locations?.length > 0 && (
            <View>
              <Text style={[styles.label, { color: theme.textColor }]}>
                Locations
              </Text>
              <ScrollView
                contentContainerStyle={styles.bubblesContainer}
                style={{ maxHeight: 80 }} // ✅ force scroll area
                nestedScrollEnabled={true}
              >
                {campaignInfo?.locations?.map((cl, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() =>
                      moveToLocation(parseFloat(cl?.lat), parseFloat(cl.lng))
                    }
                    style={[
                      styles.bubble,
                      { backgroundColor: theme.selectedCheckBox },
                    ]}
                  >
                    <Text
                      ellipsizeMode="tail"
                      numberOfLines={1}
                      style={{ color: theme.acytiveBreadcrumbText, width: 120 }}
                    >
                      {cl?.AreaName}
                    </Text>
                    <TouchableOpacity
                      // style={styles.crossIcon}
                      onPress={() =>
                        setCampaignInfo(prev => ({
                          ...prev,
                          locations: prev.locations.filter(
                            (_, i) => i !== index,
                          ),
                        }))
                      }
                    >
                      <Icon name="cross" size={18} color={theme.textColor} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              columnGap: 10,
            }}
          >
            <RNSButton
              caption="Close"
              bgColor={theme.buttonBackColor}
              onPress={toggleOpen}
              style={{ flex: 1 }}
            />
            <RNSButton
              caption="Add"
              bgColor={theme.buttonBackColor}
              onPress={onAdressClick}
              disabled={loading}
              loading={loading}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    justifyContent: 'flex-end',
    alignItems: 'center',
    // overflow: 'hidden',
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    // overflow: 'hidden',
    marginBottom: 40,
  },
  bottomView: {
    width: '95%',
    maxHeight: 350,
    bottom: 50,
    borderRadius: 6,
    padding: 10,
    rowGap: 10,
    position: 'absolute',
    // zIndex: 10, // 👈 force it above the map
    // elevation: 10,
  },
  topView: {
    width: '95%',
    maxHeight: 350,
    top: 15,
    borderRadius: 6,
    padding: 10,
    rowGap: 10,
    position: 'absolute',
    zIndex: 10, // 👈 force it above the map
    backgroundColor: 'transparent',
  },
  bubblesContainer: {
    flexDirection: 'row',
    columnGap: 5,
    rowGap: 5,
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 4,
    width: '100%',
  },
  bubble: { padding: 5, borderRadius: 6, flexDirection: 'row' },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  calloutContainer: {
    width: 200, // ✅ set width
    height: 100, // ✅ set height
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressContainer: {
    padding: 8,
    borderRadius: 8,
    marginTop: 5,
    maxHeight: 200,
  },
  seprator: {
    height: 1,
    marginVertical: 5,
    opacity: 0.5,
  },
  loader: {
    position: 'absolute',
    right: 5,
    top: 5,
  },
  crossIcon: {
    position: 'absolute',
    right: 5,
    top: 5,
    zIndex: 9999,
  },
});

export default CampaignMap;
