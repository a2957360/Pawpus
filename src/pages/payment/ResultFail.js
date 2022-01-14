import { Button } from "antd";
import i18n from "i18n-js";
import { useHistory } from 'react-router-dom';

import dog from "../../assets/img/payment/empty-page-dogy.png";

const ResultFail = () => {
  const history = useHistory();

  return (
    <div className="result-wrapper">
      <div className="result-inner-container">
        <img src={dog} alt="dog-logo" />
        <div className="font-size-20 margin-bottom-5">{i18n.t("sorry")}</div>
        <div className="font-size-14 margin-bottom-10">
          {i18n.t("Make order failed, please try again later")}
        </div>
        <div>
          <Button onClick={()=>
            history.push({
              pathname: "/record/service",
              state: "orderState=0",
            })}>{i18n.t("Service History")}</Button>
      </div>
    </div>
    </div >
  );
};

export default ResultFail;
