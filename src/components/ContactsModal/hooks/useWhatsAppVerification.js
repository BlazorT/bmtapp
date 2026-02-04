import { useState } from 'react';
import { Linking } from 'react-native';

/**
 * Hook for verifying WhatsApp availability for contacts
 * Uses deep linking to check if WhatsApp can be opened for a phone number
 */
export const useWhatsAppVerification = () => {
  const [whatsAppVerifiedContacts, setWhatsAppVerifiedContacts] = useState(
    new Map(),
  );
  const [verifying, setVerifying] = useState(false);

  /**
   * Normalize phone number for WhatsApp
   * Removes non-numeric characters and handles country codes
   */
  const normalizePhoneForWhatsApp = phoneNumber => {
    if (!phoneNumber) return '';

    // Remove all non-numeric characters
    let cleaned = phoneNumber.replace(/\D/g, '');

    // If number starts with 0 and is likely a local number, it needs country code
    // This is a simplified approach - you may need to handle country codes differently
    if (cleaned.startsWith('0') && cleaned.length <= 11) {
      // Remove leading 0
      cleaned = cleaned.substring(1);
    }

    return cleaned;
  };

  /**
   * Check if WhatsApp can be opened for a specific phone number
   */
  const canOpenWhatsApp = async phoneNumber => {
    try {
      const cleanNumber = normalizePhoneForWhatsApp(phoneNumber);
      if (!cleanNumber) return false;

      const url = `whatsapp://send?phone=${cleanNumber}`;
      const supported = await Linking.canOpenURL(url);
      return supported;
    } catch (error) {
      return false;
    }
  };

  /**
   * Verify multiple contacts for WhatsApp availability
   * Note: This checks if WhatsApp is installed, not if the contact has WhatsApp
   * Actual verification requires user interaction due to privacy restrictions
   */
  const verifyWhatsAppContacts = async contacts => {
    if (!contacts || contacts.length === 0) return;

    setVerifying(true);
    const verificationMap = new Map();

    try {
      // Check if WhatsApp is installed at all
      const whatsAppInstalled = await Linking.canOpenURL('whatsapp://send');

      if (!whatsAppInstalled) {
        // If WhatsApp isn't installed, mark all as unavailable
        contacts.forEach(contact => {
          verificationMap.set(contact.id, {
            hasWhatsApp: false,
            verified: true,
            reason: 'app_not_installed',
          });
        });
      } else {
        // WhatsApp is installed - we can try to verify individual contacts
        // Note: Due to privacy restrictions, we can only verify if WhatsApp app is installed
        // We cannot verify if a specific contact has WhatsApp without user interaction

        // We'll use a batch approach with small delays to avoid rate limiting
        for (let i = 0; i < contacts.length; i++) {
          const contact = contacts[i];

          // For privacy and performance, we'll mark phone contacts as "potentially available"
          // Real verification would require user to attempt opening WhatsApp
          if (contact.type === 'phone' && contact.primaryContact) {
            const cleanNumber = normalizePhoneForWhatsApp(
              contact.primaryContact,
            );

            if (cleanNumber && cleanNumber.length >= 7) {
              verificationMap.set(contact.id, {
                hasWhatsApp: await canOpenWhatsApp(contact.primaryContact), // Assuming available since WhatsApp is installed
                verified: false, // Not actually verified until user interaction
                reason: 'app_installed',
                canAttemptContact: true,
              });
            } else {
              verificationMap.set(contact.id, {
                hasWhatsApp: false,
                verified: true,
                reason: 'invalid_number',
              });
            }
          }

          // Small delay to avoid overwhelming the system
          if (i % 50 === 0 && i > 0) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
      }

      setWhatsAppVerifiedContacts(verificationMap);
    } catch (error) {
      console.error('Error verifying WhatsApp contacts:', error);
    } finally {
      setVerifying(false);
    }
  };

  /**
   * Open WhatsApp chat for a specific contact
   */
  const openWhatsAppChat = async phoneNumber => {
    try {
      const cleanNumber = normalizePhoneForWhatsApp(phoneNumber);
      if (!cleanNumber) {
        throw new Error('Invalid phone number');
      }

      const url = `whatsapp://send?phone=${cleanNumber}`;
      const canOpen = await Linking.canOpenURL(url);

      if (canOpen) {
        await Linking.openURL(url);
        return true;
      } else {
        throw new Error('WhatsApp is not installed');
      }
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      return false;
    }
  };

  /**
   * Get WhatsApp verification status for a contact
   */
  const getWhatsAppStatus = contactId => {
    return (
      whatsAppVerifiedContacts.get(contactId) || {
        hasWhatsApp: false,
        verified: false,
        reason: 'not_checked',
      }
    );
  };

  /**
   * Filter contacts that are WhatsApp-capable
   */
  const filterWhatsAppCapable = contacts => {
    return contacts.filter(contact => {
      const status = getWhatsAppStatus(contact.id);
      return status.hasWhatsApp || status.canAttemptContact;
    });
  };

  return {
    whatsAppVerifiedContacts,
    verifying,
    verifyWhatsAppContacts,
    canOpenWhatsApp,
    openWhatsAppChat,
    getWhatsAppStatus,
    filterWhatsAppCapable,
  };
};
