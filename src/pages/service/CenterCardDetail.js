import React, { useState, useEffect } from "react";

import { useHistory } from "react-router-dom";

//page component
import LoadingView from "../../components/loading/LoadingView";
import CenterCardDetailContent from "./components/CenterCardDetailContent";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  getServiceDetail,
  getServiceReivewList,
  getServiceDateList,
} from "../../redux/actions";
import { message } from "antd";
import I18n from "i18n-js";

const CenterCardDetail = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const userId = localStorage.getItem("userId");
  const serviceId = props.location.state;

  const { serviceDetail, serviceReview, serviceDetailMessage } = useSelector(
    (state) => state.serviceData
  );

  useEffect(() => {
    dispatch(getServiceDetail(serviceId, userId));
    dispatch(getServiceReivewList(serviceId));
    dispatch(getServiceDateList(serviceId));
  }, [dispatch, serviceId]);

  //没有登录就导航到首页
  if (!userId) {
    message.error(I18n.t("Please login"));
    history.push("/");
  }

  if (serviceDetailMessage === "201") {
    console.log(I18n.t("no item"));
    history.push("*");
  }

  if (!serviceDetail || !serviceReview) {
    return <LoadingView />;
  }

  return (
    <div className="servicecenter-detail-wrapper ">
      <div className="servicecenter-detail">
        <CenterCardDetailContent />
      </div>
    </div>
  );
};

export default CenterCardDetail;
