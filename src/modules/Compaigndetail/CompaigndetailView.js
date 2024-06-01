import {useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Breadcrumb from 'react-native-breadcrumb';
import Spinner from 'react-native-loading-spinner-overlay';
import Compaigndetail from '../../components/Compaigndetail';
import {colors} from '../../styles';
const crumbsContainerStyle = {
  backgroundColor: '#181e5c',
  flexDirection: 'row',
  borderWidth: 1,
  borderColor: '#d6d6d6',
  justifyContent: 'space-between',
  width: Dimensions.get('window').width,
};
const crumbStyle = {
  flexDirection: 'row',
  justifyContent: 'center',
  backgroundColor: 'transparent',
};
const activeCrumbStyle = {
  backgroundColor: 'gray',
  borderColor: '#010c1f',
};
const crumbTextStyle = {
  color: 'white',
  fontSize: 14,
  fontWeight: 'bold',
};
const activeCrumbTextStyle = {
  color: 'white',
  fontSize: 15,
  fontWeight: 'bold',
};
const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};
var canceltime = 40;
export default function CompaigndetailScreen(props) {
  const route = useRoute();
  global.currentscreen = route.name;
  const [Index, setIndex] = useState(0);
  const [Visible, setVisible] = useState(false);
  //const [data, setdata] = useState();
  const [storeid, setstoreid] = useState(0);
  const [status, setstatus] = useState(1);
  const [ordertime, setordertime] = useState(null);
  const [timeintervel, settimeintervel] = useState(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [spinner, setspinner] = useState(false);
  const data = [{name: '1'}, {name: '1'}, {name: '1'}];
  function handlePress(index) {
    setIndex(index);
  }
  useEffect(() => {}, []);
  return (
    <View style={styles.container}>
      <Spinner
        visible={spinner}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
      />
      <TouchableOpacity>
        <Breadcrumb
          entities={['Success', 'In Progress', 'Failed']}
          crumbsContainerStyle={crumbsContainerStyle}
          crumbStyle={crumbStyle}
          activeCrumbStyle={activeCrumbStyle}
          crumbTextStyle={crumbTextStyle}
          activeCrumbTextStyle={activeCrumbTextStyle}
          isTouchable={true}
          flowDepth={Index}
          height={35}
          onCrumbPress={index => {
            handlePress(index);
          }}
          borderRadius={1}
        />
      </TouchableOpacity>
      <FlatList
        data={data}
        keyExtractor={(item, id) => id.toString()}
        renderItem={({item}) => <Compaigndetail></Compaigndetail>}
        numColumns={1}
        horizontal={false}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BlazorBg,
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
});
