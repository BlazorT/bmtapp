// OrganizationAddEditScreen.js
import NetInfo from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-simple-toast';
import { useSelector } from 'react-redux';
import { useTheme } from '../../hooks/useTheme';
import { useUser } from '../../hooks/useUser';

import { Button } from '../../components';
import ActionButtonsSection from '../../components/ActionButtonsSection';
import AlertDialogs from '../../components/AlertDialogs';
import BasicInfoSection from '../../components/BasicInfoSection';
import CampaignAudienceSection from '../../components/CampaignAudienceSection';
import CurrencyStrengthSection from '../../components/CurrencyStrengthSection';
import PDFViewerModal from '../../components/PDFViewerModal';
import ProfileSection from '../../components/ProfileSection';
import SignatureModal from '../../components/SignatureModal';
import SocialControlSection from '../../components/SocialControlSection';
import StatusSection from '../../components/StatusSection';
import TermsCheckboxSection from '../../components/TermsCheckboxSection';
import { generateOrgAgreementPDF } from '../../helper/generateAgreementPDF';
import { useImageHandler, useOrgData, useOrgSubmit } from '../../hooks/useOrgSubmit';
import servicesettings from '../dataservices/servicesettings';

export default function OrganizationAddEditScreen(props) {
  const theme = useTheme();
  const { goBack } = useNavigation();
  const { user, isAuthenticated } = useUser();
  const lovs = useSelector(state => state.lovs).lovs;

  // Image state
  const { img, setimg, EditImgURI, setEditImgURI, imageUrl, setImageUrl } =
    useImageHandler();

  // Organization data state
  const {
    orgName,
    setOrgName,
    Email,
    setEmail,
    Contact,
    setContact,
    orgAddress,
    setOrgAddress,
    strength,
    setStrength,
    whatsapp,
    setWhatsapp,
    facebookId,
    setFacebookId,
    instagramId,
    setInstagramId,
    iban,
    setIban,
    selectCountryVal,
    setSelectCountryVal,
    selectCountryId,
    setSelectCountryId,
    selectCityName,
    setSelectCityName,
    selectCityId,
    setSelectCityId,
    cityNameAdd,
    setCityNameAdd,
    selectedCurrencyId,
    setSelectedCurrencyId,
    currencySelectedId,
    setCurrencySelectedId,
    selectedStatusId,
    setSelectedStatusId,
    statusSelectedId,
    setStatusSelectedId,
    editOrgId,
    setEditOrgId,
    selectterms,
    setselectterms,
    cityDataList,
    setCityDataList,
    orgCreatedAt,
    setOrgCreatedAt,
    signature,
    setSignature,
    signatureJSON,
    setSignatureJSON,
  } = useOrgData();

  // UI state
  const [spinner, setspinner] = useState(false);
  const [SelectAreaEnabled, setSelectAreaEnabled] = useState(false);
  const [SelectSocialAreaEnabled, setSelectSocialAreaEnabled] = useState(false);
  const [confirmationVisible, setconfirmationVisible] = useState(false);
  const [EditconfirmationVisible, setEditconfirmationVisible] = useState(false);
  const [permissionVisible, setpermissionVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [signatureModalVisible, setSignatureModalVisible] = useState(false);
  // Add state
  const [pdfViewerVisible, setPdfViewerVisible] = useState(false);
  const [generatedPdfUri, setGeneratedPdfUri] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  // Dropdown data
  const CurrencyItem = lovs['lovs']?.currencies || [];
  const stateList = lovs['lovs']?.states || [];
  const statusItem = lovs['lovs']?.statuses || [];
  const cityNameDetail = lovs['cities'] || [];

  const [userId, setUserId] = useState('');
  const [organizationId, setOrganizationId] = useState('');

  // Custom hooks
  const { submit } = useOrgSubmit({
    orgName,
    Contact,
    Email,
    strength,
    whatsapp,
    facebookId,
    instagramId,
    iban,
    selectedCurrencyId,
    selectCountryId,
    selectCityId,
    cityNameAdd,
    selectedStatusId,
    selectterms,
    editOrgId,
    user,
    orgCreatedAt,
    img,
    imageUrl,
    setImageUrl,
    setspinner,
    goBack,
    orgAddress,
    signature,
    signatureJSON,
  });

  // Initialize
  useEffect(() => {
    checkInternetAndInit();
  }, []);

  // Auto-check terms when signature is added
  useEffect(() => {
    if (signature && !selectterms) {
      setselectterms(true);
    }
  }, [signature, selectterms]);

  // Update handleViewContract

  const checkInternetAndInit = async () => {
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      Toast.showWithGravity(
        'Please connect internet',
        Toast.LONG,
        Toast.CENTER,
      );
      return;
    }
    loginInfoLoaded();
    initializeData();
  };

  const loginInfoLoaded = () => {
    props.navigation.setOptions({
      title: `${isAuthenticated ? 'Edit' : 'Register'} Organization`,
    });

    if (isAuthenticated) {
      setUserId(user.id);
      setOrganizationId(user.orgId);
      global.ORGANIZATIONID = user.orgId;
    }
  };

  const initializeData = () => {
    if (isAuthenticated && user?.orgId) {
      loadOrganization(user.orgId);
    }
  };

  const loadOrganization = orgId => {
    setspinner(true);
    const headerFetch = {
      method: 'POST',
      body: JSON.stringify({ id: orgId.toString(), Name: '', Status: 1 }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: servicesettings.AuthorizationKey,
      },
    };

    fetch(servicesettings.baseuri + 'BlazorApi/orgsfulldata', headerFetch)
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.data?.length > 0) {
          populateOrgData(responseJson.data[0]);
        } else {
          Toast.show(responseJson.message || 'Organization not found');
        }
        setspinner(false);
      })
      .catch(error => {
        console.error('service error', error);
        setspinner(false);
        Toast.showWithGravity(
          'Internet connection failed',
          Toast.LONG,
          Toast.CENTER,
        );
      });
  };

  const populateOrgData = EditOrg => {
    const EditImg = EditOrg.logoAvatar
      ? servicesettings.Imagebaseuri +
      EditOrg.logoAvatar
        .replace(/\\/g, '/')
        .replace(',', '')
        .replace('//', '')
      : '';

    setEditImgURI(EditImg);
    setImageUrl(EditOrg.logoAvatar);
    setselectterms(true);
    setEditOrgId(EditOrg.id);
    setOrgName(EditOrg.name);
    setEmail(EditOrg.email);
    setContact(EditOrg.contact);
    setOrgAddress(EditOrg.address);

    const CurrencySelectedIdx = CurrencyItem.findIndex(
      item => item.id === EditOrg.currencyId,
    );
    setCurrencySelectedId(CurrencySelectedIdx);
    setSelectedCurrencyId(EditOrg.currencyId);
    const StateIndex = stateList.findIndex(item => item.id === EditOrg.stateId);
    setSelectCountryVal(StateIndex);
    setSelectCountryId(EditOrg.stateId);
    setSelectCityName(EditOrg.cityName);
    setSelectCityId(EditOrg.cityId);

    const statusSelectIndex = statusItem.findIndex(
      item => item.id === EditOrg.status,
    );
    setStatusSelectedId(statusSelectIndex);

    setStrength(EditOrg.strength?.toString() || '');
    setWhatsapp(EditOrg.whatsApp || '');
    setFacebookId(EditOrg.fb || '');
    setInstagramId(EditOrg.instagram || '');
    setIban(EditOrg.ibanorWireTransferId || '');

    // Load signature if exists
    if (EditOrg.signature) {
      try {
        const sJSON = JSON.parse(EditOrg.signature);
        setSignatureJSON(sJSON);
        setSignature(sJSON?.signature || '');
      } catch (e) {
        console.error('Error parsing signature:', e);
      }
    }

    setOrgCreatedAt({
      createdBy: EditOrg?.createdBy,
      createdAt: EditOrg?.createdAt,
    });
  };

  // Dialog handlers
  const handleCancelClick = () => setconfirmationVisible(true);
  const handleConfirmCancel = () => {
    setconfirmationVisible(false);
    props.navigation.navigate('Blazor Media ToolKit');
  };

  const handleEditConfirmClick = () => {
    setEditconfirmationVisible(false);
    loadOrganization(organizationId);
  };

  const handleCountrySelect = value => {
    setSelectCityName('');
    setSelectCityId('');
    setSelectCountryVal(value);
    setSelectCountryId(stateList[value].id);
    filterCity(stateList[value].id);
  };

  const filterCity = stateId => {
    const filtered = cityNameDetail.filter(item => item.stateId === stateId);
    setCityDataList(filtered);
  };

  const handleCitySelect = city => {
    setSelectCityName(city.name);
    setSelectCityId(city.id);
  };

  const handleViewContract = async () => {
    if (!signature) {
      setSignatureModalVisible(true);
    } else {
      try {
        setPdfLoading(true);
        const pdfPath = await generateOrgAgreementPDF(
          signature,
          signatureJSON?.adminName || '',
          signatureJSON?.dt || new Date(),
        );
        console.log({ pdfPath });
        setGeneratedPdfUri(`file://${pdfPath}`);
        setPdfViewerVisible(true);
      } catch (err) {
        Toast.show('Failed to generate agreement PDF', Toast.LONG);
      } finally {
        setPdfLoading(false);
      }
    }
  };

  const handleSubmitWithSignature = () => {
    if (!signature) {
      Toast.showWithGravity(
        'Please sign the agreement first',
        Toast.LONG,
        Toast.CENTER,
      );
      setSignatureModalVisible(true);
      return;
    }
    submit();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.backgroundColor }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Spinner
        visible={spinner}
        textContent={'Submitting...'}
        textStyle={{ color: '#FFF' }}
      />

      <AlertDialogs
        confirmationVisible={confirmationVisible}
        setconfirmationVisible={setconfirmationVisible}
        EditconfirmationVisible={EditconfirmationVisible}
        setEditconfirmationVisible={setEditconfirmationVisible}
        permissionVisible={permissionVisible}
        setpermissionVisible={setpermissionVisible}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onConfirmCancel={handleConfirmCancel}
        onEditConfirm={handleEditConfirmClick}
      />

      <PDFViewerModal
        visible={pdfViewerVisible}
        onClose={() => setPdfViewerVisible(false)}
        pdfUri={generatedPdfUri}
      />

      <SignatureModal
        visible={signatureModalVisible}
        onClose={() => setSignatureModalVisible(false)}
        signature={signature}
        setSignature={setSignature}
        signatureJSON={signatureJSON}
        setSignatureJSON={setSignatureJSON}
        user={user}
        isAuthenticated={isAuthenticated}
        onSubmit={handleSubmitWithSignature}
      />

      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.backgroundColor },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ProfileSection img={img} setimg={setimg} EditImgURI={EditImgURI} />

        <BasicInfoSection
          orgName={orgName}
          setOrgName={setOrgName}
          Email={Email}
          setEmail={setEmail}
          Contact={Contact}
          setContact={setContact}
          orgAddress={orgAddress}
          setOrgAddress={setOrgAddress}
          theme={theme}
        />

        <CurrencyStrengthSection
          CurrencyItem={CurrencyItem}
          currencySelectedId={currencySelectedId}
          setCurrencySelectedId={setCurrencySelectedId}
          setSelectedCurrencyId={setSelectedCurrencyId}
          strength={strength}
          setStrength={setStrength}
          theme={theme}
        />

        <CampaignAudienceSection
          SelectAreaEnabled={SelectAreaEnabled}
          setSelectAreaEnabled={setSelectAreaEnabled}
          selectCountryVal={selectCountryVal}
          stateList={stateList}
          handleCountrySelect={handleCountrySelect}
          selectCityName={selectCityName}
          selectCityId={selectCityId}
          cityDataList={cityDataList}
          handleCitySelect={handleCitySelect}
          cityNameAdd={cityNameAdd}
          setCityNameAdd={setCityNameAdd}
          theme={theme}
        />

        <SocialControlSection
          SelectSocialAreaEnabled={SelectSocialAreaEnabled}
          setSelectSocialAreaEnabled={setSelectSocialAreaEnabled}
          whatsapp={whatsapp}
          setWhatsapp={setWhatsapp}
          facebookId={facebookId}
          setFacebookId={setFacebookId}
          instagramId={instagramId}
          setInstagramId={setInstagramId}
          iban={iban}
          setIban={setIban}
          theme={theme}
        />

        <StatusSection
          statusItem={statusItem}
          statusSelectedId={statusSelectedId}
          setStatusSelectedId={setStatusSelectedId}
          setSelectedStatusId={setSelectedStatusId}
          setSelectAreaEnabled={setSelectAreaEnabled}
          setSelectSocialAreaEnabled={setSelectSocialAreaEnabled}
          theme={theme}
        />

        {/* Agreement Section - Only show for authenticated users or role 2 */}
        {(isAuthenticated || user?.roleId === 2) && (
          <View style={styles.agreementSection}>
            <Button
              style={[styles.button]}
              bgColor={theme.buttonBackColor}
              caption={
                signature
                  ? 'View and Download Agreement'
                  : 'View and Sign Agreement'
              }
              onPress={handleViewContract}
              loading={pdfLoading}
            />

            {signature &&
              isAuthenticated &&
              user?.id === signatureJSON?.adminId && (
                <Button
                  style={[styles.button]}
                  bgColor={theme.buttonBackColor}
                  caption={'Change Signature'}
                  onPress={() => setSignatureModalVisible(true)}
                />
              )}
          </View>
        )}

        <TermsCheckboxSection
          selectterms={selectterms}
          setselectterms={setselectterms}
          setModalVisible={setModalVisible}
          theme={theme}
        />

        <ActionButtonsSection
          onCancel={handleCancelClick}
          onSubmit={() => submit()}
          theme={theme}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 8,
  },
  agreementSection: {
    marginVertical: 15,
    paddingHorizontal: 10,
    alignItems: 'center',
    rowGap: 5,
  },
  agreementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  agreementButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  changeSignatureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  changeSignatureText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
});
