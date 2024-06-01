import {combineReducers} from '@reduxjs/toolkit';

// Import your individual reducers here
import themeReducer from './features/theme/themeSlice';

const rootReducer = combineReducers({
  theme: themeReducer,
  // Add more reducers as needed
});

export default rootReducer;
