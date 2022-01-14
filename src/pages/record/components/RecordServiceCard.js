import React, { useState } from "react";
import { useHistory } from "react-router-dom";

//redux
import i18n from "i18n-js";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateContactList } from "../../../redux/actions";
import { API_BASE_URL } from "../../../configs/AppConfig";

//firebase
import firebase from "firebase";
import "firebase/firestore";

//packages
import { Row, Col, Divider, Button, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const RecordServiceCard = ({
  data,
  tab,
  handleCancelOrder,
  // setIsModalVisible,
  // setSelectedService,
}) => {
  const db = firebase.firestore();
  const dispatch = useDispatch();
  const history = useHistory();
  const language = localStorage.getItem("language");

  const [addressModal, setAddressModal] = useState(false);

  const { confirm } = Modal;

  let renderServiceExtra = "";
  if (data.serviceOrderExtra && data.serviceOrderExtra.length > 0) {
    data.serviceOrderExtra.forEach((element) => {
      renderServiceExtra += i18n.t("Include") + element.name[language] + " ";
    });
  }

  const stateTextList = {
    0: i18n.t("UnPaid"),
    1: i18n.t("UnConfirm"),
    2: i18n.t("UnCheckin"),
    3: i18n.t("BeingBoarding"),
    4: i18n.t("Service Completed"),
    5: i18n.t("Paid/Canceled"),
    6: i18n.t("Refused"),
    7: i18n.t("UnPaid/Canceled"),
  };

  const orderStateText = stateTextList[data.orderState];

  const contactLandlord = async () => {
    const chaterId = localStorage.getItem("userId");

    if (!chaterId) {
      return;
    }
    //initial firebase chatroom collection
    const chaterDocRef = db.doc(`${chaterId}/${chaterId}_${data.serverId}`);
    const chateeDocRef = db.doc(
      `${data.serverId}/${data.serverId}_${chaterId}`
    );

    axios
      .get(API_BASE_URL + `user/getUserInfo.php?userId=${data.serverId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log("chateeData", res.data);
        if (res.data.message === "success") {
          chaterDocRef.set(
            {
              lastViewServiceId: data.serviceId,
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
          dispatch(updateContactList(chaterId, data.serverId, data.serviceId));
          // //redirect to chat page
          history.push({
            pathname: "/chat",
            state: { chateeId: data.serverId, serviceId: data.serviceId },
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

  return (
    <div className="record-shop-card-wrapper margin-bottom-30">
      {/* header */}
      <div className="d-flex record-14-70 w-100">
        <Row className="w-100">
          <Col xs={24} sm={7} md={6} xl={6}>
            {data.createTime.split(" ")[1].slice(0, 5) +
              " " +
              data.createTime.split(" ")[0]}
          </Col>

          <Col xs={24} sm={12} md={12} xl={8}>
            {i18n.t("Order#")}: {data.serviceOrderNo}
          </Col>

          <Col xs={24} sm={5} md={6} xl={6}>
            {i18n.t("Merchant")}: {data.serverName}
          </Col>
        </Row>

        <Button
          onClick={() =>
            history.push({
              pathname: `/record/servicedetail/${data.serviceOrderId}`,
              // pathname: "/record/servicedetail",
              // search: data.serviceOrderId,
              state: data.serviceOrderId,
              tab: tab,
            })
          }
          className="transparent-button"
        >
          {i18n.t("Detail")}
        </Button>
      </div>

      {/* 图片和时间 */}
      <div className="shop-product-row-wrapper">
        <Row className="each-row">
          {/* image */}
          <Col span={4} className="text-center">
            <div className="image-section">
              <img
                src={
                  data.serviceImage &&
                  data.serviceImage.length > 0 &&
                  data.serviceImage[0]
                }
                alt="/"
                className="product-image"
              />
            </div>
          </Col>

          {/* name */}
          {/* <Col xs={12} sm={12} md={7} xl={7}> */}
          <Col xs={20} sm={20} md={12} xl={12}>
            <div className="product-content-container padding-left-20">
              <div className="margin-bottom-10">
                <span className="product-name margin-right-10">
                  {data.serviceName}
                </span>
                <span className="provider-name font-color-8c">
                  {`${i18n.t("By")} ${data.serverName} ${i18n.t("Provide")}`}
                </span>
              </div>
              <div>
                <span className="detail-name font-color-8c">
                  {`${i18n.t("Total")} ${data.OrderDayNumber} ${i18n.t(
                    "Day"
                  )} ${renderServiceExtra}`}
                </span>
              </div>
            </div>
          </Col>

          {/* single price */}
          {/* <Col xs={12} sm={12} md={12} xl={12}> */}
          {/* notes*/}
          <Col xs={24} sm={24} md={8} xl={8}>
            <div className="center-record-note ">
              <div className="note-title">{i18n.t("Notes")}</div>
              <div className="note-message">{data.serviceComment}</div>
            </div>
          </Col>
        </Row>
      </div>

      <Divider dashed={true} />

      <Row className="total-price-section d-flex align-items-center">
        <Col
          xs={24}
          sm={16}
          md={16}
          xl={16}
          className="state-button-section record-14-70 d-flex align-items-center pt-3"
        >
          <div className="margin-right-20">{orderStateText}</div>
          <div className="buttons-contain">
            <Row>
              <Col>
                {data.orderState === "0" && (
                  <Button
                    onClick={() => {
                      history.push({
                        pathname: "/payment/method",
                        state: data,
                        productPaymentFlag: false,
                      });
                    }}
                    className="margin-right-20 white-button"
                  >
                    {i18n.t("Pay Order")}
                  </Button>
                )}
              </Col>

              {/* 取消订单 */}
              <Col>
                {["0", "1"].includes(data.orderState) && (
                  <Button
                    onClick={() => {
                      showDeleteConfirm(data.serviceOrderId, data.orderState);
                    }}
                    className="white-button margin-right-20"
                  >
                    {i18n.t("Cancel")}
                  </Button>
                )}
              </Col>

              {/* 联系房东 */}
              <Col>
                {["0", "1", "2", "3"].includes(data.orderState) && (
                  <Button
                    onClick={() => contactLandlord()}
                    className="white-button margin-right-20"
                  >
                    {i18n.t("Contact Landlord")}
                  </Button>
                )}
              </Col>

              {/* 评论 */}
              <Col>
                {data.orderState === "4" && !data.userReview && (
                  <Button
                    onClick={() =>
                      history.push({
                        pathname: `/record/servicedetail/${data.serviceOrderId}`,
                        state: data.serviceOrderId,
                        tab: tab,
                      })
                    }
                    className="white-button"
                  >
                    {i18n.t("Rate Service")}
                  </Button>
                )}
              </Col>

              {/* 查看地址 支付之后就可以看地址,取消状态下不可以看 */}
              <Col>
                {data.orderState != "0" && data.orderState != "5" && (
                  <Button
                    onClick={() => setAddressModal(true)}
                    className="white-button"
                  >
                    {i18n.t("See Address")}
                  </Button>
                )}
              </Col>
            </Row>
          </div>
        </Col>

        <Col xs={24} sm={8} md={8} xl={8} className="pt-3">
          <span className="price-total-title margin-right-10">
            {i18n.t("Total Price")}
          </span>

          <span className="total-price-small">
            {/* ${data.serviceOrderTotalPyament} */}
            {(
              Number(data.serviceOrderRentPrice) +
              Number(data.serviceOrderTaxPrice) +
              Number(data.serviceOrderExtraPrice) +
              Number(data.clientChargeFee)
            ).toFixed(2)}
          </span>
        </Col>
      </Row>

      <Modal
        centered
        footer={null}
        visible={addressModal}
        onOk={() => setAddressModal(false)}
        onCancel={() => setAddressModal(false)}
      >
        <div>
          {i18n.t("Address")}:{" "}
          {`${data.serviceAddress}, ${data.serviceCity}, ${data.servicePostal}, ${data.serviceProvince}`}
        </div>
        <div>
          {i18n.t("Phone Number")}: {data.servicePhone}
        </div>
      </Modal>
    </div>
  );
};

export default RecordServiceCard;
