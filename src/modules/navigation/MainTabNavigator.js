import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Image, Platform, StyleSheet, Text } from 'react-native';
import AntdIcon from 'react-native-vector-icons/AntDesign';
import { useTheme } from '../../hooks/useTheme';
import { useUser } from '../../hooks/useUser';
import { isAdminOrSuperAdmin } from '../home/HomeView';
import tabNavigationData from './tabNavigationData';
import { isTab } from '../../constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, user } = useUser();
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 90 : isTab ? 70 : 60,
          backgroundColor: theme.navBarBack,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 4,
          // remove marginBottom entirely
        },

        headerShown: false,
      }}
    >
      {tabNavigationData.map((item, idx) =>
        item.name == 'Campaign (+)' ? (
          isAuthenticated &&
          isAdminOrSuperAdmin(user?.roleId) && ( //!!role check for campaigns
            <Tab.Screen
              key={`tab_item${idx + 1}`}
              name={item.name}
              component={item.component}
              options={{
                tabBarIcon: ({ focused }) => (
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
                tabBarLabel: ({ focused }) => (
                  <Text
                    style={{
                      fontSize: Platform.OS === 'ios' ? 9 : 11,
                      bottom: 2,
                      color: focused ? theme.textColor : 'gray',
                    }}
                  >
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
              tabBarIcon: ({ focused }) => (
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
              tabBarLabel: ({ focused }) => (
                <Text
                  style={{
                    fontSize: Platform.OS === 'ios' ? 10 : 11,
                    bottom: 2,
                    color: focused ? theme.textColor : 'gray',
                  }}
                >
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
