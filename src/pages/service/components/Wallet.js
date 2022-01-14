import React, { useState, useEffect } from "react";

import { Button, Avatar, Row, Col, Divider, Modal, Input, message } from "antd";

import LoadingView from "../../../components/loading/LoadingView";

import EmptyDataView from "../../../components/loading/EmptyDataView";

import stateNew from "../../../assets/img/service/state-new.png";

import stateVIP from "../../../assets/img/service/state-vip.png";

import axios from "axios";
import { API_BASE_URL } from "../../../configs/AppConfig";
import { useSelector, useDispatch } from "react-redux";
import { getServiceOrderList } from "../../../redux/actions";
import i18n from "i18n-js";

const Wallet = () => {
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");

  const serviceOrderList = useSelector(
    (state) => state.serviceData.serviceOrderList
  );
  // const userData = useSelector((state) => state.userData.userInfo);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [userData, setUserData] = useState();

  const [getCashParams, setGetCashParams] = useState({
    userId: userId,
    exchangePrice: "",
    exchangeEmail: "",
    exchangePassword: "",
  });

  useEffect(() => {
    dispatch(getServiceOrderList(`serverId=${userId}&orderState=4`));
    getUserInfo();
  }, []);

  const getUserInfo = () => {
    axios
      .get(API_BASE_URL + `user/getUserInfo.php?userId=${userId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setUserData(res.data.data);
      });
  };

  const handleGetCashButton = async () => {
    if (
      !getCashParams.exchangePrice ||
      !getCashParams.exchangePassword ||
      !getCashParams.exchangeEmail
    ) {
      message.error(i18n.t("Please complete the information"));
    } else {
      if (
        new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(
          getCashParams.exchangeEmail
        ) === false
      ) {
        message.error(i18n.t("Email you enter is not correct"));
      } else if (getCashParams.exchangePrice.includes("-")) {
        message.error(i18n.t("Please enter number"));
      } else {
        await axios
          .post(API_BASE_URL + "user/applyExchange.php", getCashParams, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            if (res.data.message === "success") {
              message.success(i18n.t("Submit success"));
              getUserInfo(userId);
            } else if (res.data.message === "no Points") {
              message.error(i18n.t("GetCashNoPointsError"));
            } else {
              message.error(i18n.t("Submit failed"));
            }
            //清除input values
            const resetValue = {
              userId: userId,
              exchangePrice: "",
              exchangeEmail: "",
              exchangePassword: "",
            };
            setGetCashParams(resetValue);
            setIsModalVisible(false);
          })
          .catch((error) => {});
      }
    }
  };

  if (!serviceOrderList || !userData) {
    return <LoadingView />;
  }

  const avatarStateObj = {
    0: stateNew,
    2: stateVIP,
  };

  const renderServiceList =
    serviceOrderList.length > 0 ? (
      serviceOrderList.map((element, index) => {
        return (
          <Row className="text-18 margin-bottom-30" key={index}>
            <Col className="d-flex align-items-center" lg={8} xs={8}>
              <img
                src={element.userImage}
                alt=""
                className="user-avatar-small"
              />

              <div className="ml-2">{element.userName}</div>
            </Col>

            <Col className="d-flex align-items-center" lg={11} xs={11}>
              {element.serviceOrderNo}
            </Col>

            <Col className="price-font text-18 " lg={5} xs={5}>
              {(
                element.serviceOrderTotalPrice - element.serverChargeFee
              ).toFixed(2)}
            </Col>
            {/* <Col className="price-font text-18 mt-3" lg={5} xs={8}>
              {element.serviceOrderTotalPyament}
            </Col>
            <Col className="price-font text-18 mt-3" lg={5} xs={8}>
              {element.serviceOrderTotalPyament}
            </Col> */}
          </Row>
        );
      })
    ) : (
      <EmptyDataView message={i18n.t("EmptyPageMessages")} />
    );

  return (
    <Row className="wallet-wrapper mb-5">
      {/* 总收入&提现 */}
      <Col xs={24} md={8} className="total-income-container mb-3">
        {/* 用户头像 */}
        <div className="user-avatar-container margin-bottom-30">
          {/* 头像 */}
          <Avatar
            className="avatar-img "
            icon={<img src={userData.userImage} alt="" />}
          />

          {(userData.serverLevel == 0 || userData.serverLevel == 2) && (
            <img
              className="state-style"
              src={avatarStateObj[userData.serverLevel]}
              alt=""
            />
          )}
        </div>

        {/* 用户名字 */}
        <div>
          <span className="font-20-45 margin-right-10">
            {userData.userName}
          </span>
          <span className="font-20-9f">{i18n.t("Your total income")}</span>
        </div>

        {/* 总收入金额 */}
        <div className="total-price margin-bottom-20">
          $ {Number(userData.serverPoints).toFixed(2)}
        </div>

        {/* 申请提现按钮 */}
        <Button
          onClick={() => setIsModalVisible(true)}
          className="primary-button w-50"
        >
          {i18n.t("Get Cash")}
        </Button>
      </Col>

      {/* 空白间隔 */}
      <Col xs={0} md={1}></Col>

      {/* 已完成订单列表  */}
      <Col xs={24} md={15} className="orderlist-container ">
        <div className="orderlist-section margin-bottom-30 py-3 px-3">
          <div className="text-18 margin-bottom-20">
            {i18n.t("Completed Orders")}
          </div>

          <Row className="w-100">
            <Col className="text-18" lg={8} xs={8}>
              {i18n.t("User Name")}
            </Col>

            <Col className="text-18" lg={11} xs={11}>
              {i18n.t("Order#")}
            </Col>

            <Col className="text-18 " lg={5} xs={5}>
              {i18n.t("Sum Of Consumption")}
            </Col>
          </Row>

          <Divider dashed />

          <div className="orderlist ">{renderServiceList}</div>
        </div>

        {/* <Pagination
          defaultCurrent={1}
          total={50}
          className="pagination-style"
        /> */}
      </Col>

      <Modal
        visible={isModalVisible}
        closable={false}
        footer={null}
        onCancel={() => {
          setIsModalVisible(false);
        }}
      >
        <div className="emt-modal">
          <div className="content-input-section font-20-9f margin-bottom-20">
            <div className="margin-bottom-15">
              {i18n.t("Please write down your email to get EMT transfer")}
            </div>

            <div className="two-items-row margin-bottom-10">
              <div className="margin-right-10">{i18n.t("E-mail")}:</div>
              <div>
                <Input
                  className="text-input text-input--grey"
                  type={"email"}
                  value={getCashParams.exchangeEmail}
                  onChange={(e) =>
                    setGetCashParams({
                      ...getCashParams,
                      exchangeEmail: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="two-items-row margin-bottom-10">
              <div className="margin-right-10">{i18n.t("Password")}:</div>
              <div>
                <Input
                  className="text-input text-input--grey"
                  value={getCashParams.exchangePassword}
                  onChange={(e) => {
                    setGetCashParams({
                      ...getCashParams,
                      exchangePassword: e.target.value,
                    });
                  }}
                  maxLength={6}
                  // type={"number"}
                  // pattern={"[0-9*]"}
                />
              </div>
            </div>

            <div className="two-items-row margin-bottom-10">
              <div className="margin-right-10">{i18n.t("Amount")}:</div>
              <div>
                <Input
                  className="text-input text-input--grey"
                  value={getCashParams.exchangePrice}
                  type="number"
                  min={0}
                  onChange={(e) => {
                    setGetCashParams({
                      ...getCashParams,
                      exchangePrice: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
          </div>

          {/* footer */}
          <div className="footer">
            <div
              onClick={() => {
                setIsModalVisible(false);
              }}
              className="return-button span-mouse-click"
            >
              {i18n.t("Return")}
            </div>
            <div className="confirm-button">
              <Button
                onClick={() => {
                  handleGetCashButton();
                }}
                className="primary-button confirm-button-font"
              >
                {i18n.t("Confirm")}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </Row>
  );
};

export default Wallet;
