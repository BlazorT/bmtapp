import React, {useState} from 'react';
import {Text, View} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';
import {colors} from '../styles';
import {useTheme} from '../hooks/useTheme';

const RNSDropDown = ({
  items,
  onSelect,
  style,
  borderColor = colors.borderColor,
  selectedIndex = '',
  placeholder = 'Please Select...',
}) => {
  const [isOpened, setIsOpened] = useState(false);
  const theme = useTheme();
  const openModal = () => {
    setIsOpened(true);
  };

  const closeModal = () => {
    setIsOpened(false);
  };

  return (
    <ModalDropdown
      selectedIndex={selectedIndex}
      options={items}
      onDropdownWillShow={openModal}
      onDropdownWillHide={closeModal}
      dropdownStyle={{
        shadowColor: '#000000',
        backgroundColor: theme.inputBackColor,

        marginHorizontal: 25,
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowRadius: 5,
        shadowOpacity: 1.0,
      }}
      adjustFrame={params => {
        params.left = 0;
        params.right = 0;
        return params;
      }}
      renderRow={(item, index, isSelected) => (
        <View
          style={[
            {paddingHorizontal: 20, paddingVertical: 10},
            isSelected && styles.selectedRow,
          ]}>
          <Text style={{color: theme.textColor}} nativeID={item.id.toString()}>
            {item.name}
          </Text>
        </View>
      )}
      onSelect={onSelect}>
      <View style={[styles.container, style && style, {borderColor}]}>
        <Text
          style={
            selectedIndex == -1
              ? {color: theme.placeholderColor}
              : {color: theme.textColor}
          }>
          {selectedIndex > -1 && items[selectedIndex] != null
            ? items[selectedIndex].name
            : placeholder}
        </Text>
        <Icon
          name={isOpened ? 'angle-up' : 'angle-down'}
          color={
            selectedIndex == '' || selectedIndex == -1
              ? 'gray'
              : theme.tintColor
          }
          size={20}
          style={styles.icon}
        />
      </View>
    </ModalDropdown>
  );
};

const styles = {
  container: {
    height: 40,
    borderWidth: 1,
    backgroundColor: colors.blue,
    borderColor: colors.borderColor,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    flexDirection: 'row',
    borderRadius: 5,
  },
  icon: {
    marginLeft: 10,
  },
  selectedRow: {
    backgroundColor: 'blue', // Change the background color for selected item
  },
};

export default RNSDropDown;
