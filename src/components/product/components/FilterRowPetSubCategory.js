import React, { useState } from "react";

import { useHistory } from "react-router-dom";

import { Tag, Button } from "antd";

import { DownOutlined } from "@ant-design/icons";

import MakeUrlParam from "../../service/MakeUrlParam";

import i18n from "i18n-js";

//redux
import { useSelector } from "react-redux";

const { CheckableTag } = Tag;

const FilterRowPetCategory = ({ routerParams }) => {
  const history = useHistory();
  const language = window.localStorage.getItem("language");

  const { itemPetSubCategoryList } = useSelector((state) => state.productData);

  const [expand, setExpand] = useState(false);

  const [selectedTags, setSelectedTags] = useState(
    routerParams?.itemPetSubCategory ? routerParams.itemPetSubCategory : []
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
    // 如果是一开始是空的，没有选地址
    if (routerParams.itemPetSubCategory === null) {
      //   // 增加
      routerParams.itemPetSubCategory = [tag["categoryId"]];
    } else {
      const indexCity = routerParams.itemPetSubCategory.indexOf(
        tag["categoryId"]
      );
      if (indexCity > -1) {
        // 删除
        routerParams.itemPetSubCategory.splice(indexCity, 1);
      } else {
        // 增加
        routerParams.itemPetSubCategory.splice(0, 0, tag["categoryId"]);
      }
    }

    const newRouterParams = MakeUrlParam(routerParams);
    history.push(`/product/list?${newRouterParams}`);
  };

  if (!itemPetSubCategoryList) {
    return null;
  }

  return (
    <div className="filter-inner-wrapper">
      <div className="title ml-2 mr-2 filter-title-width">{i18n.t("Type")}:</div>
      <div className="items">
        {(!expand
          ? itemPetSubCategoryList.slice(0, 3)
          : itemPetSubCategoryList
        ).map((tag, index) => {
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
        })}
      </div>
      {/* </div> */}

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

export default FilterRowPetCategory;
