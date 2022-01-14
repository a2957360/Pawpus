import React, { useState, useEffect } from "react";

import { useHistory } from "react-router-dom";

import { Divider, Button } from "antd";
import i18n from "i18n-js";

import LoadingView from "../../../components/loading/LoadingView";

//redux
import { useSelector, useDispatch } from "react-redux";
import { getServiceOrderList } from "../../../redux/actions";
import EmptyDataView from "../../../components/loading/EmptyDataView";

const BlockDateModifyOrderManage = ({ serviceData }) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const language = localStorage.getItem("language");

  const serviceOrderList = useSelector(
    (state) => state.serviceData.serviceOrderList
  );

  useEffect(() => {
    dispatch(getServiceOrderList(serviceData));
  }, []);

  if (!serviceOrderList) {
    return <LoadingView />;
  }

  return serviceOrderList.length > 0 ? (
    serviceOrderList.map((element, index) => {
      let selectedService = "";
      element.serviceOrderExtra &&
        element.serviceOrderExtra.length > 0 &&
        element.serviceOrderExtra.forEach((i) => {
          selectedService += i.extraName + " ";
        });

      // let orderStateText;
      // if (element.orderState === "0") {
      //   orderStateText = "待付款";
      // } else if (element.orderState === "1") {
      //   orderStateText = "待确认";
      // } else if (element.orderState === "2") {
      //   orderStateText = "待寄送";
      // } else if (element.orderState === "3") {
      //   orderStateText = "寄养中";
      // } else if (element.orderState === "4") {
      //   orderStateText = "服务结束";
      // } else if (element.orderState === "5") {
      //   orderStateText = "已取消";
      // }

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

      const orderStateText = stateTextList[element.orderState];

      return (
        <div key={index} className="datemodify-order-wrapper margin-bottom-30">
          {/* header */}
          <div className="header-row-container record-14-70 margin-bottom-25">
            <div>
              <span className="margin-right-40">
                {element.createTime.split(" ")[1].slice(0, 5) +
                  " " +
                  element.createTime.split(" ")[0]}
              </span>
              <span className="margin-right-20">
                {i18n.t("Order#")}: {element.serviceOrderNo}
              </span>
              <span>
                {i18n.t("Buyer")}: {element.userName}
              </span>
            </div>
            <div>
              <span
                onClick={() =>
                  history.push({
                    pathname: "/record/servicedetailcenter",
                    state: element,
                  })
                }
                className="span-mouse-click"
              >
                {i18n.t("Detail")}
              </span>
            </div>
          </div>

          <div className="content-row-container">
            <div className="detail-container">
              <img
                className="avatar-container margin-right-30"
                src={element.userImage}
                alt=""
              />

              <div className="detail-section">
                <div className="margin-bottom-10">
                  <span className="font-20-59 margin-right-20">
                    {element.userName}
                  </span>
                  <span className="font-15-8c">
                    {i18n.t("Has booked your service")}
                  </span>
                </div>
                <div className="font-18-8c">
                  {element.categoryName[language]}，{element.servicePetNumber}
                  {i18n.t("quantityOfPet")}
                </div>
                <div className="font-18-8c">
                  <span>
                    {i18n.t("Checkin Time")}: {element.orderStartDate},{" "}
                  </span>
                  <span>
                    {i18n.t("Checkout Time")}: {element.orderEndDate}{" "}
                  </span>
                  <span>
                    {i18n.t("Booked")} {selectedService}{" "}
                  </span>
                </div>
              </div>
            </div>

            {element.serviceComment && (
              <div className="note-container">
                <div className="subtitle fw-bold margin-bottom-10">
                  {i18n.t("Notes")}
                </div>
                <div className="comment-row">{element.serviceComment}</div>
              </div>
            )}
          </div>

          <Divider dashed />

          <div className="state-price-row-container">
            <div>
              <span className="record-14-70 margin-right-40">
                {orderStateText}
              </span>
              <Button className="white-button">
                {i18n.t("Contact Buyer")}
              </Button>
            </div>
            <div>
              <span className="font-18-70 margin-right-40 ">
                {i18n.t("Total Price")}
              </span>
              <span className="total-price-small">
                {element.serviceOrderTotalPrice}
              </span>
              <span className="font-16-9f">
                {" "}
                ({i18n.t("Including deliver fee and tax")})
              </span>
            </div>
          </div>
        </div>
      );
    })
  ) : (
    <EmptyDataView message={i18n.t("EmptyPageMessages")} />
  );
};
export default BlockDateModifyOrderManage;
