import React, { useState, useEffect, useRef } from "react";
//import { Link } from 'react-router-dom';

import { useHistory } from "react-router-dom";

import { Col, Row, Menu, Dropdown, Button, Divider, InputNumber } from "antd";

import { DownOutlined } from "@ant-design/icons";

import FilterRow from "./FilterRow";
import FilterRowLocation from "./FilterRowLocation";
import SingleSelector from "./components/SingleSelector";

import MakeUrlParam from "../../service/MakeUrlParam";

import i18n from "i18n-js";

//components
const Filter = ({ routerParams }) => {
  const history = useHistory();

  const [inputPetQuantity, setInputPetQuantity] = useState(
    routerParams.petStock
  );

  const [isServiceSubCategoryVisible, setServiceSubCategoryVisible] =
    useState(false);

  const handleMenuClick = (e) => {
    routerParams["serviceLanguage"] = e.key;
    handleEnterPress();
  };

  const handleNumberChange = (value) => {
    setInputPetQuantity(value);
    // 改router上的宠物数量参数
    routerParams["petStock"] = value;
  };

  const handleEnterPress = () => {
    const newRouterParams = MakeUrlParam(routerParams);
    history.push(`/service/list?${newRouterParams}`);
  };

  const handleClearAllButton = () => {
    history.push(`/service/list?`);
  };

  const languageMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="0">{i18n.t("Chinese")}</Menu.Item>
      <Menu.Item key="1">{i18n.t("English")}</Menu.Item>
    </Menu>
  );

  return (
    <div className="filer-main-container">
      <div className="filter-main-inner">
        <div className="service-header d-flex justify-content-between">
          <span className="margin-right-30">{i18n.t("Feature Services")}</span>
          <Button
            className="transparent-button"
            onClick={() => handleClearAllButton()}
          >
            {i18n.t("Clear All")}
          </Button>
        </div>

        <div className="filter-row-section">
          <div className="filter-row-section-inner">
            {/* 位置分类 */}
            <Row className="each-row">
              <Col className="w-100">
                <FilterRowLocation routerParams={routerParams} />
              </Col>
            </Row>

            <Divider className="row-divider" dashed type="horizontal" />

            {/* 宠物种类 */}
            <Row className="each-row">
              <Col style={{ width: "100%" }}>
                <SingleSelector
                  setServiceSubCategoryVisible={setServiceSubCategoryVisible}
                  routerParams={routerParams}
                />
              </Col>
            </Row>
            <Divider className="row-divider" dashed type="horizontal" />

            {/* 宠物属性 */}
            {isServiceSubCategoryVisible && (
              <>
                <Row className="each-row">
                  <Col style={{ width: "100%" }}>
                    <FilterRow routerParams={routerParams} />
                  </Col>
                </Row>

                <Divider className="row-divider" dashed type="horizontal" />
              </>
            )}

            {/* 宠物数量 */}
            {isServiceSubCategoryVisible && (
              <>
                <div className="filter-dropdown-section primary-input-container">
                  <span className="filter-title-width quantity-title ml-2 mr-2">
                    {i18n.t("Number of Pets")}:
                  </span>
                  <InputNumber
                    className="primary-input"
                    min={1}
                    value={inputPetQuantity}
                    onChange={handleNumberChange}
                    onPressEnter={handleEnterPress}
                    onBlur={handleEnterPress}
                  />
                </div>
                <Divider className="row-divider" dashed type="horizontal" />
              </>
            )}
          </div>

          {/* 服务语言dropdown */}
          <div className="filter-dropdown-section">
            <div className="dropdown-title ml-2 mr-2 filter-title-width ">
              {i18n.t("Service Language")}:
            </div>
            <div className="dropdown-button-container">
              <Dropdown overlay={languageMenu}>
                <Button className="transparent-button pl-1" size="medium">
                  <div className="text-14">
                    {!routerParams.serviceLanguage
                      ? i18n.t("Choose language")
                      : routerParams.serviceLanguage === "0"
                      ? i18n.t("Chinese")
                      : i18n.t("English")}

                    <DownOutlined className="margin-left-10" />
                  </div>
                </Button>
              </Dropdown>
            </div>
          </div>
          <Divider className="row-divider" dashed type="horizontal" />
        </div>
      </div>
    </div>
  );
};

export default Filter;
