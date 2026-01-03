// components/CampaignAudienceSection.js
import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Dropdown from '../components/Dropdown';
import SearchableDropdown from 'react-native-searchable-dropdown';

const UpArrowIcon = require('../../assets/images/uparrow.png');

export default function CampaignAudienceSection({
  SelectAreaEnabled,
  setSelectAreaEnabled,
  selectCountryVal,
  stateList,
  handleCountrySelect,
  selectCityName,
  selectCityId,
  cityDataList,
  handleCitySelect,
  cityNameAdd,
  setCityNameAdd,
  theme,
}) {
  const containerStyle = { padding: 0, minHeight: 46, maxHeight: 200 };
  const textInputStyle = {
    fontSize: 14,
    color: theme.textColor,
    paddingLeft: 20,
    backgroundColor: theme.inputBackColor,
    width: Dimensions.get('window').width - 20,
    borderRadius: 4,
    height: 42,
    marginTop: 5,
  };

  return (
    <TouchableOpacity
      style={styles.toggleButton}
      onPress={() => setSelectAreaEnabled(!SelectAreaEnabled)}
    >
      <View style={styles.dropdownHeader}>
        <Text style={[styles.heading, { color: theme.textColor }]}>
          Campaign Audience
        </Text>
        <Image
          source={
            SelectAreaEnabled
              ? require('../../assets/images/downarrow.png')
              : UpArrowIcon
          }
          style={[styles.icon, { tintColor: theme.tintColor }]}
        />
      </View>

      {SelectAreaEnabled && (
        <View
          style={[styles.content, { backgroundColor: theme.backgroundColor }]}
        >
          <Dropdown
            placeholderTextColor="gray"
            onSelect={handleCountrySelect}
            selectedIndex={selectCountryVal}
            style={[styles.dropdown, { backgroundColor: theme.inputBackColor }]}
            items={stateList}
            placeholder="Select State..."
            clearTextOnFocus={true}
            keyboardAppearance="dark"
            maxLength={5}
          />

          <SearchableDropdown
            onTextChange={setCityNameAdd}
            onItemSelect={handleCitySelect}
            containerStyle={containerStyle}
            textInputStyle={textInputStyle}
            itemStyle={{
              padding: 0,
              marginTop: 10,
              backgroundColor: theme.inputBackColor,
            }}
            itemTextStyle={{ color: theme.textColor }}
            itemsContainerStyle={{
              width: Dimensions.get('window').width - 20,
              paddingLeft: 20,
              backgroundColor: theme.inputBackColor,
              zIndex: 2,
            }}
            items={cityDataList}
            placeholder={selectCityName || 'Select City...'}
            placeholderTextColor={
              selectCityId ? theme.textColor : theme.placeholderColor
            }
            resPtValue={false}
            underlineColorAndroid="transparent"
          />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  toggleButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  icon: {
    height: 26,
    width: 26,
  },
  content: {
    marginTop: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  dropdown: {
    width: '100%',
    height: 46,
    borderRadius: 4,
    fontSize: 15,
    marginBottom: 6,
    borderWidth: 0,
    paddingLeft: 20,
  },
});
