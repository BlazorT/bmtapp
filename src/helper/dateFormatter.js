import moment from 'moment';

/**
 * Formats a given date to 'MM-DD-YY HH:mm' in 24-hour format.
 * @param {Date | string | number} date - The date to be formatted.
 * @returns {string} - The formatted date string.
 */
export const dateFormatter = date => {
  return moment(date).format('MMM DD, YYYY . hh:mm A');
};
export const safeJSONParse = (value, fallback = null) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};
export const keepOnlyAlphanumeric = input => {
  // Regular expression that matches any character that is NOT:
  // - a-z (lowercase letters)
  // - A-Z (uppercase letters)
  // - 0-9 (numbers)
  return input.replace(/[^a-zA-Z0-9]/g, '');
};

export const extractTagValue = (xml, tag) => {
  const regex = new RegExp(`<${tag}>(.*?)</${tag}>`);
  const match = xml.match(regex);
  return match ? match[1] : null;
};
