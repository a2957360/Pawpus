import { Button } from "antd";

import { DownOutlined } from "@ant-design/icons";

import { useState } from "react";

import { useHistory } from "react-router-dom";

import MakeUrlParam from "../../service/MakeUrlParam";

import i18n from "i18n-js";

//redux
import { useSelector } from "react-redux";

const SingleSelectorProduct = ({ routerParams, type, name }) => {
  const history = useHistory();
  const language = window.localStorage.getItem("language");

  const { productCategoryList, itemPetCategoryList } = useSelector(
    (state) => state.productData
  );

  const [expand, setExpand] = useState(false);

  const handleExpand = () => {
    setExpand(!expand);
  };

  const handleSelector = (categoryId) => {
    if (type === "itemPetCategory") {
      routerParams[type] = routerParams[type]
        ? routerParams[type][0] !== categoryId
          ? [categoryId]
          : null
        : [categoryId];
    } else {
      routerParams[type] =
        routerParams[type] !== categoryId ? categoryId : null;
    }

    const newRouterParams = MakeUrlParam(routerParams);
    history.push(`/product/list?${newRouterParams}`);
  };

  if (!productCategoryList || !itemPetCategoryList) {
    return null;
  }

  const obj = {
    itemCategory: productCategoryList,
    itemPetCategory: itemPetCategoryList,
  };

  const renderClassName = (element) => {
    if (type === "itemPetCategory") {
      return routerParams[type] && routerParams[type][0] === element.categoryId
        ? "selected-font"
        : "origin-font";
    } else {
      return routerParams[type] === element.categoryId
        ? "selected-font"
        : "origin-font";
    }
  };

  return (
    <div className="single-selector-wrapper">
      {/* title */}
      <div className="title ml-2 mr-2 filter-title-width">{i18n.t(name)}:</div>

      <div className="items">
        {(!expand ? obj[type].slice(0, 3) : obj[type]).map((element, index) => {
          return (
            <div
              key={index}
              onClick={() => {
                handleSelector(element.categoryId);
              }}
              className={
                renderClassName(element)
                // routerParams[type] === element.categoryId
                //   ? "selected-font"
                //   : routerParams[type] === element.categoryId
                //   ? "selected-font"
                //   : "origin-font"
              }
            >
              {element.categoryName[language]}
            </div>
          );
        })}
      </div>

      <div className="filter-inner-button">
        <Button
          className="transparent-button more-dropdown-button"
          onClick={() => handleExpand()}
          type="text"
        >
          <span className="more-text">{i18n.t("More")}</span>
          <DownOutlined className="more-icon" />
        </Button>
      </div>
    </div>
  );
};

export default SingleSelectorProduct;
