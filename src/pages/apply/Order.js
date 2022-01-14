import React, { useState, useEffect } from "react";

import { useHistory } from "react-router-dom";

import { Input, Divider, Button } from "antd";

import FAKE_AVATAR from "../../assets/img/fake/1.png";

import LoadingView from "../../components/loading/LoadingView";

//redux
import { useSelector, useDispatch } from "react-redux";
import { getServiceOrderList } from "../../redux/actions";

const Order = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const userId = localStorage.getItem("userId");

  const serviceOrderList = useSelector(
    (state) => state.serviceData.serviceOrderList
  );

  const FAKE_DATA = [
    {
      date: "14:20 2021年12月22日",
      orderNumebr: "5461658489162",
      buyerName: "吃草的鱼",
      age: "3岁",
      quantity: "10",
      petType: "田园猫",
      checkinTime: "14:00 12-02-2021",
      checkoutTime: "16:00 12-03-2021",
      service: "餐饮，卫生护理",
      note: "请按时喂饭",
      totalPrice: "1335.64",
    },
    {
      date: "14:20 2021年12月22日",
      orderNumebr: "5461658489162",
      buyerName: "吃草的鱼",
      age: "3岁",
      quantity: "10",
      petType: "田园猫",
      checkinTime: "14:00 12-02-2021",
      checkoutTime: "16:00 12-03-2021",
      service: "餐饮，卫生护理",
      note: "请按时喂饭",
      totalPrice: "1335.64",
    },
    {
      date: "14:20 2021年12月22日",
      orderNumebr: "5461658489162",
      buyerName: "吃草的鱼",
      age: "3岁",
      quantity: "10",
      petType: "田园猫",
      checkinTime: "14:00 12-02-2021",
      checkoutTime: "16:00 12-03-2021",
      service: "餐饮，卫生护理",
      note: "请按时喂饭",
      totalPrice: "1335.64",
    },
    {
      date: "14:20 2021年12月22日",
      orderNumebr: "5461658489162",
      buyerName: "吃草的鱼",
      age: "3岁",
      quantity: "10",
      petType: "田园猫",
      checkinTime: "14:00 12-02-2021",
      checkoutTime: "16:00 12-03-2021",
      service: "餐饮，卫生护理",
      note: "请按时喂饭",
      totalPrice: "1335.64",
    },
    {
      date: "14:20 2021年12月22日",
      orderNumebr: "5461658489162",
      buyerName: "吃草的鱼",
      age: "3岁",
      quantity: "10",
      petType: "田园猫",
      checkinTime: "14:00 12-02-2021",
      checkoutTime: "16:00 12-03-2021",
      service: "餐饮，卫生护理",
      note: "请按时喂饭",
      totalPrice: "1335.64",
    },
  ];

  useEffect(() => {
    dispatch(getServiceOrderList(userId));
  }, []);

  if (!serviceOrderList) {
    return <LoadingView />;
  }

  return FAKE_DATA.map((element, index) => {
    return (
      <div key={index} className="order-center-wrapper margin-bottom-30">
        {/* header */}
        <div className="header-row-container record-14-70 margin-bottom-25">
          <div>
            <span className="margin-right-40">时间日期</span>
            <span className="margin-right-20">订单编号</span>
            <span>买家</span>
          </div>
          <div>
            <span className="span-mouse-click">查看详情</span>
          </div>
        </div>

        <div className="content-row-container">
          <div className="detail-container">
            <img
              className="avatar-container margin-right-30"
              src={FAKE_AVATAR}
              alt=""
            />

            <div className="detail-section">
              <div className="margin-bottom-10">
                <span className="font-20-59 margin-right-20">
                  速速老公是上线
                </span>
                <span className="font-15-8c">已预定了您的服务</span>
              </div>
              <div className="font-18-8c">3岁，田园猫，1只</div>
              <div className="font-18-8c">
                kaskdfjlasdflkasdflkjladsfjlkajdsf
              </div>
            </div>
          </div>
          <div className="note-container">
            <div className="subtitle fw-bold margin-bottom-10">备注</div>
            <div>
              <Input className="font-18-8c text-input text-input--grey" />
            </div>
          </div>
        </div>

        <Divider dashed />

        <div className="state-price-row-container">
          <div>
            <span className="record-14-70 margin-right-40">代付款</span>
            <Button className="white-button">联系买家</Button>
          </div>
          <div>
            <span className="font-18-70 margin-right-40 ">总计金额</span>
            <span className="total-price-small">1564.55</span>
            <span className="font-16-9f"> (含运费税费)</span>
          </div>
        </div>
      </div>
    );
  });
};
export default Order;
