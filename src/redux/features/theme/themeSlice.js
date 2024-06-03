import {createSlice} from '@reduxjs/toolkit';

export const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: 'light', // Default theme is set to 'light'
  },
  reducers: {
    toggleTheme: state => {
      // Toggle between 'light' and 'dark' themes
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action) => {
      // Set a specific theme mode
      state.mode = action.payload; // payload should be 'light' or 'dark'
    },
  },
});

// Export the action creators
export const {toggleTheme, setTheme} = themeSlice.actions;

// Export the reducer as default
export default themeSlice.reducer;
