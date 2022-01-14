import React from "react";
// import { Spin } from "antd";
// import { LoadingOutlined } from "@ant-design/icons";

// const Icon = <LoadingOutlined style={{ fontSize: 35 }} spin />;

import i18n from "i18n-js";

import emptyView from "../../assets/img/empty-page-dogy.png";

const EmptyDataView = ({ message }) => {
  return (
    <div className="empty-view-container">
      <span className="warning-message">{message}</span>
      <img className="dogy-img" src={emptyView} alt="/" />
    </div>
  );
};

export default EmptyDataView;
