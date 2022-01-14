import React from "react";
//import { Link } from 'react-router-dom';
import { Col, Row, Avatar } from "antd";

import { StarFilled } from "@ant-design/icons";

import { useHistory } from "react-router-dom";

import flag from "../../../assets/img/service/flag.png";

import { withSize } from "react-sizeme";

import stateNew from "../../../assets/img/service/state-new.png";

import stateVIP from "../../../assets/img/service/state-vip.png";

import MakeUrlParam from "../../../components/service/MakeUrlParam";

//redux
import { useDispatch, useSelector } from "react-redux";
import I18n from "i18n-js";

const listWrapperLayout = {
  xs: { span: 24 },
  sm: { span: 12 },
  md: { span: 12 },
  lg: { span: 6 },
};

//components
const List = (props) => {
  const history = useHistory();

  const language = window.localStorage.getItem("language");

  const { data, routerParams } = props;

  const handleDetailClick = (item) => {
    const newRouterParams = MakeUrlParam(routerParams);
    history.push(`/service/detail/${item.serviceId}?${newRouterParams}`);
  };

  const avatarStateObj = {
    0: stateNew,
    2: stateVIP,
  };

  return (
    <div className="service-list-wrapper">
      <div className="service-list">
        <Row className="service-row">
          {data.map((item, index) => {
            return (
              <Col key={index} {...listWrapperLayout} className="each-col">
                <div
                  onClick={() => handleDetailClick(item)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  {/* image container */}
                  <div className="cover-image-container">
                    <img
                      className="cover-image"
                      src={
                        item.serviceImage.length > 0
                          ? item.serviceImage[0]
                          : "http://pawpus.finestudiotest.com/include/pic/backend/21030105112901.jpg"
                      }
                      alt="/"
                    />

                    {/* 高分服务 */}
                    {item.serviceStar >= 4 && (
                      <>
                        <img className="flag" src={flag} alt="flag" />
                        <div className="city">
                          <div className="city-font text-bold ">
                            {item.serviceCity}
                          </div>
                          <div className="flag-font text-bold ">
                            {I18n.t("High Rated")}
                          </div>
                        </div>
                      </>
                    )}

                    {/* 宠物寄养 */}
                    <div className="title-price-container color-total-price fw-bold ">
                      <div className="title-price-inner-container">
                        <div className="price-title">
                          {`${I18n.t("Pet")} ${
                            item.categoryName && item.categoryName[language]
                          } ${I18n.t("Care")}`}
                        </div>
                        <div className="d-flex justify-content-center align-items-center">
                          <span className="price mr-1">
                            ${Number(item.servicePrice).toFixed(2)} /{" "}
                          </span>
                          <span className="day">{I18n.t("Day")}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* avatar title container */}
                  <div className="card-content-container-service">
                    <div className="user-avatar-name">
                      <div className="user-avatar-name-inner">
                        {/* 头像 */}
                        <div className="user-avatar">
                          <Avatar
                            className="avatar-img"
                            icon={
                              <img
                                src={
                                  item.serviceImage.length > 0
                                    ? item.userImage
                                    : "http://pawpus.finestudiotest.com/include/pic/backend/21030105112901.jpg"
                                }
                                alt=""
                              />
                            }
                          />

                          {(item.serverLevel == "0" ||
                            item.serverLevel == "2") && (
                            <img
                              src={avatarStateObj[item.serverLevel]}
                              alt=""
                              className="state-img"
                            />
                          )}
                        </div>

                        {/* 发布者名字 */}
                        <div className="author-name">
                          <span>{item.userName} </span>
                          {item.serverLevel === "2" && (
                            <span className="certify-server">
                              ({I18n.t("Certified Provider")})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div>&nbsp;</div>
                      {/* <div>&nbsp;</div> */}
                      {/* <div className="space-row">&nbsp;</div> */}
                    </div>

                    <div className="description-like-container-service">
                      <div className="card-description pt-2">
                        {item.serviceDescription}
                      </div>
                      <div className="card-like text-12">
                        {Number(item.serviceStar) === 0
                          ? 0
                          : Number(item.serviceStar).toFixed(1)}

                        <StarFilled
                          style={{ color: "#fadb14", marginLeft: 5 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
};

export default withSize()(List);
