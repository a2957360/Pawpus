import { useState, useEffect } from "react";

import i18n from "i18n-js";

import { Button, Divider, Col, Row, message } from "antd";

import { useHistory } from "react-router-dom";

import DisplayPetCard from "./components/DisplayPetCard";
import Review from "../../components/review/Review";
import RateModal from "./components/RateModal";
import RefuseModal from "./components/RefuseModal";

//redux
import axios from "axios";
import { API_BASE_URL } from "../../configs/AppConfig";
// import { configConsumerProps } from "antd/lib/config-provider";

const CenterOrderManageDetail = (props) => {
  const history = useHistory();
  const userId = localStorage.getItem("userId");
  const language = localStorage.getItem("language");

  const { state } = props.location;

  const testGutter = { xs: 8, sm: 16, md: 24, lg: 32 };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputReview, setInputReview] = useState();
  const [reviewStar, setReviewStar] = useState();
  const [refuseReasonInput, setRefuseReasonInput] = useState();
  const [refuseModalVisible, setRefuseModalVisible] = useState(false);

  // 房东给客人评论
  const handleRateButton = () => {
    if (!inputReview || !reviewStar) {
      message.error(
        !reviewStar
          ? i18n.t("Please complete rating")
          : i18n.t("Please write down your review")
      );
    } else {
      const data = {
        targetId: state.userId,
        fromId: state.serverId,
        orderId: state.serviceOrderId,
        reviewContent: inputReview,
        reviewStar: reviewStar,
        targetType: "2",
      };
      console.log("landlord rate user input", data);
      axios
        .post(API_BASE_URL + "review/addReview.php", data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          //返回列表页面
          console.log("landlord rate user result", res.data);
          if (res.data.message === "success") {
            message.success(i18n.t("rateSuccess"));
            setIsModalVisible(false);

            history.push({
              pathname: "/service/center",
              state: 2,
            });
          } else {
            message.error(i18n.t("Rate Failed"));
          }
        })
        .catch((error) => {});
    }
  };

  // 改变订单状态
  const handleStateButton = (serviceOrderId, orderState) => {
    let successMessage;
    if (orderState === "2") {
      successMessage = i18n.t("confirmOrderSuccessMessage");
    } else if (orderState === "3") {
      successMessage = i18n.t("receivePetSuccessMessage");
    } else if (orderState === "4") {
      successMessage = i18n.t("serviceEndMessage");
    } else if (orderState === "6") {
      successMessage = i18n.t("refuseServiceMessage");
    }
    const data = {
      userId: userId,
      orderState: orderState,
      serviceOrderId: serviceOrderId,
    };
    console.log("change state button input", serviceOrderId, orderState);
    axios
      .post(API_BASE_URL + "service/serverControlOrder.php", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        //重新获取serviceOrderList
        console.log("this is change order state result", res.data);
        if (res.data.message === "success") {
          message.success(successMessage);
          history.push({
            pathname: "/service/center",
            state: 2,
          });
          // dispatch(getServiceOrderList(`serverId=${userId}`));
        } else {
          message.error(i18n.t("changeStateFailMessage"));
        }
      })
      .catch((error) => {});
  };

  //拒绝服务
  const handleRefuseButton = () => {
    if (!refuseReasonInput) {
      message.error(
        i18n.t("Please write down your reason for refusing this order")
      );
    } else {
      const data = {
        userId: userId,
        serviceOrderId: state.serviceOrderId,
        serviceRefuseReason: refuseReasonInput,
      };
      console.log("refuse order inout", data);
      axios
        .post(API_BASE_URL + "service/serverDeclineService.php", data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          //返回列表页面
          console.log("refuse order resutl", res.data);
          if (res.data.message === "success") {
            message.success("refuseSuccess");
            history.push({
              pathname: "/service/center",
              state: 2,
            });
          } else {
            message.error(i18n.t("refuseFail"));
          }
        })
        .catch((error) => {});
    }
  };

  if (!props.location.state) {
    history.push("*");
  }

  const renderServiceExtra =
    state.serviceOrderExtra && state.serviceOrderExtra.length > 0
      ? state.serviceOrderExtra.map((element, index) => {
          return (
            <div key={index} className="info-row margin-bottom-20 subtitle">
              <span>
                {`${element.name[language]} (${i18n.t("Before Tax")})`}
              </span>
              <span>${element.price}</span>
            </div>
          );
        })
      : null;

  const renderPetCards =
    state.serviceOrderPetCard.length > 0 &&
    state.serviceOrderPetCard.map((element) => {
      return (
        <Col xs={24} md={12} xl={8}>
          <DisplayPetCard data={element} showMessage={true} />
        </Col>
      );
    });

  let renderPetInfo = "";
  if (state.serviceOrderPetCard.length > 0) {
    state.serviceOrderPetCard.forEach((element, index) => {
      renderPetInfo += `1 ${i18n.t("quantityOfPet")} ${
        element.petType[language]
      } ${i18n.t("Age")} ${element.petAge} ${i18n.t("weight")} ${
        element.petWeight
      } ${index === state.serviceOrderPetCard.length - 1 ? " " : ","}`;
    });
  }

  const stateTextList = {
    // 0: i18n.t("UnPaid"),
    1: i18n.t("UnConfirm"),
    2: i18n.t("Unship"),
    3: i18n.t("BeingBoarding"),
    4: i18n.t("Service Completed"),
    5: i18n.t("Paid/Canceled"),
    6: i18n.t("Refused"),
    7: i18n.t("UnPaid/Canceled"),
  };

  return (
    <div className="record-shop-detail-wrapper ">
      <div className="record-shop-detail-inner-container margin-bottom-30">
        {/* header */}
        <div className="header-container record-14-70 margin-bottom-30">
          <span className="margin-right-40">
            {state.createTime.split(" ")[1].slice(0, 5) +
              " " +
              state.createTime.split(" ")[0]}
          </span>
          <span>
            {i18n.t("Order#")}: {state.serviceOrderNo}
          </span>
        </div>

        {/* state */}
        <div className="state-container flex-column margin-bottom-30">
          <div>
            <span className="margin-right-10 state-title">
              {i18n.t("Order state")}
            </span>
            <span className="margin-right-20 state">
              {stateTextList[state.orderState]}
            </span>

            {/* 联系买家 */}
            {state.orderState === "0" && (
              <Button
                onClick={() => console.log("contact buyer pressed")}
                className="state-button-font mr-2 white-button"
              >
                {i18n.t("Contact Buyer")}
              </Button>
            )}

            {/* 拒绝订单 */}
            {/* todo */}
            {state.orderState === "1" && (
              <Button
                onClick={() => setRefuseModalVisible(true)}
                className="white-button state-button-font mr-2"
              >
                {i18n.t("Refuse Order")}
              </Button>
            )}

            {/* 确认订单 */}
            {state.orderState === "1" && (
              <Button
                onClick={() => handleStateButton(state.serviceOrderId, "2")}
                className="white-button state-button-font "
              >
                {i18n.t("Comfirm Order")}
              </Button>
            )}

            {/* 确认入住 */}
            {state.orderState === "2" && (
              <Button
                onClick={() => handleStateButton(state.serviceOrderId, "3")}
                className="state-button-font white-button"
              >
                {i18n.t("Confirm Checkin")}
              </Button>
            )}

            {/* 确认接走 */}
            {state.orderState === "3" && (
              <Button
                onClick={() => handleStateButton(state.serviceOrderId, "4")}
                className="state-button-font white-button "
              >
                {i18n.t("Confirm Checkout")}
              </Button>
            )}

            {/* 评论 */}
            {/* data.orderState === "4" && */}
            {state.orderState === "4" && !state.serverReview && (
              <Button
                onClick={() => {
                  setIsModalVisible(true);
                }}
                className="white-button state-button-font"
              >
                {i18n.t("Rate Service")}
              </Button>
            )}
          </div>
          {/* <div className="state-message ">操作类型： 等待买家支付</div> */}
          {state.orderState == "6" && (
            <div className="state-message">
              {i18n.t("Refused Reason")}：{state.serviceRefuseReason}
            </div>
          )}
        </div>

        {/* 商家信息 */}
        <div className="state-container flex-column margin-bottom-30">
          <div className="title margin-bottom-20">
            {i18n.t("Buyer Information")}
          </div>
          <div className="contact-landloard-row margin-bottom-20 subtitle">
            <div className="margin-right-20">
              {i18n.t("Buyer")}： {state.userName}
            </div>
          </div>
          <div className="subtitle margin-bottom-20">
            {i18n.t("Pet")}： {renderPetInfo}
          </div>
          <div className="subtitle">
            {i18n.t("Phone number")}： {state.userPhone}
          </div>
        </div>

        {/* note */}
        <div className="state-container flex-column margin-bottom-30">
          <div className="title margin-bottom-30">{i18n.t("Notes")}</div>
          <div className="input-font">{state.serviceComment}</div>
        </div>

        {/* 订单信息 */}
        <div className="state-container flex-column margin-bottom-30">
          <div className="title margin-bottom-30">
            {i18n.t("Order information")}
          </div>
          {/* animal cards */}
          <div className="animal-cards-section margin-bottom-30">
            <Row gutter={testGutter}>{renderPetCards}</Row>
          </div>
          <div className="subtitle ">
            {`${i18n.t("Checkin Time")}：${state.orderStartDate}，${i18n.t(
              "Checkout Time"
            )}: ${state.orderEndDate}`}
          </div>
          <Divider />
          {/* <div className="info-row margin-bottom-20 subtitle">
            <span>
              {`${i18n.t("Pet Care Days")} ${state.OrderDayNumber} ${i18n.t(
                "Day"
              )} (${i18n.t("Before Tax")})`}
            </span>
            <span>${state.serviceOrderRentPrice}</span>
          </div>
          {renderServiceExtra} */}

          {/* 订单总价 */}
          <div className="info-row margin-bottom-20 subtitle">
            <pan>
              {i18n.t("Total Price")}({i18n.t("Including Tax")})
            </pan>
            <span>
              ${Number(state.serviceOrderTotalPrice).toFixed(2)}
              {/* {(
                Number(state.serviceOrderRentPrice) +
                Number(state.serviceOrderTaxPrice) +
                Number(state.serviceOrderExtraPrice)
              ).toFixed(2)} */}
            </span>
          </div>

          <div className="info-row margin-bottom-20 subtitle">
            <span>
              {i18n.t("Service Fee")}({i18n.t("Including Tax")})
            </span>
            <span>-${Number(state.serverChargeFee).toFixed(2)}</span>
          </div>

          {/* <div className="info-row margin-bottom-20 subtitle">
            <span>{i18n.t("Tax")}</span>
            <span>${state.serviceOrderTaxPrice}</span>
          </div> */}

          {/* <div className="info-row margin-bottom-20 subtitle">
            <span>{i18n.t("Coupon Deduction")}</span>
            <span>${state?.serviceOrderCouponPrice}</span>
          </div> */}
          <Divider />
          <div className="total-price justify-content-between d-flex">
            <span>{i18n.t("Actual Revenue")}</span>
            <span>
              $
              {(
                Number(state.serviceOrderTotalPrice) -
                Number(state.serverChargeFee)
              ).toFixed(2)}
              {/* {(
                Number(state.serviceOrderRentPrice) +
                Number(state.serviceOrderTaxPrice) +
                Number(state.serviceOrderExtraPrice) -
                Number(state.serverChargeFee)
              ).toFixed(2)} */}
            </span>
          </div>
        </div>

        {/* 客人评语 */}
        {state.userReview && (
          <div className="state-container flex-column margin-bottom-30">
            <div className="title margin-bottom-30">
              {i18n.t("Customer Review")}
            </div>

            <Review
              name={state.userName}
              time={state.userReviewCreateTime}
              reviewStar={state.userReviewStar}
              content={state.userReviewContent}
              avatarUrl={state.userImage}
            />
          </div>
        )}

        {state.serverReview && (
          <div className="state-container flex-column margin-bottom-30">
            <div className="title margin-bottom-30">
              {i18n.t("Landlord Review")}
            </div>

            <Review
              name={state.serverName}
              time={state.serverReviewCreateTime}
              reviewStar={state.serverReviewStar}
              content={state.serverReviewContent}
              avatarUrl={state.serverImage}
            />
          </div>
        )}
      </div>

      <RateModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        handleRateButton={handleRateButton}
        setInputReview={setInputReview}
        setReviewStar={setReviewStar}
      />
      <RefuseModal
        isModalVisible={refuseModalVisible}
        setIsModalVisible={setRefuseModalVisible}
        setInputReview={setRefuseReasonInput}
        handleSubmit={handleRefuseButton}
      />
    </div>
  );
};

export default CenterOrderManageDetail;

// const getLandlordReview = () => {
//   // if (state.serverReview) {
//   axios
//     .get(API_BASE_URL + `review/getUserReview.php?userId=${userId}`)
//     .then((res) => {
//       console.log("landlord review result111", res.data);
//       if (res.data.message === "success") {
//         if (res.data.data.length > 0) {
//           console.log("landlord review result", res.data.data);
//           const result = res.data.data.filter((e) => e.fromId === userId);
//           setLandlordReview(result);
//         }
//       }
//     })
//     .catch((error) => {});
//   // }
// };

// useEffect(() => {
//   const getCustomerReview = () => {
//     if (state.userReview) {
//       axios
//         .get(
//           API_BASE_URL +
//             `review/getServiceReview.php?serviceId=${state.serviceId}`
//         )
//         .then((res) => {
//           if (res.data.message === "success") {
//             if (res.data.data.length > 0) {
//               const result = res.data.data.filter((e) => e.fromId === userId);
//               setCustomerReview(result);
//             }
//           }
//         })
//         .catch((error) => {});
//     }
//   };

//   getCustomerReview();
//   getLandlordReview();
// }, []);
