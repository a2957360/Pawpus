import React, { useState, useEffect } from "react";

import { useHistory } from "react-router-dom";

import { Button, Row, Col, Avatar, Modal, message, Switch } from "antd";

import { StarFilled } from "@ant-design/icons";

import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

import flag from "../../assets/img/service/flag.png";

import stateNew from "../../assets/img/service/state-new.png";

import stateVIP from "../../assets/img/service/state-vip.png";

import happyDog from "../../assets/img/Success-Dogy.png";

import LoadingView from "../../components/loading/LoadingView";

import Wallet from "./components/Wallet";

import CenterOrderManage from "./components/CenterOrderManage";

import MakeUrlParam from "../../components/service/MakeUrlParam";

//redux
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { API_BASE_URL } from "../../configs/AppConfig";
import { getDraftServiceList } from "../../redux/actions";
import i18n from "i18n-js";

const ServiceCenter = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const userId = localStorage.getItem("userId");
  const language = localStorage.getItem("language");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRecallModalVisible, setIsRecallMoalVisible] = useState(false);
  const [deleteThisService, setDeleteThisService] = useState();
  const [reCallThisService, setRecallThisService] = useState();
  const [selectedTab, setSelectedTab] = useState(
    props.location.state !== undefined ? props.location.state : 0
  );

  const userData = useSelector((state) => state.userData.userInfo);

  const draftServiceList = useSelector(
    (state) => state.serviceData.draftServiceList
  );

  useEffect(() => {
    if (userId) {
      dispatch(getDraftServiceList(userId));
    }
  }, []);

  const listWrapperLayout = {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 12 },
    lg: { span: 6 },
  };

  // 修改服务上下架(0上架，1下架)
  const handleSwitch = async (checked, serviceId) => {
    const data = {
      userId: userId,
      serviceId: serviceId,
      serviceBlock: checked ? "0" : "1",
    };

    axios
      .post(API_BASE_URL + "service/updateServiceBlock.php", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        //重新获取list
        dispatch(getDraftServiceList(userId));
      })
      .catch((error) => {});
  };

  const handleDeleteService = async () => {
    // 确定撤回申请，修改服务状态为草稿
    if (isRecallModalVisible) {
      const data = {
        serviceId: reCallThisService,
        userId: userId,
      };
      axios
        .post(API_BASE_URL + "service/updateServiceToDraft.php", data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log("update service to draft result", res.data);
          if (res.data.message === "success") {
            //重新获取list
            dispatch(getDraftServiceList(userId));
          } else {
            message.error(i18n.t("Withdraw application failed"));
          }
          setIsModalVisible(false);
          setIsRecallMoalVisible(false);
          setRecallThisService(null);
        })
        .catch((error) => {});
    }
    // 确定删除服务
    else {
      const data = {
        serviceId: deleteThisService,
        userId: userId,
      };
      axios
        .post(API_BASE_URL + "service/deleteService.php", data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log("delete service ersult", res.data);
          if (res.data.message === "success") {
            //重新获取list
            dispatch(getDraftServiceList(userId));
          } else {
            message.error(i18n.t("Delete service failed"));
          }
          setIsModalVisible(false);
          setIsRecallMoalVisible(false);
          setDeleteThisService(null);
        })
        .catch((error) => {});
    }
  };

  const handleMessageClick = (item) => {
    if (item.serviceState === "0") {
      //当state是撤回申请，modal弹窗提示是否确定要撤回
      setRecallThisService(item.serviceId);
      setIsModalVisible(true);
      setIsRecallMoalVisible(true);
    } else {
      // 当state是预览/编辑内容并提交

      const newRouterParams = MakeUrlParam(item);
      history.push({
        pathname: `/serviceapply/applicant`,
        search: newRouterParams,
        state: true,
      });
      // history.push(`/serviceapply/applicant?${newRouterParams}`);
    }
  };

  if (!userId) {
    message.error(i18n.t("Please login"));
    history.push("/");
    return;
  }

  if (!draftServiceList || !userData) {
    return <LoadingView />;
  }

  const avatarStateObj = {
    0: stateNew,
    2: stateVIP,
  };

  const menuTab = [
    {
      action: 0,
      name: i18n.t("My Service"),
    },
    {
      action: 1,
      name: i18n.t("My Wallet"),
    },
    {
      action: 2,
      name: i18n.t("My Order"),
    },
  ];

  return (
    <div className="submit-wrapper d-flex flex-column align-items-center page-background">
      {/* <div className="content-container responsive-container"> */}

      {/* 居中的div */}
      <div className="inner-container responsive-container">
        {/* header */}
        <div className="header-container padding-h-30-v-0 mt-3">
          <span className="record-14-70">{i18n.t("My Service")}</span>
        </div>

        {/* menu tab */}
        <div className="header-container padding-h-30-v-0 margin-bottom-30 mt-3">
          {menuTab.map((element, index) => {
            return (
              <span
                onClick={() => setSelectedTab(element.action)}
                className={
                  selectedTab === element.action
                    ? "selectedTab-container text-bold mr-4"
                    : "tab-container text-bold mr-4"
                }
                key={index}
              >
                {element.name}
              </span>
            );
          })}
        </div>

        {/* 服务列表 */}
        {selectedTab === 0 && (
          <Row className="service-row">
            {draftServiceList.length > 0 &&
              draftServiceList.map((item, index) => {
                let unapprovedStateTitle, unapprovedMessage;
                if (item.serviceState === "0") {
                  unapprovedStateTitle = i18n.t("Processing");
                  unapprovedMessage = i18n.t("Withdraw");
                } else if (item.serviceState === "-1") {
                  unapprovedStateTitle = i18n.t("UnSubmitted");
                  unapprovedMessage = i18n.t("Preview and submit");
                } else if (item.serviceState === "-2") {
                  unapprovedStateTitle = i18n.t("Refused");
                  unapprovedMessage = i18n.t("Edit and submit");
                }

                return (
                  <Col key={index} {...listWrapperLayout} className="each-col">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                      }}
                      //  className="card-inner-div"
                    >
                      {/* image container */}
                      <div
                        onClick={() => {
                          if (item.serviceState === "1") {
                            history.push({
                              pathname: "/service/centercarddetail",
                              state: item.serviceId,
                            });
                          }
                        }}
                        className={
                          item.serviceState === "1"
                            ? "cover-image-container span-mouse-click"
                            : "cover-image-container"
                        }
                      >
                        <img
                          className="cover-image"
                          src={
                            item.serviceImage.length > 0
                              ? item.serviceImage[0]
                              : "http://pawpus.finestudiotest.com/include/pic/backend/21030105112901.jpg"
                          }
                          alt=""
                        />

                        {/* 朦胧阴影盖在卡片上 */}
                        {item.serviceState !== "1" && (
                          <div className="overly-background opacity-effect" />
                        )}
                        <div className="edit-delete-buttons-container">
                          {/* 已上架 */}
                          {item.serviceState === "1" ? (
                            <div className="approved-state-container">
                              <div>
                                <Switch
                                  className="margin-right-10"
                                  defaultChecked={
                                    item.serviceBlock === "0" ? true : false
                                  }
                                  onChange={(checked, e) => {
                                    e.stopPropagation();
                                    handleSwitch(checked, item.serviceId);
                                  }}
                                />
                                <span className="bg-white">
                                  {item.serviceBlock === "0"
                                    ? i18n.t("Open")
                                    : i18n.t("closed")}
                                </span>
                              </div>
                              <div className="action-buttons-container ">
                                <CalendarOutlined
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    history.push({
                                      pathname: "/service/datemodify",
                                      state: item,
                                    });
                                  }}
                                  className="edit-button margin-right-10 span-mouse-click"
                                />

                                <EditOutlined
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const newRouterParams = MakeUrlParam(item);
                                    // history.push(
                                    //   `/serviceapply/applicant?${newRouterParams}`
                                    // );
                                    history.push({
                                      pathname: `/serviceapply/applicant`,
                                      search: newRouterParams,
                                      state: true,
                                    });
                                  }}
                                  className="edit-button margin-right-10 span-mouse-click"
                                />

                                <DeleteOutlined
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteThisService(item.serviceId);
                                    setIsModalVisible(true);
                                  }}
                                  className="edit-button span-mouse-click"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="unapproved-action-container">
                              <span
                                onClick={() => {
                                  handleMessageClick(item);
                                }}
                                className="unapproved-action-message span-mouse-click"
                              >
                                {unapprovedMessage}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* 未通过审核的服务，中间显示的状态文字 */}
                        <div className="unapproved-service-state">
                          {unapprovedStateTitle}
                        </div>

                        {/* 高分服务 */}
                        {/* {userData.serverLevel === "3" && (
                          <>
                            <img className="flag" src={flag} alt="flag" />
                            <div className="city">
                              <div className="city-font">
                                {item.serviceCity}
                              </div>
                              <div className="flag-font">
                                {i18n.t("High Rated")}
                              </div>
                            </div>
                          </>
                        )} */}

                        {/* 宠物寄养 */}

                        <div className="title-price-container color-total-price fw-bold ">
                          <div className="title-price-inner-container">
                            <div
                              style={{ color: "#ffad3e" }}
                              className="price-title"
                            >
                              {`${i18n.t("Pet")} ${
                                item.categoryName && item.categoryName[language]
                              } ${i18n.t("Care")}`}
                            </div>
                            <div
                              style={{ color: "#ffad3e" }}
                              className="d-flex justify-content-center align-items-center"
                            >
                              <span className="price mr-1">
                                ${Number(item.servicePrice).toFixed(2)} /
                              </span>
                              <span className="day">{i18n.t("Day")}</span>
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
                                icon={<img src={userData?.userImage} alt="" />}
                              />

                              {(userData.serverLevel == 0 ||
                                userData.serverLevel == 2) && (
                                <img
                                  className="state-style"
                                  src={avatarStateObj[userData.serverLevel]}
                                  alt=""
                                />
                              )}
                            </div>

                            {/* 发布者名字 */}
                            <div className="author-name">
                              {userData?.userName}
                              {userData.serverLevel === "2" && (
                                <span className="certify-server">
                                  ({i18n.t("Certified Provider")})
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
                          <div className="card-like">
                            <span className="margin-right-10 text-12">
                              {/* {userData.serverStar} */}
                              {Number(item.serviceStar) === 0
                                ? 0
                                : Number(item.serviceStar).toFixed(1)}
                            </span>
                            <StarFilled style={{ color: "#fadb14" }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                );
              })}

            {/* 最后一张卡片，添加新的服务 */}
            <Col {...listWrapperLayout} className="each-col">
              <div
                onClick={() => history.push("/serviceapply/apply")}
                className="card-inner-div span-mouse-click"
              >
                {/* image container */}
                <div className="cover-image-container">
                  <div className="cover-image center-text add-button-bgc">
                    <PlusOutlined className="add-service-button-font" />
                    <span className="input-font">
                      {i18n.t("Post new service")}
                    </span>
                  </div>

                  {/* 宠物寄养 */}
                  <div className="title-price-container">
                    <div className="price-title">&nbsp;&nbsp; &nbsp;&nbsp;</div>
                    <span className="price">
                      &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;
                    </span>
                    <span className="day">
                      &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;
                    </span>
                  </div>
                </div>

                {/* avatar title container */}
                <div className="card-content-container-service">
                  <div className="user-avatar-name">
                    <div className="user-avatar-name-inner"></div>
                  </div>

                  <div>
                    <div>&nbsp;</div>
                  </div>

                  <div className="description-like-container-service">
                    <br />
                    <br />
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        )}

        {/* 钱包管理 */}
        {selectedTab === 1 && <Wallet />}

        {/* 订单管理 */}
        {selectedTab === 2 && <CenterOrderManage />}
      </div>
      {/* </div> */}

      {/* modal弹窗 */}
      <Modal
        visible={isModalVisible}
        closable={false}
        onCancel={() => {
          setIsModalVisible(false);
          setIsRecallMoalVisible(false);
        }}
        footer={false}
      >
        <div className="delete-warning-modal-wrapper">
          <div className="content-container margin-bottom-20">
            <img src={happyDog} alt="happy-dog" />
            <span className="input-font">{i18n.t("Attention")}</span>
            <span className="font-14-9f">
              {isRecallModalVisible
                ? i18n.t("Are you sure to withdraw the service")
                : i18n.t("Confirm deletion")}
            </span>
          </div>

          {/* footer */}
          <div className="footer">
            <div
              onClick={() => {
                setIsModalVisible(false);
                setIsRecallMoalVisible(false);
              }}
              className="return-button span-mouse-click"
            >
              {i18n.t("Return")}
            </div>
            <div className="confirm-button">
              <Button
                onClick={() => {
                  handleDeleteService();
                }}
                className="confirm-button-font"
              >
                {i18n.t("Confirm")}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ServiceCenter;
