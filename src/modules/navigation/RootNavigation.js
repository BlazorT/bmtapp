import {Header, createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import 'react-native-gesture-handler';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import {useDispatch, useSelector} from 'react-redux';
import {useTheme} from '../../hooks/useTheme';
import {toggleTheme} from '../../redux/features/theme/themeSlice';
import {colors} from '../../styles';
import StackNavigationData from './stackNavigationData';

const Stack = createStackNavigator();
global.SampleVar = 0;
export default function NavigatorView(props) {
  const theme = useTheme();

  const headerRightComponentMenu = props => {
    const dispatch = useDispatch();
    const appTheme = useSelector(state => state.theme.mode);

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginRight: 10,
        }}>
        <Text
          style={{
            color: theme.textColor,
            fontSize: 16,
            marginRight: 5,
          }}>
          {appTheme === 'dark' ? 'Dark' : 'Light'}
        </Text>
        <TouchableOpacity onPress={() => dispatch(toggleTheme())}>
          <IconFontAwesome
            name={appTheme == 'dark' ? 'toggle-on' : 'toggle-off'}
            size={28}
            color={theme.textColor}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const headerLeftComponentMenu = () => {
    return (
      <TouchableOpacity
        onPress={() => props.navigation.toggleDrawer()}
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}>
        <Image
          source={require('../../../assets/images/drawer/menu.png')}
          resizeMode="contain"
          style={{
            height: 20,
            tintColor: theme.tintColor,
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
            headerBackground: () => (
              <View
                style={[
                  styles.headerImage,
                  {backgroundColor: theme.navBarBack},
                ]}></View>
            ),
            headerRight: headerRightComponentMenu,
            headerTitleStyle: {
              ...item.headerTitleStyle,
              color: theme.textColor,
            },
          }}
        />
      ))}
    </Stack.Navigator>
  );
}
// <Image style={styles.headerImage} source={item.headerBackground.source} />
const styles = StyleSheet.create({
  headerImage: {
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
