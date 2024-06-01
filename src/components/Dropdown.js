import React from 'react';
import {Text, View} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';
import {colors} from '../styles';
class RNSDropDown extends React.Component {
  static defaultProps = {
    placeholder: 'Please Select...',
    selectedIndex: -1,
    color: 'green',
    borderColor: colors.borderColor,
    selectedvalue: 0,
  };
  if(highlighted) {
    rowStyle.push(styles.selectedRow); // Apply custom style to selected item
  }
  state = {
    isOpened: false,
  };
  _openModal = () => {
    this.setState({isOpened: true});
  };
  _closeModal = () => {
    this.setState({isOpened: false});
  };
  render() {
    // console.log('this.props.style',this.props.style.borderColor);

    const {
      items,
      color,
      onSelect,
      style,
      borderColor,
      selectedIndex,
      selectedvalue,
      placeholder,
    } = this.props;

    return (
      <ModalDropdown
        selectedIndex={selectedIndex}
        options={items}
        onDropdownWillShow={this._openModal}
        onDropdownWillHide={this._closeModal}
        dropdownStyle={{
          shadowColor: '#000000',
          backgroundColor: colors.TextBoxContainer,
          //backgroundColor:'#2c2b2b',
          //width:60 + '%',
          marginHorizontal: 25,
          //opacity: 0.8,
          // shadowColor: 'black',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowRadius: 5,
          shadowOpacity: 1.0,
        }}
        adjustFrame={params => {
          // eslint-disable-next-line no-param-reassign
          params.left = 0;
          // eslint-disable-next-line no-param-reassign
          params.right = 0;
          return params;
        }}
        renderRow={item => (
          <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
            <Text
              style={{color: colors.TextBoxPlaceholderColor}}
              nativeID={item.id.toString()}
            >
              {item.name}
            </Text>
          </View>
        )}
        onSelect={onSelect}
      >
        <View style={[styles.container, style && style, {borderColor}]}>
          <Text
            style={
              selectedIndex == -1
                ? {color: colors.TextBoxColor}
                : {color: colors.TextBoxPlaceholderColor}
            }
          >
            {selectedIndex > -1 && items[selectedIndex] != null
              ? items[selectedIndex].name
              : placeholder}
          </Text>
          <Icon
            name={this.state.isOpened ? 'angle-up' : 'angle-down'}
            color={selectedIndex == -1 ? 'gray' : '#ffff'}
            size={20}
            style={styles.icon}
          />
        </View>
      </ModalDropdown>
    );
  }
}
const styles = {
  container: {
    height: 40,
    borderWidth: 1,
    backgroundcolor: colors.blue,
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
