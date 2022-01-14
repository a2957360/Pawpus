import React, { useState, useEffect } from "react";
//packages
import { withRouter } from "react-router-dom";
import firebase from "firebase";
import "firebase/firestore";
import {
  useCollectionData,
  useCollection,
} from "react-firebase-hooks/firestore";
import i18n from "i18n-js";
import axios from "axios";
//components
import {
  Row,
  Col,
  Breadcrumb,
  Button,
  Input,
  Drawer,
  message,
  Modal,
} from "antd";
import { MenuFoldOutlined, UserOutlined } from "@ant-design/icons";
import Loading from "../../components/loading/LoadingView";
import ChateeServiceDetail from "./ChateeServiceDetail";
import ContactList from "./ContactList";
//statics
import { API_BASE_URL } from "../../configs/AppConfig";

const db = firebase.firestore();

const ChatRoom = (props) => {
  const { history, location } = props;
  const chaterId = localStorage.getItem("userId");

  const [chateeId, setChateeId] = useState(null);
  const [chateeInfo, setChateeInfo] = useState(null);
  const [newMsg, setNewMsg] = useState({ content: "" });
  const [blockedContact, setBlockedContact] = useState(null);
  const [leftDrawer, setLeftDrawer] = useState(false);
  const [rightDrawer, setRightDrawer] = useState(false);

  const [onSending, setOnSending] = useState(false);

  const chaterRoomRef = db.collection(`${chaterId}`); //当前用户聊天室列表
  const chaterMessageRef = db.collection(
    `${chaterId}/${chaterId}_${chateeId}/messages`
  ); //当前用户与对话对象聊天记录
  const chateeMessageRef = db.collection(
    `${chateeId}/${chateeId}_${chaterId}/messages`
  ); //当前用户与对话对象聊天记录
  const chateeDocRef = db.doc(`${chateeId}/${chateeId}_${chaterId}`);
  const chaterDocRef = db.doc(`${chaterId}/${chaterId}_${chateeId}`);

  const [messages] = useCollectionData(
    chaterMessageRef.orderBy("createdAt", "asc")
  );
  const [roomList, loading] = useCollection(chaterRoomRef);

  useEffect(() => {
    if (!chaterId) {
      message.warn(i18n.t("Please login"));
      history.replace("/");
    }
    getChateeId();
  }, [loading, location.state]);

  const getChateeId = async () => {
    if (loading) {
      return;
    }
    if (location.state) {
      setChateeId(location.state.chateeId);
    } else {
      const ids = roomList.docs.map((doc) => doc.id.split("_")[1]);
      setChateeId(ids[0]);
    }
    const { data } = await axios.get(
      `${API_BASE_URL}user/getUserInfo.php?userId=${chateeId}`
    );
    setChateeInfo({
      userName:
        data.message === "success" ? data.data.userName : "User not found",
    });
    const doc = await chaterDocRef.get();
    if (!doc.exists) {
      setBlockedContact(null);
    } else {
      setBlockedContact(doc.data().blocked);
    }
  };

  const switchChatee = async (chateeId) => {
    setChateeId(chateeId);

    const { data } = await axios.get(
      `${API_BASE_URL}user/getUserInfo.php?userId=${chateeId}`
    );

    await db.doc(`${chaterId}/${chaterId}_${chateeId}`).set(
      {
        newMsg: false,
      },
      {
        merge: true,
      }
    );

    setChateeInfo({
      userName:
        data.message === "success" ? data.data.userName : "User not found",
    });
  };

  const deleteChatee = async (chateeId) => {
    Modal.confirm({
      title: i18n.t("Delete Chat"),
      content: i18n.t("Are you sure to delete this chat?"),
      okText: i18n.t("Confirm"),
      cancelText: i18n.t("Cancel"),
      onCancel: () => {
        console.log("cancel");
        return;
      },
      onOk: () => {
        handleDelete(chateeId);
      },
    });
  };

  const handleDelete = async (chateeId) => {
    await db.doc(`${chaterId}/${chaterId}_${chateeId}`).delete();
  };

  const handleMessageSend = async () => {
    await setOnSending(true);
    //空消息警告
    if (newMsg.content.trim().length === 0) {
      message.warn(i18n.t("Empty Message"));
      return;
    }
    //检测是否被对方屏蔽
    const doc = await chateeDocRef.get();
    if (doc.data().blocked) {
      message.error(i18n.t("Been blocked"));
      return;
    }
    //获取自己的头像和用户名
    const { data } = await axios.get(
      `${API_BASE_URL}user/getUserInfo.php?userId=${chaterId}`
    );
    console.log(chaterId);
    //添加新消息至双方消息列表
    await chaterMessageRef.add({
      content: newMsg.content,
      createdAt: Date.now(),
      showTime: false,
      user: { userId: chaterId },
    });

    await chateeMessageRef.add({
      content: newMsg.content,
      createdAt: Date.now(),
      showTime: false,
      user: { userId: chaterId },
    });
    //更新新消息状态
    await chateeDocRef.set(
      {
        createdAt: Date.now(),
        lastMsg: newMsg.content,
        newMsg: true,
        chateeImage: data.data.userImage, //在对方的状态里添加自己的头像和用户名
        chateeName: data.data.userName,
      },
      {
        merge: true,
      }
    );

    await chaterDocRef.set(
      {
        createdAt: Date.now(),
        lastMsg: newMsg.content,
        newMsg: false,
      },
      {
        merge: true,
      }
    );

    //清空输入框数据
    setNewMsg({
      content: "",
    });

    setOnSending(false);
  };

  const toggleBlockContact = async () => {
    if (blockedContact) {
      await chaterDocRef.set(
        {
          blocked: false,
        },
        {
          merge: true,
        }
      );
      setBlockedContact(false);
      message.success(i18n.t("Unblock contact succeeded"));
    } else {
      await chaterDocRef.set(
        {
          blocked: true,
        },
        {
          merge: true,
        }
      );
      setBlockedContact(true);
      message.success(i18n.t("Block contact succeeded"));
    }
  };
  if (chateeId===null || !chateeInfo) {
    return (
      <div className="chatroom-wrapper page-background py-5">
        <Loading />
      </div>
    );
  } else{
    return (
      <div className="chatroom-wrapper page-background py-5">
        <div className="chatroom-container border border-raidus-6 shadow">
          <Row
            align="middle"
            justify="space-between"
            className="w-100 py-3 pl-4 pr-3 border-bottom border-3"
          >
            <Col
              xs={2}
              sm={2}
              md={0}
              lg={0}
              xl={0}
              className="chatroom-breadcrumb-mobile-menu-left"
            >
              <UserOutlined size="large" onClick={() => setLeftDrawer(true)} />
            </Col>

            <Col xs={19} sm={19} md={22} lg={22} xl={22}>
              <Row
                justify="space-between"
                align="middle"
                className="chatroom-breadcrumb-pc"
              >
                <Breadcrumb>
                  <Breadcrumb.Item className="text-14 text-normal text-truncate color-grey-typeAnimal">
                    {i18n.t("Inapp Messages")}
                  </Breadcrumb.Item>
                  <Breadcrumb.Item className="text-14 text-normal color-grey-typeAnimal">
                    {i18n.t("with")}
                    {chateeInfo.userName}
                    {i18n.t("Chatting")}
                  </Breadcrumb.Item>
                </Breadcrumb>

                {messages && messages.length > 0 && (
                  <Button type="text" onClick={toggleBlockContact}>
                    <i className="fas fa-ban"></i>
                    <span className="text-14 text-normal color-grey-typeAnimal ml-1">
                      {blockedContact !== null && blockedContact
                        ? i18n.t("Blocked")
                        : i18n.t("Block")}
                    </span>
                  </Button>
                )}
              </Row>
              <Row
                justify="space-between"
                align="middle"
                className="chatroom-breadcrumb-mobile"
              >
                <Breadcrumb className="d-inline">
                  <Breadcrumb.Item className="text-14 text-normal color-grey-typeAnimal">
                    {chateeInfo.userName}
                  </Breadcrumb.Item>
                </Breadcrumb>

                {messages && messages.length > 0 && (
                  <Button type="text" onClick={toggleBlockContact}>
                    <i className="fas fa-ban"></i>
                    <span className="text-14 text-normal color-grey-typeAnimal ml-1">
                      {blockedContact !== null && blockedContact
                        ? i18n.t("Blocked")
                        : i18n.t("Block")}
                    </span>
                  </Button>
                )}
              </Row>
            </Col>

            {/* <Col xs={3} sm={3} md={3} lg={2} xl={2}>
              {messages && messages.length > 0 && (
                <Button type="text" onClick={toggleBlockContact}>
                  <i className="fas fa-ban"></i>
                  <span className="text-14 text-normal color-grey-typeAnimal ml-1">
                    {blockedContact !== null && blockedContact
                      ? i18n.t("Blocked")
                      : i18n.t("Block")}
                  </span>
                </Button>
              )}
            </Col> */}

            <Col
              xs={2}
              sm={2}
              md={2}
              lg={0}
              xl={0}
              className="chatroom-breadcrumb-mobile-menu-right"
            >
              <MenuFoldOutlined
                size="large"
                onClick={() => setRightDrawer(true)}
              />
            </Col>
          </Row>

          <Row className="chatroom-content-container">
            <Col xs={0} sm={0} md={4} lg={4} xl={4}>
              <ContactList
                switchChatee={switchChatee}
                deleteChatee={deleteChatee}
                chateeId={chateeId}
                setLeftDrawer={setLeftDrawer}
              />
            </Col>
            <Col
              xs={24}
              sm={24}
              md={20}
              lg={14}
              xl={14}
              className="message-list-container border-left border-right border-3"
            >
              <Row
                justify={messages ? "start" : "center"}
                className="message-list flex-grow-1"
              >
                {messages ? (
                  <div className="w-100">
                    {messages.length === 0 ? (
                      <div className="w-100 mt-3 text-center">
                        <span className="text-normal text-16 py-2 px-4 color-grey-typeAnimal">
                          {i18n.t("First Message")}
                        </span>
                      </div>
                    ) : (
                      messages.map((msg, index) => {
                        return (
                          <div
                            key={index}
                            className={`w-100 mt-3 d-flex ${
                              msg.user.userId === chaterId
                                ? "justify-content-end"
                                : ""
                            }`}
                          >
                            <span
                              className={`text-normal text-16 chat-box py-2 px-4 ${
                                msg.user.userId === chaterId
                                  ? "chat-chater-message-box"
                                  : "chat-chatee-message-box"
                              }`}
                            >
                              {msg.content}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                ) : (
                  <Loading />
                )}
              </Row>
              <Row className="message-input">
                <Input.TextArea
                  rows={6}
                  bordered={false}
                  className="border-top border-2 w-100 text-input text-input--grey"
                  placeholder={i18n.t("Please enter your message")}
                  value={newMsg.content}
                  onPressEnter={handleMessageSend}
                  disabled={!chateeId}
                  onChange={(e) =>
                    setNewMsg({ ...newMsg, content: e.target.value })
                  }
                />
                <Button
                  type="text"
                  className="send-button"
                  onClick={handleMessageSend}
                  disabled={onSending}
                >
                  <i className="fas fa-paper-plane color-grey-typeAnimal"></i>
                </Button>
              </Row>
            </Col>
            <Col xs={0} sm={0} md={0} lg={6} xl={6} className="py-3 px-4">
              <ChateeServiceDetail chateeId={chateeId} />
            </Col>
          </Row>
        </div>
        <Drawer
          title={i18n.t("Contact List")}
          placement="left"
          onClose={() => setLeftDrawer(false)}
          visible={leftDrawer}
        >
          <ContactList
            switchChatee={switchChatee}
            setLeftDrawer={setLeftDrawer}
            deleteChatee={deleteChatee}
            chateeId={chateeId}
          />
        </Drawer>
        <Drawer
          title={i18n.t("Service Detail")}
          placement="right"
          onClose={() => setRightDrawer(false)}
          visible={rightDrawer}
        >
          <ChateeServiceDetail chateeId={chateeId} />
        </Drawer>
      </div>
    );
  }
};

export default withRouter(ChatRoom);
