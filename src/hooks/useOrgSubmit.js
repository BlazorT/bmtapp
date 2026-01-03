// hooks/useOrgSubmit.js
import Toast from 'react-native-simple-toast';
import moment from 'moment';
import { useState } from 'react';
import servicesettings from '../modules/dataservices/servicesettings';

export const useOrgSubmit = ({
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
}) => {
  const validateForm = () => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

    if (!orgName.trim()) {
      Toast.showWithGravity(
        'Please enter "Organization name"',
        Toast.LONG,
        Toast.CENTER,
      );
      return false;
    }
    if (!Contact.trim()) {
      Toast.showWithGravity('Please enter "Contact"', Toast.LONG, Toast.CENTER);
      return false;
    }
    if (!Email.trim()) {
      Toast.showWithGravity('Please enter "Email"', Toast.LONG, Toast.CENTER);
      return false;
    }
    if (!emailRegex.test(Email.trim())) {
      Toast.showWithGravity('Email is not correct', Toast.LONG, Toast.CENTER);
      return false;
    }
    if (!selectedCurrencyId) {
      Toast.showWithGravity(
        'Please select "Currency"',
        Toast.LONG,
        Toast.CENTER,
      );
      return false;
    }
    if (!selectterms) {
      Toast.showWithGravity(
        'Please agree to Terms & Conditions',
        Toast.LONG,
        Toast.CENTER,
      );
      return false;
    }
    return true;
  };

  const uploadImage = async () => {
    if (img === '' || !img) return imageUrl;

    const formData = new FormData();
    formData.append('files', {
      name: img[0].fileName,
      uri: img[0].uri,
      type: img[0].type,
    });

    try {
      const res = await fetch(
        servicesettings.baseuri + 'BlazorApi/uploadAttachment',
        {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: servicesettings.AuthorizationKey,
          },
        },
      );

      if (!res.ok) {
        throw new Error(`Upload failed with status: ${res.status}`);
      }

      const response = await res.json();
      return (
        response?.data?.replace(/^\\\\?wwwroot[\\/]/, '').replace(/\\/g, '/') ||
        ''
      );
    } catch (error) {
      Toast.showWithGravity(
        error?.message || 'Image upload failed',
        Toast.LONG,
        Toast.CENTER,
      );
      throw error;
    }
  };

  const submit = async () => {
    if (!validateForm()) return;

    setspinner(true);

    try {
      let imageUrlOrg = imageUrl;

      if (img !== '' && img) {
        imageUrlOrg = await uploadImage();
      }

      const OrgIdSelect = editOrgId || 0; // 0 for new registration

      const orgUpdateBody = {
        id: OrgIdSelect,
        Name: orgName,
        Contact: Contact,
        Address: orgAddress,
        Email: Email,
        Strength: strength,
        Instagram: instagramId,
        WhatsApp: whatsapp,
        Fb: facebookId,
        IbanorWireTransferId: iban,
        CurrencyId: selectedCurrencyId,
        StateId: selectCountryId,
        CityId: selectCityId,
        CityName: cityNameAdd || '',
        Status: selectedStatusId || 1,
        LastUpdatedAt: moment.utc().format(),
        CreatedAt: orgCreatedAt?.createdAt || moment.utc().format(),
        CreatedBy: orgCreatedAt?.createdBy || user?.id || 1,
        LastUpdatedBy: user?.id || 1,
        LogoAvatar: imageUrlOrg,
        RowVer: 0,
      };
      // return;
      const response = await fetch(
        servicesettings.baseuri + 'BlazorApi/adupdateorg',
        {
          method: 'POST',
          body: JSON.stringify(orgUpdateBody),
          headers: {
            Authorization: servicesettings.AuthorizationKey,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }

      const responseJson = await response.json();
      if (responseJson.status) {
        const message =
          OrgIdSelect === 0
            ? 'Organization registered successfully'
            : 'Organization updated successfully';
        Toast.show(message);
        setTimeout(() => goBack(), 1000);
      } else {
        Toast.showWithGravity(
          responseJson.message || 'Failed to save organization',
          Toast.LONG,
          Toast.CENTER,
        );
      }
    } catch (error) {
      console.error('Submit error:', error);
      Toast.showWithGravity(
        error?.message || 'Internet connection failed, try another time!!!',
        Toast.LONG,
        Toast.CENTER,
      );
    } finally {
      setspinner(false);
    }
  };

  return { submit };
};

export const useOrgData = () => {
  const [orgName, setOrgName] = useState('');
  const [Email, setEmail] = useState('');
  const [Contact, setContact] = useState('');
  const [orgAddress, setOrgAddress] = useState('');
  const [strength, setStrength] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [facebookId, setFacebookId] = useState('');
  const [instagramId, setInstagramId] = useState('');
  const [iban, setIban] = useState('');
  const [selectCountryVal, setSelectCountryVal] = useState('');
  const [selectCountryId, setSelectCountryId] = useState('');
  const [selectCityName, setSelectCityName] = useState('');
  const [selectCityId, setSelectCityId] = useState('');
  const [cityNameAdd, setCityNameAdd] = useState('');
  const [selectedCurrencyId, setSelectedCurrencyId] = useState('');
  const [currencySelectedId, setCurrencySelectedId] = useState('');
  const [selectedStatusId, setSelectedStatusId] = useState('');
  const [statusSelectedId, setStatusSelectedId] = useState('');
  const [editOrgId, setEditOrgId] = useState('');
  const [selectterms, setselectterms] = useState(false);
  const [cityDataList, setCityDataList] = useState([]);
  const [orgCreatedAt, setOrgCreatedAt] = useState(null);

  return {
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
  };
};

export const useImageHandler = () => {
  const [img, setimg] = useState('');
  const [EditImgURI, setEditImgURI] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  return { img, setimg, EditImgURI, setEditImgURI, imageUrl, setImageUrl };
};
