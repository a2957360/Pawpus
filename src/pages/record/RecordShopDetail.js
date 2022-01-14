import { useEffect, useState } from "react";

import { Row, Col, Button, Divider, message } from "antd";

import { useHistory } from "react-router-dom";

import i18n from "i18n-js";

import LoadingView from "../../components/loading/LoadingView";
import Review from "../../components/review/Review";
import RateModal from "./components/RateModal";
import CustomerServiceModal from "./components/CustomerServiceModal";

//redux
import axios from "axios";
import { API_BASE_URL } from "../../configs/AppConfig";
// import { useDispatch, useSelector } from "react-redux";

const RecordShopDetail = (props) => {
  const history = useHistory();
  const userId = localStorage.getItem("userId");
  const language = localStorage.getItem("language");

  // const { state } = props.location;
  const pathList = props.location.pathname.split("/");
  const itemOrderId = pathList[pathList.length - 1];

  const [customerReview, setCustomerReview] = useState([]);
  const [itemOrderData, setItemOrderData] = useState();
  const [contactModalVisible, setContactModalVisible] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputReview, setInputReview] = useState();
  const [reviewStar, setReviewStar] = useState();

  const getCustomerReview = (itemId) => {
    // console.log("get resview list input", itemId);
    axios
      .get(API_BASE_URL + `review/getItemReview.php?itemId=${itemId}`)
      .then((res) => {
        // console.log("get review result", res.data);
        if (res.data.message === "success") {
          if (res.data.data.length > 0) {
            const result = res.data.data.filter(
              (e) => e.fromId === userId && e.targetType === "1"
            );
            setCustomerReview(result);
          }
        }
      })
      .catch((error) => {});
  };

  const getItemOrderDetail = () => {
    axios
      .get(
        API_BASE_URL +
          `item/getItemOrder.php?userId=${userId}&itemOrderId=${itemOrderId}`
      )
      .then((res) => {
        // console.log("get item order result", res.data.data[0]);
        if (res.data.data.length === 0) {
          history.push("/");
          message.error(i18n.t("This order does not exist"));
          return;
        } else {
          setItemOrderData(res.data.data[0]);
        }
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getItemOrderDetail();
  }, []);

  useEffect(() => {
    if (itemOrderData) {
      getCustomerReview(itemOrderData.itemList[0].itemId);
    }
  }, [itemOrderData]);

  const handleRateButton = () => {
    if (!inputReview || !reviewStar) {
      message.error(
        !reviewStar
          ? i18n.t("Please complete rating")
          : i18n.t("Please write down your review")
      );
    } else {
      const itemIds = itemOrderData.itemList.map((e) => e.itemId);
      const data = {
        targetId: itemIds,
        fromId: userId,
        orderId: itemOrderData.itemOrderId,
        reviewContent: inputReview,
        reviewStar: reviewStar,
        targetType: "1",
      };
      console.log("add product review", data);
      axios
        .post(API_BASE_URL + "review/addReview.php", data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log("add product review result", res.data);
          //重新获取list
          if (res.data.message === "success") {
            message.success("rateSuccess");
            setIsModalVisible(false);
            // getCustomerReview();
            // history.push({
            //   pathname: "/record/shop",
            //   state: tab,
            // });
          }
        })
        .catch((error) => {});
    }
  };

  if (!userId) {
    message.error(i18n.t("Please login"));
    history.push("/");
    return;
  }

  if (!itemOrderData) {
    return <LoadingView />;
  }

  const stateTextList = {
    0: i18n.t("UnPaid"),
    1: i18n.t("Unship"),
    2: i18n.t("Sent"),
    3: i18n.t("Delivered"),
    4: i18n.t("Refunding"),
    5: i18n.t("Paid/Canceled"),
    6: i18n.t("Refused"),
    7: i18n.t("UnPaid/Canceled"),
  };

  const orderStateText = stateTextList[itemOrderData.orderState];

  const renderItems =
    itemOrderData.itemList.length > 0
      ? itemOrderData.itemList.map((element) => {
          return (
            <div className="info-row margin-bottom-20 subtitle">
              <span>{element.itemTitle}</span>
              <span>${element.subTotal}</span>
            </div>
          );
        })
      : null;

  return (
    <div className="record-shop-detail-wrapper ">
      <div className="record-shop-detail-inner-container responsive-container margin-bottom-30">
        {/* header */}
        <Row className="header-container record-14-70 margin-bottom-30">
          <Col className="margin-right-40">
            {itemOrderData.createTime.split(" ")[1].slice(0, 5) +
              " " +
              itemOrderData.createTime.split(" ")[0]}
          </Col>

          <Col>
            {i18n.t("Order#")}: {itemOrderData.orderNo}
          </Col>
        </Row>

        {/* state */}
        <div className="state-container flex-column margin-bottom-30">
          <div>
            <span className="mr-4 state-title">{i18n.t("Order state")}</span>

            <span className="margin-right-20 state">{orderStateText}</span>

            {/* 未付款 */}
            {itemOrderData.orderState === "0" && (
              <Button
                onClick={() => {
                  history.push({
                    pathname: "/payment/method",
                    state: itemOrderData,
                    productPaymentFlag: true,
                  });
                }}
                className="white-button state-button-font margin-right-20"
              >
                {i18n.t("Pay Order")}
              </Button>
            )}

            {/* 联系客服 */}
            {(itemOrderData.orderState === "1" ||
              itemOrderData.orderState === "2") && (
              <Button
                onClick={() => setContactModalVisible(true)}
                className="white-button state-button-font margin-right-20"
              >
                {i18n.t("Contact Customer Service")}
              </Button>
            )}

            {/* 评论 */}
            {itemOrderData.orderState === "4" && !itemOrderData.userReview && (
              <Button
                onClick={() => setIsModalVisible(true)}
                className="white-button state-button-font"
              >
                {i18n.t("Rate")}
              </Button>
            )}
          </div>

          {/* <div className="state-message">操作类型： 等待买家支付</div>
          <div className="state-message">关闭原因： 本订单会在5分钟后关闭</div> */}
        </div>

        {/* note */}
        <div className="state-container flex-column margin-bottom-30">
          <div className="title margin-bottom-30">{i18n.t("Notes")}</div>
          <div className="input-font">{itemOrderData.itemOrderComment}</div>
        </div>

        {/* info */}
        <div className="state-container flex-column margin-bottom-30">
          <div className="title">{i18n.t("Order information")}</div>
          <Divider />

          {renderItems}

          <div className="info-row margin-bottom-20 subtitle">
            <span>{i18n.t("Deliver Fee")}</span>
            <span>${itemOrderData.deliverPrice}</span>
          </div>

          <div className="info-row margin-bottom-20 subtitle">
            <span>{i18n.t("Tax")}</span>
            <span>${itemOrderData.tax}</span>
          </div>

          <div className="info-row margin-bottom-20 subtitle">
            <span>{i18n.t("Coupon Deduction")}</span>
            <span>${itemOrderData.coupon}</span>
          </div>

          <Divider />

          <div className="total-price text-align-end">
            <span>$ {itemOrderData.total}</span>
          </div>
        </div>

        {/* 客人评语 */}
        {customerReview.length !== 0 && (
          <div className="state-container margin-bottom-30">
            <div className="title margin-bottom-30">
              {i18n.t("Customer Review")}
            </div>

            <Review
              name={customerReview[0].userName}
              time={customerReview[0].createTime}
              reviewStar={customerReview[0].reviewStar}
              content={customerReview[0].reviewContent}
              avatarUrl={customerReview[0].userImage}
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

      <CustomerServiceModal
        isModalVisible={contactModalVisible}
        setIsModalVisible={setContactModalVisible}
      />
    </div>
  );
};

export default RecordShopDetail;
