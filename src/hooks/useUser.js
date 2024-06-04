import {useSelector, useDispatch} from 'react-redux';
import {login, logout, updateUser} from '../redux/features/user/userSlice';

export const useUser = () => {
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  const user = useSelector(state => state.user.user);

  const loginUser = user => {
    dispatch(login(user));
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  const updateUserDetails = userDetails => {
    dispatch(updateUser(userDetails));
  };

  return {
    isAuthenticated,
    user,
    loginUser,
    logoutUser,
    updateUserDetails,
  };
};
