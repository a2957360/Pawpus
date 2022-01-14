import { useState, useEffect } from "react";
//packages
import { withRouter } from "react-router-dom";
import { withSize } from "react-sizeme";
import firebase from "firebase";
import "firebase/firestore";
import axios from "axios";
import i18n from "i18n-js";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

//components
import { Button, Divider, Row, Col, Breadcrumb, Modal, message } from "antd";
import { StarFilled, CheckOutlined } from "@ant-design/icons";
import ImageCarousel from "../../../components/layout/carousel/ImageCarousel";
import Review from "../../../components/review/Review";
import shareButtonImage from "../../../assets/img/service/share.png";
import ModalServiceDetailCalculator from "../components/ModalServiceDetailCalculator";
import placeholder_pic from "../../../assets/img/Success-Dogy.png";
import House from "../../../assets/img/service/House.png";

//redux
import { useDispatch, useSelector } from "react-redux";
import { API_BASE_URL } from "../../../configs/AppConfig";
import { updateContactList, getServiceDetail } from "../../../redux/actions";
// import { getServiceDetail } from '../../../redux/actions/service';

import { GOOGLE_API_KEY } from "../../../configs/AppConfig";

const ServiceDetailContent = (props) => {
  const { size, history, searchData } = props;

  const db = firebase.firestore();
  const dispatch = useDispatch();
  const chaterId = window.localStorage.getItem("userId");
  const language = localStorage.getItem("language");

  //redux state serviceDetail
  const data = useSelector((state) => state.serviceData.serviceDetail);

  //redux state reviewList
  const reviewList = useSelector((state) => state.serviceData.serviceReview);

  const [modalVisible, setModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [slicedReviewList, setSlicedReviewList] = useState(
    reviewList.slice(0, 10)
  );
  const [center, setCenter] = useState();

  let reviewTotalPoints = reviewList.reduce(
    (total, review) => total + Number(review.reviewStar),
    0
  );

  const [reviewPointsAverage, setReviewPointAverage] = useState(
    (reviewTotalPoints / reviewList.length).toFixed(1)
  );

  let addressParams = "";
  if (data.serviceAddress) {
    const addressSplited = data.serviceAddress.split(" ").slice(1);

    addressSplited.forEach((element) => {
      addressParams += element + "+";
    });
  }

  const getGeo = async () => {
    await axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${addressParams}${data.serviceCity}+${data.serviceProvince}&key=${GOOGLE_API_KEY}`
      )
      .then((res) => {
        setCenter(res.data.results[0].geometry.location);
      });
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_API_KEY,
  });

  useEffect(() => {
    getGeo();
  }, []);

  const checkList =
    data.serviceFacility.length > 0 &&
    data.serviceFacility.map((element, index) => {
      return (
        <Col key={index} span={12} className="d-flex align-items-center">
          <CheckOutlined className="text-grey-8 mr-2" />
          <span className="text-18 text-grey-8">{element[language]}</span>
        </Col>
      );
    });

  const renderReview = slicedReviewList.map((review, index) => {
    const { userName, createTime, reviewStar, reviewContent, userImage } =
      review;

    return (
      <Col key={index} span={24}>
        <Review
          name={userName}
          time={createTime}
          reviewStar={reviewStar}
          content={reviewContent}
          avatarUrl={userImage}
        />
      </Col>
    );
  });

  const contactLandlord = async () => {
    if (!chaterId) {
      message.error(i18n.t("Please login"));
    } else {
      //initial firebase chatroom collection
      const chaterDocRef = db.doc(`${chaterId}/${chaterId}_${data.userId}`);
      const chateeDocRef = db.doc(`${data.userId}/${data.userId}_${chaterId}`);

      chaterDocRef.set(
        {
          lastViewServiceId: data.serviceId,
          chateeImage: data.userImage,
          chateeName: data.userName,
        },
        {
          merge: true,
        }
      );
      chateeDocRef.get().then((doc) => {
        if (!doc.exists)
          chateeDocRef.set({
            // lastViewServiceId: data.serviceId,
          });
      });
      // //update contact list
      await dispatch(updateContactList(chaterId, data.userId, data.serviceId));
      // //redirect to chat page
      history.push({
        pathname: "/chat",
        state: { chateeId: data.userId, serviceId: data.serviceId },
      });
    }
  };

  const handleFavoriteButton = async () => {
    if (!chaterId) {
      message.error(i18n.t("Please login to add this service to favorite"));
    } else {
      //isSaved === false, 添加; true, 取消添加
      const SAVE_TYPE_URL =
        data.isSaved == "1"
          ? "saved/deleteSaved.php"
          : "service/saveService.php";
      const inputData =
        data.isSaved == "1"
          ? {
              targetType: "0",
              userId: chaterId,
              targetId: data.serviceId,
            }
          : {
              userId: chaterId,
              targetId: data.serviceId,
            };

      await axios
        .post(API_BASE_URL + SAVE_TYPE_URL, inputData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          dispatch(getServiceDetail(data.serviceId, chaterId));
        })
        .catch((error) => {});
    }

    // setIsSaved(!isSaved);
  };

  if (!center || !isLoaded) {
    return null;
  }

  return (
    <div>
      {/* pageHeader */}

      <div className="pageHeader-1">
        <Breadcrumb>
          <Breadcrumb.Item>
            <span
              onClick={() => history.push("/service/list")}
              className="span-mouse-click"
            >
              {i18n.t("Service Section")}
            </span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {`${data.categoryName[language]} ${i18n.t("care provided by")} ${
              data.userName
            } ${i18n.t("posted")}`}
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      {/* imageCarousel */}
      <ImageCarousel
        data={data.serviceImage}
        width={size.width}
        height={size.width * 0.65}
      />

      {/* 联系房东 */}
      <div className="pl-2 pr-2">
        <Row className="d-flex flex-row align-items-end margin-bottom-20">
          <Col span={24} className="text-22 text-grey-8 text-bold mt-3">
            {data.serviceName}
          </Col>
          <Col span={20} className="d-flex flex-row align-items-end">
            <div className="text-16 text-grey-8 mt-3 mr-3">
              {i18n.t("by")}
              <span className="text-16 text-primary"> {data.userName}</span>
              {i18n.t("provide")}
            </div>

            <Button
              className="primary-button responsive-button"
              // disabled={!chaterId}
              onClick={contactLandlord}
            >
              {i18n.t("Contact Landlord")}
            </Button>
          </Col>

          <Col
            span={4}
            className="d-flex flex-row justify-content-end align-items-end mt-3"
          >
            <StarFilled
              onClick={() => handleFavoriteButton()}
              className={
                data.isSaved == "1"
                  ? "saved-favorite mr-3"
                  : "favorite-button mr-3"
              }
            />

            <img
              onClick={() => setShareModalVisible(true)}
              className="share-button cursor-pointer"
              src={shareButtonImage}
              alt="/"
            />
          </Col>
        </Row>

        <div className="d-flex flex-row align-items-start">
          <span className="margin-right-30 text-22 text-grey-8">
            {i18n.t("Checkin Time")}: {data.checkinTime}
          </span>
          <span className="text-22 text-grey-8">
            {i18n.t("Checkout Time")}: {data.checkoutTime}
          </span>
        </div>
      </div>

      <Divider plain></Divider>

      {/* 详情 */}
      <div className="pl-2 pr-2">
        <div className="detail-section">
          <div className="text-22 text-grey-8 text-bold mr-3">
            {i18n.t("Detail")}
          </div>
          <div className="text-16 text-grey-8">
            {i18n.t("Below content provided by")}
            <span className="text-16 text-primary"> {data.userName}</span>
            {i18n.t("provide")}
          </div>
        </div>
        <div className="text-16 text-grey-8">{data.serviceDescription}</div>
      </div>

      <Divider plain></Divider>

      {/* 基础设施 */}
      <div className="pl-2 pr-2">
        <div className="detail-section">
          <div className="text-22 text-grey-8 text-bold mr-3">
            {i18n.t("Facility")}
          </div>
          <div className="text-16 text-grey-8">
            {i18n.t("Below content provided by")}
            <span className="text-16 text-primary"> {data.userName}</span>
            {i18n.t("provide")}
          </div>
        </div>
        <Row>{checkList}</Row>
      </div>

      <Divider plain></Divider>

      {/* 位置 */}
      <div className="pl-2 pr-2">
        <div className="detail-section">
          <div className="text-22 text-grey-8 text-bold mr-3">
            {i18n.t("Location")}
          </div>
          <div className="text-16 text-grey-8">
            {i18n.t("Below content provided by")}
            <span className="text-16 text-primary"> {data.userName}</span>
            {i18n.t("provide")}
          </div>
        </div>
        {/* <iframe
          icon={""}
          className="map-container"
          loading="lazy"
          allowFullScreen
          title="iframe"
          src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDCmwMYRg9mGJDZ_ttRz9LVqaNTwcbtsyw&q=${addressParams}${data.serviceCity}+${data.serviceProvince}`}
          // src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDCmwMYRg9mGJDZ_ttRz9LVqaNTwcbtsyw&q=valleywood+drive+makrham+on"
        ></iframe> */}

        <GoogleMap
          mapContainerClassName="map-container"
          zoom={15}
          center={center}
        >
          <Marker position={center} icon={House} />
        </GoogleMap>
      </div>

      <Divider plain></Divider>

      {/* 入住须知 */}
      <div className="pl-2 pr-2">
        <div className="detail-section">
          <div className="text-22 text-grey-8 text-bold mr-3">
            {i18n.t("Checkin notes")}
          </div>
          <div className="text-16 text-grey-8">
            {i18n.t("Below content provided by")}
            <span className="text-16 text-primary"> {data.userName}</span>
            {i18n.t("provide")}
          </div>
        </div>
        <div className="text-16 text-grey-8 mr-4">
          {data.serviceRequirement}
        </div>
      </div>

      <Divider plain></Divider>

      {/* 综合评分 */}
      <div className="pl-2 pr-2">
        <div className="detail-section">
          <div className="detail-title-large">
            {i18n.t("Comprehensive Score")}
          </div>
          <div className="detail-subtitle">
            <StarFilled className="star-container" />
            {reviewList.length === 0
              ? i18n.t("No rate currently")
              : reviewPointsAverage}
            {/* {reviewPointsAverage || i18n.t("No rate currently")} */}
          </div>
        </div>

        {/* <Review /> */}
        <Row>{renderReview}</Row>

        {/* loadmore button */}
        {slicedReviewList.length > 0 && slicedReviewList.length % 10 === 0 && (
          <Button
            onClick={() =>
              setSlicedReviewList(
                reviewList.slice(0, slicedReviewList.length + 10)
              )
            }
          >
            {i18n.t("View More")}
          </Button>
        )}
      </div>

      {/* 手机显示 */}
      <div className="fix-component">
        <div className="title-box">
          {i18n.t("Select dates to check the price")}
        </div>
        <div className="button-box">
          <Button
            onClick={() => setModalVisible(true)}
            className="modal-button"
            size={"large"}
          >
            {i18n.t("Check")}
          </Button>
        </div>
      </div>

      <Modal
        style={{ top: 20 }}
        width={size.width}
        visible={modalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <ModalServiceDetailCalculator data={data} searchData={searchData} />
      </Modal>

      {/* 分享弹窗 */}
      <Modal
        visible={shareModalVisible}
        onCancel={() => setShareModalVisible(false)}
        footer={null}
      >
        <div className="d-flex flex-column align-items-center">
          <img src={placeholder_pic} alt="success-placeholder" />
          <span className="text-normal text-20 grey-service-price">
            {i18n.t("Please copy the following link to share")}
          </span>
          <span className="w-100 text-normal text-14 grey-service-price align-text-center">
            {window.location.href}
          </span>
          <div className="w-80 d-flex justify-content-center m-3">
            <Button
              className="primary-button"
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.href}`).then(
                  function () {
                    /* clipboard successfully set */
                    message.success(i18n.t("Link copied"));
                  },
                  function () {
                    /* clipboard write failed */
                    message.success(i18n.t("Link copy failed"));
                  }
                );
              }}
            >
              {i18n.t("Copy link")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default withRouter(withSize()(ServiceDetailContent));
