import React, { useState } from "react";
//import { Link } from 'react-router-dom';
import { InputNumber, Row, Col, message } from "antd";

import { DownOutlined, UpOutlined } from "@ant-design/icons";

import { useHistory } from "react-router-dom";

import MakeUrlParam from "../../../components/service/MakeUrlParam";

import i18n from "i18n-js";

import { SearchOutlined } from "@ant-design/icons";

//components
const Sort = ({ routerParams }) => {
  const history = useHistory();

  const [minPrice, setMinPrice] = useState(routerParams.startPrice);
  const [maxPrice, setMaxPrice] = useState(
    routerParams.endPrice
    // ? routerParams.endPrice
    // : routerParams.startPrice
    // ? routerParams.startPrice + 1
    // : null
  );

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
      history.push(`/product/list?${newRouterParams}`);
    }
  };

  const handleSortSelector = (type) => {
    routerParams.orderBy = type;
    if (type === "itemPrice") {
      routerParams["sort"] = routerParams["sort"] === "DESC" ? "ASC" : "DESC";
    } else if (type === "itemSaleNumber" || type === "itemStar") {
      routerParams["sort"] = "DESC";
    }

    const newRouterParams = MakeUrlParam(routerParams);
    history.push(`/product/list?${newRouterParams}`);
  };

  return (
    <div className="sort-main-wrapper">
      <Row className="sort-main-inner sort-text">
        <Col xs={5} md={2} lg={2} className="col-height">
          <span
            onClick={() => handleSortSelector("regular")}
            className="cursor-pointer"
          >
            {i18n.t("Relevant")}
          </span>
        </Col>

        <Col xs={4} md={2} lg={2} className="col-height">
          <span
            onClick={() => handleSortSelector("itemSaleNumber")}
            className="cursor-pointer"
          >
            {i18n.t("Sales")}
          </span>
        </Col>
        <Col xs={4} md={2} lg={2} className="col-height">
          <span
            onClick={() => handleSortSelector("itemStar")}
            className="cursor-pointer"
          >
            {i18n.t("Rating")}
          </span>
        </Col>
        <Col xs={4} md={2} lg={2} className="col-height mr-3">
          <span
            onClick={() => handleSortSelector("itemPrice")}
            className="cursor-pointer center-item"
          >
            {i18n.t("Price")}
            {routerParams["sort"] === "DESC" ? (
              <DownOutlined className="margin-left-10" />
            ) : (
              <UpOutlined className="margin-left-10" />
            )}
          </span>
        </Col>
        <Col sm={12} md={12} lg={10} className="col-height">
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
            // onBlur={(e) => handleEnterPress(e)}
            // onPressEnter={handleEnterPress}
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            className="ant-input-number-sm w-35 text-input text-input--grey mr-1"
          />
          {/* <Button className="white-button">{i18n.t("Confirm")}</Button> */}
          <SearchOutlined onClick={() => handleEnterPress()} />
        </Col>
      </Row>
    </div>
  );
};

export default Sort;
