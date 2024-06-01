import {combineReducers} from '@reduxjs/toolkit';
import themeReducer from './features/theme/themeSlice';
// ## Generator Reducer Imports
const rootReducers = combineReducers({
  theme: themeReducer,
});
export default rootReducers;
