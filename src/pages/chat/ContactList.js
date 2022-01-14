import React, { useState, useEffect } from "react";
//packages
import i18n from "i18n-js";
import axios from "axios";
import firebase from "firebase";
import "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

//components
import { List, Row, Avatar } from "antd";
import noAvatar from "../../assets/img/payment/dog-logo.png";
import Loading from "../../components/loading/LoadingView";
import { API_BASE_URL } from "../../configs/AppConfig";
import { DeleteOutlined } from "@ant-design/icons";

const db = firebase.firestore();

const ContactList = (props) => {
  const { switchChatee, setLeftDrawer,deleteChatee, chateeId } = props;
  const chaterId = localStorage.getItem("userId");
  const chaterRoomRef = db.collection(`${chaterId}`);

  const [roomList, loading] = useCollection(chaterRoomRef);
  const [contactList, setContactList] = useState(null);

  useEffect(() => {
    getContactListInfo();
  }, [roomList]);

  const getContactListInfo = async () => {
    if (!roomList) {
      return;
    }
    const userList = roomList.docs.map((doc) => doc.id.split("_")[1]);
    const { data } = await axios.post(`${API_BASE_URL}contact/getContact.php`, {
      userList,
    });
    if (data.message === "success") {
      setContactList(data.data);
    }
  };

  if (!roomList || loading || !contactList) {
    return (
      <div className="d-flex h-100 justify-content-center align-items-center">
        <Loading />
      </div>
    );
  } else {
    return (
      <List
        itemLayout="horizontal"
        dataSource={contactList}
        renderItem={(item) => (
          <List.Item
            role="button"
            className={
              item.userId === chateeId
                ? "px-3 border-bottom border-0 color-active-chat"
                : "px-3 border-bottom border-0"
            }
            onClick={(e) => {
              e.stopPropagation();
              switchChatee(item.userId);
              setLeftDrawer(false);
            }}
          >
            <Row
              align="middle"
              className="w-100 d-flex flex-row align-items-center justify-content-between"
            >
              <div className="w-80 d-flex flex-row align-items-center ">
                <Avatar
                  className="chat-contact-list-avatar"
                  size="default"
                  src={item.userImage ? item.userImage : noAvatar}
                />
                <span className="contact-list-name  ">{item.userName}</span>
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChatee(item.userId);
                  console.log("delete this chat");
                }}
                className="d-flex align-items-center"
              >
                <DeleteOutlined size="small" />
              </div>
            </Row>
          </List.Item>
        )}
      />
    );
  }
};

export default ContactList;
