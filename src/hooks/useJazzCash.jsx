// src/api/hooks/useFetchDashboard   .js
import { useState } from 'react';
import servicesettings from '../modules/dataservices/servicesettings';
import Toast from 'react-native-simple-toast';
import axios from 'axios';

export const useJazzCash = () => {
  const [jcLoading, setJCLoading] = useState(false);

  const payJC = async body => {
    setJCLoading(true);
    try {
      const res = await axios.post(
        servicesettings.payment_service + '/api/payment/jc-initiate',
        body,
      );
      return res.data;
    } catch (e) {
      // console.log({e: e.message, res: e?.response?.data?.message});
      Toast.show(
        e?.response?.data?.message ?? e?.message ?? 'Something went wrong',
      );
      return null;
    } finally {
      setJCLoading(false);
    }
  };

  return { payJC, jcLoading };
};

export const useJCInquiry = () => {
  const inquireJC = async body => {
    try {
      const res = await axios.post(
        servicesettings.payment_service + '/api/payment/jc-inquire',
        body,
      );
      return res.data;
    } catch (e) {
      showToast('Something went wrong', 'error');
      return null;
    }
  };

  return { inquireJC };
};
