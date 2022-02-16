import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store/index";
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
 
const persistor = persistStore(store);
ReactDOM.render(
  <React.StrictMode>
  <Provider store={store}>
  <PersistGate persistor={persistor}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </PersistGate>
  </Provider></React.StrictMode>,
  document.getElementById("root")
);
 