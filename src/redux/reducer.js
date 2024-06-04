import {combineReducers} from '@reduxjs/toolkit';
import themeReducer from './features/theme/themeSlice';
import userReducer from './features/user/userSlice';
import lovsReducer from './features/bmtLovs/lovsSlice';
// ## Generator Reducer Imports
const rootReducers = combineReducers({
  theme: themeReducer,
  user: userReducer,
  lovs: lovsReducer,
});
export default rootReducers;
