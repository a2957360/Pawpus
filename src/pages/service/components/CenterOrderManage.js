import React, { useState, useEffect } from "react";

import { useHistory } from "react-router-dom";

import I18n from "i18n-js";

import { Divider, Button, Row, Col } from "antd";

import LoadingView from "../../../components/loading/LoadingView";

//redux
import axios from "axios";
import { API_BASE_URL } from "../../../configs/AppConfig";
import { useSelector, useDispatch } from "react-redux";
import { getServiceOrderList } from "../../../redux/actions";
import EmptyDataView from "../../../components/loading/EmptyDataView";
// import { filter } from "lodash-es";

const CenterOrderManage = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const userId = localStorage.getItem("userId");
  const language = localStorage.getItem("language");

  const [serviceOrderList, setServiceOrderList] = useState();

  const getServiceOrders = () => {
    axios
      .get(API_BASE_URL + `service/getServiceOrder.php?serverId=${userId}`)
      .then((res) => {
        // const filteredData = res.data.data.filter((e) => e.orderState !== "0");
        // console.log("filteredData", filteredData);
        setServiceOrderList(res.data.data);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    // dispatch(getServiceOrderList(`serverId=${userId}`));
    getServiceOrders();
  }, []);

  if (!serviceOrderList) {
    return <LoadingView />;
  }

  //   //object lookup
  const stateTextList = {
    0: I18n.t("UnPaid"),
    1: I18n.t("UnConfirm"),
    2: I18n.t("Unship"),
    3: I18n.t("BeingBoarding"),
    4: I18n.t("Service Completed"),
    5: I18n.t("Paid/Canceled"),
    6: I18n.t("Refused"),
    7: I18n.t("UnPaid/Canceled"),
  };

  return serviceOrderList.length > 0 ? (
    serviceOrderList.map((element, index) => {
      let selectedService = "";
      element.serviceOrderExtra &&
        element.serviceOrderExtra.length > 0 &&
        element.serviceOrderExtra.forEach((i) => {
          selectedService += i.name[language] + " ";
        });

      let renderPetInfo = "";
      if (element.serviceOrderPetCard.length > 0) {
        element.serviceOrderPetCard.forEach((e, index) => {
          renderPetInfo += `1 ${I18n.t("quantityOfPet")} ${
            e.petType[language]
          } ${I18n.t("Age")} ${e.petAge} ${I18n.t("weight")} ${e.petWeight} ${
            index === element.serviceOrderPetCard.length - 1 ? " " : ","
          }`;
        });
      }

      const orderStateText = stateTextList[element.orderState];

      return (
        <div key={index} className="order-center-wrapper p-3 margin-bottom-30">
          {/* header */}
          <div className="d-flex record-14-70 w-100">
            {/* <div className="header-row-container record-14-70 margin-bottom-25"> */}
            <Row className="w-100">
              <Col xs={24} sm={7} md={6} xl={6}>
                {element.createTime.split(" ")[1].slice(0, 5) +
                  " " +
                  element.createTime.split(" ")[0]}
              </Col>

              <Col xs={24} sm={12} md={12} xl={8}>
                {I18n.t("Order#")}: {element.serviceOrderNo}
              </Col>

              <Col xs={24} sm={5} md={6} xl={6}>
                {I18n.t("Buyer")}: {element.userName}
              </Col>
            </Row>

            {/* 查看详情 */}

            <Button
              onClick={() =>
                history.push({
                  pathname: "/record/servicedetailcenter",
                  state: element,
                })
              }
              className="transparent-button"
            >
              {I18n.t("Detail")}
            </Button>
          </div>

          {/* 图片和时间 */}
          <div className="content-row-container">
            <Row className="w-100">
              <Col className="detail-container" xs={6} sm={6} md={4} xl={4}>
                <img
                  className="avatar-container "
                  src={element.userImage}
                  alt=""
                />
              </Col>
              <Col xs={18} sm={18} md={12} xl={12}>
                <div className="detail-section">
                  <div className="mb-1">
                    <span className="font-20-59 mr-3">{element.userName}</span>
                    <span className="font-15-8c">
                      {I18n.t("Has booked your service")}
                    </span>
                  </div>
                  <div className="font-18-8c">
                    {/* {element.servicePetNumber}
                    {I18n.t("quantityOfPet")} {element.categoryName[language]} */}
                    {renderPetInfo}
                  </div>
                  <div className="font-18-8c">
                    <span>
                      {I18n.t("Checkin Time")}: {element.orderStartDate},
                    </span>
                    <span>
                      {` ${I18n.t("Checkout Time")}: ${element.orderEndDate}`}
                    </span>
                    {element.serviceOrderExtra &&
                      element.serviceOrderExtra.length > 0 && (
                        <span>{` ${I18n.t("Booked")} ${selectedService}`}</span>
                      )}
                  </div>
                </div>
              </Col>

              {/* 客人留言 */}
              {element.serviceComment && (
                <Col xs={24} sm={24} md={8} xl={8}>
                  <div className="note-container">
                    <div className="subtitle fw-bold mb-1">
                      {I18n.t("Notes")}
                    </div>
                    <div className="comment-row">{element.serviceComment}</div>
                  </div>
                </Col>
              )}
            </Row>
          </div>

          <Divider dashed />

          {/* 订单状态 */}
          <Row className="state-price-row-container d-flex align-items-center">
            <Col
              xs={24}
              sm={16}
              md={16}
              xl={16}
              className="record-14-70 d-flex align-items-center pt-3"
            >
              <span className="mr-3">{orderStateText}</span>

              {/* 联系买家 */}
              {element.orderState === "0" && (
                <Button className="white-button mr-3">
                  {I18n.t("Contact Buyer")}
                </Button>
              )}

              {/* 拒绝订单 */}
              {element.orderState === "1" && (
                <Button
                  onClick={() => {
                    history.push({
                      pathname: "/record/servicedetailcenter",
                      state: element,
                    });
                  }}
                  // onClick={() => handleStateButton(element.serviceOrderId, "6")}
                  className="white-button margin-left-10"
                >
                  {I18n.t("Refuse Order")}
                </Button>
              )}

              {/* 确认订单 */}
              {element.orderState === "1" && (
                <Button
                  onClick={() => {
                    history.push({
                      pathname: "/record/servicedetailcenter",
                      state: element,
                    });
                  }}
                  // onClick={() => handleStateButton(element.serviceOrderId, "2")}
                  className="white-button margin-left-10"
                >
                  {I18n.t("Comfirm Order")}
                </Button>
              )}

              {/* 确认入住 */}
              {element.orderState === "2" && (
                <Button
                  onClick={() => {
                    history.push({
                      pathname: "/record/servicedetailcenter",
                      state: element,
                    });
                  }}
                  // onClick={() => handleStateButton(element.serviceOrderId, "3")}
                  className="white-button margin-left-10"
                >
                  {I18n.t("Confirm Checkin")}
                </Button>
              )}

              {/* 确认接走 */}
              {element.orderState === "3" && (
                <Button
                  onClick={() => {
                    history.push({
                      pathname: "/record/servicedetailcenter",
                      state: element,
                    });
                  }}
                  // onClick={() => handleStateButton(element.serviceOrderId, "4")}
                  className="white-button margin-left-10"
                >
                  {I18n.t("Confirm Checkout")}
                </Button>
              )}

              {/* 评论 */}
              {element.orderState === "4" && !element.serverReview && (
                <Button
                  onClick={() => {
                    history.push({
                      pathname: "/record/servicedetailcenter",
                      state: element,
                    });
                  }}
                  className="white-button state-button-font"
                >
                  {I18n.t("Rate Service")}
                </Button>
              )}
            </Col>
            <Col xs={24} sm={8} md={8} xl={8} className="pt-3">
              <span className="font-18-70 mr-4 ">{I18n.t("Total Price")}</span>
              <span className="total-price-small">
                ${Number(element.serviceOrderTotalPrice).toFixed(2)}
                {/* {(
                  Number(element.serviceOrderRentPrice) +
                  Number(element.serviceOrderTaxPrice) +
                  Number(element.serviceOrderExtraPrice) -
                  Number(element.serverChargeFee)
                ).toFixed(2)} */}
              </span>
              <span className="font-16-9f">
                ({I18n.t("Including deliver fee and tax")})
              </span>
            </Col>
          </Row>
        </div>
      );
    })
  ) : (
    <EmptyDataView message={I18n.t("EmptyPageMessages")} />
  );
};
export default CenterOrderManage;
