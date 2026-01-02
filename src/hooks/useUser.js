import { useSelector, useDispatch } from 'react-redux';
import {
  login,
  logout,
  setAppleUsers,
  updateUser,
} from '../redux/features/user/userSlice';

export const useUser = () => {
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  const user = useSelector(state => state.user.user);
  const appleUsers = useSelector(state => state.user.appleUsers);

  const loginUser = user => {
    dispatch(login(user));
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  const updateUserDetails = userDetails => {
    dispatch(updateUser(userDetails));
  };

  const updateAppleUsers = users => {
    dispatch(setAppleUsers(users));
  };

  const findAppleUser = id => {
    return appleUsers?.find(user => user?.user == id) || null;
  };

  return {
    isAuthenticated,
    user,
    appleUsers,
    loginUser,
    logoutUser,
    updateUserDetails,
    updateAppleUsers,
    findAppleUser,
  };
};
