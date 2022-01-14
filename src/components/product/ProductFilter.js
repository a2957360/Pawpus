import React from "react";

import { useHistory } from "react-router-dom";

import { Col, Row, Button, Divider } from "antd";

import i18n from "i18n-js";

//redux

//components
import SingleSelectorProduct from "./components/SingleSelectorProduct";
import FilterRowPetCategory from "./components/FilterRowPetCategory";
import FilterRowPetSubCategory from "./components/FilterRowPetSubCategory";

const ProductFilter = ({ routerParams }) => {
  const history = useHistory();

  const handleClearAllButton = () => {
    history.push(`/product/list?`);
  };

  return (
    <div className="filer-main-container">
      <div className="filter-main-inner">
        <div className="service-header d-flex justify-content-between">
          <span className="margin-right-30">{i18n.t("Feature Products")}</span>
          <Button
            className="transparent-button"
            onClick={() => handleClearAllButton()}
          >
            {i18n.t("Clear All")}
          </Button>
        </div>

        <div className="filter-row-section">
          <div className="filter-row-section-inner">
            {/* 商品分类 */}
            <Row className="each-row">
              <Col className="w-100">
                <SingleSelectorProduct
                  routerParams={routerParams}
                  type={"itemCategory"}
                  name={"Category"}
                />
              </Col>
            </Row>
            <Divider className="row-divider" dashed type="horizontal" />

            {/* 宠物 */}
            <Row className="each-row">
              <Col style={{ width: "100%" }}>
                <SingleSelectorProduct
                  routerParams={routerParams}
                  type={"itemPetCategory"}
                  name={"Pet"}
                />
                {/* <FilterRowPetCategory routerParams={routerParams} /> */}
              </Col>
            </Row>
            <Divider className="row-divider" dashed type="horizontal" />

            {/* 规格 */}
            <Row className="each-row">
              <Col style={{ width: "100%" }}>
                <FilterRowPetSubCategory routerParams={routerParams} />
              </Col>
            </Row>
          </div>

          <Divider className="row-divider" dashed type="horizontal" />
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
