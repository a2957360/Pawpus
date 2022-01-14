import { Button, message } from "antd";

import dog from "../../assets/img/payment/dog-logo.png";

import { useHistory } from "react-router-dom";
import I18n from "i18n-js";

const Result = () => {
  const history = useHistory();

  const paymentType = localStorage.getItem("paymentType");
  console.log("paymentType", paymentType);

  const handleButtonPress = () => {
    const url = paymentType === "item" ? "shop" : "service";
    history.push(`/record/${url}`);
    localStorage.removeItem("paymentType");
  };

  if (!paymentType) {
    message.error("没有新的付款");
    history.push("/");
  }
  return (
    <div className="result-wrapper">
      <div className="result-inner-container">
        <img src={dog} alt="dog-logo" />
        <div className="font-size-20 margin-bottom-5">
          {I18n.t("Congratulations")}
        </div>
        <div className="font-size-14 margin-bottom-10">
          {I18n.t("PaymentSuccessMessage")}
        </div>
        <div>
          <Button
            className="primary-button"
            onClick={() => handleButtonPress()}
          >
            {paymentType === "item"
              ? I18n.t("Shopping History")
              : I18n.t("Service History")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Result;
