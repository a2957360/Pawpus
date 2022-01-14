import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
//components
import { Row, Col, Modal, Button, message } from "antd";
import { Carousel } from "react-bootstrap";
import Loading from "../../components/loading/LoadingView";
//packages
import i18n from "i18n-js";
import axios from "axios";
import firebase from "firebase";
import "firebase/firestore";
//statics
import stateNew from "../../assets/img/service/state-new.png";
import stateVIP from "../../assets/img/service/state-vip.png";
import vipBadge from "../../assets/img/service/state-vip.png";
import noAvatar from "../../assets/img/payment/dog-logo.png";
import placeholder_pic from "../../assets/img/Success-Dogy.png";
import { API_BASE_URL } from "../../configs/AppConfig";

const db = firebase.firestore();

const ChateeServiceDetail = (props) => {
  const { chateeId, history } = props;
  const chaterId = localStorage.getItem("userId");
  const language = localStorage.getItem("language");
  const [serviceDetail, setServiceDetail] = useState(null);
  const [reviewLength, setReviewLength] = useState();

  const [shareModal, setShareModal] = useState({
    visible: false,
  });
  const [favourite, setFavourite] = useState({
    loading: false,
    added: false,
  });

  useEffect(() => {
    getServiceDetail();
  }, [chateeId, chaterId]);

  const getServiceDetail = async () => {
    const docRef = await db.doc(`${chaterId}/${chaterId}_${chateeId}`).get();

    if (docRef.exists) {
      const { lastViewServiceId } = await docRef.data(); //
      const { data } = await axios.get(
        `${API_BASE_URL}service/getSingleService.php?serviceId=${lastViewServiceId}&userId=${chaterId}`
      );

      if (data.data?.message === "nouser") {
        message.error(i18n.t("Please login again"));
        history.replce("/");
        return;
      } else {
        if (data.message === "no service") {
          message.error(i18n.t("This service does not exist"));
        }
        setServiceDetail(data.data);
        setFavourite({
          loading: false,
          added: data.data?.isSaved == 1,
        });
      }
      // get service review
      getServiceReviewList(lastViewServiceId);
    }
  };

  const getServiceReviewList = (data) => {
    axios
      .get(API_BASE_URL + `review/getServiceReview.php?serviceId=${data}`)
      .then((res) => {
        if (res.data.data.length > 0) {
          setReviewLength(res.data.data.length);
        } else {
          setReviewLength(null);
        }
      })
      .catch((error) => {});
  };

  const toggleAddToFavourite = async () => {
    setFavourite({
      ...favourite,
      loading: true,
    });
    if (favourite.added) {
      //取消收藏
      const toSubmit = {
        userId: chaterId,
        targetId: serviceDetail.serviceId,
        targetType: "0",
      };
      const { data } = await axios.post(
        `${API_BASE_URL}saved/deleteSaved.php`,
        toSubmit
      );
      if (data.message === "success") {
        message.success(i18n.t("Successfully remove from favourite"));
        setFavourite({
          loading: false,
          added: false,
        });
      } else {
        message.error(i18n.t("Remove from favourite failed"));
        setFavourite({
          ...favourite,
          loading: false,
        });
      }
    } else {
      //收藏
      const toSubmit = { userId: chaterId, targetId: serviceDetail.serviceId };
      const { data } = await axios.post(
        `${API_BASE_URL}service/saveService.php`,
        toSubmit
      );
      if (data.message === "success") {
        message.success(i18n.t("Successfully add to favourite"));
        setFavourite({
          loading: false,
          added: true,
        });
      } else {
        message.error(i18n.t("Add to favourite failed"));
        setFavourite({
          ...favourite,
          loading: false,
        });
      }
    }
  };

  console.log("serviceDetail", serviceDetail);

  const avatarStateObj = {
    0: stateNew,
    2: stateVIP,
  };

  if (!serviceDetail) {
    return (
      <div className="w-100 h-100 d-flex justify-content-center align-items-center">
        <Loading />
      </div>
    );
  } else {
    return (
      <>
        {/* 发布者 */}
        <div className="pb-3 border-bottom border-3">
          <div className="moment-author-profile position-relative">
            <Row>
              <span className="text-normal text-14 color-grey-typeAnimal">
                {i18n.t("Author")}
              </span>
            </Row>

            <Row className="pt-3">
              <div className="author-avatar">
                <img
                  src={
                    !serviceDetail.userImage
                      ? noAvatar
                      : serviceDetail.userImage
                  }
                  alt={serviceDetail.userName}
                />

                {(serviceDetail.serverLevel == 0 ||
                  serviceDetail.serverLevel == 2) && (
                  <img
                    className="state-style"
                    src={avatarStateObj[serviceDetail.serverLevel]}
                    alt=""
                  />
                )}
              </div>

              <div>
                <p className="text-bold text-14 text-truncate color-grey-typeAnimal mb-0">
                  {serviceDetail.userName}{" "}
                  {serviceDetail.serverLevel === "2" && (
                    <span className="certify-color">
                      ({i18n.t("Certified Provider")})
                    </span>
                  )}
                </p>
                <span className="text-normal text-12 color-grey-typeAnimal text-truncate">
                  {serviceDetail.userDescription}
                </span>
              </div>
            </Row>
            <div className="view-profile-button">
              <Button
                className="text-bold text-14 view-profile-button text-truncate px-3"
                onClick={() =>
                  history.push(`/user/userInfo/${serviceDetail.userId}`)
                }
              >
                {i18n.t("View Profile")}
              </Button>
            </div>
          </div>
        </div>

        {/* 服务详情 */}
        <Row className="w-100 py-3 border-bottom border-3">
          <Row align="bottom" className="w-100 chat-service-text">
            <span className="text-bold color-grey-8">
              {language.includes("zh")
                ? serviceDetail.categoryName.zh
                : serviceDetail.categoryName.en}
              {i18n.t("Boarding")}
            </span>
            <span className="text-normal text-14 color-grey-8 ml-2">
              {i18n.t("By")}
              <span className="color-owner px-1">{serviceDetail.userName}</span>
              {i18n.t("Provide")}
            </span>
          </Row>

          <Row
            align="middle"
            justify="space-between"
            className="w-100 py-2 chat-service-location-review"
          >
            <span className="text-normal py-2 color-grey-typeAnimal">
              {i18n.t("Canada")}/{serviceDetail.serviceProvince}/
              {serviceDetail.serviceCity}
            </span>
            <span>
              <i className="fas fa-star color-total-price pr-1"></i>
              <span className="text-normal color-grey-typeAnimal">
                {!reviewLength
                  ? i18n.t("No rate currently")
                  : `${Number(serviceDetail.serviceStar).toFixed(
                      serviceDetail.serviceStar == 0 ? 0 : 1
                    )} ` + `(${reviewLength} ${i18n.t("Reviews")})`}
              </span>
            </span>
          </Row>

          <Row className="text-normal py-2 color-grey-typeAnimal chat-service-text chat-service-mobile">
            {i18n.t("Canada")}/{serviceDetail.serviceProvince}/
            {serviceDetail.serviceCity}
          </Row>

          <Row
            align="middle"
            className="pb-3 chat-service-text chat-service-mobile"
          >
            <i className="fas fa-star color-total-price pr-1"></i>
            <span className="text-normal color-grey-typeAnimal">
              {!reviewLength
                ? i18n.t("No rate currently")
                : `${Number(serviceDetail.serviceStar).toFixed(
                    serviceDetail.serviceStar == 0 ? 0 : 1
                  )} ` + `(${reviewLength} ${i18n.t("Reviews")})`}
            </span>
          </Row>

          <Row className="w-100 py-2">
            <Button
              type="text"
              disabled={favourite.loading}
              onClick={toggleAddToFavourite}
              className="chat-service-button"
            >
              <i
                className={`fas fa-star ${
                  favourite.added ? "color-total-price" : "color-card-detail"
                }`}
              >
                <span className="text-normal pl-1">
                  {favourite.added
                    ? i18n.t("Saved to favourite")
                    : i18n.t("Save to favourite")}
                </span>
              </i>
            </Button>
            <Button
              type="text"
              className="chat-service-button"
              onClick={() => setShareModal({ ...shareModal, visible: true })}
            >
              <i className="fas fa-share color-card-detail">
                <span className="text-normal color-card-detail pl-1">
                  {i18n.t("Share")}
                </span>
              </i>
            </Button>
          </Row>
        </Row>
        {/* 图片 */}
        <Row justify="center" className="py-3 w-100">
          <Carousel indicators={false}>
            {serviceDetail.serviceImage.map((img, index) => (
              <Carousel.Item key={index}>
                <img className="chat-service-img" src={img} alt="First slide" />
              </Carousel.Item>
            ))}
          </Carousel>
        </Row>
        {/* 分享弹窗 */}
        <Modal
          visible={shareModal.visible}
          onCancel={() => setShareModal({ ...shareModal, visible: false })}
          footer={null}
        >
          <div className="d-flex flex-column align-items-center">
            <img src={placeholder_pic} alt="success-placeholder" />
            <span className="text-normal text-20 grey-service-price">
              {i18n.t("Please copy the following link to share")}
            </span>
            <span className="text-normal text-20 grey-service-price">
              {`${window.location.hostname}/service/detail/${serviceDetail.serviceId}`}
            </span>
            <div className="w-80 d-flex justify-content-center m-3">
              <Button
                type="primary"
                className="primary-background text-normal-20 text-dark"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.hostname}/service/detail/${serviceDetail.serviceId}`
                  );
                  message.success(i18n.t("Link copied"));
                }}
              >
                {i18n.t("Copy link")}
              </Button>
            </div>
          </div>
        </Modal>
      </>
    );
  }
};

export default withRouter(ChateeServiceDetail);
