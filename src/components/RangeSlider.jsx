import MultiSlider from '@ptomasroos/react-native-multi-slider';
import React, { memo, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
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
  sliderLength = 320,
}) => {
  const theme = useTheme();

  // MultiSlider works with a `values` array instead of separate low/high props.
  const values = disableRange ? [low ?? min] : [low ?? min, high ?? max];

  const handleValuesChangeFinish = useCallback(
    newValues => {
      if (!onChange) return;
      if (disableRange) {
        onChange(newValues[0]);
      } else {
        onChange(newValues[0], newValues[1]);
      }
    },
    [onChange, disableRange],
  );

  const renderCustomLabel = useCallback(
    props => (
      <>
        <View
          style={[
            styles.valueLabelWrap,
            { left: props.oneMarkerLeftPosition - 10 },
          ]}
        >
          <Text style={[styles.valueText, { color: theme.textColor }]}>
            {props.oneMarkerValue}
          </Text>
        </View>
        {!disableRange && (
          <View
            style={[
              styles.valueLabelWrap,
              { left: props.twoMarkerLeftPosition - 10 },
            ]}
          >
            <Text style={[styles.valueText, { color: theme.textColor }]}>
              {props.twoMarkerValue === max
                ? `+${props.twoMarkerValue}`
                : props.twoMarkerValue}
            </Text>
          </View>
        )}
      </>
    ),
    [theme, max, disableRange],
  );

  return (
    <View style={styles.wrapper}>
      {label ? (
        <Text style={[styles.label, { color: theme.textColor }]}>{label}</Text>
      ) : null}

      <MultiSlider
        values={values}
        min={min}
        max={max}
        step={step}
        // Closest MultiSlider equivalent to `minRange`: minimum pixel
        // distance enforced between the two markers.
        minMarkerOverlapDistance={minRange}
        onValuesChangeFinish={handleValuesChangeFinish}
        enabledOne
        enabledTwo={!disableRange}
        allowOverlap={false}
        isMarkersSeparated
        enableLabel
        sliderLength={sliderLength}
        containerStyle={styles.slider}
        trackStyle={{ backgroundColor: theme.darkGray, height: 3 }}
        selectedStyle={[
          styles.railSelected,
          { backgroundColor: theme.selectedCheckBox },
        ]}
        markerStyle={[
          styles.thumb,
          {
            backgroundColor: theme.selectedCheckBox,
            borderColor: theme.selectedCheckBox,
          },
        ]}
        pressedMarkerStyle={[
          styles.thumb,
          {
            backgroundColor: theme.selectedCheckBox,
            borderColor: theme.selectedCheckBox,
          },
        ]}
        customLabel={renderCustomLabel}
      />
    </View>
  );
};

export default memo(RNSRangeSlider);

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
  valueLabelWrap: {
    position: 'absolute',
    top: -20,
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
