import React, { useState } from "react";
//import { Link } from 'react-router-dom';
import { InputNumber, DatePicker, Row, Col, message } from "antd";

import { DownOutlined, UpOutlined } from "@ant-design/icons";

import { useHistory } from "react-router-dom";

import moment from "moment";

import MakeUrlParam from "../../../components/service/MakeUrlParam";

import i18n from "i18n-js";

import { SearchOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

//components
const Sort = ({ routerParams }) => {
  const history = useHistory();

  const [minPrice, setMinPrice] = useState(routerParams.startPrice);
  const [maxPrice, setMaxPrice] = useState(routerParams.endPrice);

  // const minPrice = routerParams.startPrice;
  // const maxPrice = routerParams.endPrice
  //   ? routerParams.endPrice
  //   : routerParams.startPrice
  //   ? routerParams.startPrice + 1
  //   : null;

  const handlePriceInput = (type, value) => {
    if (type === "start") {
      setMinPrice(value);
      routerParams.startPrice = value;
    } else if (type === "end") {
      setMaxPrice(value);
      routerParams.endPrice = value;
    }
  };

  const handleEnterPress = () => {
    //当输入不为空时
    if (
      (!routerParams.startPrice && routerParams.endPrice) ||
      (!routerParams.endPrice && routerParams.startPrice)
    ) {
      message.error(
        !routerParams.startPrice
          ? i18n.t("Please enter start price")
          : i18n.t("Please enter end price")
      );
    } else {
      const newRouterParams = MakeUrlParam(routerParams);
      history.push(`/service/list?${newRouterParams}`);
    }
  };

  // const handleEnterPress = (e) => {
  //   //当输入不为空时
  //   if (e.target.value !== "$ ") {
  //     const newRouterParams = MakeUrlParam(routerParams);
  //     history.push(`/service/list?${newRouterParams}`);
  //   }
  // };

  const disabledDate = (current) => {
    if (current.isBefore(moment())) {
      // 不可选
      return true;
    }
    return false;
  };

  const handleDatesSelect = (dates, dateStrings) => {
    if (dates) {
      routerParams.startDate = dateStrings[0];
      routerParams.endDate = dateStrings[1];
      const newRouterParams = MakeUrlParam(routerParams);
      history.push(`/service/list?${newRouterParams}`);
    }
  };

  const handleSortSelector = (type) => {
    routerParams.orderBy = type;
    if (type === "servicePrice") {
      routerParams["sort"] = routerParams["sort"] === "DESC" ? "ASC" : "DESC";
    } else if (type === "serviceSaleNumber" || type === "serviceStar") {
      routerParams["sort"] = "DESC";
    }
    const newRouterParams = MakeUrlParam(routerParams);
    history.push(`/service/list?${newRouterParams}`);
  };

  return (
    <div className="sort-main-wrapper">
      <Row className="sort-main-inner sort-text">
        {/* Relevant */}
        <Col xs={5} md={4} lg={2} className="col-height">
          <span
            onClick={() => handleSortSelector("regular")}
            className="cursor-pointer"
          >
            {i18n.t("Relevant")}
          </span>
        </Col>

        {/* Sales */}
        <Col xs={4} md={4} lg={2} className="col-height">
          <span
            onClick={() => handleSortSelector("serviceSaleNumber")}
            className="cursor-pointer"
          >
            {i18n.t("Sales")}
          </span>
        </Col>

        {/* Rate */}
        <Col xs={4} md={4} lg={2} className="col-height">
          <span
            onClick={() => handleSortSelector("serviceStar")}
            className="cursor-pointer"
          >
            {i18n.t("Rating")}
          </span>
        </Col>

        {/* Price */}
        <Col xs={4} md={4} lg={2} className="col-height">
          <span
            onClick={() => handleSortSelector("servicePrice")}
            className="cursor-pointer center-item"
          >
            {i18n.t("Price")}
            {routerParams["sort"] === "DESC" ? (
              <DownOutlined />
            ) : (
              <UpOutlined />
            )}
          </span>
        </Col>

        {/* Price range */}
        <Col sm={12} md={12} lg={8} className="col-height">
          <span className="price">{i18n.t("Price range")}:</span>
          <InputNumber
            min={0}
            max={100000}
            className="ant-input-number-sm w-35 text-input text-input--grey"
            value={minPrice}
            onChange={(value) => handlePriceInput("start", value)}
            // onBlur={handleEnterPress}
            // onPressEnter={handleEnterPress}
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          />
          &nbsp;-&nbsp;
          <InputNumber
            min={minPrice}
            // min={minPrice + 1}
            max={100000}
            value={maxPrice}
            onChange={(value) => handlePriceInput("end", value)}
            // onBlur={handleEnterPress}
            // onPressEnter={handleEnterPress}
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            className="ant-input-number-sm w-35 text-input text-input--grey"
          />
          <SearchOutlined onClick={() => handleEnterPress()} />
        </Col>

        {/* time */}
        <Col sm={12} md={12} lg={8} className="col-height">
          <span className="price">{i18n.t("time")}:</span>
          <RangePicker
            size={"small"}
            className="w-80"
            allowClear={false}
            disabledDate={disabledDate}
            onChange={handleDatesSelect}
            defaultValue={
              routerParams &&
              routerParams.startDate &&
              routerParams.endDate && [
                moment(routerParams.startDate),
                moment(routerParams.endDate),
              ]
            }
            placeholder={[i18n.t("Checkin Time"), i18n.t("Checkout Time")]}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Sort;
