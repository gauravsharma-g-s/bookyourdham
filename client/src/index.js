import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from 'App';
import authReducer from './state/index';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage/session';
import { PersistGate } from 'redux-persist/integration/react';

// Configuration for Redux persist
const persistConfig = { key: "root", storage, version: 1 };
const persistedReducer = persistReducer(persistConfig, authReducer);

// Create the Redux store with Redux persist integration
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore certain actions that are not serializable
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
});

// Create a root for ReactDOM rendering
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component wrapped with Redux Provider and PersistGate for Redux persist
root.render(
  <Provider store={store}>
    {/* Wrap the App component with PersistGate to wait for rehydration of state */}
    <PersistGate loading={null} persistor={persistStore(store)}>
      <App />
    </PersistGate>
  </Provider>
);
