import {
  RESET_AUTH_MESSAGE_SUCCESS,
  REGISTER_USER_SUCCESS,
  LOGIN_USER_SUCCESS,
  RESEND_ACTIVATION_EMAIL_SUCCESS,
  VALIDATE_EMAIL_SUCCESS,
  CHANGE_PASSWORD_SUCCESS,
  SEND_RESET_PASSWORD_SUCCESS,
  SEND_VERIFICATION_CODE_SUCCESS,
  CHECK_VERIFICATION_CODE_SUCCESS,
  SEND_CHANGE_EMAIL_SUCCESS,
  STORE_USER_EMAIL_SUCCESS,
  AUTH_USER_SUCCESS,
  UNAUTH_USER_SUCCESS
} from "../constants/ActionTypes";

const INIT_STATE = {
  errorCode: null,
  loginMessage: null,
  registerMessage: null,
  validateMessage: null,
  sendEmailMessage: null,
  sendCodeMessage: null,
  checkCodeMessage: null,
  changePasswordMessage: null
};

const Auth = (state = INIT_STATE, action) => {
  switch (action.type) {
    case RESET_AUTH_MESSAGE_SUCCESS: {
      return {
        ...state,
        errorCode: null,
        loginMessage: null,
        registerMessage: null,
        validateMessage: null,
        sendEmailMessage: null,
        sendCodeMessage: null,
        checkCodeMessage: null,
        changePasswordMessage: null
      }
    }

    case REGISTER_USER_SUCCESS: {
      return {
        ...state,
        errorCode: action.payload.errorCode,
        registerMessage: action.payload.message
      };
    }

    case LOGIN_USER_SUCCESS: {
      return {
        ...state,
        errorCode: action.payload.errorCode,
        loginMessage: action.payload.message
      }
    }

    case STORE_USER_EMAIL_SUCCESS: {
      return {
        ...state,
        userEmail: action.payload
      }
    }

    case RESEND_ACTIVATION_EMAIL_SUCCESS: {
      return {
        ...state,
        sendEmailMessage: action.payload.message
      }
    }

    case VALIDATE_EMAIL_SUCCESS: {
      return {
        ...state,
        validateMessage: action.payload.message
      }
    }

    case CHANGE_PASSWORD_SUCCESS: {
      return {
        ...state,
        changePasswordMessage: action.payload.message
      }
    }

    case SEND_RESET_PASSWORD_SUCCESS: {
      return {
        ...state,
        sendEmailMessage: action.payload.message
      }
    }

    case SEND_CHANGE_EMAIL_SUCCESS: {
      return {
        ...state,
        sendEmailMessage: action.payload.message
      }
    }

    case SEND_VERIFICATION_CODE_SUCCESS: {
      return {
        ...state,
        sendCodeMessage: action.payload.message
      }
    }

    case CHECK_VERIFICATION_CODE_SUCCESS: {
      return {
        ...state,
        checkCodeMessage: action.payload.message,
      }
    }

    case AUTH_USER_SUCCESS: {
      return {
        ...state,
        userAuth: true
      }
    }

    case UNAUTH_USER_SUCCESS: {
      return {
        ...state,
        userAuth: false
      }
    }
    default:
      return state;
  }
};

export default Auth
