import {Header, createStackNavigator} from '@react-navigation/stack';
import React, {useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useGlobal} from 'reactn';
import {colors} from '../../styles';
import StackNavigationData from './stackNavigationData';
const Stack = createStackNavigator();
global.SampleVar = 0;
export default function NavigatorView(props) {
  const [Visible, setVisible] = useState(false);
  const [global, setGlobal] = useGlobal('false');
  const VisibleSidebarr = () => {
    if (Visible == false) {
      setGlobal({num: 1});
    }
    if (Visible == true) {
      setGlobal({num: 0});
    }
  };
  const headerRightComponentMenu = () => {
    return (
      <TouchableOpacity
        onPress={() => VisibleSidebarr()}
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        <Icon name="search" style={styles.imageStyle} />
      </TouchableOpacity>
    );
  };

  const headerLeftComponentMenu = () => {
    return (
      <TouchableOpacity
        onPress={() => props.navigation.toggleDrawer()}
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        <Image
          source={require('../../../assets/images/drawer/menu.png')}
          resizeMode="contain"
          style={{
            height: 20,
            tintColor: colors.NavbarTextColor,
          }}
        />
      </TouchableOpacity>
    );
  };
  //item.name
  return (
    <Stack.Navigator>
      {StackNavigationData.map((item, idx) => (
        <Stack.Screen
          key={`stack_item-${idx + 1}`}
          name={item.name}
          component={item.component}
          options={{
            headerLeft: item.headerLeft || headerLeftComponentMenu,
            headerBackground: () => <View style={styles.headerImage}></View>,
            // headerRight: headerRightComponentMenu,
            headerTitleStyle: item.headerTitleStyle,
          }}
        />
      ))}
    </Stack.Navigator>
  );
}
// <Image style={styles.headerImage} source={item.headerBackground.source} />
const styles = StyleSheet.create({
  headerImage: {
    backgroundColor: colors.TopNavbar,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 100 + '%',
    height: Header.height,
  },
  imageStyle: {
    //margin:5,
    fontSize: 25,
    color: colors.NavbarTextColor,
  },
});
