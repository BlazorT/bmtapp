import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import Toast from 'react-native-simple-toast';
import RNSTextInput from '../TextInput';
import Icon from 'react-native-vector-icons/Entypo';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import { useSelector } from 'react-redux';
import { GET_ADDRESS_LIST } from '../../constants';
import CampaignMap from './CampaignMap';

const CampaignAdress = ({ label, campaignInfo, setCampaignInfo }) => {
  const theme = useTheme();
  const ipinfo = useSelector(state => state?.lovs?.lovs?.ipinfo);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [addressList, setAddressList] = useState([]);
  const [isMapVisible, setIsMapVisible] = useState(false);

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

  const fetchAdressList = async q => {
    setLoading(true);
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
      setLoading(false);
    }
  };
  const onAdressClick = item => {
    setCampaignInfo(prev => ({
      ...prev,
      locations: [
        ...(prev.locations || []),
        {
          AreaName: item?.display_name || '',
          lat: item?.lat,
          lng: item?.lon,
          radius: campaignInfo?.radius,
        },
      ],
    }));
    setQuery('');
    setAddressList([]);
  };
  return (
    <View>
      {label ? (
        <Text style={[styles.label, { color: theme.textColor }]}>{label}</Text>
      ) : null}

      <View style={styles.wrapper}>
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
          {loading && (
            <ActivityIndicator
              style={styles.loader}
              size={'small'}
              color={theme.selectedCheckBox}
            />
          )}
          {query && !loading && (
            <TouchableOpacity
              style={styles.crossIcon}
              onPress={() => setQuery('')}
            >
              <Icon name="cross" size={18} color={theme.buttonBackColor} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity onPress={() => setIsMapVisible(true)}>
          <FontAwesomeIcon
            name="map-marked-alt"
            size={28}
            color={theme.textColor}
          />
        </TouchableOpacity>
        <CampaignMap
          isOpen={isMapVisible}
          toggleOpen={() => setIsMapVisible(prev => !prev)}
          campaignInfo={campaignInfo}
          setCampaignInfo={setCampaignInfo}
        />
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
              style={[styles.seprator, { backgroundColor: theme.lightGray }]}
            />
          }
          nestedScrollEnabled
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onAdressClick(item)}>
              <Text style={[{ color: theme.textColor, fontWeight: 'bold' }]}>
                {item?.name}
              </Text>
              <Text style={[{ color: theme.lightGray, fontSize: 12 }]}>
                {item?.display_name}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      {campaignInfo?.locations?.length > 0 && (
        <View style={styles.bubblesContainer}>
          {campaignInfo?.locations?.map((cl, index) => (
            <View
              key={index}
              style={[
                styles.bubble,
                { backgroundColor: theme.selectedCheckBox },
              ]}
            >
              <Text
                ellipsizeMode="tail"
                numberOfLines={1}
                style={{ color: theme.textColor, width: 150 }}
              >
                {cl?.AreaName}
              </Text>
              <TouchableOpacity
                // style={styles.crossIcon}
                onPress={() =>
                  setCampaignInfo(prev => ({
                    ...prev,
                    locations: prev.locations.filter((_, i) => i !== index),
                  }))
                }
              >
                <Icon name="cross" size={18} color={theme.textColor} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default CampaignAdress;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  bubblesContainer: {
    flexDirection: 'row',
    columnGap: 5,
    rowGap: 5,
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  bubble: { padding: 5, borderRadius: 6, flexDirection: 'row' },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
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
