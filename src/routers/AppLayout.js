import React from "react";
import { BrowserRouter } from 'react-router-dom';
import AppViews from '../pages'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

import { languageOptions } from "../i18n/i18n";
import i18n from "i18n-js";

const AppLayout = () => {
  i18n.translations = languageOptions;

  return (
    <BrowserRouter>
      <Header />
      <div className='scale-container'>
        <AppViews />
      </div>
      <Footer />
    </BrowserRouter>
  )
}
export default AppLayout;