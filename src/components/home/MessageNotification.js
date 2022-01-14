import React, { useEffect, useState } from "react";
//packages
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import firebase from "firebase";
import "firebase/firestore";
import {
  useCollectionData,
  useCollection,
} from "react-firebase-hooks/firestore";
import i18n from "i18n-js";
import moment from "moment";
import axios from "axios";
//components
import { Dropdown, Menu, Row, Col, Avatar } from "antd";

//statics
import { firebaseConfig, API_BASE_URL } from "../../configs/AppConfig";

//redux
import { getNotification, readNotification } from "../../redux/actions";


if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

const MessageNotification = (props) => {
  const { history } = props;
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");

  const [messageDocs, loading] = useCollection(db.collection(`${userId}`));
  const [chatees, setChatees] = useState(null);
  const [newMsgList, setNewMsgList] = useState([]);

  const { notifications } = useSelector((state) => state.notificationData);

  useEffect(() => {
    setInterval(() => {
      dispatch(getNotification({
        userId: userId
      }))
    }, 15000);
  }, [dispatch, userId]);

  useEffect(() => {
    getNewMessages();
  }, [messageDocs]);

  const getNewMessages = async () => {
    if (!messageDocs) {
      return;
    }
    const collectionData = messageDocs.docs.map((doc) => ({
      chateeId: doc.id.split("_")[1],
      ...doc.data(),
    }));
    const newMsgs = collectionData.filter((msg) => msg.newMsg);
    const ids = collectionData.map((msg) => msg.chateeId);
    const { data } = await axios.post(`${API_BASE_URL}contact/getContact.php`, {
      ids,
    });
    setChatees(data.data);
    setNewMsgList(newMsgs);
  };

  // const checkMessage = async (chateeId) => {
  // await db.doc(`${userId}/${userId}_${chateeId}`).set(
  //   {
  //     newMsg: false,
  //   },
  //   {
  //     merge: true,
  //   }
  // );

  //   history.push({
  //     pathname: "/chat",
  //     state: { chateeId },
  //   });
  // };

  const notificationLength = notifications[0]?.length || 0 + notifications[1]?.length || 0 + notifications[2]?.length || 0;

  const menu = () => {
    return (
      <Menu>
        <Menu.Item
          onClick={() => history.push('/chat')}
        >
          <div className='d-flex'>
            <span >{i18n.t("Messages")}</span>
            {newMsgList.length === 0 ? null : <div className='red-dot my-auto ml-1' />}
          </div>
        </Menu.Item>

        <Menu.Item
          onClick={() => history.push('/notifications')}
        >
          <div className='d-flex'>
            <span >{i18n.t("Notifications")}</span>
            {notificationLength === 0 ? null : <div className='red-dot my-auto ml-1' />}
          </div>
        </Menu.Item>
      </Menu>
      // <Menu>
      //   {newMsgList.length === 0 ? (
      //     <Menu.Item disabled>{i18n.t("No New Messages")}</Menu.Item>
      //   ) : (
      //     <>
      //       {newMsgList.map((msg, index) => {
      //         return (
      //           <Menu.Item
      //             key={msg.chateeId}
      //             onClick={() => checkMessage(msg.chateeId)}
      //           >
      //             <Row align="middle">
      //               <Avatar src={msg.chateeImage} />
      //               <span className="ml-2">
      //                 {`${i18n.t("Message from")}${msg.chateeName}${i18n.t(
      //                   "New Message"
      //                 )}`}
      //               </span>
      //             </Row>
      //           </Menu.Item>
      //         );
      //       })}
      //     </>
      //   )}
      // </Menu>
    );
  };

  return (
    <div className="position-relative mr-1 text-18">
      {newMsgList.length + notificationLength > 0 && (
        <div className="notification-dot"></div>
      )}
      {chatees ? (
        <Dropdown
          overlay={menu}
          placement="topCenter"
          disabled={!userId}
          trigger={["click"]}
        >
          <i
            className="far fa-bell"
            role="button"
          />
        </Dropdown>
      ) : (
        <i className="far fa-bell"></i>
      )}
    </div>
  );
};

export default withRouter(MessageNotification);
