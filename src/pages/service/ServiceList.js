import React, { useEffect, useState } from "react";

//redux
import axios from "axios";
import { API_BASE_URL } from "../../configs/AppConfig";
import { useDispatch, useSelector } from "react-redux";
import {
  // getServiceList,
  getServiceCategory,
  getServiceLocationList,
} from "../../redux/actions";

//global component
import Filter from "../../components/layout/filter";

//page component
import RouterLoading from "../../components/loading/RouterLoading";
import Sort from "./components/Sort";
import List from "./components/List";
import EmptyDataView from "../../components/loading/EmptyDataView";

import { LeftSquareOutlined, RightSquareOutlined } from "@ant-design/icons";
import { message } from "antd";
import I18n from "i18n-js";

//components
const ServiceList = () => {
  const dispatch = useDispatch();
  // const userId = localStorage.getItem("userId");

  const { serviceLocation, serviceCategory } = useSelector(
    (state) => state.serviceData
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [offset, setOffset] = useState(null);
  const [serviceDataList, setServiceDataList] = useState({});
  const [data, setData] = useState();

  const emptyData = {
    serviceCity: null,
    startDate: null,
    endDate: null,
    petStock: null,
    categoryId: null,
    serviceExtra: null,
    serviceSubCategory: null,
    startPrice: null,
    endPrice: null,
    userId: null,
    serviceLanguage: null,
    // offset: offset,
    orderBy: "regular",
    sort: null,
    searchContent: null,
  };

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const entries = urlParams.entries();

  const paredUrlParams = {};
  for (const entry of entries) {
    paredUrlParams[entry[0]] = JSON.parse(entry[1]);
  }

  const params = Object.assign(emptyData, paredUrlParams);

  useEffect(() => {
    dispatch(getServiceCategory());
    dispatch(getServiceLocationList());

    const getServiceDataListFirstTime = async () => {
      const inputData = params
        ? { ...params, offset: null }
        : { ...emptyData, offset: null };

      await axios
        .post(API_BASE_URL + "service/getService.php", inputData, {
          headers: {
            // "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (res.data.message === "success") {
            setServiceDataList({
              ...serviceDataList,
              1: res.data.data,
            });
            setOffset(res.data.offset);
            setData(res.data.data);
          }
        })
        .catch((error) => {});
    };
    getServiceDataListFirstTime();
  }, []);

  const handlePageChange = (type) => {
    if (type === "left") {
      if (currentPage > 1) {
        setData(serviceDataList[currentPage - 1]);
        setCurrentPage(currentPage - 1);
      }
    } else if (type === "right") {
      if (serviceDataList[currentPage + 1]) {
        setData(serviceDataList[currentPage + 1]);
        setCurrentPage(currentPage + 1);
      } else {
        const inputData = params
          ? { ...params, offset: offset }
          : { ...emptyData, offset: offset };
        axios
          .post(API_BASE_URL + "service/getService.php", inputData, {
            headers: {
              // "Content-Type": "application/json",
            },
          })
          .then((res) => {
            console.log("get serviceList result", res.data);
            if (res.data.data.length > 0) {
              setServiceDataList({
                ...serviceDataList,
                [currentPage + 1]: res.data.data,
              });
              setOffset(res.data.offset);
              setData(res.data.data);
              setCurrentPage(currentPage + 1);
            } else {
              message.error(I18n.t("No next page"));
            }
          })
          .catch((error) => {});
      }
    }
  };

  if (!serviceLocation || !serviceCategory || !data) {
    return <RouterLoading />;
  }

  return (
    <div
      className="w-100 d-flex justify-content-center"
      style={{ backgroundColor: "#F8F8FF" }}
    >
      <div className="responsive-container">
        <Filter routerParams={params} />
        <Sort routerParams={params} />
        {data.length === 0 ? (
          <EmptyDataView message={I18n.t("EmptyPageMessages")} />
        ) : (
          <List data={data} routerParams={params} />
        )}

        {/* 页码 */}
        <div className="white-bar-wrapper">
          <div className="white-bar-container">
            <LeftSquareOutlined
              onClick={() => handlePageChange("left")}
              className="arrow-size margin-right-10 span-mouse-click"
            />
            {currentPage}
            <RightSquareOutlined
              onClick={() => handlePageChange("right")}
              className="arrow-size margin-left-10 span-mouse-click"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceList;
