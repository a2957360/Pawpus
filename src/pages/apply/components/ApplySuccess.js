import dog from "../../../assets/img/payment/dog-logo.png";

import { Button } from "antd";

import { useHistory } from "react-router-dom";
import i18n from "i18n-js";

const ApplySuccess = (props) => {
  const history = useHistory();

  return (
    <div className="result-wrapper">
      <div className="result-inner-container">
        <img src={dog} alt="dog-logo" />
        <div className="font-size-20 margin-bottom-5">
          {i18n.t("Congratulations")}
        </div>
        <div className="font-size-14 margin-bottom-10">
          {props.location.state === "save"
            ? i18n.t("SaveServiceSuccess")
            : i18n.t("ApplyServiceSuccess")}
        </div>
        <div>
          <Button
            onClick={() => {
              history.push("/service/center");
            }}
          >
            {i18n.t("Redirect")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplySuccess;
