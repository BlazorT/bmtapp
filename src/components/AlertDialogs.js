// components/AlertDialogs.js
import React from 'react';
import Alert from '../components/Alert';
import TermsAndConditions from '../components/Terms&Conditions';
import { Linking } from 'react-native';

export default function AlertDialogs({
  confirmationVisible,
  setconfirmationVisible,
  EditconfirmationVisible,
  setEditconfirmationVisible,
  permissionVisible,
  setpermissionVisible,
  modalVisible,
  setModalVisible,
  onConfirmCancel,
  onEditConfirm,
}) {
  return (
    <>
      <Alert
        massagetype="warning"
        hide={() => setpermissionVisible(false)}
        confirm={() => {
          setpermissionVisible(false);
          Linking.openSettings();
        }}
        Visible={permissionVisible}
        alerttype="confirmation"
        Title="Confirmation"
        Massage='"BDMT" Would like to access camera ?'
      />

      <Alert
        massagetype="warning"
        hide={() => setconfirmationVisible(false)}
        confirm={onConfirmCancel}
        Visible={confirmationVisible}
        alerttype="confirmation"
        Title="Confirmation"
        Massage="Do you want to discard?"
      />

      <Alert
        massagetype="warning"
        hide={() => setEditconfirmationVisible(false)}
        confirm={onEditConfirm}
        Visible={EditconfirmationVisible}
        alerttype="confirmation"
        Title="Confirmation"
        Massage="Do you want to edit?"
      />

      <TermsAndConditions
        modalVisible={modalVisible}
        TermsAndConditionsClose={() => setModalVisible(false)}
      />
    </>
  );
}
