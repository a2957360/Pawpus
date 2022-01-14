import React, { useState } from "react";

import { withRouter } from "react-router-dom";

//components
import { Row, Col, Button, Typography } from "antd";
import { AutoComplete, DatePicker, InputNumber, message } from "antd";
import MakeUrlParam from "../../components/service/MakeUrlParam";

//packages
import i18n from "i18n-js";
import moment from "moment";

//redux
import { useSelector } from "react-redux";

const ServiceSearch = (props) => {
  const language = localStorage.getItem("language");

  const { componentContent, history } = props;
  const { serviceCategory } = useSelector((state) => state.serviceData);
  const serviceLocations = useSelector(
    (state) => state.serviceData.serviceLocation
  );

  const [searchForm, setSearchForm] = useState({
    location: "",
    dateRange: [moment(), moment().add(1, "days")],
    petType: "",
    serviceCategoryId: "",
    petCount: 1,
    categoryId: "",
  });

  const handleSearchButton = () => {
    console.log(searchForm);
    if (!searchForm.categoryId) {
      message.error(i18n.t("Please select pet type"));
    } else {
      const paramData = {
        serviceCity: searchForm.location && [searchForm.location],
        startDate: searchForm.dateRange && searchForm.dateRange[0],
        endDate: searchForm.dateRange && searchForm.dateRange[1],
        petStock: searchForm.petCount,
        categoryId: searchForm.categoryId,
      };
      const newRouterParams = MakeUrlParam(paramData);
      history.push(`/service/list?${newRouterParams}`);
    }
  };

  const disabledDate = (current) => {
    if (current.isBefore(moment())) {
      // 不可选
      return true;
    }
    return false;
  };

  const handleSingleDatePick = (idx) => {
    console.log(idx);
  };

  const options = [
    { value: "Burns Bay Road" },
    { value: "Downing Street" },
    { value: "Wall Street" },
  ];

  return (
    <div
      className="home-search-container"
      style={{
        backgroundImage: `url(${componentContent[0]})`,
      }}
    >
      <div className="title-container">
        <Row>
          <div className="home-title">
            {i18n.t("TEMPORAY HARBOR WARMTH LIKE HOME")}
          </div>
        </Row>

        <Row>
          <div className="home-subtitle mt-3">
            {i18n.t("Best Pets Service platform, Solve your Every Worries")}
          </div>
        </Row>
      </div>

      <Row align="bottom" justify="center" className="w-70 mt-5">
        <Col xs={24} lg={5} className="home-search-field-1" id="serviceArea">
          <Typography.Title level={5} className="text-white my-2 w-100">
            {i18n.t("Service Area")}
          </Typography.Title>

          <AutoComplete
            options={serviceLocations.map((location) => ({
              value: location.serviceCity,
            }))}
            className="text-input text-input--primary w-100"
            placeholder={i18n.t("Choose Service Location")}
            size="large"
            value={searchForm.location}
            filterOption={(inputValue, option) => {
              return (
                option.value.toLowerCase().indexOf(inputValue.toLowerCase()) !==
                -1
              );
            }}
            getPopupContainer={() => document.getElementById("serviceArea")}
            onChange={(value) => {
              // 更新选中位置
              setSearchForm({
                ...searchForm,
                location: value,
              });
            }}
            notFoundContent={<span>{i18n.t("No option found")}</span>}
          />
        </Col>
        <Col xs={24} lg={10} className="home-search-field-1">
          <Typography.Title level={5} className="text-white my-2">
            {i18n.t("Service Date")}
          </Typography.Title>
          <Row
            justify="space-between"
            className="home-search-date-picker date-picker-container"
          >
            <DatePicker
              disabledDate={disabledDate}
              onChange={() => handleSingleDatePick(0)}
              format="YYYY/MM/DD"
              className="w-100 date-picker mt-1"
              placeholder={i18n.t("Check in")}
            />

            <DatePicker
              onChange={() => handleSingleDatePick(1)}
              format="YYYY/MM/DD"
              className="w-100 date-picker mt-1"
              placeholder={i18n.t("Check out")}
            />
          </Row>

          <DatePicker.RangePicker
            className="w-100 home-search-date-range"
            value={searchForm.dateRange}
            allowClear={true}
            format="YYYY/MM/DD"
            size="large"
            showToday
            disabledDate={disabledDate}
            onCalendarChange={(dates, dateString, info) => {
              setSearchForm({ ...searchForm, dateRange: dates });
            }}
            getPopupContainer={() => document.getElementById("serviceArea")}
          />
        </Col>

        <Col xs={12} lg={3} className="home-search-field-2">
          <Typography.Title level={5} className="text-white my-2">
            {i18n.t("Service Pets")}
          </Typography.Title>
          <AutoComplete
            className="w-100"
            options={serviceCategory
              .map((serviceCat) => {
                return {
                  value: serviceCat.categoryName[language],
                  key: serviceCat.categoryId,
                };
              })
              .reverse()}
            placeholder={i18n.t("Service Pets")}
            size="large"
            value={searchForm.petType}
            filterOption={(inputValue, option) =>
              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
              -1
            }
            onChange={(value, key) => {
              setSearchForm({
                ...searchForm,
                petType: value,
                categoryId: key.key,
              });
            }}
            getPopupContainer={() => document.getElementById("serviceArea")}
          />
        </Col>

        <Col xs={12} lg={2} className="home-search-field-1">
          <InputNumber
            className="text-input text-input--grey w-100"
            min={1}
            max={10}
            // defaultValue={3}
            value={searchForm.petCount}
            onChange={(value) => {
              setSearchForm({
                ...searchForm,
                petCount: value,
              });
            }}
            size="large"
          />
        </Col>
        <Col xs={24} lg={4} className="home-search-button">
          <Button
            className="primary-button text-normal-16 w-100 text-center color-button-title py-2"
            onClick={() => handleSearchButton()}
          >
            {i18n.t("Search Service")}
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default withRouter(ServiceSearch);
