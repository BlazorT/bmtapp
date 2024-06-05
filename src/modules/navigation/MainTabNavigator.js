import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Image, Platform, StyleSheet, Text, View} from 'react-native';
import AntdIcon from 'react-native-vector-icons/AntDesign';
import {useTheme} from '../../hooks/useTheme';
import {useUser} from '../../hooks/useUser';
import {colors} from '../../styles';
import TabNavigator from './TabNavigator';
import tabNavigationData from './tabNavigationData';
const Tab = createBottomTabNavigator();
export default function BottomTabs() {
  const isFocused = useIsFocused();
  const {user, isAuthenticated} = useUser();
  const theme = useTheme();
  const [Data, setData] = useState(null);
  useEffect(() => {
    if (isAuthenticated) setData(user);
    else setData(null);
  }, [isFocused]);
  if (Data == null) {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            height: Platform.OS === 'ios' ? 90 : 50,
            backgroundColor: theme.navBarBack,
          },
          headerShown: false,
        }}>
        {TabNavigator.map((item, idx) => (
          <Tab.Screen
            key={`tab_item${idx + 1}`}
            name={item.name}
            component={item.component}
            options={{
              tabBarIcon: ({focused}) => (
                <View style={styles.tabBarItemContainer}>
                  {item.name === 'About' ? (
                    <AntdIcon
                      name="infocirlceo"
                      size={28}
                      color={!focused ? 'gray' : theme.tintColor}
                    />
                  ) : (
                    <Image
                      resizeMode="contain"
                      source={item.icon}
                      style={[
                        styles.tabBarIcon,
                        focused && styles.tabBarIconFocused,
                        {
                          tintColor: !focused ? 'gray' : theme.tintColor,
                        },
                      ]}
                    />
                  )}
                </View>
              ),
              tabBarLabel: ({focused}) => (
                <Text
                  style={{
                    fontSize: 12,
                    bottom: 2,
                    color: focused ? theme.textColor : 'gray',
                  }}>
                  {item.name}
                </Text>
              ),
            }}
          />
        ))}
      </Tab.Navigator>
    );
  }
  if (Data != null) {
    //{item.name}
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            height: Platform.OS === 'ios' ? 90 : 50,
            backgroundColor: theme.navBarBack,
          },
          headerShown: false,
        }}>
        {tabNavigationData.map((item, idx) => (
          <Tab.Screen
            key={`tab_item${idx + 1}`}
            name={item.name}
            component={item.component}
            options={{
              tabBarIcon: ({focused}) => (
                <View style={styles.tabBarItemContainer}>
                  {item.name === 'About' ? (
                    <AntdIcon
                      name="infocirlceo"
                      size={28}
                      color={!focused ? 'gray' : theme.tintColor}
                    />
                  ) : (
                    <Image
                      resizeMode="contain"
                      source={item.icon}
                      style={[
                        styles.tabBarIcon,
                        focused && styles.tabBarIconFocused,
                        {
                          tintColor: !focused ? 'gray' : theme.tintColor,
                        },
                      ]}
                    />
                  )}
                </View>
              ),
              tabBarLabel: ({focused}) => (
                <Text
                  style={{
                    fontSize: 12,
                    bottom: 2,
                    color: focused ? theme.textColor : 'gray',
                  }}>
                  {item.name}
                </Text>
              ),
            }}
          />
        ))}
      </Tab.Navigator>
    );
  }
}
//colors.LabelColor
//colors.BottomSelectColor
const styles = StyleSheet.create({
  tabBarItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    bottom: Platform.OS === 'ios' ? -5 : 0,
  },
  tabBarIcon: {
    tintColor: 'gray',
    //  color:colors.LabelColor,
    width: 28,
    height: 28,
  },
  tabBarIconFocused: {
    tintColor: colors.NavbarTextColor,
  },
});
