import React, { useState, useEffect } from "react";
//packages
import i18n from "i18n-js";
import axios from "axios";
import { useDispatch } from "react-redux";
//components
import { Row, Col, Input, Button, Modal, message } from "antd";
import noAvatar from "../../assets/img/Success-Dogy.png";
import { API_BASE_URL } from "../../configs/AppConfig";
import { getSingleMoment } from "../../redux/actions";

const MomentComment = (props) => {
  const { replyDetail, authorId } = props;
  const loginUserId = localStorage.getItem("userId");
  const dispatch = useDispatch();

  const [toggleReply, setToggleReply] = useState({
    show: false,
    content: "",
    loading: false,
  });
  const [reportModal, setReportModal] = useState({
    targetId: null,
    visible: false,
    reason: "",
    reportLoading: false,
  });
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    userId: null,
    replyId: null,
    momentId: null,
  });
  const [replyList, setReplyList] = useState({
    data: [],
    offset: 0,
    loading: false,
    moreData: true,
  });

  useEffect(() => {
    loadReplyList();
  }, [replyDetail]);

  const loadReplyList = async () => {
    const { data } = await axios.get(
      `${API_BASE_URL}moment/getReply.php?replyToReplyId=${replyDetail.replyId}`
    );

    setReplyList({
      ...replyList,
      data: data.data,
      offset: !data.data ? 0 : data.data.length,
    });
  };

  const handleReplyCommentSubmit = async () => {
    setToggleReply({ ...toggleReply, loading: true });
    const toSubmit = {
      momentId: replyDetail.momentId,
      replyToReplyId: replyDetail.replyId,
      userId: window.localStorage.getItem("userId"),
      replyContent: toggleReply.content,
      replyType: 1,
    };
    const { data } = await axios.post(
      `${API_BASE_URL}moment/addReply.php`,
      toSubmit
    );
    if (data.message === "success") {
      message.success(i18n.t("Reply success"));
      setToggleReply({ ...toggleReply, content: "", loading: false });
    } else {
      message.error(i18n.t("Reply fail"));
      setToggleReply({ ...toggleReply, loading: false });
    }
    loadReplyList();
  };

  const handleOpenReportModal = (targetId) => {
    setReportModal({ ...reportModal, targetId, visible: true });
  };

  const handleReport = async () => {
    if (reportModal.reason.length < 10) {
      message.warn(i18n.t("Please provide a reason"));
      return;
    }
    setReportModal({ ...reportModal, reportLoading: true });
    const { data } = await axios.post(`${API_BASE_URL}moment/addReport.php`, {
      targetId: reportModal.targetId,
      userId: window.localStorage.getItem("userId"),
      reportContent: reportModal.reason,
      targetType: 1,
    });
    if (data.message === "success") {
      message.success(i18n.t("Report success"));
      setReportModal({
        targetId: null,
        visible: false,
        reason: "",
        reportLoading: false,
      });
    } else {
      message.error("Somthing went wrong, please try again later");
      setReportModal({ ...reportModal, reportLoading: false });
    }
  };

  const handleLoadMoreReply = async () => {
    setReplyList({ ...replyList, loading: true });
    const { data } = await axios.get(
      `${API_BASE_URL}moment/getReply.php?replyToReplyId=${replyDetail.replyId}&offset=${replyList.offset}`
    );

    if (!data.data) {
      setReplyList({ ...replyList, loading: false, moreData: false });
    } else {
      setReplyList({
        ...replyList,
        data: [...replyList.data, ...data.data],
        loading: false,
        offset: data.offset,
      });
    }
  };

  const handleCommentDelete = async () => {
    console.log("deleting comment", deleteModal);
    if (!loginUserId) {
      message.error(i18n.t("Please login"));
      return;
    }
    const { data } = await axios.post(
      `${API_BASE_URL}moment/deleteReply.php`,
      deleteModal
    );
    if (data.message === "success") {
      message.success(i18n.t("Comment deleted"));
      dispatch(getSingleMoment(replyDetail.momentId, loginUserId));
      setDeleteModal(false);
    }
  };

  return (
    <div className="comment-wrapper mb-5 mt-3">
      <Row className="w-100">
        <div className="author-avatar mr-3">
          <img
            src={!replyDetail.userImage ? noAvatar : replyDetail.userImage}
            alt="Pawpus"
          />
        </div>
        <div className="w-60 d-flex flex-column justify-content-around">
          <p className="mb-1 text-bold text-18 color-grey-typeAnimal">
            {!replyDetail.userName ? i18n.t("Anonymous") : replyDetail.userName}
          </p>
          <p className="mb-0 text-normal text-14 color-grey-typeAnimal">
            {i18n.t("Posted at")} {replyDetail.createTime}
          </p>
        </div>
        <div className="d-flex justify-content-end flex-grow-1">
          {replyDetail.userId === loginUserId ? (
            <span
              role="button"
              className="text-normal text-18 color-red scale-up mr-2"
              onClick={() =>
                setDeleteModal({
                  show: true,
                  userId: loginUserId,
                  replyId: replyDetail.replyId,
                  momentId: replyDetail.momentId,
                })
              }
            >
              <u>{i18n.t("Delete")}</u>
            </span>
          ) : (
            <span
              role="button"
              className="text-normal text-18 color-grey-servicePrice scale-up mr-2"
              onClick={() => handleOpenReportModal(replyDetail.replyId)}
            >
              <u>{i18n.t("Report")}</u>
            </span>
          )}
          <span
            role="button"
            className="text-bold text-18 color-grey-typeAnimal scale-up"
            onClick={() =>
              setToggleReply({ ...toggleReply, show: !toggleReply.show })
            }
          >
            {i18n.t("Reply")}
          </span>
        </div>
      </Row>
      <Row>
        <p className="text-normal text-14 pt-3 pl-3 color-grey-typeAnimal">
          {replyDetail.replyContent}
        </p>
      </Row>
      <Row className="ml-3 reply-list-container">
        {!replyList.data ? (
          <div className="w-100 text-center">{i18n.t("First Reply")}</div>
        ) : (
          replyList.data.map((reply, index) => (
            <div key={reply.replyId} className="single-reply-container w-100">
              <span className="text-normal text-14 color-grey-typeAnimal">
                {!reply.userName ? i18n.t("Anonymous") : reply.userName}
                {authorId === reply.userId ? `(${i18n.t("Author")})` : null}：
              </span>
              <span className="text-normal text-14 color-grey-typeAnimal w-100">
                {reply.replyContent}
              </span>
              {reply.userId === loginUserId ? (
                <span
                  role="button"
                  className="text-normal text-14 color-grey-servicePrice float-right scale-up"
                  onClick={() =>
                    setDeleteModal({
                      show: true,
                      userId: loginUserId,
                      replyId: reply.replyId,
                      momentId: replyDetail.momentId,
                    })
                  }
                >
                  <u>{i18n.t("Delete")}</u>
                </span>
              ) : (
                <span
                  role="button"
                  className="text-normal text-14 color-grey-servicePrice float-right scale-up"
                  onClick={() => handleOpenReportModal(reply.replyId)}
                >
                  <u>{i18n.t("Report")}</u>
                </span>
              )}
            </div>
          ))
        )}
        {replyList.data && (
          <div className="w-100 text-center border-top border-3">
            <Button
              type="text"
              onClick={handleLoadMoreReply}
              className="text-16"
              loading={replyList.loading}
              disabled={!replyList.moreData}
            >
              {replyList.moreData
                ? i18n.t("View More Replies")
                : i18n.t("No more replies")}
            </Button>
          </div>
        )}
        {toggleReply.show ? (
          <Row className="pt-4 w-100">
            <Col span={24}>
              {/* <p className="text-18 text-bold color-grey-typeAnimal">
                {i18n.t("Reply")}
              </p> */}
              <Input.TextArea
                className="text-input text-input--grey text-20"
                rows={2}
                maxLength={50}
                // placeholder={i18n.t("Reply")}
                value={toggleReply.content}
                disabled={toggleReply.loading}
                onChange={(event) =>
                  setToggleReply({
                    ...toggleReply,
                    content: event.target.value,
                  })
                }
              />
              <Row align="middle" justify="end" className="my-3">
                <Button
                  type="text"
                  className="text-normal text-16"
                  onClick={() =>
                    setToggleReply({ ...toggleReply, show: false })
                  }
                >
                  {i18n.t("Cancel")}
                </Button>
                <Button
                  className="text-normal text-16 submit-button"
                  loading={toggleReply.loading}
                  onClick={handleReplyCommentSubmit}
                >
                  {i18n.t("Reply")}
                </Button>
              </Row>
            </Col>
          </Row>
        ) : null}
      </Row>
      <Modal
        visible={reportModal.visible}
        onCancel={() =>
          setReportModal({ ...reportModal, visible: false, reason: "" })
        }
        // title={<img src={placeholder_pic} alt="success-placeholder" />}
        footer={null}
      >
        <div className="d-flex flex-column align-items-center">
          <img src={noAvatar} alt="success-placeholder" />
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
                setReportModal({ ...reportModal, visible: false, reason: "" })
              }
            >
              {i18n.t("Cancel")}
            </Button>
            <Button
              type="primary"
              className="primary-background text-normal-20 text-dark"
              onClick={handleReport}
              loading={reportModal.reportLoading}
            >
              {i18n.t("Report")}
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        visible={deleteModal.show}
        footer={null}
        closable={false}
        maskClosable={true}
        onCancel={() => setDeleteModal({ ...deleteModal, show: true })}
        width={500}
        bodyStyle={{
          borderRadius: "8px",
        }}
      >
        <div className="w-100">
          <div className="w-40 m-auto text-center">
            <img src={noAvatar} alt="Pawpus" className="w-100 m-auto" />
            <p className="text-20 color-grey-servicePrice mb-1">
              {i18n.t("Attention")}
            </p>
            <p className="text-14 color-grey-servicePrice mb-1">
              {i18n.t("Confirm deletion")}
            </p>
          </div>
          <Row
            justify="space-between"
            align="middle"
            className="w-80 m-auto py-3"
          >
            <Button
              type="text"
              className="text-normal text-20"
              onClick={() => setDeleteModal({ ...deleteModal, show: false })}
            >
              {i18n.t("Cancel")}
            </Button>
            <Button
              className="text-normal text-22 color-button-title loadmore-button w-30"
              onClick={() => handleCommentDelete()}
            >
              {i18n.t("Confirm")}
            </Button>
          </Row>
        </div>
      </Modal>
    </div>
  );
};

export default MomentComment;
