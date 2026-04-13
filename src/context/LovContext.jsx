import { createContext, useEffect } from 'react';
import {
  ActivityIndicator,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../components';
import { GET_COUNTRY_INFO } from '../constants';
import useFetchData from '../hooks/useFetchData';
import { useTheme } from '../hooks/useTheme';
import { setLovs } from '../redux/features/bmtLovs/lovsSlice';
const profilelogo = require('../../assets/images/BDMT.png');

const apiConfigs = [
  {
    endpoint: 'BlazorApi/orgs',
    method: 'POST',
    body: {
      Id: 0,
      Name: '',
      Status: 0,
    },
    key: 'orgs',
  },
  {
    endpoint: 'Common/lovs',
    method: 'POST',
    body: {
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
    },
    key: 'lovs',
  },
  {
    endpoint: 'Admin/custombundlingdetails',
    method: 'POST',
    body: {
      orgId: '0',
      id: '0',
    },
    key: 'mybundlings',
  },
  {
    endpoint: 'Common/cities',
    method: 'POST',
    body: {},
    key: 'cities',
  },
  {
    endpoint: GET_COUNTRY_INFO,
    method: 'GET',
    body: {},
    key: 'ipinfo',
  },
];

const LOVContext = createContext({
  data: null,
});

export const LOVProvider = ({ children }) => {
  const theme = useTheme();
  const themeMode = useSelector(state => state.theme.mode);
  const isRehydrated = useSelector(state => state._persist?.rehydrated);
  const dispatch = useDispatch();

  const { data, loading, error, fetchData } = useFetchData(apiConfigs);

  useEffect(() => {
    if (!isRehydrated) return; // ✅ wait for store to rehydrate
    fetchData();
  }, [isRehydrated]);

  useEffect(() => {
    if (loading || error) return;

    dispatch(setLovs(data));
  }, [error, loading, data]);

  if (loading) {
    return (
      <>
        <StatusBar
          barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
        />
        <View
          style={[styles.container, { backgroundColor: theme.backgroundColor }]}
        >
          <Image
            source={profilelogo}
            style={{ width: 300, height: 100, marginBottom: 10 }}
          />
          <ActivityIndicator size={'small'} color={theme.textColor} />
          <Text style={styles.errorText}>Initializing App...</Text>
        </View>
      </>
    );
  }

  if (error) {
    return (
      <>
        <StatusBar
          barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
        />
        <View
          style={[styles.container, { backgroundColor: theme.backgroundColor }]}
        >
          <Image source={profilelogo} style={{ width: 300, height: 100 }} />
          <Text style={styles.errorText}>
            We’re having trouble connecting right now. Please check your
            internet connection or try again in a moment.
          </Text>
          <Button
            style={{ width: '50%', marginTop: 10 }}
            bgColor={theme.buttonBackColor}
            caption="Retry"
            onPress={fetchData}
          />
        </View>
      </>
    );
  }

  return <LOVContext.Provider value={data}>{children}</LOVContext.Provider>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'grey',
    fontSize: 18,
    padding: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
});
