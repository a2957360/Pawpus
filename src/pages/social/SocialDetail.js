import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
//packages
import i18n from "i18n-js";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
//components
import LoadingView from "../../components/loading/LoadingView";
// import Breadcrumb from '../../components/layout/Breadcrumb';
import MomentComment from "../../components/moments/MomentComment";
import AuthorDetail from "../../components/moments/AuthorDetail";
import {
  Tooltip,
  List,
  Button,
  Input,
  message,
  Modal,
  Row,
  Col,
  Drawer,
  Breadcrumb,
} from "antd";
import { Carousel } from "react-bootstrap";
import { MenuFoldOutlined } from "@ant-design/icons";
//statics
import { API_BASE_URL } from "../../configs/AppConfig";
import placeholder_pic from "../../assets/img/Success-Dogy.png";
import { getSingleMoment } from "../../redux/actions";

const SocailDetail = (props) => {
  // const { history } = props;
  const { id: moment_id } = useParams();
  const userId = localStorage.getItem("userId");
  const [rightDrawer, setRightDrawer] = useState(false);

  const { momentDetail: singleMomentData } = useSelector(
    (state) => state.momentData
  );
  const dispatch = useDispatch();

  const [momentDetail, setMomentDetail] = useState();
  const [moreComment, setMoreComment] = useState({
    offset: 0,
    loading: false,
    moreData: true,
  });
  const [reportModal, setReportModal] = useState({
    visible: false,
    reason: "",
    reportLoading: false,
  });
  const [shareModal, setShareModal] = useState({
    visible: false,
  });
  const [replyPost, setReplyPost] = useState({
    content: "",
    loading: false,
  });
  //static like
  const [statics, setStatics] = useState({
    liked: false,
    saved: false,
    likes: 0,
    saves: 0,
  });

  useEffect(() => {
    loadMomentDetail();
  }, [dispatch, singleMomentData, userId, moment_id]);

  useEffect(() => {
    dispatch(getSingleMoment(moment_id, userId));
  }, [moment_id]);

  const loadMomentDetail = async () => {
    if (!singleMomentData) {
      dispatch(getSingleMoment(moment_id, userId));
    } else {
      setMomentDetail(singleMomentData);
      setMoreComment({
        ...moreComment,
        offset: singleMomentData.replyList.length,
      });
      setStatics({
        liked: singleMomentData.isLiked,
        saved: singleMomentData.isSaved,
        likes: singleMomentData.momentLikeNumber,
        saves: singleMomentData.momentSaveNumber || 0,
      });
    }
  };

  const toggleMomentLike = async () => {
    if (!userId) {
      message.error(i18n.t("Please login"));
      return;
    }
    const { data } = await axios.post(`${API_BASE_URL}moment/likeAction.php`, {
      userId,
      momentId: momentDetail.momentId,
    });
    if (data.message === "success") {
      if (statics.liked) {
        dispatch(getSingleMoment(moment_id, userId));
        message.success(i18n.t("Unlike Succeeded"));
        loadMomentDetail();
      } else {
        dispatch(getSingleMoment(moment_id, userId));
        message.success(i18n.t("Like Succeeded"));
        loadMomentDetail();
      }
    } else {
      if (statics.liked) {
        message.error(i18n.t("Unlike Failed"));
      } else {
        message.error(i18n.t("Like Failed"));
      }
    }
  };

  const toggleMomentSave = async () => {
    if (!userId) {
      message.error(i18n.t("Please login"));
      return;
    }

    if (statics.saved) {
      //取消收藏
      const { data } = await axios.post(
        `${API_BASE_URL}saved/deleteSaved.php`,
        { userId, targetId: momentDetail.momentId, targetType: 2 }
      );
      if (data.message === "success") {
        dispatch(getSingleMoment(moment_id, userId));
        loadMomentDetail();
        message.success(i18n.t("Unsave Succeeded"));
      } else {
        message.error(i18n.t("Unsave Failed"));
      }
    } else {
      //收藏
      const { data } = await axios.post(
        `${API_BASE_URL}moment/saveMoment.php`,
        { userId, targetId: momentDetail.momentId }
      );
      if (data.message === "success") {
        dispatch(getSingleMoment(moment_id, userId));
        loadMomentDetail();
        message.success(i18n.t("Save to favourite succeeded"));
      } else {
        message.error(i18n.t("Save to favourite failed"));
      }
    }
  };

  const handleReport = async () => {
    if (reportModal.reason.length < 10) {
      message.warn(i18n.t("Please provide a reason"));
      return;
    }
    setReportModal({ ...reportModal, reportLoading: true });
    const { data } = await axios.post(`${API_BASE_URL}moment/addReport.php`, {
      targetId: reportModal.target,
      userId,
      reportContent: reportModal.reason,
      targetType: reportModal.reportType,
    });
    if (data.message === "success") {
      message.success(i18n.t("Report success"));
      setReportModal({
        visible: false,
        reason: "",
        reportLoading: false,
      });
    } else {
      message.error("Somthing went wrong, please try again later");
      setReportModal({ ...reportModal, reportLoading: false });
    }
  };

  const handleReplySubmit = async () => {
    if (replyPost.content.trim().length === 0) {
      message.warn(i18n.t("Empty reply"));
      return;
    }
    if (!userId) {
      message.error(i18n.t("Please login"));
      return;
    }
    setReplyPost({
      ...replyPost,
      loading: true,
    });
    const toSubmit = {
      momentId: moment_id,
      userId,
      replyContent: replyPost.content,
      replyType: 0,
    };
    const { data } = await axios.post(
      `${API_BASE_URL}moment/addReply.php`,
      toSubmit
    );
    if (data.message === "success") {
      message.success(i18n.t("Comment success"));
      setReplyPost({
        content: "",
        loading: false,
      });
      dispatch(getSingleMoment(moment_id, userId));
      loadMomentDetail();
    } else {
      message.error(i18n.t("Comment fail"));
      setReplyPost({
        ...replyPost,
        loading: false,
      });
    }
  };

  const handleLoadMoreComment = async () => {
    setMoreComment({ ...moreComment, loading: true });
    //20条评论分页
    const { data } = await axios.get(
      `${API_BASE_URL}moment/getReply.php?momentId=${moment_id}&offset=${moreComment.offset}`
    );

    if (!data.data) {
      setMoreComment({ ...moreComment, loading: false, moreData: false });
    } else {
      setMoreComment({ ...moreComment, loading: false, offset: data.offset });
      setMomentDetail({
        ...momentDetail,
        replyList: [...momentDetail.replyList, ...data.data],
      });
    }
  };

  if (!momentDetail) {
    return (
      <div className="d-flex flex-column align-items-center moment-detail-container">
        <LoadingView />
      </div>
    );
  } else {
    const breadcrumbList = [
      { url: "/social/list", title: i18n.t("Moment List") },
      {
        url: `/user/userInfo/${momentDetail.userId}`,
        title: momentDetail.userName,
      },
      { url: "", title: momentDetail.momentTitle },
    ];

    return (
      <div className="d-flex flex-column align-items-center w-100 moment-detail-container">
        {/* Breadcrumb */}

        <div className="responsive-container">
          <Row
            align="middle"
            justify="space-between"
            className="white-background border-radius-6 mt-3 mb-3 px-4 py-2"
          >
            <div>
              <Breadcrumb className="w-100 bg-white border-radius-6 social-detail-breadcrumb">
                {breadcrumbList.map((breadcrumb, index) =>
                  breadcrumb.url !== "" ? (
                    <Breadcrumb.Item key={index} href={breadcrumb.url}>
                      <span className="breadcrumb-title">
                        {breadcrumb.title}
                      </span>
                    </Breadcrumb.Item>
                  ) : (
                    <Breadcrumb.Item key={index}>
                      <span className="text-bold breadcrumb-title">
                        {breadcrumb.title}
                      </span>
                    </Breadcrumb.Item>
                  )
                )}
              </Breadcrumb>
            </div>

            <MenuFoldOutlined
              size="large"
              className="moment-sidemenu-icon"
              onClick={() => setRightDrawer(true)}
            />
          </Row>

          <Row justify="space-between" className="w-100 my-3">
            <div className="moment-detail-content-wrapper">
              <Carousel fade>
                {momentDetail.momentImage.map((img, index) => (
                  <Carousel.Item key={index} className="moment-image-container">
                    <img
                      className="d-block moment-image"
                      src={img}
                      alt={`${momentDetail.momentTitle}_image_${index}`}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>

              <Row align="middle" justify="space-between" className="pt-4">
                <span className="text-bold text-25 color-grey-typeAnimal">
                  {momentDetail.momentTitle}
                </span>
                <div>
                  <span
                    role="button"
                    className="px-3 text-20 grey-service-price"
                    onClick={() =>
                      setReportModal({
                        ...reportModal,
                        visible: true,
                        reportType: 0,
                        target: momentDetail.momentId,
                      })
                    }
                  >
                    <u>{i18n.t("Report")}</u>
                  </span>
                  <Tooltip title={i18n.t("Share")}>
                    <i
                      className="fas fa-share text-28 color-grey-light"
                      role="button"
                      onClick={() =>
                        setShareModal({ ...shareModal, visible: true })
                      }
                    ></i>
                  </Tooltip>
                </div>
              </Row>

              <Row className="pt-4">
                <p className="color-grey-typeAnimal text-20">
                  {momentDetail.momentContent}
                </p>
              </Row>

              <Row className="pt-2">
                <Button type="text" onClick={toggleMomentLike} className="pl-0">
                  <i
                    className={`fas fa-heart text-20 ${
                      statics.liked ? "color-red" : "color-card-detail"
                    }`}
                  >
                    <span className="pl-2">{statics.likes}</span>
                  </i>
                </Button>
                <Button type="text" onClick={toggleMomentSave}>
                  <i
                    className={`fas fa-star text-20 ${
                      statics.saved ? "color-total-price" : "color-card-detail"
                    }`}
                  >
                    <span className="pl-2">{statics.saves}</span>
                  </i>
                </Button>
              </Row>

              <Row className="pt-4">
                <p className="color-grey-typeAnimal">
                  {`${i18n.t("Published")} ${momentDetail.createTime}`}
                </p>
              </Row>

              <Row className="pt-4">
                <Col span={24}>
                  <p className="text-18 text-bold color-grey-typeAnimal">
                    {i18n.t("comments")}
                  </p>
                  <Input.TextArea
                    className="text-input text-input--grey text-20"
                    rows={4}
                    maxLength={100}
                    placeholder={i18n.t("Leave a comment")}
                    value={replyPost.content}
                    disabled={replyPost.loading}
                    onChange={(event) =>
                      setReplyPost({
                        ...replyPost,
                        content: event.target.value,
                      })
                    }
                  />
                  <Row align="middle" justify="end" className="my-3">
                    <Button
                      className="text-normal text-16 submit-button"
                      loading={replyPost.loading}
                      onClick={handleReplySubmit}
                    >
                      {i18n.t("Submit comment")}
                    </Button>
                  </Row>
                </Col>
              </Row>

              {/* 朋友圈评论 */}
              <div>
                {momentDetail.replyList.length === 0 ? (
                  <div className="w-50 m-auto">
                    <img src={placeholder_pic} alt="Pawpus" className="w-100" />
                    <p className="text-center text-16 color-grey-typeAnimal">
                      {i18n.t("First comment")}
                    </p>
                  </div>
                ) : (
                  <List
                    className="color-grey-typeAnimal"
                    dataSource={momentDetail.replyList}
                    renderItem={(item) => (
                      <MomentComment
                        replyDetail={item}
                        authorId={momentDetail.userId}
                        loadMomentDetail={loadMomentDetail}
                      />
                    )}
                    footer={
                      <div className="text-center w-100">
                        <Button
                          className="text-normal text-16 color-button-title submit-button"
                          loading={moreComment.loading}
                          onClick={handleLoadMoreComment}
                          disabled={!moreComment.moreData}
                        >
                          {moreComment.moreData
                            ? i18n.t("Load More")
                            : i18n.t("No More Comments")}
                        </Button>
                      </div>
                    }
                  />
                )}
              </div>
            </div>

            <div className="moment-author-detail-wrapper">
              <AuthorDetail momentDetail={momentDetail} />
            </div>
          </Row>

          {/* 举报弹窗 */}
          <Modal
            visible={reportModal.visible}
            onCancel={() =>
              setReportModal({ ...reportModal, visible: false, reason: "" })
            }
            // title={<img src={placeholder_pic} alt="success-placeholder" />}
            footer={null}
          >
            <div className="d-flex flex-column align-items-center">
              <img src={placeholder_pic} alt="success-placeholder" />
              <Input.TextArea
                className="text-input text-input--grey"
                rows={4}
                maxLength={100}
                placeholder={i18n.t("Leave a reason")}
                value={reportModal.reason}
                onChange={(event) =>
                  setReportModal({ ...reportModal, reason: event.target.value })
                }
              />
              <div className="w-80 d-flex justify-content-around m-3">
                <Button
                  type="text"
                  className="text-normal-20"
                  onClick={() =>
                    setReportModal({
                      ...reportModal,
                      visible: false,
                      reason: "",
                    })
                  }
                >
                  {i18n.t("Cancel")}
                </Button>
                <Button
                  type="primary"
                  className="primary-background text-normal-20 text-dark"
                  onClick={() => handleReport()}
                  loading={reportModal.reportLoading}
                >
                  {i18n.t("Report")}
                </Button>
              </div>
            </div>
          </Modal>
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
                {window.location.href}
              </span>
              <div className="w-80 d-flex justify-content-center m-3">
                <Button
                  type="primary"
                  className="primary-background text-normal-20 text-dark"
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
        <Drawer
          title={
            <Breadcrumb className="w-100 bg-white border-radius-6 social-detail-breadcrumb">
              {breadcrumbList.slice(1).map((breadcrumb, index) =>
                breadcrumb.url !== "" ? (
                  <Breadcrumb.Item key={index} href={breadcrumb.url}>
                    <span className="breadcrumb-title">{breadcrumb.title}</span>
                  </Breadcrumb.Item>
                ) : (
                  <Breadcrumb.Item key={index}>
                    <span className="text-bold breadcrumb-title">
                      {breadcrumb.title}
                    </span>
                  </Breadcrumb.Item>
                )
              )}
            </Breadcrumb>
          }
          placement="right"
          onClose={() => setRightDrawer(false)}
          visible={rightDrawer}
          width="80vw"
        >
          <AuthorDetail momentDetail={momentDetail} />
        </Drawer>
      </div>
    );
  }
};

export default SocailDetail;
