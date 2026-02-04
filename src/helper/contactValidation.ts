// contactValidation.ts

/**
 * Validates a contact based on the network type
 */
export const validateContact = (
  networkName: string,
  value: string,
): { isValid: boolean; message?: string } => {
  if (!value || !value.trim()) {
    return { isValid: false, message: 'Contact cannot be empty' };
  }

  const trimmedValue = value.trim();
  const lowerNetwork = networkName.toLowerCase();

  // Phone number validation (for SMS and WhatsApp)
  if (lowerNetwork === 'sms' || lowerNetwork === 'whatsapp') {
    const phonePattern = /^\+?\d+$/;

    if (!phonePattern.test(trimmedValue)) {
      return {
        isValid: false,
        message: 'Contact must contain only digits (+ allowed at start)',
      };
    }

    if (trimmedValue.length < 7 || trimmedValue.length > 15) {
      return {
        isValid: false,
        message: 'Contact must be between 7-15 digits',
      };
    }

    return { isValid: true };
  }

  // Email validation
  if (lowerNetwork === 'email') {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(trimmedValue)) {
      return {
        isValid: false,
        message: 'Invalid email format (e.g., user@example.com)',
      };
    }

    return { isValid: true };
  }

  // Social media ID validation (alphanumeric and underscore)
  const idPattern = /^[a-zA-Z0-9_]+$/;

  if (!idPattern.test(trimmedValue)) {
    return {
      isValid: false,
      message: 'ID must contain only letters, numbers, and underscores',
    };
  }

  return { isValid: true };
};

/**
 * Get format guidance text based on network type
 */
export const getFormatGuidance = (networkName: string): string => {
  const lowerNetwork = networkName.toLowerCase();

  if (lowerNetwork === 'email') {
    return 'Valid email format: user@example.com';
  }

  if (lowerNetwork === 'sms' || lowerNetwork === 'whatsapp') {
    return 'Valid contact format: 923331234567 (7-15 digits)';
  }

  if (lowerNetwork === 'tiktok') {
    return 'Enter TikTok username or URL';
  }

  if (lowerNetwork === 'linkedin') {
    return 'Enter LinkedIn profile URL';
  }

  if (lowerNetwork === 'facebook') {
    return 'Enter Facebook profile or page URL';
  }

  if (lowerNetwork === 'instagram') {
    return 'Enter Instagram username or URL';
  }

  if (lowerNetwork === 'twitter') {
    return 'Enter Twitter handle or profile URL';
  }

  return 'Enter valid contact information';
};

/**
 * Parse multiple contacts from pasted text
 */
export const parseMultipleContacts = (text: string): string[] => {
  if (!text || !text.trim()) return [];

  // Split by common separators: newline, comma, semicolon, space
  const contacts = text
    .split(/[\n,;\s]+/)
    .map(c => c.trim())
    .filter(c => c.length > 0);

  return contacts;
};

/**
 * Format contact display based on network type
 */
export const formatContactDisplay = (
  contact: string,
  networkName: string,
): string => {
  const lowerNetwork = networkName.toLowerCase();

  // For phone numbers, you might want to format them nicely
  if (lowerNetwork === 'sms' || lowerNetwork === 'whatsapp') {
    // Simple formatting - can be enhanced based on requirements
    return contact;
  }

  return contact;
};
