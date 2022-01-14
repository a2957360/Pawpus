import React, { useEffect } from "react";

import Dogy from "../../assets/img/Success-Dogy.png";

//redux
import { useDispatch, useSelector } from "react-redux";
import { resendActivationEmail, resetMessage } from "../../redux/actions";

//packages
import i18n from "i18n-js";
import { Button, message } from "antd";

export default function SendActivationSuccess(props) {
  const { changeLayout } = props;

  const dispatch = useDispatch();

  const userEmail = useSelector((state) => state.authData.userEmail);

  const sendEmailMessage = useSelector(
    (state) => state.authData.sendEmailMessage
  );

  useEffect(() => {
    async function handleSuccess() {
      await dispatch(resetMessage());
      await message.success(`验证链接已发送: ${sendEmailMessage}`);
    }

    async function handleFail() {
      await dispatch(resetMessage());
      await message.error(`Error: ${sendEmailMessage}`);
    }

    if (sendEmailMessage === null) {
    } else if (sendEmailMessage === "success") {
      handleSuccess();
    } else {
      handleFail();
    }
  }, [dispatch, sendEmailMessage]);

  const handleResend = () => {
    dispatch(resendActivationEmail({ userEmail: userEmail }));
  };

  return (
    <div className="auth-container">
      <div className="auth-image-container">
        <img src={Dogy} className="auth-image" alt="dogy" />
      </div>

      <div className="message-title text-center">{i18n.t("Congratulations")}</div>

      <div className="message-text-container">
        <div className="message-text text-center">
          {i18n.t("Active link has been sent, please check your e-mail")}
        </div>
      </div>

      <Button
        className="transparent-button w-100 mt-4 mb-2"
        type="text"
        onClick={() => handleResend()}
      >
        {i18n.t("Not Received? Send again")}
      </Button>

      <Button
        className="primary-button w-100"
        type="text"
        onClick={() => changeLayout(0)}
      >
        {i18n.t("Return Login")}
      </Button>
    </div>
  );
}
