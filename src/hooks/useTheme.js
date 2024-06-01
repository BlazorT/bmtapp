import {useSelector} from 'react-redux';
import darkVersion from '../styles/darkVersion';
import ligthVersion from '../styles/lightVersion';
// Your color themes

// Custom hook to get the current theme based on Redux state
export const useTheme = () => {
  const theme = useSelector(state => state.theme.mode);
  return theme === 'dark' ? darkVersion : ligthVersion;
};
