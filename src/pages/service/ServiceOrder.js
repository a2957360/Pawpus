import React, { useEffect, useState } from "react";

import { useHistory } from "react-router-dom";

import { Row, Col, message } from "antd";

import moment from "moment";

import i18n from "i18n-js";

import LoadingView from "../../components/loading/LoadingView";
import OrderContent from "./components/OrderContent";
import Order from "./components/Order";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  getPetList,
  getServiceDetail,
  getServiceCategory,
  getPostByType,
} from "../../redux/actions";
import axios from "axios";
import { API_BASE_URL } from "../../configs/AppConfig";

const ServiceOrder = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const userId = localStorage.getItem("userId");

  const urlParams = new URLSearchParams(window.location.search);
  const entries = urlParams.entries();

  const params = {};
  for (const entry of entries) {
    params[entry[0]] = JSON.parse(entry[1]);
  }

  console.log("params", params);

  const { serviceDetail, petList, serviceCategory } = useSelector(
    (state) => state.serviceData
  );
  const { postListByType } = useSelector((state) => state.userData);

  const [isAddPetModalVisible, setIsAddPetModalVisible] = useState(false);

  const [priceParam, setPriceParam] = useState({
    serviceOrderPetCard: [],
    userPhone: null,
    serviceComment: null,
    arriveTime: null,
  });

  const [serviceOrderPrice, setServiceOrderPrice] = useState();

  // 已选中的日期,算选中的天数
  let duration = null;
  let startDate = moment(params.orderStartDate);
  let endDate = moment(params.orderEndDate);
  duration = endDate.diff(startDate, "days");

  // 一进来先获取服务详情，再获取用户的宠物列表
  useEffect(() => {
    dispatch(getServiceDetail(params.serviceId, userId));
    dispatch(getPetList(userId));
    dispatch(getServiceCategory());
    dispatch(getPostByType("3"));
  }, [dispatch, isAddPetModalVisible]);

  //get service price
  useEffect(() => {
    axios
      .post(API_BASE_URL + "service/getServiceOrderPrice.php", params, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.data.message === "success") {
          setServiceOrderPrice(res.data.data);
        }
      })
      .catch((error) => {
        console.log("get service order price failed", error);
      });
  }, []);

  const handleSubmitServiceOrder = () => {
    const data = {
      ...priceParam,
      ...serviceOrderPrice,
      userId: userId,
      serverId: serviceDetail.userId,
      serviceId: serviceDetail.serviceId,
      serviceInfo: serviceDetail,
      serviceOrderCouponPrice: null,
      servicePetNumber: params.quantity,
      serviceOrderPetInfo: params.serviceOrderPetInfo,
      serviceOrderExtra: params.serviceOrderExtra,
      orderStartDate: params.orderStartDate,
      orderEndDate: params.orderEndDate,
      clientChargeFee: serviceOrderPrice.clientChargeFee,
      serverChargeFee: serviceOrderPrice.serverChargeFee,
      serviceOrderTotalPyament: serviceOrderPrice.serviceOrderTotalPyament,
    };

    //如果该服务是自己发布的，不允许下单
    if (userId == serviceDetail.userId) {
      message.error(i18n.t("Can not order your own service"));
    }

    if (
      !priceParam.userPhone ||
      !priceParam.arriveTime ||
      priceParam.serviceOrderPetCard.length === 0 ||
      priceParam.serviceOrderPetCard.length !== params.quantity
    ) {
      if (priceParam.serviceOrderPetCard.length === 0) {
        message.error(i18n.t("Please select pet card"));
      } else if (priceParam.serviceOrderPetCard.length !== params.quantity) {
        message.error(
          i18n.t(
            "The pet cards you have selected do not match with your pet quantity"
          )
        );
      } else {
        message.error(
          i18n.t("Please complete your contact number and arrive time")
        );
      }
    } else {
      console.log("submit service order input data", data);
      axios
        .post(API_BASE_URL + "service/addServiceOrder.php", data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log("submit service order result", res.data);
          if (res.data.message === "success") {
            history.push({
              pathname: "/payment/method",
              state: {
                ...res.data.data,
                duration,
                selectedServiceExtra: params.serviceOrderExtra,
              },
              productPaymentFlag: false,
            });
          } else if (res.data.message === "date selected") {
            message.error(
              i18n.t(
                "Selected dates has been blocked, please select another dates"
              )
            );
          } else {
            message.error(i18n.t("Add order failed, please try again later"));
          }
        })
        .catch((error) => {
          console.log("add service order  failed", error);
        });
    }
  };

  // 如果没有用户id或者serviceID ，返回首页
  if (!userId || Object.keys(params).length === 0) {
    message.error(
      !userId ? i18n.t("Not logged in") : i18n.t("No service infomation")
    );
    history.push("/");
    return null;
  }

  if (
    !serviceDetail ||
    !petList ||
    !serviceOrderPrice ||
    !serviceCategory ||
    !postListByType
  ) {
    return <LoadingView />;
  }
  return (
    <div className="service-order-wrapper">
      <div className="service-order-inner-container responsive-container mb-3">
        <Row>
          <Col lg={17} xs={24}>
            <OrderContent
              orderParams={params}
              priceParam={priceParam}
              setPriceParam={setPriceParam}
              isAddPetModalVisible={isAddPetModalVisible}
              serviceOrderPrice={serviceOrderPrice}
              setIsAddPetModalVisible={setIsAddPetModalVisible}
            />
          </Col>

          <Col lg={1} xs={0}></Col>

          <Col lg={6} xs={24}>
            <Order
              quantity={params.quantity}
              duration={duration}
              serviceOrderPrice={serviceOrderPrice}
              handleSubmitServiceOrder={handleSubmitServiceOrder}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ServiceOrder;
