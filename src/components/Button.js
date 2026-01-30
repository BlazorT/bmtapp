import React from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, fonts } from '../styles';
const borderRadius = 40;

export default function RNSButton(props) {
  const caption = props.caption || props.caption.toUpperCase();
  let icon;
  if (props.icon) {
    icon = (
      <Image resizeMode="contain" source={props.icon} style={styles.icon} />
    );
  }
  if (props.nIcon) {
    icon = props.nIcon;
  }

  let content;

  const borderedStyle = [
    styles.button,
    styles.primaryButton,
    props.small && styles.buttonSmall,
    props.bordered && styles.border,
    props.primary && {
      borderColor: colors.bgColor,
    },
    props.secondary && {
      borderColor: colors.bgColor,
    },
    props.bgColor && {
      backgroundColor: props.bgColor,
    },
    props.rounded && styles.rounded,
  ];
  const textStyle = [
    styles.caption,
    props.small && styles.captionSmall,
    styles.secondaryCaption,
    icon && styles.captionWithIcon,
    props.primary && {
      color: colors.primary,
    },
    props.secondary && {
      color: colors.secondary,
    },
    props.bgColor && {},
    props.textColor && {
      color: props.textColor,
    },
  ];

  content = (
    <View style={borderedStyle}>
      {icon && <View>{icon}</View>}
      {props.loading && <ActivityIndicator color="white" />}
      {!props.loading && props.caption && (
        <Text style={textStyle}>{caption}</Text>
      )}
      {props.children && props.children}
    </View>
  );
  // else {
  //   const isPrimary = props.primary || (!props.primary && !props.secondary);
  //   let gradientArray =
  //     props.bgGradientStart && props.bgGradientEnd
  //       ? [props.bgGradientStart, props.bgGradientEnd]
  //       : undefined;

  //   if (!gradientArray) {
  //     gradientArray = isPrimary
  //       ? [colors.primaryGradientStart, colors.primaryGradientEnd]
  //       : [colors.secondaryGradientStart, colors.secondaryGradientEnd];
  //   }

  //   if (props.bgColor) {
  //     gradientArray = [props.bgColor, props.bgColor];
  //   }

  //   content = (
  //     <LinearGradient
  //       start={{ x: 0.5, y: 1 }}
  //       end={{ x: 1, y: 1 }}
  //       colors={gradientArray}
  //       style={[
  //         styles.button,
  //         props.small && styles.buttonSmall,
  //         styles.primaryButton,
  //         props.rounded && { borderRadius },
  //         props.action && styles.action,
  //       ]}
  //     >
  //       {icon && <View>{icon}</View>}
  //       {props.loading && <ActivityIndicator color="white" />}
  //       {!props.loading && props.caption && (
  //         <Text
  //           style={[
  //             styles.caption,
  //             props.small && styles.captionSmall,
  //             icon && styles.captionWithIcon,
  //             styles.primaryCaption,
  //             props?.textStyle && props.textStyle,
  //           ]}
  //         >
  //           {caption}
  //         </Text>
  //       )}
  //       {!props.loading && props.children && props.children}
  //     </LinearGradient>
  //   );
  // }

  return (
    <TouchableOpacity
      accessibilityTraits="button"
      onPress={props.onPress}
      disabled={props.disabled}
      activeOpacity={0.8}
      style={[
        styles.container,
        props.small && styles.containerSmall,
        props.large && styles.containerLarge,
        props.style,
      ]}
    >
      {content}
    </TouchableOpacity>
  );
}

const HEIGHT = 45;
const HEIGHT_SMALL = 40;
const HEIGHT_LARGE = 60;

const styles = StyleSheet.create({
  container: {
    height: HEIGHT,
    width: '100%',
  },
  containerSmall: {
    height: HEIGHT_SMALL,
  },
  containerLarge: {
    height: HEIGHT_LARGE,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10, // Consistent padding for both platforms
    paddingVertical: 0, // Remove vertical padding to maintain height
  },
  buttonSmall: {
    paddingHorizontal: 15, // Consistent padding for small buttons
  },
  border: {
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 5,
  },
  primaryButton: {
    borderRadius: 5,
  },
  rounded: {
    borderRadius: HEIGHT_LARGE / 2,
  },
  fullrounded: {
    borderRadius: HEIGHT_LARGE / 5,
  },
  icon: {
    maxHeight: HEIGHT - 20,
    maxWidth: HEIGHT - 20,
  },
  caption: {
    letterSpacing: 1,
    fontSize: 18,
    fontFamily: fonts.primaryBold,
    textAlign: 'center', // Center text properly
  },
  captionSmall: {
    fontSize: 15,
    color: '#a2a2a2',
  },
  captionWithIcon: {
    marginLeft: 6, // Consistent spacing with icon for both platforms
  },
  primaryCaption: {
    color: 'white',
  },
  secondaryCaption: {
    color: 'white',
    backgroundColor: 'transparent',
  },
  action: {
    borderRadius: 20,
    height: HEIGHT,
    width: HEIGHT,
    paddingHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
