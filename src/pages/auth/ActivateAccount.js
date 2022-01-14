import React, { useEffect, useState } from "react";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  validateEmail,
  resetMessage,
  showAuthModal,
} from "../../redux/actions";

import Dogy from "../../assets/img/Success-Dogy.png";

import { Button } from "antd";
import I18n from "i18n-js";

export default function ActivationResult() {
  const dispatch = useDispatch();

  const validateMessage = useSelector(
    (state) => state.authData.validateMessage
  );

  useEffect(() => {
    const params = Object.fromEntries(
      new URLSearchParams(window.location.search)
    );

    dispatch(resetMessage());
    dispatch(validateEmail(params));
  }, [dispatch]);

  if (validateMessage === "success") {
    return (
      <div className="auth-container">
        <div className="auth-image-container">
          <img src={Dogy} className="auth-image" alt="dogy" />
        </div>

        <div className="message-large-title text-center">
          {I18n.t("ActiveAccountSuccessMessage")}
        </div>

        <div className="text-center mt-3">
          <Button
            className="primary-button"
            type="text"
            onClick={() => dispatch(showAuthModal())}
          >
            {I18n.t("Login")}
          </Button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="text-center">
        {I18n.t("Error message")}: {validateMessage}
      </div>
    );
  }
}
