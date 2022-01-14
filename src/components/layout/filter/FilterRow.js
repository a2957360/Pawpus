import React, { useState } from "react";

import { useHistory } from "react-router-dom";

import { Tag, Button } from "antd";

import { DownOutlined } from "@ant-design/icons";

import MakeUrlParam from "../../service/MakeUrlParam";

import i18n from "i18n-js";

//redux
import { useSelector } from "react-redux";

const { CheckableTag } = Tag;

const FilterRow = ({ routerParams }) => {
  const history = useHistory();
  const language = window.localStorage.getItem("language");

  const { serviceSubCategory } = useSelector((state) => state.serviceData);

  const [expand, setExpand] = useState(false);
  const [selectedTags, setSelectedTags] = useState(
    routerParams.serviceSubCategory ? routerParams.serviceSubCategory : []
  );

  const handleExpand = () => {
    setExpand(!expand);
  };

  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag["categoryId"]]
      : selectedTags.filter((t) => t !== tag["categoryId"]);
    setSelectedTags(nextSelectedTags);
    handleFilterAction(tag);
  };

  const handleFilterAction = (tag) => {
    // 多选属性
    // 如果是一开始是空的，没有选属性
    if (
      routerParams.serviceSubCategory === null ||
      routerParams.serviceSubCategory.length === 0
    ) {
      routerParams.serviceSubCategory = [tag.categoryId];
    } else {
      const index = routerParams.serviceSubCategory.indexOf(tag.categoryId);
      if (index > -1) {
        // 在这个array里，执行删除
        routerParams.serviceSubCategory.splice(index, 1);
      } else {
        // 不在这个array里，执行增加
        routerParams.serviceSubCategory.splice(0, 0, tag.categoryId);
      }
    }
    const newRouterParams = MakeUrlParam(routerParams);
    history.push(`/service/list?${newRouterParams}`);
  };

  if (!serviceSubCategory) {
    return null;
  }

  return (
    <div className="filter-inner-wrapper">
      <div className="title ml-2 mr-2 filter-title-width">{i18n.t("Kind")}:</div>
      <div className="items">
        {(!expand ? serviceSubCategory.slice(0, 3) : serviceSubCategory).map(
          (tag, index) => {
            return (
              <CheckableTag
                className="filter-row-title"
                key={index}
                checked={selectedTags.indexOf(tag["categoryId"]) > -1}
                onChange={(checked) => handleChange(tag, checked)}
              >
                {tag.categoryName[language]}
              </CheckableTag>
            );
          }
        )}
      </div>
      {/* </div> */}

      <div className="filter-inner-button">
        <Button
          className="more-dropdown-button"
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

export default FilterRow;
