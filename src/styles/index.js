/**
 * @flow
 */
import { Dimensions } from 'react-native';

import colors from './colors';
import commonStyles from './common';
import fonts from './fonts';

const { width } = Dimensions.get('window');

// Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;

const scale = size => (width / guidelineBaseWidth) * size;

export { colors, commonStyles, fonts, scale };
