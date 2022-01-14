import React, { useEffect } from "react";
import { Provider } from "react-redux";
import AppRouter from "./routers";
import { createStore, applyMiddleware, compose } from "redux";
import reduxThunk from "redux-thunk";
import reducers from "./redux/reducers";

import { languageOptions } from "./i18n/i18n";
import i18n from "i18n-js";
import firebase from "firebase";
import { firebaseConfig } from "./configs/AppConfig";

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(reduxThunk))
);

export default function App() {
  const storageLanguage = localStorage.getItem("language");

  const browserLanguage = navigator.language.slice(0, 2)

  if (storageLanguage !== null) {
    //set language code equal to localstorage value if code exist
    i18n.locale = storageLanguage;
  } else {
    //如果本地没存过语言，则根据浏览器语言来保存。
    //平台只有中文和英文，如果是中文set成中文，否则默认英文
    if (browserLanguage === 'zh') {
      localStorage.setItem("language", browserLanguage);
      i18n.locale = browserLanguage;
    } else {
      localStorage.setItem("language", "en");
      i18n.locale = 'en';
    }
  }

  // When a value is missing from a language it'll fallback to another language with the key present.
  i18n.fallbacks = true;

  i18n.translations = languageOptions;

  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
}
