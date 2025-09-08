import React, { memo, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RangeSlider from 'react-native-sticky-range-slider';
import { useTheme } from '../hooks/useTheme';

const THUMB_RADIUS = 10;

const RNSRangeSlider = ({
  min,
  max,
  step = 1,
  minRange = 1,
  low,
  high,
  onChange,
  label, // ✅ optional label
  disableRange,
}) => {
  const theme = useTheme();

  const Thumb = useCallback(
    () => (
      <View
        style={[
          styles.thumb,
          {
            backgroundColor: theme.buttonBackColor,
            borderColor: theme.buttonBackColor,
          },
        ]}
      />
    ),
    [theme],
  );

  const Rail = useCallback(() => <View style={styles.rail} />, []);
  const RailSelected = useCallback(
    () => (
      <View
        style={[
          styles.railSelected,
          { backgroundColor: theme.selectedCheckBox },
        ]}
      />
    ),
    [theme],
  );

  const renderLowValue = useCallback(
    value => (
      <Text style={[styles.valueText, { color: theme.textColor }]}>
        {value}
      </Text>
    ),
    [theme],
  );

  const renderHighValue = useCallback(
    value => (
      <Text style={[styles.valueText, { color: theme.textColor }]}>
        {value === max ? `+${value}` : value}
      </Text>
    ),
    [theme, max],
  );

  return (
    <View style={styles.wrapper}>
      {label ? (
        <Text style={[styles.label, { color: theme.textColor }]}>{label}</Text>
      ) : null}

      <RangeSlider
        disableRange={disableRange}
        style={styles.slider}
        min={min}
        max={max}
        step={step}
        minRange={minRange}
        low={low}
        high={high}
        onValueChanged={onChange}
        renderLowValue={renderLowValue}
        renderHighValue={renderHighValue}
        renderThumb={Thumb}
        renderRail={Rail}
        renderRailSelected={RailSelected}
      />
    </View>
  );
};

export default RNSRangeSlider;

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 0,
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 18,
  },
  slider: {
    marginVertical: 0,
    marginRight: 0,
  },
  valueText: {
    fontSize: 12,
    fontWeight: '500',
  },
  thumb: {
    width: THUMB_RADIUS * 2,
    height: THUMB_RADIUS * 2,
    borderRadius: THUMB_RADIUS,
    borderWidth: 3,
  },
  rail: {
    flex: 1,
    height: 3,
    borderRadius: 3,
    backgroundColor: 'grey',
  },
  railSelected: {
    height: 3,
  },
});
