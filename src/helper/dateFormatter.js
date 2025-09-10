import moment from 'moment';

/**
 * Formats a given date to 'MM-DD-YY HH:mm' in 24-hour format.
 * @param {Date | string | number} date - The date to be formatted.
 * @returns {string} - The formatted date string.
 */
export const dateFormatter = date => {
  return moment(date).format('MM-DD-YY HH:mm');
};
export const safeJSONParse = (value, fallback = null) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};
