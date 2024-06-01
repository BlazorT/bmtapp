import {configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import rootReducer from './reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  whitelist: ['user'], // Specify persisted reducers
};

// Wrap root reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store
const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Create the persistor
export const persistor = persistStore(store);

export default store;
