import { useState, useEffect } from "react";

//components
import Detail from "./components/Detail";
import ProductPaymentDetail from "./components/ProductPaymentDetail";
import Method from "./components/Method";
import RouterLoading from "../../components/loading/RouterLoading";

//packages
import axios from "axios";
import { API_BASE_URL } from "../../configs/AppConfig";
import { useHistory } from "react-router-dom";
import { message } from "antd";
import I18n from "i18n-js";

const PaymentMethod = (props) => {
  const history = useHistory();

  const state = props.location.state;
  const flag = props.location.productPaymentFlag;

  const [orderNumber, setOrderNumber] = useState(
    flag ? state.orderNo : state.serviceOrderNo
  );

  const [serviceInfo, setServiceInfo] = useState();

  useEffect(() => {
    localStorage.removeItem("paymentType");
    getServiceInfo();
  }, []);

  const getServiceInfo = async () => {
    axios
      .get(
        `${API_BASE_URL}service/getSingleService.php?serviceId=${state.serviceId}`
      )
      .then((res) => {
        console.log("this is get service result", res.data);
        if (res.data.message === "success") {
          setServiceInfo({
            serviceImage: res.data.data.serviceImage,
            categoryName: res.data.data.categoryName,
            serviceName: res.data.data.serviceName,
          });
        }
      })
      .catch((e) => console.log(e));
  };

  if (!props.location.state) {
    history.push("/");
  }

  // if (props.location.productPaymentFlag === undefined) {
  //   message.error(I18n.t("Refresh causing to home page"));
  //   history.push("/");
  //   return null;
  // }

  return (
    <div className="payment-method-wrapper">
      <div className="payment-method-inner-container responsive-container">
        <div className="margin-bottom-30">
          {flag !== undefined && flag ? (
            <ProductPaymentDetail data={state} orderNumber={orderNumber} />
          ) : !serviceInfo ? (
            <RouterLoading />
          ) : (
            <Detail
              data={state}
              serviceInfo={serviceInfo}
              orderNumber={orderNumber}
            />
          )}
        </div>

        <div className="margin-bottom-large-space ">
          <Method
            orderId={flag ? state.itemOrderId : state.serviceOrderId}
            type={flag}
            orderNumber={orderNumber}
            setOrderNumber={setOrderNumber}
            price={flag ? state.total : state.serviceOrderTotalPyament}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
