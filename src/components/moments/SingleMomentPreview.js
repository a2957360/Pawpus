import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import i18n from "i18n-js";
//components
import { Card, Row, message, Modal, Button, Tooltip } from "antd";
import { DeleteOutlined, StarFilled } from "@ant-design/icons";

//statics
import noAvatar from "../../assets/img/Success-Dogy.png";
import { API_BASE_URL } from "../../configs/AppConfig";

const SingleMomentPreview = (props) => {
  const { history, data } = props;

  const userId = localStorage.getItem("userId");

  const [likeState, setLikeState] = useState({
    liked: data.isLiked,
    likeNum: data.momentLikeNumber,
  });
  // const [deleteModal, setDeleteModal] = useState(false);
  // const [likeCnt, setLikeCnt] = useState(data.momentLikeNumber);

  const handleLikeMomentClick = async () => {
    //未登陆提示登陆
    if (!userId) {
      message.error(i18n.t("Please login"));
      return;
    }
    //   let temp = [];
    const result = await axios.post(`${API_BASE_URL}moment/likeAction.php`, {
      userId,
      momentId: data.momentId,
    });
    if (result.data.message === "success") {
      if (likeState.liked) {
        //取消点赞
        message.success(i18n.t("Unlike Succeeded"));
        setLikeState({
          liked: false,
          likeNum: likeState.likeNum - 1,
        });
      } else {
        //点赞
        message.success(i18n.t("Like Succeeded"));
        setLikeState({
          liked: true,
          likeNum: likeState.likeNum + 1,
        });
      }
    } else {
      if (likeState.liked) {
        //取消点赞失败
        message.error(i18n.t("Unlike Failed"));
      } else {
        //点赞失败
        message.error(i18n.t("Like Failed"));
      }
    }
  };

  return !likeState ? null : (
    <Card
      className="single-moment-container position-relative"
      cover={
        <img
          className="moment-preview-cover"
          src={data.momentImage[0]}
          alt="Pawpus"
          role="button"
          onClick={() => history.push(`/social/detail/${data.momentId}`)}
        />
      }
    >
      <div
        className="moment-preview-content-wrapper "
        // className="moment-preview-content-wrapper py-2 px-2"
      >
        <div
          className=" moment-preview-description p-2-lines"
          role="button"
          onClick={() => history.push(`/social/detail/${data.momentId}`)}
        >
          {data.momentTitle}
        </div>
        <Row
          align="bottom"
          justify="space-between"
          className="w-100 "
          // className="w-100 mb-3"
        >
          <div
            className="d-flex align-items-center w-60"
            role="button"
            // onClick={() => history.push(`/user/userInfo/${data.userId}`)}
            onClick={() => history.push(`/social/detail/${data.momentId}`)}
          >
            <div className="moment-author-avatar">
              <img
                src={!!data.userImage ? data.userImage : noAvatar}
                alt="Pawpus"
              />
            </div>

            <span className="moment-author text-truncate">{data.userName}</span>
          </div>
          <div
            className="d-flex align-items-center"
            role="button"
            onClick={() => handleLikeMomentClick()}
          >
            <span className="mr-1 text-10">{likeState.likeNum}</span>
            <i
              className={`fas fa-heart ${
                likeState.liked ? "color-red" : "color-grey-7"
              } `}
            ></i>
          </div>
        </Row>
      </div>
      {/*<div className='moment-extro-info-container'>
        <img
          className='moment-author-avatar'
          src={data.userImage}
          alt={data.userName}
        />
        <div className='moment-author'>{data.userName}</div>
        <div onClick={() => handleLikeMomentClick(item.id)}>
          {likes.includes(item.id) ? (
            <Tooltip title='取消点赞'>
              <i className='fas fa-heart moment-like'></i>
            </Tooltip>
          ) : (
            <Tooltip title='点赞'>
              <i className='far fa-heart moment-unlike'></i>
            </Tooltip>
          )}
        </div> 
        <div>
          <i className='fas fa-heart moment-like'>{data.likes}</i>
        </div>
      </div>*/}
    </Card>
  );
};

export default withRouter(SingleMomentPreview);
