import React, { useEffect, useState } from "react";

import { Row, Col } from "antd";

import { useHistory } from "react-router-dom";

import RouterLoading from "../../components/loading/RouterLoading";
import EmptyDataView from "../../components/loading/EmptyDataView";

//redux
import { useDispatch, useSelector } from "react-redux";
import { getPost, getPostByType } from "../../redux/actions";
import I18n from "i18n-js";

const Help = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const language = localStorage.getItem("language");
  const { postList, postListByType } = useSelector((state) => state.userData);

  useEffect(() => {
    dispatch(getPost());
    dispatch(getPostByType("4"));
  }, []);

  const listWrapperLayout = {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 8 },
    lg: { span: 8 },
  };

  if (!postList || !postListByType) {
    return <RouterLoading />;
  }

  if (postList.length === 0) {
    return <EmptyDataView message={I18n.t("EmptyPageMessages")} />;
  }

  const renderImages =
    postList.length > 0 &&
    postList.map((e) => {
      return (
        <Col className="margin-bottom-20 each-col " {...listWrapperLayout}>
          <div
            onClick={() =>
              history.push({
                pathname: "/user/help/detail",
                state: e,
              })
            }
            className="col-inner-div span-mouse-click"
          >
            <img
              className="each-img margin-bottom-10"
              src={e.postImage}
              alt=""
            />
            <span className="font-18-70">{e.postTitle[language]}</span>
          </div>
        </Col>
      );
    });

  const renderContent =
    postListByType.length > 0 &&
    postListByType.map((e) => {
      return (
        <div className="each-content margin-bottom-30">
          <div
            className=""
            dangerouslySetInnerHTML={{
              __html: e.postContent,
            }}
          />
        </div>
      );
    });

  return (
    <div className="help-wrapper">
      <div className="help-container">
        {/* header */}
        <div className="header-row margin-top-30 margin-bottom-30">
          <span className="record-14-70">{I18n.t("Help")}</span>
        </div>

        <div className="margin-bottom-30">
          <div className="subtitle font-weight-bold margin-bottom-20">
            {I18n.t("Common information")}
          </div>
          <Row>{renderImages}</Row>
        </div>

        <div>
          <div className="subtitle font-weight-bold margin-bottom-20">
            {I18n.t("Common question")}
          </div>
          <div>{renderContent}</div>
        </div>
      </div>
    </div>
  );
};
export default Help;
