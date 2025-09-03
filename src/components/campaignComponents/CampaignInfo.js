import CheckBox from '@react-native-community/checkbox';
import React, { useState } from 'react';
import {
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
import RNSDropDown from '../Dropdown';
import CampaignAttachment from './CampaignAttachment';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import Alert from '../Alert';
import Toast from 'react-native-simple-toast';

import { useNavigation } from '@react-navigation/native';

const CampaignInfo = ({ campaignInfo, setCampaignInfo, setIndex }) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const lovs = useSelector(state => state.lovs).lovs;

  const [audienceShow, setAudienceShow] = useState(false);
  const [attachmentShow, setAttachmentShow] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showCancelAlert, setShowCancelAlert] = useState(false);

  const statusRadioBtns = [
    { value: 1, label: 'Active' },
    { value: 2, label: 'Paused' },
    { value: 3, label: 'Cancelled' },
  ];

  const handleCampaignInfo = (property, value) => {
    console.log({ property, value });
    setCampaignInfo(prevState => ({
      ...prevState,
      [property]: value,
    }));
  };

  const nextStep = () => {
    if (campaignInfo.subject.trim() == '') {
      Toast.show('Please enter campaign subject');
      return;
    }
    if (campaignInfo.template.trim() == '') {
      Toast.show('Please enter campaign template');
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
  return (
    <View style={{ width: '100%', marginTop: 10, rowGap: 10 }}>
      <Alert
        massagetype={'warning'}
        hide={() => setShowCancelAlert(false)}
        confirm={() => {
          navigation.goBack();
          setCampaignInfo({
            id: 0,
            subject: '',
            hashtag: '',
            template: '',
            country: '',
            state: '',
            campaignStartDate: '',
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
        }}
        Visible={showCancelAlert}
        alerttype={'confirmation'}
        Title={'Confirmation'}
        Massage={'Do you want to discard ?'}
      ></Alert>
      <TextInput
        placeholder="Subject"
        placeholderTextColor={theme.placeholderColor}
        value={campaignInfo.subject}
        onChangeText={value => handleCampaignInfo('subject', value)}
        style={{
          width: '100%',
          backgroundColor: theme.inputBackColor,
          color: theme.textColor,
          borderRadius: 6,
          paddingHorizontal: 10,
          fontSize: 16,
          borderColor: '#ff00003d',
          borderWidth: 1,
        }}
      />
      <TextInput
        placeholder="Hashtag"
        placeholderTextColor={theme.placeholderColor}
        value={campaignInfo.hashtag}
        onChangeText={value => handleCampaignInfo('hashtag', value)}
        style={{
          width: '100%',
          backgroundColor: theme.inputBackColor,
          color: theme.textColor,
          borderRadius: 6,
          paddingHorizontal: 10,
          fontSize: 16,
          borderColor: '#ff00003d',
          borderWidth: 1,
        }}
      />
      <TextInput
        placeholder="Template..."
        placeholderTextColor={theme.placeholderColor}
        value={campaignInfo.template}
        onChangeText={value => handleCampaignInfo('template', value)}
        style={{
          width: '100%',
          backgroundColor: theme.inputBackColor,
          color: theme.textColor,
          borderRadius: 6,
          paddingHorizontal: 10,
          fontSize: 16,
          borderColor: '#ff00003d',
          borderWidth: 1,
          height: 100,
        }}
        textAlignVertical="top"
      />
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        onPress={() => setAudienceShow(prevState => !prevState)}
      >
        <Text
          style={{ color: theme.textColor, fontSize: 18, fontWeight: 'bold' }}
        >
          Campaign Audience
        </Text>
        <AntdIcon
          name={audienceShow ? 'downcircle' : 'upcircle'}
          size={22}
          color={theme.tintColor}
        />
      </TouchableOpacity>
      {audienceShow && (
        <>
          <RNSDropDown
            items={lovs['lovs'].countries}
            selectedIndex={campaignInfo.country}
            onSelect={value => handleCampaignInfo('country', value)}
            style={{
              width: '100%',
              backgroundColor: theme.inputBackColor,
              color: theme.textColor,
              borderRadius: 6,
              paddingHorizontal: 10,
              fontSize: 16,
              borderColor: '#ff00003d',
              borderWidth: 1,
            }}
            placeholder="Select Country..."
            clearTextOnFocus={true}
            keyboardAppearance={'dark'}
          />
          <RNSDropDown
            items={lovs['lovs'].states}
            selectedIndex={campaignInfo.state}
            onSelect={value => handleCampaignInfo('state', value)}
            style={{
              width: '100%',
              backgroundColor: theme.inputBackColor,
              color: theme.textColor,
              borderRadius: 6,
              paddingHorizontal: 10,
              fontSize: 16,
              borderColor: '#ff00003d',
              borderWidth: 1,
            }}
            placeholder="Select State..."
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
              fontSize: 18,
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
          <Text style={{ color: theme.textColor, fontSize: 17 }}>
            {campaignInfo.campaignStartDate
              ? moment(campaignInfo.campaignStartDate).format('DD-MM-YYYY')
              : 'Campaign Start'}
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
            handleCampaignInfo('campaignStartDate', date);
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
                    fontSize: 20,
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
          <Text style={{ color: theme.textColor, fontSize: 17 }}>
            {campaignInfo.campaignEndDate
              ? moment(campaignInfo.campaignEndDate).format('DD-MM-YYYY')
              : 'Campaign End'}
          </Text>
          <DateTimePicker
            isVisible={showEndDatePicker}
            minimumDate={new Date(campaignInfo.campaignStartDate)}
            mode="date"
            // date={
            //   campaignInfo.campaignEndDate !== ''
            //     ? new Date(campaignInfo.campaignEndDate)
            //     : new Date(new Date().setMonth(new Date().getDay() + 2))
            // }
            onConfirm={date => {
              handleCampaignInfo('campaignEndDate', date);

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
                      fontSize: 20,
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
            fontSize: 16,
            color: theme.textColor,
          }}
        />
      </View>
      <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ color: theme.textColor, fontSize: 18, marginRight: 20 }}>
          Auto Generate Lead
        </Text>
        <CheckBox
          value={campaignInfo.autoLead}
          tintColors={{
            true: theme.selectedCheckBox,
            false: theme.buttonBackColor,
          }}
          style={{ transform: [{ scale: 1.3 }] }}
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

const styles = StyleSheet.create({});
