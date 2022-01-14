import {
  VALIDATE_EMAIL_SUCCESS,
  GET_USER_INFO_SUCCESS,
  GET_USER_ADDRESS_SUCCESS,
  POST_USER_ADDRESS_SUCCESS,
  UPDATE_USER_INFO_SUCCESS,
  LOGIN_USER_SUCCESS,
  RESET_USER_MESSAGE_SUCCESS,
  DEFAULT_USER_ADDRESS_SUCCESS,
  DELETE_USER_ADDRESS_SUCCESS,
  SAVE_USER_ADDRESS_SUCCESS,
  CHANGE_USER_ADDRESS_SUCCESS,
  CHANGE_PASSWORD_SUCCESS,
  GET_POST_SUCCESS,
  GET_POST_BY_TYPE,
  GET_USER_INFO_START,
  GET_USER_REVIEW_SUCCESS,
} from "../constants/ActionTypes";

const INIT_STATE = {
  userInfo: {},
  userMomentData: null,
  errorCode: null,
  updateMessage: null,
  savedAddress: null,
  savedMessage: null,
};

const User = (state = INIT_STATE, action) => {
  switch (action.type) {
    case RESET_USER_MESSAGE_SUCCESS: {
      return {
        ...state,
        errorCode: null,
        updateMessage: null,
      };
    }

    case VALIDATE_EMAIL_SUCCESS: {
      return {
        ...state,
        userInfo: action.payload.data,
      };
    }

    case GET_USER_INFO_SUCCESS: {
      return {
        ...state,
        userInfo: action.payload.data,
      };
    }

    case POST_USER_ADDRESS_SUCCESS: {
      return {
        ...state,
        updateMessage: action.payload.message,
      };
    }

    case GET_USER_ADDRESS_SUCCESS: {
      return {
        ...state,
        userAddress: action.payload.data,
      };
    }

    case UPDATE_USER_INFO_SUCCESS: {
      return {
        ...state,
        updateMessage: action.payload.message,
      };
    }

    case LOGIN_USER_SUCCESS: {
      return {
        ...state,
        userInfo: action.payload.data,
      };
    }

    case DEFAULT_USER_ADDRESS_SUCCESS: {
      return {
        ...state,
        updateMessage: action.payload.message,
      };
    }

    case DELETE_USER_ADDRESS_SUCCESS: {
      return {
        ...state,
        updateMessage: action.payload.message,
      };
    }

    case CHANGE_USER_ADDRESS_SUCCESS: {
      return {
        ...state,
        updateMessage: action.payload.message,
      };
    }

    case CHANGE_PASSWORD_SUCCESS: {
      return {
        ...state,
        updateMessage: action.payload.message,
      };
    }

    case SAVE_USER_ADDRESS_SUCCESS: {
      return {
        ...state,
        savedAddress: action.payload,
      };
    }

    case GET_POST_SUCCESS: {
      return {
        ...state,
        postList: action.payload.data,
      };
    }

    case GET_POST_BY_TYPE: {
      return {
        ...state,
        postListByType: action.payload.data,
      };
    }

    case GET_USER_INFO_START: {
      return {
        ...state,
        userInfo: null,
      };
    }

    case GET_USER_REVIEW_SUCCESS: {
      return {
        ...state,
        userReviewList: action.payload.data,
      };
    }

    default:
      return state;
  }
};

export default User;
