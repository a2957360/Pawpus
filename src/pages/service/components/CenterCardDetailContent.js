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
import placeholder_pic from "../../../assets/img/Success-Dogy.png";
import House from "../../../assets/img/service/House.png";

//redux
import { useDispatch, useSelector } from "react-redux";
import { API_BASE_URL } from "../../../configs/AppConfig";
import { updateContactList } from "../../../redux/actions/chat";

import { GOOGLE_API_KEY } from "../../../configs/AppConfig";

const CenterCardDetailContent = (props) => {
  const { size, history } = props;

  const db = firebase.firestore();
  const dispatch = useDispatch();
  const chaterId = window.localStorage.getItem("userId");
  const language = localStorage.getItem("language");

  //redux state serviceDetail
  const data = useSelector((state) => state.serviceData.serviceDetail);

  //redux state reviewList
  const reviewList = useSelector((state) => state.serviceData.serviceReview);
  const [slicedReviewList, setSlicedReviewList] = useState(
    reviewList.slice(0, 10)
  );
  const [isSaved, setIsSaved] = useState(data.isSaved == "0" ? false : true);
  const [shareModalVisible, setShareModalVisible] = useState(false);
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
    const addressSplited = data.serviceAddress.split(" ");
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

  const renderReview = reviewList.map((review, index) => {
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
    //isSaved === false, ??????; true, ????????????
    const SAVE_TYPE_URL = isSaved
      ? "saved/deleteSaved.php"
      : "service/saveService.php";
    const inputData = isSaved
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
      .then((res) => {})
      .catch((error) => {});

    setIsSaved(!isSaved);
  };

  if (!center || !isLoaded) {
    return null;
  }

  return (
    <div className="main-container">
      {/* imageCarousel */}
      <ImageCarousel
        data={data.serviceImage}
        width={size.width}
        height={size.width * 0.65}
      />

      {/* ???????????? */}
      <div className="pl-2 pr-2">
        <Row className="d-flex flex-row align-items-end margin-bottom-20">
          <Col span={24} className="text-22 text-grey-8 text-bold mt-3">
            {data.serviceName}
          </Col>
          <Col span={20} className="d-flex flex-row align-items-end">
            <div className="text-16 text-grey-8 mt-3 mr-3">
              <span>{i18n.t("By")} </span>
              <span className="text-16 text-primary">{data.userName} </span>
              {i18n.t("provide")}
            </div>

            <Button
              className="primary-button responsive-button"
              disabled={!chaterId}
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
                isSaved ? "saved-favorite mr-3" : "favorite-button mr-3"
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

        <div className="d-flex flex-row align-items-start text-grey-8 text-22">
          {`${i18n.t("Checkin Time")}: ${data.checkinTime} ${i18n.t(
            "Checkout Time"
          )}: ${data.checkoutTime}`}
        </div>
      </div>

      <Divider plain></Divider>

      {/* ?????? */}
      <div className="pl-2 pr-2">
        <div className="detail-section">
          <div className="text-22 text-grey-8 text-bold mr-3">
            {i18n.t("Detail")}
          </div>
          <div className="text-16 text-grey-8">
            <span>{i18n.t("Below content provided by")}</span>
            <span className="text-primary"> {data.userName} </span>
            <span>{i18n.t("provide")}</span>
          </div>
        </div>
        <div className="text-16 text-grey-8">{data.serviceDescription}</div>
      </div>

      <Divider plain></Divider>

      {/* ???????????? */}
      <div className="pl-2 pr-2">
        <div className="detail-section">
          <div className="text-22 text-grey-8 text-bold mr-3">
            {i18n.t("Facility")}
          </div>
          <div className="text-16 text-grey-8">
            <span>{i18n.t("Below content provided by")}</span>
            <span className="text-16 text-primary"> {data.userName} </span>
            <span>{i18n.t("provide")}</span>
          </div>
        </div>
        <Row>{checkList}</Row>
      </div>

      <Divider plain></Divider>

      {/* ?????? */}
      <div className="pl-2 pr-2">
        <div className="detail-section">
          <div className="text-22 text-grey-8 text-bold mr-3">
            {i18n.t("Location")}
          </div>
          <div className="text-16 text-grey-8">
            <span>{i18n.t("Below content provided by")}</span>
            <span className="text-16 text-primary"> {data.userName} </span>
            <span>{i18n.t("provide")}</span>
          </div>
        </div>
        {/* <iframe
          className="map-container"
          loading="lazy"
          allowFullScreen
          title="iframe"
          src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDCmwMYRg9mGJDZ_ttRz9LVqaNTwcbtsyw&q=${addressParams}${data.serviceCity}+${data.serviceProvince}`}
          // src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDCmwMYRg9mGJDZ_ttRz9LVqaNTwcbtsyw&q=25+valleywood+drive+makrham+on"
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

      {/* ???????????? */}
      <div className="pl-2 pr-2">
        <div className="detail-section">
          <div className="text-22 text-grey-8 text-bold mr-3">
            {i18n.t("Checkin notes")}
          </div>
          <div className="text-16 text-grey-8">
            <span>{i18n.t("Below content provided by")}</span>
            <span className="text-16 text-primary"> {data.userName} </span>
            <span>{i18n.t("provide")}</span>
          </div>
        </div>
        <div className="text-16 text-grey-8 mr-4">
          {data.serviceRequirement}
        </div>
      </div>

      <Divider plain></Divider>

      {/* ???????????? */}
      <div className="pl-2 pr-2 margin-bottom-20">
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
        {/* {reviewList.length > 0 ? <Button>Load more</Button> : null} */}
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

      <div className="pl-2 pr-2 align-items-center">
        <Button onClick={() => history.goBack()}>{i18n.t("Return")}</Button>
      </div>

      {/* ???????????? */}
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
                navigator.clipboard.writeText(`${window.location.href}`);
                message.success(i18n.t("Link copied"));
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

export default withRouter(withSize()(CenterCardDetailContent));
