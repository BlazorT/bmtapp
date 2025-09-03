import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';

var HEIGHT = 50;
var BACKGROUND_COLOR = '#212121';
var BORDER_COLOR = '#212121';
var COLOR = '#252733';
var TEXT_COLOR = 'white';
var DISABLE_TEXT_COLOR = 'grey';

const AppBreadcrumb = ({
  crumbs,
  onSelect,
  selectedIndex,
  breadcrumbContainer,
  breadcrumbText,
  activeBreadCrumb,
  containerBorderColor,
}) => {
  const theme = useTheme();
  BACKGROUND_COLOR = theme.breadCrumbContainer;
  TEXT_COLOR = theme.acytiveBreadcrumbText;
  COLOR = theme.activeBreadCrumb;
  BORDER_COLOR = theme.containerBorderColor;
  DISABLE_TEXT_COLOR = theme.breadcrumbText;
  const styles = StyleSheet.create({
    breadcrumbContainer: {
      flexDirection: 'row',
      borderRadius: 5, // Rounded corners
      backgroundColor: BACKGROUND_COLOR,
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: BORDER_COLOR,
      width: '100%',
    },
    breadcrumbText: {
      color: DISABLE_TEXT_COLOR, // Dark gray text
      fontSize: 14, // Adjust font size as needed
      fontWeight: 900,
    },
    breadCrumb: {
      flex: 1,
      height: HEIGHT,
      alignItems: 'center',
      justifyContent: 'center',
    },
    selectedBreadCrumb: {
      backgroundColor: COLOR,
      COLOR, // '#010c1f',
      borderColor: '#d6d6d6',
    },

    selectedCrumbText: {
      color: TEXT_COLOR,
      fontWeight: 'bold',
    },
    arrowContainer: {
      position: 'absolute',
      right: -HEIGHT + 0.1,
      zIndex: 1,
    },
    tailContainer: {
      position: 'absolute',
      left: -15,
      zIndex: 1,
    },
    arrow: {
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
    },
    arrowRight: {
      width: 0,
      height: 0,
      borderRightWidth: HEIGHT / 2,
      borderTopWidth: HEIGHT / 2,
      borderBottomWidth: HEIGHT / 2,
      borderRightColor: 'transparent',
      borderTopColor: 'transparent',
      borderBottomColor: 'transparent',
      borderLeftWidth: HEIGHT / 2,
      borderLeftColor: COLOR,
    },
    tail: {
      borderTopColor: 'transparent',
      borderRightColor: COLOR, // Match selected text color
      borderBottomColor: 'transparent', // Match selected text color
      borderLeftColor: COLOR, // Match selected text color
      transform: [{ rotate: '90deg' }],
      borderWidth: HEIGHT / 2,
    },
  });
  return (
    <View style={styles.breadcrumbContainer}>
      {crumbs.map((crumb, index) => (
        <TouchableOpacity
          key={crumb.text}
          onPress={() => onSelect(index)}
          activeOpacity={0.7}
          style={[
            styles.breadCrumb,
            index === selectedIndex && styles.selectedBreadCrumb,
            ,
            {
              marginRight: index === crumbs.length - 1 ? 0 : 12,
            },
          ]}
        >
          {index === selectedIndex && index !== 0 && (
            <View style={styles.tailContainer}>
              <View style={[styles.arrow, styles.tail]} />
            </View>
          )}
          <Text
            style={[
              styles.breadcrumbText,
              index === selectedIndex && [styles.selectedCrumbText],
            ]}
          >
            {crumb.text}
          </Text>
          {index === selectedIndex && index < crumbs.length - 1 && (
            <View style={styles.arrowContainer}>
              <View style={[styles.arrow, styles.arrowRight]} />
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default AppBreadcrumb;
