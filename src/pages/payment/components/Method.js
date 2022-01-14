import React, { useState } from "react";
import { useHistory } from "react-router-dom";

//packages
import axios from "axios";
import i18n from "i18n-js";
import { Tabs, Button, message } from "antd";
import { loadStripe } from "@stripe/stripe-js";
import { PayPalButton } from "react-paypal-button-v2";

//constant
import {
  API_BASE_URL,
  PAYPAL_CLIENT_ID,
  STRIPE_KEY,
} from "../../../configs/AppConfig";

//components
import wechatLogo from "../../../assets/img/payment/wechat-logo.png";
import alipayLogo from "../../../assets/img/payment/alipay-logo.png";

const { TabPane } = Tabs;

const stripePromise = loadStripe(STRIPE_KEY);

const Method = ({ orderId, type, orderNumber, setOrderNumber, price }) => {
  const history = useHistory();
  const userId = localStorage.getItem("userId");

  const [alipayQrCode, setAlipayQrCode] = useState();
  const [wechatQrCode, setWechatQrCode] = useState();
  const [expireMessage, setExpireMessage] = useState();

  const handlePay = async (key) => {
    let temOrderNo;
    setExpireMessage(null);
    const stripe = await stripePromise;
    //type true=>product, false=>service
    const data = {
      userId: userId,
      orderId: orderId,
      orderType: type ? "1" : "0",
    };
    const updateOrderNoData = {
      userId: userId,
      itemOrderId: orderId,
    };
    const paymentType = type ? "item" : "service";

    // 微信支付&支付宝支付
    if (key === "1" || key === "2") {
      //如果是商品订单需要更新orderNo,服务订单不用
      if (type) {
        console.log("update order no input", updateOrderNoData);
        const updatedResult = await axios.post(
          API_BASE_URL + `item/updateItemOrderNo.php`,
          updateOrderNoData
        );
        temOrderNo = updatedResult.data.data.orderNo;
        setOrderNumber(temOrderNo);
      }

      //更新orderNo成功后调qrCode
      const apiUrl = key === "1" ? "wechatQrcode" : "alipayQrcode";
      axios
        .post(API_BASE_URL + `payment/${apiUrl}.php`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log("this is wechat result", res.data);
          if (res.data.message === "success") {
            if (key === "1") {
              setWechatQrCode(res.data.data.qrCode);
            } else {
              setAlipayQrCode(res.data.data.qrCode);
            }

            //调查支付结果
            var startTime = new Date().getTime();
            var interval = setInterval(function () {
              if (new Date().getTime() - startTime > 120000) {
                clearInterval(interval);
                if (key === "1") {
                  setExpireMessage(0);
                  setWechatQrCode(null);
                } else {
                  setExpireMessage(1);
                  setAlipayQrCode(null);
                }
                return;
              }
              const getPayResultInput = {
                orderNo: type ? temOrderNo : orderNumber,
              };
              console.log("get pay result input", getPayResultInput);
              axios
                .post(
                  API_BASE_URL + `payment/alphaPayCheck.php`,
                  getPayResultInput,
                  {
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                )
                .then((res) => {
                  console.log("get pay result input result", res.data);
                  //支付成功调转
                  if (res.data.data.result_code === "PAY_SUCCESS") {
                    clearInterval(interval);
                    localStorage.setItem("paymentType", paymentType);
                    history.push("/payment/result");
                    // history.push(`/record/${type ? "shop" : "service"}`);
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
            }, 3000);
          }
        })
        .catch((error) => {
          console.log(error);
        });

      // axios
      //   .post(API_BASE_URL + `item/updateItemOrderNo.php`, updateOrderNoData, {
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   })
      //   .then((res) => {
      //     console.log("update orderNo result", res.data);
      //     if (res.data.message === "success") {

      //     }
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });
    }
    //stipe支付
    else if (key === "3") {
      //get sessionId
      console.log("stripe input", data);
      axios
        .post(API_BASE_URL + `payment/stripePayment.php`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log("stripe result", res);
          if (res.data.message === "success") {
            localStorage.setItem("paymentType", paymentType);
            stripe
              .redirectToCheckout({
                sessionId: res.data.data.sessionId,
              })
              .then((result) => console.log("this is pay result", result));
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const rederAlipayTabContent = (key) => {
    return (
      <div className="tab-content-container">
        <div className="logo-container margin-bottom-30">
          <img
            className={alipayQrCode ? "qrcode-size" : "logo-size"}
            src={alipayQrCode ? alipayQrCode : alipayLogo}
            alt="wechat-logo"
          />
        </div>

        {expireMessage === 1 && (
          <div className="message-box margin-bottom-30">
            {i18n.t("QRCode Expired")}
          </div>
        )}
        {/* message */}
        <div className="message-box margin-bottom-30">
          {i18n.t("ClickPayMessageAlipay")}
        </div>

        {/* button */}
        <div className="button-container  margin-bottom-30">
          <Button
            onClick={() => handlePay(key)}
            className="button-size submit-order-btn"
          >
            {i18n.t("Pay")}
          </Button>
        </div>
      </div>
    );
  };

  const rederWechatTabContent = (key) => {
    return (
      <div className="tab-content-container">
        <div className="logo-container margin-bottom-30">
          <img
            className={wechatQrCode ? "qrcode-size" : "logo-size"}
            src={wechatQrCode ? wechatQrCode : wechatLogo}
            alt="wechat-logo"
          />
        </div>

        {expireMessage === 0 && (
          <div className="message-box margin-bottom-30">
            {i18n.t("QRCode Expired")}
          </div>
        )}

        {/* message */}
        <div className="message-box margin-bottom-30">
          {i18n.t("ClickPayMessageWechatPay")}
        </div>

        {/* button */}
        <div className="button-container  margin-bottom-30">
          <Button
            onClick={() => handlePay(key)}
            className="button-size submit-order-btn"
          >
            {i18n.t("Pay")}
          </Button>
        </div>
      </div>
    );
  };

  const rederStripeTabContent = (key) => {
    return (
      <div className="tab-content-container">
        {/* message */}
        <div className="message-box margin-bottom-30">
          {i18n.t("ClickPayMessageStripe")}
        </div>

        {/* button */}
        <div className="button-container  margin-bottom-30">
          <Button
            onClick={() => handlePay(key)}
            className="button-size submit-order-btn"
          >
            {i18n.t("Pay")}
          </Button>
        </div>
      </div>
    );
  };

  const handlePaymentSuccess = async () => {
    //type true=>product, false=>service
    const url = type
      ? "item/itemOrderFinishPay.php"
      : "service/serviceOrderFinishPay.php?";
    const data = {
      userId: userId,
      [type ? "itemOrderId" : "serviceOrderId"]: orderId,
    };
    // console.log("here", url, data);
    axios
      .post(API_BASE_URL + url, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        // console.log("payment success result", res.data);
        //支付成功调转
        if (res.data.message === "success") {
          const paymentType = type ? "item" : "service";
          localStorage.setItem("paymentType", paymentType);
          history.push("/payment/result");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const rederPaypalTabContent = (key) => {
    return (
      <div className="tab-content-container">
        {/* message */}
        <div className="message-box margin-bottom-30">
          {i18n.t("ClickPayMessagePaypal")}
        </div>

        {/* button */}
        <div className="paypal-button-container margin-bottom-30">
          <PayPalButton
            // amount="0.01"
            amount={price}
            onSuccess={(details, data) => {
              handlePaymentSuccess();
            }}
            onCancel={(data) => {
              console.log("canceled", data);
            }}
            onError={(e) => {
              console.log("Paypal error", e);
              message.error("Paypal error");
              // history.push("/payment/resultfail")
            }}
            options={{
              clientId: PAYPAL_CLIENT_ID,
              currency: "CAD",
            }}
          />
        </div>
      </div>
    );
  };

  if (!userId) {
    message.error(i18n.t("Please login"));
    history.push("/");
  }

  return (
    <div className="method-container">
      <div className="method-inner-container">
        {/* tabs */}

        <Tabs
          defaultActiveKey="1"
          centered
          size={"large"}
          className="tabs-container"
        >
          <TabPane tab={i18n.t("WechatPay")} key="1">
            {rederWechatTabContent("1")}
          </TabPane>
          <TabPane tab={i18n.t("AliPay")} key="2">
            {rederAlipayTabContent("2")}
          </TabPane>
          <TabPane tab={i18n.t("CreditCard")} key="3">
            {rederStripeTabContent("3")}
          </TabPane>
          <TabPane tab="Paypal" key="4">
            {rederPaypalTabContent("4")}
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default Method;
