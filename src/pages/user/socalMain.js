import React, { useState, useEffect } from "react";
//packages
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import i18n from "i18n-js";

//components
import { Row, Col, Card, Button } from "antd";
import LoadingView from "../../components/loading/LoadingView";
import Masonry from "react-masonry-css";
import DashboardMomentPreview from "./components/DashboardMomentPreview";
import PetCardList from "./PetCardList";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

//statics
import { API_BASE_URL, breakpointColumnsObj } from "../../configs/AppConfig";
import noAvatar from "../../assets/img/Success-Dogy.png";
import { getServiceCategory } from "../../redux/actions/service";

const SocalMain = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [momentList, setMomentList] = useState([]);
  const [selectedTab, setSelectedTab] = useState({
    id: 1,
    title: i18n.t("My Moments"),
    state: 1,
    endpoint: "getMoment",
  });

  const [loadMoreState, setLoadMoreState] = useState({
    loading: false,
    offset: 0,
    end: false,
  });

  const userId = localStorage.getItem("userId");
  const userInfo = useSelector((state) => state.userData.userInfo);

  const tabs = [
    { id: 1, title: i18n.t("My Moments"), state: 1, endpoint: "getMoment" },
    {
      id: 2,
      title: i18n.t("Liked Moments"),
      state: 2,
      endpoint: "getLikedMoment",
    },
    {
      id: 3,
      title: i18n.t("Saved Moments"),
      state: 3,
      endpoint: "getSavedMoment",
    },
    {
      id: 4,
      title: i18n.t("Commented Moments"),
      state: 4,
      endpoint: "getRepliedMoment",
    },
    {
      id: 5,
      title: i18n.t("My Pet Cards"),
      state: 5,
      endpoint: "getMyPetCards",
    },
  ];

  const emptyListText = [
    "",
    "No moment data",
    "No liked moment",
    "No saved moment",
    "No commented moment",
  ];

  useEffect(() => {
    fetchMomentData();
    dispatch(getServiceCategory());
  }, [selectedTab]);

  const fetchMomentData = async (offset = loadMoreState.offset) => {
    if (selectedTab.state === 5) {
      return;
    } else {
      const { data } = await axios.get(
        `${API_BASE_URL}moment/${selectedTab.endpoint}.php?userId=${userId}&offset=${offset}&loginUserId=${userId}`
      );
      setMomentList(data.data);
      setLoadMoreState({
        ...loadMoreState,
        offset: data.offset,
      });
    }
  };

  const handleTabSwitch = (tab) => {
    setSelectedTab(tab);
    setLoadMoreState({
      loading: false,
      offset: 0,
      end: false,
    });
  };

  const handleLoadMore = async () => {
    setLoadMoreState({
      ...loadMoreState,
      loading: true,
    });
    const { data } = await axios.get(
      `${API_BASE_URL}moment/${selectedTab.endpoint}.php?userId=${userId}&offset=${loadMoreState.offset}&loginUserId=${userId}`
    );
    setMomentList([...momentList, ...data.data]);
    setLoadMoreState({
      ...loadMoreState,
      loading: false,
      offset: data.offset,
      end: data.data.length === 0,
    });
  };

  if (!userId || !userInfo || momentList == null) {
    return <LoadingView />;
  } else {
    return (
      <div className="profile-wrapper">
        <div className="profile-container responsive-container">
          <div className="profile-list-container w-100 my-3 p-3">
            <Row align="middle" className="w-100">
              <div>
                <img
                  className="profile-avatar mr-3"
                  src={userInfo.userImage}
                  alt="/"
                />
              </div>
              <div
              // className="border border-1"
              >
                <p className="line-height-21 text-18 color-grey-7 text-bold">
                  {userInfo.userName}
                </p>
                <p className="text-14 color-grey-7">
                  {userInfo.userDescription}
                </p>
              </div>
            </Row>
          </div>

          <div className="profile-list-container w-100 my-3 px-3">
            <div className="header-container-tab m-auto">
              {tabs.map((tab) => (
                <p
                  key={tab.id}
                  onClick={() => handleTabSwitch(tab)}
                  className={`text-center tab-container ${
                    selectedTab.state === tab.state
                      ? "tab-container-selected"
                      : ""
                  }`}
                >
                  {tab.title}
                </p>
              ))}
            </div>
          </div>

          {selectedTab.state !== 5 && (
            <div className="w-100 pb-5">
              {momentList.length == 0 ? (
                <div className="w-50 m-auto d-flex flex-column align-items-center">
                  <img src={noAvatar} alt="Pawpus" className="w-50" />
                  <p className="text-center color-grey-7">
                    {i18n.t(emptyListText[selectedTab.state])}
                  </p>
                  {selectedTab.state == 1 ? (
                    <Button
                      className="text-normal text-16 color-button-title loadmore-button w-30"
                      onClick={() => history.push("/social/publish")}
                    >
                      {i18n.t("Publish Post")}
                    </Button>
                  ) : (
                    <Button
                      className="text-normal text-16 color-button-title loadmore-button w-30"
                      onClick={() => history.push("/social/list")}
                    >
                      {i18n.t("Explore More")}
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="social-list-wrapper"
                    columnClassName="social-list-column"
                  >
                    {/* {momentList.map((moment) => (
                      <DashboardMomentPreview
                        key={moment.momentId}
                        data={moment}
                        removable
                        fetchMomentData={fetchMomentData}
                      />
                    ))} */}
                    {momentList.map((moment) => {
                      return (
                        <DashboardMomentPreview
                          key={moment.momentId}
                          data={moment}
                          removable={selectedTab.state === 1}
                          favourite={selectedTab.state === 3}
                          fetchMomentData={fetchMomentData}
                        />
                      );
                    })}
                    <div
                      role="button"
                      onClick={() => history.push("/social/publish")}
                      className="single-moment-container publish-icon d-flex flex-column justify-content-center align-items-center"
                    >
                      <PlusOutlined className="text-100 color-white" />
                      <p className="text-20 color-grey-servicePrice mt-2">
                        {i18n.t("New Moment")}
                      </p>
                    </div>
                  </Masonry>

                  {momentList.length > 0 && (
                    <Row align="middle" justify="center" className="w-100">
                      <Button
                        className="text-normal text-16 color-button-title loadmore-button"
                        onClick={() => handleLoadMore()}
                        icon={
                          loadMoreState.loading ? <LoadingOutlined /> : null
                        }
                        loading={loadMoreState.loading}
                        disabled={loadMoreState.end}
                      >
                        {loadMoreState.end
                          ? i18n.t("No More")
                          : i18n.t("Load More")}
                      </Button>
                    </Row>
                  )}
                </>
              )}
            </div>
          )}
          {selectedTab.state === 5 && (
            <div className="w-100 pb-5">
              <PetCardList />
            </div>
          )}
        </div>
      </div>
    );
  }
};

export default SocalMain;
