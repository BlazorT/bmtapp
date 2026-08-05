import CheckBox from '@react-native-community/checkbox';
import React, { useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import RadioForm from 'react-native-simple-radio-buttons';
import AntdIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { useSelector } from 'react-redux';
import { useTheme } from '../../hooks/useTheme';
import RNSButton from '../Button';
import RNSRangeSlider from '../RangeSlider';
import RNSDropDown from '../Dropdown';
import CampaignAttachment from './CampaignAttachment';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import Alert from '../Alert';
import Toast from 'react-native-simple-toast';
import { useNavigation } from '@react-navigation/native';
import {
  CAMPAIGN_INTERESTS,
  GENDER_LIST,
  MAX_AGE,
  MIN_AGE,
} from '../../constants';
import CampaignAddress from './CampaignAdress';
import Icon from 'react-native-vector-icons/MaterialIcons'; // or your preferred icon set

// Reduces font size by 2 on iOS
const fs = size => (Platform.OS === 'ios' ? size - 2 : size);

const CampaignInfo = ({
  campaignInfo,
  setCampaignInfo,
  setIndex,
  orgData,
  setScheduleList,
}) => {
  const theme = useTheme();
  const navigation = useNavigation();

  const [audienceShow, setAudienceShow] = useState(false);
  const [attachmentShow, setAttachmentShow] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showCancelAlert, setShowCancelAlert] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const statusRadioBtns = [
    { value: 1, label: 'Active' },
    { value: 2, label: 'Paused' },
    { value: 3, label: 'Cancelled' },
  ];

  const handleCampaignInfo = (property, value) => {
    setCampaignInfo(prevState => ({
      ...prevState,
      [property]: value,
    }));
  };

  const nextStep = () => {
    if (campaignInfo.template.trim() == '') {
      Toast.show('Please enter campaign title');
      return;
    }
    if (campaignInfo.campaignStartDate == '') {
      Toast.show('Please select valid campaign start date');
      return;
    }
    if (campaignInfo.campaignEndDate == '') {
      Toast.show('Please select valid campaign end date');
      return;
    }

    setIndex(1);
  };

  const getHashtagsArray = () => {
    if (!campaignInfo.hashtag) return [];
    return campaignInfo.hashtag.split(',').filter(tag => tag.trim() !== '');
  };

  const handleTextChange = text => {
    setInputValue(text);

    // Check if user entered a comma
    if (text.endsWith(',')) {
      const newTag = text.slice(0, -1).trim();

      if (newTag) {
        // Get existing hashtags
        const existingTags = getHashtagsArray();

        // Add new tag if it doesn't exist
        if (!existingTags.includes(newTag)) {
          const updatedHashtags = [...existingTags, newTag].join(',');
          handleCampaignInfo('hashtag', updatedHashtags);
        }
      }

      // Clear input
      setInputValue('');
    }
  };

  const removeHashtag = tagToRemove => {
    const existingTags = getHashtagsArray();
    const updatedTags = existingTags.filter(tag => tag !== tagToRemove);
    handleCampaignInfo('hashtag', updatedTags.join(','));
  };

  const hashtags = getHashtagsArray();

  return (
    <View style={{ width: '100%', marginTop: 10, rowGap: 10 }}>
      <Alert
        massagetype={'warning'}
        hide={() => setShowCancelAlert(false)}
        confirm={() => {
          setShowCancelAlert(false);
          navigation.goBack();
          setCampaignInfo({
            id: 0,
            subject: '',
            hashtag: '',
            template: '',
            country: '',
            state: '',
            campaignStartDate: moment().local().startOf('day').format(),
            campaignEndDate: '',
            status: 1,
            autoLead: false,
            image: '',
            video: '',
            pdf: '',
            networks: [],
            schedules: [],
            totalBudget: 0,
            discount: 0,
          });
          setScheduleList({
            CompaignNetworks: [],
            id: 0,
            budget: 0,
            rowVer: 0,
            messageCount: 0,
            orgId: 0,
            days: [],
            networkId: 0,
            compaignDetailId: 0,
            isFixedTime: 1,
            startTime: campaignInfo.campaignStartDate,
            finishTime: campaignInfo.campaignEndDate,
            interval: 0,
            status: 1,
            intervalTypeId: 0,
            randomId: Math.floor(100000 + Math.random() * 900000),
          });
        }}
        Visible={showCancelAlert}
        alerttype={'confirmation'}
        Title={'Confirmation'}
        Massage={'Do you want to discard?'}
      ></Alert>
      {!orgData?.signature ? (
        <Text
          style={{
            fontSize: fs(12),
            color: theme.selectedCheckBox,
            fontStyle: 'italic',
          }}
        >
          Note : Campaign will be auto activated once admin sign the contract!!!
        </Text>
      ) : null}
      <TextInput
        placeholder="Title / short description..."
        placeholderTextColor={theme.placeholderColor}
        value={campaignInfo.template}
        onChangeText={value => handleCampaignInfo('template', value)}
        style={{
          width: '100%',
          backgroundColor: theme.inputBackColor,
          color: theme.textColor,
          borderRadius: 6,
          paddingHorizontal: 10,
          fontSize: fs(16),
          borderColor: '#ff00003d',
          borderWidth: 1,
          height: 45,
        }}
      />
      <View style={styles.container}>
        {/* Display hashtags as chips */}
        {hashtags.length > 0 && (
          <View style={styles.tagsContainer}>
            {hashtags.map((tag, index) => (
              <View
                key={index}
                style={[styles.tag, { backgroundColor: theme.inputBackColor }]}
              >
                <Text
                  style={[
                    styles.tagText,
                    { color: theme.textColor, fontSize: fs(14) },
                  ]}
                >
                  #{tag}
                </Text>
                <TouchableOpacity
                  onPress={() => removeHashtag(tag)}
                  style={styles.removeButton}
                >
                  <Icon name="close" size={16} color={theme.textColor} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Input field */}
        <TextInput
          placeholder="Hashtag (type and press comma)"
          placeholderTextColor={theme.placeholderColor}
          value={inputValue}
          onChangeText={handleTextChange}
          style={{
            width: '100%',
            backgroundColor: theme.inputBackColor,
            color: theme.textColor,
            borderRadius: 6,
            paddingHorizontal: 10,
            fontSize: fs(16),
            borderColor: '#ff00003d',
            borderWidth: 1,
            height: 45,
          }}
        />
      </View>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        onPress={() => setAudienceShow(prevState => !prevState)}
      >
        <Text
          style={{
            color: theme.textColor,
            fontSize: fs(18),
            fontWeight: 'bold',
          }}
        >
          Audience
        </Text>
        <AntdIcon
          name={audienceShow ? 'downcircle' : 'upcircle'}
          size={22}
          color={theme.tintColor}
        />
      </TouchableOpacity>
      {audienceShow && (
        <>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              alignItems: 'center',
              columnGap: 0,
            }}
          >
            <RNSRangeSlider
              disableRange={true}
              min={1}
              max={500}
              step={1}
              low={campaignInfo.radius}
              high={500}
              onChange={(low, high) => {
                setCampaignInfo(prev => {
                  if (prev.radius === low) {
                    return prev;
                  }
                  return { ...prev, radius: low };
                });
              }}
              label={'Radius (km)'}
              sliderLength={150}
            />
            <RNSRangeSlider
              min={MIN_AGE}
              max={MAX_AGE}
              step={1}
              minRange={5}
              low={campaignInfo.minAge}
              high={campaignInfo.maxAge}
              onChange={(low, high) => {
                setCampaignInfo(prev => {
                  if (prev.minAge === low && prev.maxAge === high) {
                    return prev;
                  }
                  return { ...prev, minAge: low, maxAge: high };
                });
              }}
              label={'Age'}
              sliderLength={180}
            />
          </View>
          <CampaignAddress
            campaignInfo={campaignInfo}
            setCampaignInfo={setCampaignInfo}
          />
          <RNSDropDown
            items={GENDER_LIST}
            selectedIndex={campaignInfo.genderId}
            onSelect={value => handleCampaignInfo('genderId', value)}
            style={{
              width: '100%',
              backgroundColor: theme.inputBackColor,
              color: theme.textColor,
              borderRadius: 6,
              paddingHorizontal: 10,
              fontSize: fs(16),
              borderColor: '#ff00003d',
              borderWidth: 1,
            }}
            placeholder="Select Gender..."
            clearTextOnFocus={true}
            keyboardAppearance={'dark'}
          />
          <RNSDropDown
            items={CAMPAIGN_INTERESTS}
            selectedIndex={campaignInfo.interests}
            multipleSelect
            onSelect={value => {
              const current = campaignInfo.interests || [];
              const exists = current.includes(value);

              handleCampaignInfo(
                'interests',
                exists ? current.filter(v => v !== value) : [...current, value],
              );
            }}
            style={{
              width: '100%',
              backgroundColor: theme.inputBackColor,
              color: theme.textColor,
              borderRadius: 6,
              paddingHorizontal: 10,
              fontSize: fs(16),
              borderColor: '#ff00003d',
              borderWidth: 1,
            }}
            placeholder="Select Interests..."
            clearTextOnFocus={true}
            keyboardAppearance={'dark'}
          />
        </>
      )}
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 6,
        }}
        onPress={() => setAttachmentShow(prevState => !prevState)}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            style={{
              color: theme.textColor,
              fontSize: fs(18),
              fontWeight: 'bold',
              marginRight: 10,
            }}
          >
            Attachments
          </Text>
          <EntypoIcon name={'attachment'} size={22} color={theme.tintColor} />
        </View>
        <AntdIcon
          name={attachmentShow ? 'downcircle' : 'upcircle'}
          size={22}
          color={theme.tintColor}
        />
      </TouchableOpacity>
      {attachmentShow && (
        <CampaignAttachment
          campaignInfo={campaignInfo}
          handleCampaignInfo={handleCampaignInfo}
        />
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 6,
        }}
      >
        <TouchableOpacity
          onPress={() => setShowStartDatePicker(true)}
          style={{
            backgroundColor: theme.inputBackColor,
            width: '48%',
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderRadius: 6,
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: '#ff00003d',
            borderWidth: 1,
          }}
        >
          <Text style={{ color: theme.textColor, fontSize: fs(17) }}>
            {campaignInfo.campaignStartDate
              ? moment(campaignInfo.campaignStartDate).format('DD-MM-YYYY')
              : 'Start Time'}
          </Text>
        </TouchableOpacity>
        <DateTimePicker
          isVisible={showStartDatePicker}
          minimumDate={new Date()}
          maximumDate={
            campaignInfo.campaignEndDate !== ''
              ? new Date(campaignInfo.campaignEndDate)
              : new Date(new Date().setMonth(new Date().getMonth() + 4))
          }
          date={
            campaignInfo.campaignStartDate !== ''
              ? new Date(campaignInfo.campaignStartDate)
              : new Date()
          }
          mode="date"
          onConfirm={date => {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0); // start of selected day
            handleCampaignInfo('campaignStartDate', startOfDay);
            setShowStartDatePicker(false);
          }}
          onCancel={() => setShowStartDatePicker(false)}
          pickerStyleIOS={{
            backgroundColor: theme.cardBackColor,
          }}
          textColor={theme.textColor}
          buttonTextColorIOS={theme.textColor}
          pickerContainerStyleIOS={{
            backgroundColor: theme.cardBackColor,
          }}
          customCancelButtonIOS={e => {
            return (
              <TouchableOpacity
                onPress={() => setShowStartDatePicker(false)}
                style={{
                  width: '100%',
                  backgroundColor: theme.cardBackColor,
                  borderRadius: 10,
                  paddingVertical: 15,
                }}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: fs(20),
                    color: theme.textColor,
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            );
          }}
        />
        <TouchableOpacity
          onPress={() => setShowEndDatePicker(true)}
          style={{
            backgroundColor: theme.inputBackColor,
            width: '48%',
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderRadius: 6,
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: '#ff00003d',
            borderWidth: 1,
          }}
        >
          <Text style={{ color: theme.textColor, fontSize: fs(17) }}>
            {campaignInfo.campaignEndDate
              ? moment(campaignInfo.campaignEndDate).format('DD-MM-YYYY')
              : 'End Time'}
          </Text>
          <DateTimePicker
            isVisible={showEndDatePicker}
            minimumDate={new Date(campaignInfo.campaignStartDate)}
            mode="date"
            date={
              campaignInfo.campaignEndDate !== ''
                ? new Date(campaignInfo.campaignEndDate)
                : new Date()
            }
            onConfirm={date => {
              const endOfDay = new Date(date);
              endOfDay.setHours(23, 59, 59, 999); // end of selected day

              handleCampaignInfo('campaignEndDate', endOfDay);
              setShowEndDatePicker(false);
            }}
            onCancel={() => setShowEndDatePicker(false)}
            pickerStyleIOS={{
              backgroundColor: theme.cardBackColor,
            }}
            textColor={theme.textColor}
            buttonTextColorIOS={theme.textColor}
            pickerContainerStyleIOS={{
              backgroundColor: theme.cardBackColor,
            }}
            customCancelButtonIOS={e => {
              return (
                <TouchableOpacity
                  onPress={() => setShowEndDatePicker(false)}
                  style={{
                    width: '100%',
                    backgroundColor: theme.cardBackColor,
                    borderRadius: 10,
                    paddingVertical: 15,
                  }}
                >
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: fs(20),
                      color: theme.textColor,
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          backgroundColor: theme.inputBackColor,
          borderRadius: 6,
          padding: 10,
        }}
      >
        <RadioForm
          items={statusRadioBtns}
          withLabels={true}
          value={campaignInfo.status}
          setValue={value => handleCampaignInfo('status', value)}
          buttonOuterColor={theme.selectedCheckBox}
          defaultButtonColor={theme.selectedCheckBox}
          buttonOuterSize={30}
          buttonInnerColor={theme.selectedCheckBox}
          disabled={campaignInfo?.id === 0}
          buttonInnerSize={26}
          radioFormStyle={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
          radioButtonItemStyle={{
            width: 110,
          }}
          radioButtonLabelStyle={{
            fontSize: fs(16),
            color: theme.textColor,
          }}
        />
      </View>
      <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text
          style={{ color: theme.textColor, fontSize: fs(18), marginRight: 20 }}
        >
          Auto Generate Lead
        </Text>
        <CheckBox
          value={campaignInfo.autoLead}
          tintColors={{
            true: theme.selectedCheckBox,
            false: theme.buttonBackColor,
          }}
          style={{ transform: [{ scale: Platform.OS === 'ios' ? 0.8 : 1.3 }] }}
          boxType={'square'}
          onValueChange={value => handleCampaignInfo('autoLead', value)}
        />
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 10,
        }}
      >
        <RNSButton
          style={{ width: '46%' }}
          bgColor={theme.buttonBackColor}
          caption="Cancel"
          onPress={() => setShowCancelAlert(true)}
        />
        <RNSButton
          style={{ width: '46%' }}
          bgColor={theme.buttonBackColor}
          caption="Next"
          onPress={nextStep}
        />
      </View>
    </View>
  );
};

export default CampaignInfo;
const THUMB_RADIUS = 10;
const styles = StyleSheet.create({
  slider: {
    marginVertical: 20,
  },
  valueText: {
    color: 'black',
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
    backgroundColor: 'red',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 8,
  },
  container: {
    width: '100%',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingLeft: 12,
    paddingRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ff00003d',
  },
  tagText: {
    fontSize: 14, // handled inline with fs()
    marginRight: 4,
  },
  removeButton: {
    padding: 2,
  },
});
