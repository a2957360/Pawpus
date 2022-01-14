import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
//components
import { Card } from "antd";
import { Button, Tooltip, Row, Col, message } from "antd";
import LoadingView from "../../../components/loading/LoadingView";
import { LoadingOutlined } from "@ant-design/icons";

//redux
import { useSelector, useDispatch } from "react-redux";
// import {
//   getMomentData,
//   loadMoreMomentData,
// } from '../../../redux/actions/moment';
//packages
import Masonry from "react-masonry-css";
import i18n from "i18n-js";
//dummy data
import noAvatar from "../../../assets/img/Success-Dogy.png";
import axios from "axios";
import { API_BASE_URL } from "../../../configs/AppConfig";

const breakpointColumnsObj = {
  default: 6,
  1280: 4,
  768: 2,
};

const SocialList = (props) => {
  const history = useHistory();
  const loginUserId = localStorage.getItem("userId");
  const { id: userId } = useParams();
  const [momentData, setMomentData] = useState({
    momentList: null,
    offset: 0,
    loadingMore: false,
    end: false,
  });
  const dispatch = useDispatch();
  // const { momentList, loading, loadMore, offset, momentListMessage } =
  //   useSelector((state) => state.momentData);

  //static like
  const [liked, setLiked] = useState([]);

  useEffect(() => {
    getMomentData();
  }, [userId, loginUserId]);

  useEffect(() => {
    initMomentList();
  }, [momentData]);

  const getMomentData = async () => {
    const { data } = await axios.get(
      `${API_BASE_URL}moment/getMoment.php?userId=${userId}&offset=0&loginUserId=${loginUserId}`
    );

    setMomentData({
      ...momentData,
      momentList: data.data,
      offset: data.offset,
    });
  };

  const handleLikeMomentClick = async (momentId) => {
    if (!loginUserId) {
      message.error(i18n.t("Please login"));
      return;
    }
    let temp = [];
    const { data } = await axios.post(`${API_BASE_URL}moment/likeAction.php`, {
      userId: loginUserId,
      momentId,
    });
    if (data.message === "success") {
      if (liked.includes(momentId)) {
        //取消点赞
        temp = liked.filter((id) => id !== momentId);
        setLiked(temp);
        message.success(i18n.t("Unlike Succeeded"));
      } else {
        temp = [...liked, momentId];
        setLiked(temp);
        message.success(i18n.t("Like Succeeded"));
      }
    } else {
      if (liked.includes(momentId)) {
        message.error(i18n.t("Unlike Failed"));
      } else {
        message.error(i18n.t("Like Failed"));
      }
    }
  };

  const initMomentList = () => {
    if (!momentData.momentList || momentData.momentList.length === 0) {
      return;
    }
    const likedIds = momentData.momentList
      .filter((moment) => moment.isLiked)
      .map((moment) => moment.momentId);
    setLiked(likedIds);
  };

  const handleLoadMore = () => {
    setMomentData({
      ...momentData,
      loadingMore: true,
    });
    axios
      .get(
        `${API_BASE_URL}moment/getMoment.php?userId=${userId}&offset=${momentData.offset}&loginUserId=${loginUserId}`
      )
      .then(({ data }) => {
        if (data.data.length === 0) {
          setMomentData({
            ...momentData,
            loadingMore: false,
            end: true,
          });
        } else {
          setMomentData({
            ...momentData,
            momentList: [...momentData.momentList, ...data.data],
            loadingMore: false,
          });
        }
      })
      .catch((e) => console.log(e));
    // dispatch(loadMoreMomentData(offset, userId));
  };

  if (!momentData.momentList) {
    return (
      <div className="w-100 page-background border border-3">
        <LoadingView />
      </div>
    );
  } else {
    return (
      <Row justify="center" className="w-100 page-background pt-2">
        <Col className="w-100 page-background mb-5">
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="d-flex w-auto"
            columnClassName="my-masonry-grid_column"
          >
            {momentData.momentList.map((moment, index) => {
              return (
                <Card
                  key={index}
                  className="shadow bg-white border-radius-8 mb-3 mx-2"
                >
                  <img
                    className="w-100 rounded-top"
                    src={moment.momentImage[0]}
                    alt="Pawpus"
                    role="button"
                    onClick={() =>
                      history.push(`/social/detail/${moment.momentId}`)
                    }
                  />
                  <Row
                    className="w-100 pt-1 pl-2 mb-2"
                    role="button"
                    onClick={() =>
                      history.push(`/social/detail/${moment.momentId}`)
                    }
                  >
                    <span className="color-card-detail text-12 text-normal">
                      {moment.momentTitle}
                    </span>
                  </Row>
                  <Row className="w-100 mb-3">
                    <Col span={6} className="px-2">
                      <img
                        className="user-social-list-avatar"
                        // className='rounded-circle shadow-sm avatar-frame w-100'
                        src={!moment.userImage ? noAvatar : moment.userImage}
                        alt={moment.userName}
                        role="button"
                        onClick={() =>
                          history.push(`/social/detail/${moment.momentId}`)
                        }
                      />
                    </Col>
                    <Col
                      span={8}
                      className="d-flex align-items-center"
                      role="button"
                      onClick={() =>
                        history.push(`/social/detail/${moment.momentId}`)
                      }
                    >
                      <span className="text-bold text-12 color-grey-8">
                        {moment.userName}
                      </span>
                    </Col>
                    <Col
                      span={8}
                      className="d-flex justify-content-end align-items-end"
                      role="button"
                      onClick={() => handleLikeMomentClick(moment.momentId)}
                    >
                      {liked.includes(moment.momentId) || moment.isLiked ? (
                        <Tooltip title="取消点赞">
                          <span className="color-red">
                            {moment.momentLikeNumber + 1}
                          </span>
                          <i className="fas fa-heart ml-2 text-18 color-red"></i>
                        </Tooltip>
                      ) : (
                        <Tooltip title="点赞">
                          <span className="color-card-detail">
                            {moment.momentLikeNumber}
                          </span>
                          <i className="fas fa-heart ml-2 text-18 color-card-detail"></i>
                        </Tooltip>
                      )}
                    </Col>
                  </Row>
                </Card>
              );
            })}
          </Masonry>
        </Col>

        <div className="w-100 text-center">
          <Button
            className="text-normal text-16 color-button-title loadmore-button"
            onClick={() => handleLoadMore()}
            icon={momentData.loadingMore ? <LoadingOutlined /> : null}
            loading={momentData.loadingMore}
            disabled={momentData.end}
          >
            {momentData.end ? i18n.t("No More") : i18n.t("Load More")}
          </Button>
        </div>
        {/* <div
          className="publish-post-button"
          onClick={() => history.push("/social/publish")}
        >
          <i className="fas fa-camera"></i>
        </div> */}
      </Row>
    );
  }
};

export default SocialList;
