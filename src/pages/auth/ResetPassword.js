import React, { useEffect } from "react";
import { useHistory } from "react-router";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  validateEmail,
  resetMessage,
  showAuthModal,
} from "../../redux/actions";

//components
import ResetForm from "../../components/auth/ResetForm";

import { Button } from "antd";

import Dogy from "../../assets/img/Success-Dogy.png";

export default function ResetPassword() {
  const dispatch = useDispatch();
  const history = useHistory();

  const validateMessage = useSelector(
    (state) => state.authData.validateMessage
  );
  const changePasswordMessage = useSelector(
    (state) => state.authData.changePasswordMessage
  );
  const userInfo = useSelector((state) => state.userData.userInfo);

  useEffect(() => {
    const params = Object.fromEntries(
      new URLSearchParams(window.location.search)
    );

    dispatch(resetMessage());
    dispatch(validateEmail(params));
  }, [dispatch]);

  const handleLogin = async () => {
    await history.push("/");
    await dispatch(showAuthModal());
  };

  if (validateMessage === "success" && changePasswordMessage === null) {
    return (
      <div className="d-flex justify-content-center fixed-height-wrapper ">
        <div className="min-width-240">
          <ResetForm userInfo={userInfo} />
        </div>
      </div>
    );
  } else if (
    validateMessage === "success" &&
    changePasswordMessage === "success"
  ) {
    return (
      <div className="auth-container">
        <div className="auth-image-container">
          <img src={Dogy} className="auth-image" alt="dogy" />
        </div>

        <div className="message-large-title text-center">
          密码重置成功，请重新登录！
        </div>

        <div className="text-center mt-3">
          <Button
            className="primary-button"
            type="text"
            onClick={() => handleLogin()}
          >
            去登陆
          </Button>
        </div>
      </div>
    );
  } else if (changePasswordMessage === null && validateMessage === null) {
    return <div className="fixed-height-wrapper"></div>;
  } else {
    return (
      <div className="fixed-height-wrapper text-center">
        Error message: {validateMessage}
      </div>
    );
  }
}
