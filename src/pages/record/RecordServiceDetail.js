import { useEffect, useState } from "react";

//packages
import { Button, Divider, Col, Row, message, Modal } from "antd";
import { useHistory } from "react-router-dom";
import i18n from "i18n-js";
import { ExclamationCircleOutlined } from "@ant-design/icons";

//components
import Review from "../../components/review/Review";
import DisplayPetCard from "../record/components/DisplayPetCard";
import RateModal from "./components/RateModal";
import LoadingView from "../../components/loading/LoadingView";

//redux
import axios from "axios";
import { API_BASE_URL } from "../../configs/AppConfig";
import { useDispatch } from "react-redux";
import { updateContactList } from "../../redux/actions";

//firebase
import firebase from "firebase";
import "firebase/firestore";

const petCardGutter = { xs: 8, sm: 16, md: 24, lg: 32 };

const RecordServiceDetail = (props) => {
  const db = firebase.firestore();
  const dispatch = useDispatch();
  const history = useHistory();
  const userId = localStorage.getItem("userId");
  const language = localStorage.getItem("language");

  const { confirm } = Modal;

  const { tab } = props.location;
  const pathList = props.location.pathname.split("/");
  const state = pathList[pathList.length - 1];

  const [orderDetail, setOrderDetail] = useState({});

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputReview, setInputReview] = useState();
  const [reviewStar, setReviewStar] = useState();

  const {
    serviceId,
    serverId,
    serviceOrderId,
    serviceOrderExtra,
    serviceOrderPetCard,
    orderState,
    createTime,
    serviceOrderNo,
    userReview,
    serverName,
    serviceAddress,
    serviceCity,
    servicePostal,
    serviceProvince,
    userPhone,
    serviceComment,
    orderStartDate,
    orderEndDate,
    OrderDayNumber,
    serviceOrderRentPrice,
    clientChargeFee,
    serviceOrderTaxPrice,
    serviceOrderTotalPyament,
    serverReview,
    serviceRefuseReason,
    serviceOrderExtraPrice,
  } = orderDetail;

  useEffect(() => {
    const getOrderDetail = () => {
      axios
        .get(
          API_BASE_URL +
            `service/getServiceOrder.php?userId=${userId}&serviceOrderId=${state}`
        )
        .then((res) => {
          // console.log("get order detail result", res.data);
          if (res.data.data.length === 0) {
            history.push("/");
            message.error(i18n.t("This order does not exist"));
            return;
          } else {
            setOrderDetail(res.data.data[0]);
          }
        })
        .catch((e) => console.log(e));
    };

    getOrderDetail();
  }, []);

  const handleCancelOrder = (serviceOrderId, orderState) => {
    const data = {
      userId: userId,
      orderState: "10",
      serviceOrderId: serviceOrderId,
      cancelType: orderState,
    };

    axios
      .post(API_BASE_URL + "service/clientCancelOrder.php", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        //返回列表重新获取数据
        history.push({
          pathname: "/record/service",
          state: "orderState=5",
        });
      })
      .catch((error) => {});
  };

  const handleRateButton = () => {
    if (!inputReview || !reviewStar) {
      message.error(
        !reviewStar
          ? i18n.t("Please complete rating")
          : i18n.t("Please write down your review")
      );
    } else {
      const data = {
        targetId: serviceId,
        fromId: userId,
        orderId: serviceOrderId,
        reviewContent: inputReview,
        reviewStar: reviewStar,
        targetType: "0",
      };
      axios
        .post(API_BASE_URL + "review/addReview.php", data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          //重新获取list
          if (res.data.message === "success") {
            setIsModalVisible(false);
            message.success("rateSuccess");

            // getCustomerReview();
            history.push({
              pathname: "/record/service",
              state: tab,
            });
          }
        })
        .catch((error) => {});
    }
  };

  const contactLandlord = async () => {
    const chaterId = localStorage.getItem("userId");

    if (!chaterId) {
      return;
    }
    //initial firebase chatroom collection
    const chaterDocRef = db.doc(`${chaterId}/${chaterId}_${serverId}`);
    const chateeDocRef = db.doc(`${serverId}/${serverId}_${chaterId}`);

    axios
      .get(API_BASE_URL + `user/getUserInfo.php?userId=${serverId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log("chateeData", res.data);
        if (res.data.message === "success") {
          chaterDocRef.set(
            {
              lastViewServiceId: serviceId,
              chateeImage: res.data.data.userImage,
              chateeName: res.data.data.userName,
            },
            {
              merge: true,
            }
          );
          chateeDocRef.get().then((doc) => {
            if (!doc.exists)
              chateeDocRef.set({
                // lastViewServiceId: data.serviceId,
              });
          });
          // //update contact list
          dispatch(updateContactList(chaterId, serverId, serviceId));
          // //redirect to chat page
          history.push({
            pathname: "/chat",
            state: { chateeId: serverId, serviceId: serviceId },
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function showDeleteConfirm(id, orderState) {
    confirm({
      title: i18n.t("Are you sure cancel this?"),
      icon: <ExclamationCircleOutlined />,
      // content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        handleCancelOrder(id, orderState);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  }

  if (Object.keys(orderDetail).length === 0) {
    return <LoadingView />;
  }

  const renderServiceExtra =
    serviceOrderExtra && serviceOrderExtra?.length > 0
      ? serviceOrderExtra.map((element, index) => {
          return (
            <div key={index} className="info-row margin-bottom-20 subtitle">
              <span>{`${element.name[language]} (${i18n.t(
                "Before Tax"
              )})`}</span>
              <span>${element.price}</span>
            </div>
          );
        })
      : null;

  const renderPetCards = () => {
    if (serviceOrderPetCard.length > 0) {
      return serviceOrderPetCard.map((element) => {
        return (
          <Col xs={24} md={12} xl={8}>
            <DisplayPetCard data={element} showMessage={true} />
          </Col>
        );
      });
    } else {
      return <div>{i18n.t("This user has not uploaded pet information")}</div>;
    }
  };

  const stateTextList = {
    0: i18n.t("UnPaid"),
    1: i18n.t("UnConfirm"),
    2: i18n.t("Unship"),
    3: i18n.t("BeingBoarding"),
    4: i18n.t("Service Completed"),
    5: i18n.t("Paid/Canceled"),
    6: i18n.t("Refused"),
    7: i18n.t("UnPaid/Canceled"),
  };

  const orderStateText = stateTextList[orderState];

  return (
    <div className="record-shop-detail-wrapper ">
      <div className="record-shop-detail-inner-container responsive-container margin-bottom-30">
        {/* header */}
        <Row className="header-container record-14-70 margin-bottom-30">
          <Col className="margin-right-40">
            {createTime.split(" ")[1].slice(0, 5) +
              " " +
              createTime.split(" ")[0]}
          </Col>

          <Col>
            {i18n.t("Order#")}: {serviceOrderNo}
          </Col>
        </Row>

        {/* state */}
        <Row className="state-container margin-bottom-30">
          <Col className="mr-5">
            <span className="margin-right-10 state-title">
              {i18n.t("Order state")}
            </span>
            <span className="state">{orderStateText}</span>
          </Col>

          <Col>
            {/* 未支付 */}
            {orderState === "0" && (
              <Button
                onClick={() => {
                  history.push({
                    pathname: "/payment/method",
                    state: orderDetail,
                    productPaymentFlag: false,
                  });
                }}
                className="state-button-font white-button mr-3"
              >
                {i18n.t("Pay Order")}
              </Button>
            )}

            {/* 取消订单 */}
            {["0", "1"].includes(orderState) && (
              <Button
                onClick={() => {
                  showDeleteConfirm(serviceOrderId, orderState);
                  // handleCancelOrder(serviceOrderId)
                }}
                className="state-button-font white-button mr-3"
              >
                {i18n.t("Cancel")}
              </Button>
            )}

            {/* 联系房东 */}
            {["0", "1", "2", "3"].includes(orderState) && (
              <Button
                onClick={() => contactLandlord()}
                className="state-button-font white-button mr-3"
              >
                {i18n.t("Contact Landlord")}
              </Button>
            )}

            {/* 评论 */}
            {orderState === "4" && !userReview && (
              <Button
                onClick={() => {
                  setIsModalVisible(true);
                }}
                className="white-button state-button-font"
              >
                {i18n.t("Rate Service")}
              </Button>
            )}
          </Col>

          {orderState == 6 && (
            <Col span={24}>
              <span className="text-15 color-grey-servicePrice">
                {i18n.t("Refused Reason")}:{serviceRefuseReason}
              </span>
            </Col>
          )}
        </Row>

        {/* 商家信息 */}
        <div className="state-container flex-column margin-bottom-30">
          <div className="title margin-bottom-20">
            {i18n.t("Merchant Information")}
          </div>
          <div className="contact-landloard-row margin-bottom-20 subtitle">
            <div className="mr-3">
              {i18n.t("Landlord")}： {serverName}
            </div>
          </div>

          {/* 地址 */}
          {orderState != "0" && orderState != "5" && (
            <div className="subtitle margin-bottom-20">
              {i18n.t("Address")}：{" "}
              {`${serviceAddress}, ${serviceCity}, ${servicePostal}, ${serviceProvince}`}
            </div>
          )}
          <div className="subtitle">
            {i18n.t("Contact")}： {userPhone}
          </div>
        </div>

        {/* note */}
        <div className="state-container flex-column margin-bottom-30">
          <div className="title margin-bottom-30">{i18n.t("Notes")}</div>
          <div className="input-font">{serviceComment}</div>
        </div>

        {/* 订单信息 */}
        <div className="state-container flex-column margin-bottom-30">
          <div className="title margin-bottom-30">
            {i18n.t("Order information")}
          </div>

          {/* animal cards */}
          <div className="margin-bottom-30 ml-3">
            <Row gutter={petCardGutter}>{renderPetCards()}</Row>
          </div>

          <div className="subtitle">
            {`${i18n.t("Checkin Time")}：${orderStartDate}, ${i18n.t(
              "Checkout Time"
            )}：${orderEndDate}`}
          </div>

          <Divider />

          {/* 订单总价 */}
          <div className="info-row margin-bottom-20 subtitle">
            <span>
              {/* {`${i18n.t("Pet Care Days")} ${OrderDayNumber} ${i18n.t(
                "Day"
              )} (${i18n.t("Before Tax")})`} */}
              {i18n.t("Total Price")} ({i18n.t("Before Tax")})
            </span>
            <span>
              $
              {(
                Number(serviceOrderRentPrice) + Number(serviceOrderExtraPrice)
              ).toFixed(2)}
            </span>
          </div>

          {/* {renderServiceExtra} */}

          <div className="info-row margin-bottom-20 subtitle">
            <span>{i18n.t("Service Fee")}</span>
            <span>${Number(clientChargeFee).toFixed(2)}</span>
          </div>

          <div className="info-row margin-bottom-20 subtitle">
            <span>{i18n.t("Tax")}</span>
            <span>${Number(serviceOrderTaxPrice).toFixed(2)}</span>
          </div>

          {/* <div className="info-row margin-bottom-20 subtitle">
            <span>{i18n.t("Coupon Deduction")}</span>
            <span>${state?.serviceOrderCouponPrice}</span>
          </div> */}

          <Divider />

          <div className="total-price text-align-end">
            <span>
              ${" "}
              {(
                Number(serviceOrderRentPrice) +
                Number(serviceOrderTaxPrice) +
                Number(serviceOrderExtraPrice) +
                Number(clientChargeFee)
              ).toFixed(2)}
            </span>
          </div>
        </div>

        {/* 客人评语 */}
        {userReview && (
          <div className="state-container flex-column margin-bottom-30">
            <div className="title margin-bottom-30">
              {i18n.t("Customer Review")}
            </div>

            <Review
              name={orderDetail.userName}
              time={orderDetail.userReviewCreateTime}
              reviewStar={orderDetail.userReviewStar}
              content={orderDetail.userReviewContent}
              avatarUrl={orderDetail.userImage}
            />
          </div>
        )}

        {/* 房东评语 */}
        {serverReview && (
          <div className="state-container flex-column margin-bottom-30">
            <div className="title margin-bottom-30">
              {i18n.t("Landlord Review")}
            </div>

            <Review
              name={orderDetail.serverName}
              time={orderDetail.serverReviewCreateTime}
              reviewStar={orderDetail.serverReviewStar}
              content={orderDetail.serverReviewContent}
              avatarUrl={orderDetail.serverImage}
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
    </div>
  );
};

export default RecordServiceDetail;

// const getCustomerReview = () => {
//   console.log("get resview list input", state.serviceId);
//   axios
//     .get(
//       API_BASE_URL +
//         `review/getServiceReview.php?serviceId=${state.serviceId}`
//     )
//     .then((res) => {
//       console.log("get review result", res.data);
//       if (res.data.message === "success") {
//         if (res.data.data.length > 0) {
//           const result = res.data.data.filter(
//             (e) => e.fromId === userId && e.targetType === "0"
//           );
//           setCustomerReview(result);
//         }
//       }
//     })
//     .catch((error) => {});
// };

// const getLandlordReview = () => {
//   if (state.serverReview) {
//     axios
//       .get(
//         API_BASE_URL + `review/getUserReview.php?userId=${state.serverId}`
//       )
//       .then((res) => {
//         if (res.data.message === "success") {
//           if (res.data.data.length > 0) {
//             const result = res.data.data.filter(
//               (e) => e.fromId === state.serverId && e.targetType === "0"
//             );
//             setLandlordReview(result);
//           }
//         }
//       })
//       .catch((error) => {});
//   }
// };
