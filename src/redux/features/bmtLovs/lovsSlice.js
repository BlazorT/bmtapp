import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  lovs: {},
};

export const lovsSlice = createSlice({
  name: 'lovs',
  initialState,
  reducers: {
    setLovs: (state, action) => {
      state.lovs = action.payload;
    },
    clearLovs: state => {
      state.lovs = {};
    },
    updateLovs: (state, action) => {
      state.lovs = {...state.lovs, ...action.payload};
    },
  },
});

// Action creators are generated for each case reducer function
export const {setLovs, clearLovs, updateLovs} = lovsSlice.actions;

export default lovsSlice.reducer;
