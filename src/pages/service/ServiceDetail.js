import React, { useEffect } from "react";

import { useHistory } from "react-router-dom";

import { message } from "antd";

//page component
import LoadingView from "../../components/loading/LoadingView";
import ServiceDetailContent from "./components/ServiceDetailContent";
import ServiceDetailCalculator from "./components/ServiceDetailCalculator";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  getServiceDetail,
  getServiceReivewList,
  getServiceDateList,
} from "../../redux/actions";
import I18n from "i18n-js";

//components
const ServiceDetail = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const userId = window.localStorage.getItem("userId");

  const serviceId = props.match.params.id;

  const urlParams = new URLSearchParams(window.location.search);
  const entries = urlParams.entries();
  const paredUrlParams = {};
  for (const entry of entries) {
    paredUrlParams[entry[0]] = JSON.parse(entry[1]);
  }

  const emptyData = {
    categoryId: null,
    endDate: null,
    endPrice: null,
    petStock: null,
    serviceCity: [],
    serviceExtra: [],
    serviceLanguage: "0",
    serviceSubCategory: [],
    startDate: null,
    startPrice: null,
    serviceOrderPetInfoInput: [],
    serviceOrderExtraInput: [],
  };

  const searchData = Object.assign(emptyData, paredUrlParams);

  const { serviceDetail, serviceReview, serviceDetailMessage, serviceDates } =
    useSelector((state) => state.serviceData);

  useEffect(() => {
    dispatch(getServiceDetail(serviceId, userId));
    dispatch(getServiceReivewList(serviceId));
    dispatch(getServiceDateList(serviceId));
  }, [dispatch, serviceId]);

  //没有登录就导航到首页
  // if (!userId) {
  //   message.error(I18n.t("Please login"));
  //   history.push("/");
  // }

  if (serviceDetailMessage === "201") {
    // console.log("no item");
    history.push("*");
  }

  if (!serviceDetail || !serviceReview || !serviceDates) {
    return <LoadingView />;
  }

  return (
    <div className="service-detail-wrapper">
      <div className="service-detail">
        <div className="service-detail-content">
          <ServiceDetailContent searchData={searchData} />
        </div>

        <div className="service-detail-calculator">
          <ServiceDetailCalculator searchData={searchData} />
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
