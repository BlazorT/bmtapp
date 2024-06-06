import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {Image, Platform, StyleSheet, Text, View} from 'react-native';
import AntdIcon from 'react-native-vector-icons/AntDesign';
import {useTheme} from '../../hooks/useTheme';
import {useUser} from '../../hooks/useUser';
import {colors} from '../../styles';
import tabNavigationData from './tabNavigationData';
const Tab = createBottomTabNavigator();
export default function BottomTabs() {
  const {isAuthenticated} = useUser();
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 90 : 50,
          backgroundColor: theme.navBarBack,
        },

        headerShown: false,
      }}>
      {tabNavigationData.map((item, idx) =>
        item.name == 'Campaign (+)' ? (
          isAuthenticated && (
            <Tab.Screen
              key={`tab_item${idx + 1}`}
              name={item.name}
              component={item.component}
              options={{
                tabBarIcon: ({focused}) => (
                  <>
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
                          {
                            tintColor: !focused ? 'gray' : theme.tintColor,
                          },
                        ]}
                      />
                    )}
                  </>
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
          )
        ) : (
          <Tab.Screen
            key={`tab_item${idx + 1}`}
            name={item.name}
            component={item.component}
            options={{
              tabBarIcon: ({focused}) => (
                <>
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
                        {
                          tintColor: !focused ? 'gray' : theme.tintColor,
                        },
                      ]}
                    />
                  )}
                </>
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
        ),
      )}
    </Tab.Navigator>
  );
}
const styles = StyleSheet.create({
  tabBarIcon: {
    width: 28,
    height: 28,
  },
});
