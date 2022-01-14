import React, { useState } from "react";

import { useHistory } from "react-router-dom";

import { Tag, Button } from "antd";

import { DownOutlined } from "@ant-design/icons";

import MakeUrlParam from "../../service/MakeUrlParam";

import i18n from "i18n-js";

//redux
import { useSelector } from "react-redux";

const { CheckableTag } = Tag;

const FilterRowLocation = ({ routerParams }) => {
  const history = useHistory();

  const { serviceLocation } = useSelector((state) => state.serviceData);

  const [expand, setExpand] = useState(false);
  const [selectedTags, setSelectedTags] = useState(
    routerParams?.serviceCity ? routerParams.serviceCity : []
  );

  const handleExpand = () => {
    setExpand(!expand);
  };

  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag["serviceCity"]]
      : selectedTags.filter((t) => t !== tag["serviceCity"]);

    setSelectedTags(nextSelectedTags);
    handleFilterAction(tag);
  };

  const handleFilterAction = (tag) => {
    // 如果是一开始是空的，没有选地址
    if (routerParams.serviceCity === null) {
      // // 增加
      routerParams.serviceCity = [tag.serviceCity];
    } else {
      const indexCity = routerParams.serviceCity.indexOf(tag.serviceCity);
      if (indexCity > -1) {
        // 删除
        routerParams.serviceCity.splice(indexCity, 1);

        if (routerParams.serviceCity.length === 0) {
          routerParams.serviceCity = null;
        }
      } else {
        // 增加
        routerParams.serviceCity.splice(0, 0, tag.serviceCity);
      }
    }
    const newRouterParams = MakeUrlParam(routerParams);
    history.push(`/service/list?${newRouterParams}`);
  };

  return (
    <div className="filter-inner-wrapper">
      <div className="filter-title-width title ml-2 mr-2">
        {i18n.t("Location")}:
      </div>
      <div className="items">
        {(!expand ? serviceLocation.slice(0, 3) : serviceLocation).map(
          (tag, index) => {
            return (
              <CheckableTag
                className="filter-row-title"
                key={index}
                checked={selectedTags.indexOf(tag["serviceCity"]) > -1}
                onChange={(checked) => handleChange(tag, checked)}
              >
                {tag["serviceCity"]}
              </CheckableTag>
            );
          }
        )}
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

export default FilterRowLocation;
