import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: null,
  appleUsers: [],
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: state => {
      state.isAuthenticated = false;
      state.user = null;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    setAppleUsers: (state, action) => {
      state.appleUsers.push(action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout, updateUser, setAppleUsers } = userSlice.actions;

export default userSlice.reducer;
