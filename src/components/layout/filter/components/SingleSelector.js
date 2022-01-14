import { Button } from "antd";

import { DownOutlined } from "@ant-design/icons";

import { useEffect, useState } from "react";

import { useHistory } from "react-router-dom";

import MakeUrlParam from "../../../service/MakeUrlParam";

import i18n from "i18n-js";

//redux
import { useDispatch, useSelector } from "react-redux";
import { getServiceSubCategory } from "../../../../redux/actions";

const SingleSelector = ({ routerParams, setServiceSubCategoryVisible }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const language = window.localStorage.getItem("language");

  const { serviceCategory } = useSelector((state) => state.serviceData);

  const [expand, setExpand] = useState(false);

  const handleExpand = () => {
    setExpand(!expand);
  };

  const handleSelector = (categoryId, type) => {
    routerParams["categoryId"] =
      routerParams?.categoryId !== categoryId ? categoryId : null;
    const newRouterParams = MakeUrlParam(routerParams);
    history.push(`/service/list?${newRouterParams}`);
    // 获取属性数据
    dispatch(getServiceSubCategory(categoryId));
    setServiceSubCategoryVisible(true);
  };

  useEffect(() => {
    if (routerParams?.categoryId) {
      // 获取属性数据
      dispatch(getServiceSubCategory(routerParams?.categoryId));
      setServiceSubCategoryVisible(true);
    }
  }, []);

  return (
    <div className="single-selector-wrapper">
      {/* title */}
      <div className="filter-title-width title ml-2 mr-2">{i18n.t("Pet")}:</div>

      <div className="items">
        {(!expand ? serviceCategory.slice(0, 3) : serviceCategory).map(
          (element, index) => {
            return (
              <div
                key={index}
                onClick={() => {
                  handleSelector(element.categoryId);
                }}
                className={
                  routerParams.categoryId === element.categoryId
                    ? "selected-font"
                    : "origin-font"
                }
              >
                {element.categoryName[language]}
              </div>
            );
          }
        )}
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

export default SingleSelector;
