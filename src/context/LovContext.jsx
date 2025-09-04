import { useDispatch } from 'react-redux';
import useFetchData from '../hooks/useFetchData';
import { createContext, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { setLovs } from '../redux/features/bmtLovs/lovsSlice';
import { useTheme } from '../hooks/useTheme';
import { Button } from '../components';

const apiConfigs = [
  {
    endpoint: 'Blazorapi/orgs',
    method: 'POST',
    body: {
      Id: 0,
      Name: '',
      Status: 0,
    },
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
  },
  {
    endpoint: 'admin/custombundlingdetails',
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
  },
  {
    endpoint: 'Common/cities',
    method: 'POST',
    body: {},
  },
];

const LOVContext = createContext({
  data: null,
});

export const LOVProvider = ({ children }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { data, loading, error, fetchData } = useFetchData(apiConfigs);

  console.log({ data, error, loading });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (loading || error) return;

    dispatch(setLovs(data));
  }, [error, loading, data]);

  if (loading) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.backgroundColor }]}
      >
        <Spinner
          visible={true}
          textContent={'Loading...'}
          textStyle={{ color: theme.textColor }}
        />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.backgroundColor }]}
      >
        <Text style={styles.errorText}>
          Something went wrong fetching LOVs:{' '}
          {error?.message || JSON.stringify(error)}
        </Text>
        <Button
          style={{ width: 'auto', marginTop: 10 }}
          bgColor={theme.buttonBackColor}
          caption="Retry"
          onPress={fetchData}
        />
      </View>
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
    color: 'red',
    fontSize: 18,
    padding: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
});
