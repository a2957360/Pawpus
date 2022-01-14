import React, { useState, useEffect } from "react";

import { useHistory } from "react-router-dom";

import { Row, Col, Avatar, message } from "antd";

import { StarFilled } from "@ant-design/icons";

import flag from "../../assets/img/service/flag.png";

import stateNew from "../../assets/img/service/state-new.png";

import stateVIP from "../../assets/img/service/state-vip.png";

import happyDog from "../../assets/img/Success-Dogy.png";

import LoadingView from "../../components/loading/LoadingView";

//redux
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { API_BASE_URL } from "../../configs/AppConfig";
import { getSavedItem, getSavedService } from "../../redux/actions";

import { DeleteOutlined } from "@ant-design/icons";
import EmptyDataView from "../../components/loading/EmptyDataView";
import I18n from "i18n-js";

const Main = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const userId = localStorage.getItem("userId");
  const language = localStorage.getItem("language");

  const { savedItemList } = useSelector((state) => state.productData);
  const { savedServiceList } = useSelector((state) => state.serviceData);

  console.log("savedServiceList", savedServiceList);

  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    dispatch(getSavedService(userId));
    dispatch(getSavedItem(userId));
  }, []);

  const handleDeleteSave = async (itemId, type) => {
    //type === item, 删除商品，else 删除服务
    const data = {
      userId: userId,
      targetId: itemId,
      targetType: type === "item" ? "1" : "0",
    };
    console.log("delete save input", type, data);
    await axios
      .post(API_BASE_URL + "saved/deleteSaved.php", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log("delete item save result", res.data);
        if (res.data.message == "success") {
          if (type === "item") {
            dispatch(getSavedItem(userId));
          } else {
            dispatch(getSavedService(userId));
          }
        } else {
          message.error("删除收藏失败");
        }
      })
      .catch((error) => {});
  };

  const listWrapperLayout = {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 12 },
    lg: { span: 6 },
  };

  if (!userId) {
    message.error(I18n.t("Please login"));
    history.push("/");
  }

  if (!savedServiceList || !savedItemList) {
    return <LoadingView />;
  }

  // console.log("savedItemList", savedItemList);

  const avatarStateObj = {
    0: stateNew,
    2: stateVIP,
  };

  const menuTab = [
    {
      action: 0,
      name: I18n.t("Service"),
    },
    {
      action: 1,
      name: I18n.t("Product"),
    },
  ];

  return (
    <div className="submit-wrapper d-flex flex-column align-items-center page-background">
      {/* <div className="content-container"> */}

      {/* 居中的div */}
      <div className="inner-container responsive-container">
        {/* header */}
        <div className="header-container padding-h-30-v-0 mt-3">
          <span className="record-14-70">{I18n.t("My Service")}</span>
        </div>

        {/* menu tab */}
        <div className="header-container padding-h-30-v-0 margin-bottom-30 mt-3">
          {menuTab.map((e, index) => {
            return (
              <span
                key={index}
                onClick={() => setSelectedTab(e.action)}
                className={
                  selectedTab === e.action
                    ? "selectedTab-container text-bold mr-4"
                    : "tab-container text-bold mr-4"
                }
              >
                {e.name}
              </span>
            );
          })}
        </div>

        {/* 服务列表 */}
        {selectedTab === 0 && (
          <Row className="service-row">
            {savedServiceList.length > 0 ? (
              savedServiceList.map((item, index) => {
                return (
                  <Col key={index} {...listWrapperLayout} className="each-col">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                      }}
                    >
                      {/* image container */}
                      <div
                        onClick={() => {
                          history.push(`/service/detail/${item.serviceId}`);
                        }}
                        className="cover-image-container"
                      >
                        <img
                          className="cover-image"
                          src={
                            item.serviceImage &&
                            item.serviceImage.length > 0 &&
                            item.serviceImage[0]
                          }
                          alt=""
                        />

                        <DeleteOutlined
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSave(item.serviceId, "service");
                          }}
                          className="favorite-page-delete-button span-mouse-click"
                        />

                        {/* 高分服务 */}
                        {/* {userData.serverLevel === "3" && (
                            <>
                              <img className="flag" src={flag} alt="flag" />
                              <div className="city">
                                <div className="city-font">
                                  {item.serviceCity}
                                </div>
                                <div className="flag-font">高分服务</div>
                              </div>
                            </>
                          )} */}

                        {/* 宠物寄养 */}
                        {/* <div className="title-price-container">
                          <div className="price-title">
                            {`${
                              item.categoryName && item.categoryName[language]
                            } ${I18n.t("Care")}`}
                          </div>

                          <span className="price">${item?.servicePrice}/</span>
                          <span className="day">{I18n.t("Day")}</span>
                        </div> */}

                        <div className="title-price-container color-total-price fw-bold ">
                          <div className="title-price-inner-container">
                            <div
                              className="price-title"
                              style={{ color: "#ffad3e" }}
                            >
                              {`${I18n.t("Pet")} ${
                                item.categoryName && item.categoryName[language]
                              } ${I18n.t("Care")}`}
                            </div>
                            <div
                              style={{ color: "#ffad3e" }}
                              className="d-flex align-items-center justify-content-center"
                            >
                              <span className="price mr-1">
                                ${Number(item.servicePrice).toFixed(2)} /
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
                                icon={<img src={item.userImage} alt="" />}
                              />

                              {(item.serverLevel == 0 ||
                                item.serverLevel == 2) && (
                                <img
                                  className="state-style"
                                  src={avatarStateObj[item.serverLevel]}
                                  alt=""
                                />
                              )}
                            </div>

                            {/* 发布者名字 */}
                            <div className="author-name">
                              {item?.userName}
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
                          <div className="card-description">
                            {item?.serviceDescription}
                            {/* {item.description} */}
                          </div>
                          <div className="card-like text-12">
                            <span className="margin-right-10">
                              {Number(item.serviceStar).toFixed(1)}
                            </span>
                            <StarFilled style={{ color: "#fadb14" }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                );
              })
            ) : (
              <EmptyDataView message={I18n.t("EmptyPageMessages")} />
            )}
          </Row>
        )}

        {/* 商品列表 */}
        {selectedTab === 1 && (
          <Row className="service-row">
            {savedItemList.length > 0 ? (
              savedItemList.map((item) => {
                return (
                  <Col {...listWrapperLayout} className="each-col">
                    <div
                      onClick={() =>
                        history.push({
                          pathname: `/product/detail/${item.itemId}`,
                        })
                      }
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        // height: (size.width * 0.8) / 4,
                        width: "100%",
                        backgroundColor: "white",
                      }}
                    >
                      {/* image container */}
                      <div className="cover-image-container">
                        <img
                          className="cover-image"
                          src={item.itemImage.length > 0 && item.itemImage[0]}
                          alt=""
                        />

                        <DeleteOutlined
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSave(item.itemId, "item");
                          }}
                          className="favorite-page-delete-button span-mouse-click"
                        />
                      </div>

                      {/* title price container */}
                      <div className="card-content-container product-container pl-3">
                        <div className="product-container-inner">
                          <div className="card-title-price-container height-1 fw-bold">
                            <div className="card-product-title ">
                              {item.itemTitle}
                            </div>
                            <div className="card-product-price">
                              {/* {item.itemSalePrice} */}
                              {item.itemSalePrice != "0" &&
                              item.itemSalePrice < item.itemPrice
                                ? Number(item.itemSalePrice).toFixed(2)
                                : Number(item.itemPrice).toFixed(2)}
                            </div>
                          </div>

                          <div className="description-like-container height-2">
                            <div className="card-description">
                              {item.itemShortDescription}
                            </div>
                            <div className="card-like text-12">
                              {item.itemStar}
                              <StarFilled
                                style={{
                                  color: "#fadb14",
                                  marginLeft: 5,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                );
              })
            ) : (
              <EmptyDataView message={I18n.t("EmptyPageMessages")} />
            )}
          </Row>
        )}
      </div>
      {/* </div> */}
    </div>
  );
};

export default Main;
