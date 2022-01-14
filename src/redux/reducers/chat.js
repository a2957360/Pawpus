import {
    GET_USER_CONTACT_LIST_SUCCESS
  } from "../constants/ActionTypes";
  
  const INIT_STATE = {
    userContactList: null,
    serviceDetail: null,
    chatMessage:""
  };
  
  const Chat = (state = INIT_STATE, action) => {
    switch (action.type) {
  
      case GET_USER_CONTACT_LIST_SUCCESS: {
        return {
          ...state,
          userContactList: action.payload.data,
          chatMessage: action.payload.message
        }
      }
  
      default:
        return state;
    }
  };
  
  export default Chat
  