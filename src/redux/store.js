import {configureStore, isImmutableDefault} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import rootReducer from './reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Define the root state type

// Define persist configurations
const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  whitelist: ['theme', 'user', 'lovs'], // Specify persisted reducers
};
// Wrap root reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store
const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

// Create the persistor
export const persistor = persistStore(store);

export default store;
