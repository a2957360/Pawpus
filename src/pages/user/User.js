import { useState, useEffect } from "react";

import { useHistory } from "react-router-dom";

//components
import PetInfoModal from "./components/PetInfoModal";
import Review from "../../components/review/Review";
import DisplayPetCard from "../record/components/DisplayPetCard";
import LoadingView from "../../components/loading/LoadingView";
import flag from "../../assets/img/service/flag.png";
import stateNew from "../../assets/img/service/state-new.png";
import stateVIP from "../../assets/img/service/state-vip.png";

//packages
import { Row, Col, Avatar, Divider, message } from "antd";
import { StarFilled } from "@ant-design/icons";
import i18n from "i18n-js";

//redux
import axios from "axios";
import { API_BASE_URL } from "../../configs/AppConfig";
import { useSelector, useDispatch } from "react-redux";
import {
  getDraftServiceList,
  getUserReview,
  getPetList,
} from "../../redux/actions";
import UserSocialList from "./components/UserSocialList";

const User = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const language = localStorage.getItem("language");
  const user_id = props.match.params.id;

  const [selectedTab, setSelectedTab] = useState(0);
  const [userInfo, setUserInfo] = useState();
  const [isPetInfoVisible, setIsPetInfoVisible] = useState(false);
  const [selectedPetCard, setSelectedPetCard] = useState([]);

  const draftServiceList = useSelector(
    (state) => state.serviceData.draftServiceList
  );
  const { petList } = useSelector((state) => state.serviceData);
  const { userReviewList } = useSelector((state) => state.userData);

  const listWrapperLayout = {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 12 },
    lg: { span: 6 },
  };
  const testGutter = { xs: 8, sm: 16, md: 24, lg: 32 };

  //获取用户信息
  useEffect(() => {
    const getUserInfo = async () => {
      axios
        .get(API_BASE_URL + `user/getUserInfo.php?userId=${user_id}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (res.data.message === "nouser") {
            message.warn(i18n.t("User is removed"));
            history.goBack();
          } else {
            setUserInfo(res.data.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getUserInfo();
  }, [dispatch, user_id]);

  useEffect(() => {
    if (selectedTab === 0) {
      //getDraftList
      dispatch(getDraftServiceList(user_id));
    } else if (selectedTab === 1) {
      // get socical list
    } else if (selectedTab === 2) {
      //get pet list & user reivew
      dispatch(getPetList(user_id));
      dispatch(getUserReview(user_id));
    }
  }, [user_id, selectedTab]);

  const menuTab = [
    {
      action: 0,
      name: i18n.t("TAService"),
    },
    {
      action: 1,
      name: i18n.t("TAMoment"),
    },
    {
      action: 2,
      name: i18n.t("TAPetCard"),
    },
  ];

  if (!user_id) {
    message.error(i18n.t("Please login"));
    history.push("/");
  }

  if (!userInfo || !draftServiceList) {
    return <LoadingView />;
  }

  const avatarStateObj = {
    0: stateNew,
    2: stateVIP,
  };

  const serviceList = draftServiceList.filter(
    (e) => e.serviceState === "1" && e.serviceBlock === "0"
  );

  return (
    <div className="user-wrapper">
      <div className="main-container">
        {/* avatar % name */}
        <div className="information-section">
          <img className="avatar" src={userInfo.userImage} alt="" />
          <div className="name-description">
            {/* userName */}
            <span className="font-18-70 margin-bottom-10">
              {userInfo.userName}
            </span>
            <span className="record-14-70">{userInfo.userDescription}</span>
          </div>
        </div>

        {/* tabs */}
        <div className="header-container-tab">
          {menuTab.map((e, index) => {
            return (
              <span
                key={index}
                onClick={() => setSelectedTab(e.action)}
                className={
                  selectedTab === e.action
                    ? "selectedTab-container"
                    : "tab-container"
                }
              >
                {e.name}
              </span>
            );
          })}
        </div>

        {/* content */}

        {selectedTab === 0 && (
          <Row className="service-row">
            {serviceList.length > 0 &&
              serviceList.map((item, index) => {
                return (
                  <Col key={index} {...listWrapperLayout} className="each-col">
                    <div className="card-inner-div">
                      {/* image container */}
                      <div
                        onClick={() => {
                          history.push(`/service/detail/${item.serviceId}?`);
                        }}
                        className="cover-image-container span-mouse-click"
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

                        {/* 高分服务 */}
                        {userInfo.serverLevel === "3" && (
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
                        )}

                        {/* 宠物寄养 */}
                        <div className="title-price-container color-total-price fw-bold">
                          <div className="price-title">
                            {item.categoryName && item.categoryName[language]}
                            {i18n.t("Care")}
                          </div>

                          <span className="price">${item?.servicePrice}/</span>
                          <span className="day">{i18n.t("Day")}</span>
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
                                icon={<img src={userInfo.userImage} alt="" />}
                              />

                              {(userInfo.serverLevel == 0 ||
                                userInfo.serverLevel == 2) && (
                                <img
                                  className="state-style"
                                  src={avatarStateObj[userInfo.serverLevel]}
                                  alt=""
                                />
                              )}
                            </div>

                            {/* 发布者名字 */}
                            <div className="author-name">
                              {userInfo.userName}
                              {userInfo.serverLevel === "2" && (
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
                          <div className="card-like text-12">
                            <span className="margin-right-10">
                              {Number(userInfo.serverStar) == 0
                                ? 0
                                : Number(userInfo.serverStar).toFixed(1)}
                            </span>
                            <StarFilled style={{ color: "#fadb14" }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                );
              })}
          </Row>
        )}

        {selectedTab === 1 && <UserSocialList />}

        {selectedTab === 2 && petList && userReviewList && (
          <>
            <Row gutter={testGutter}>
              {petList.map((element, index) => {
                return (
                  <Col
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPetCard(element);
                      setIsPetInfoVisible(true);
                    }}
                    key={index}
                    xs={24}
                    md={12}
                    xl={6}
                    className="span-mouse-click"
                  >
                    <DisplayPetCard data={element} />
                  </Col>
                );
              })}
            </Row>
            <Divider dashed />
            {/* 评价 */}
            <div className="pl-2 pr-2">
              <div className="detail-section">
                <div className="detail-title-large">
                  {i18n.t("Customer Review")}
                </div>
                {/* <div className="detail-subtitle">
                  <StarFilled className="star-container" />
                </div> */}
              </div>

              {/* <Review /> */}
              <Row>
                {userReviewList.map((review, index) => {
                  const {
                    userName,
                    createTime,
                    reviewStar,
                    reviewContent,
                    userImage,
                  } = review;

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
                })}
              </Row>
            </div>
          </>
        )}

        <PetInfoModal
          isPetInfoVisible={isPetInfoVisible}
          setIsPetInfoVisible={setIsPetInfoVisible}
          selectedPetCard={selectedPetCard}
          showMessage={false}
        />
      </div>
    </div>
  );
};

export default User;
