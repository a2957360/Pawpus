import {
    RESET_AUTH_MESSAGE_SUCCESS,
    REGISTER_USER_SUCCESS,
    LOGIN_USER_SUCCESS,
    RESEND_ACTIVATION_EMAIL_SUCCESS,
    VALIDATE_EMAIL_SUCCESS,
    CHANGE_PASSWORD_SUCCESS,
    SEND_RESET_PASSWORD_SUCCESS,
    SEND_CHANGE_EMAIL_SUCCESS,
    SEND_VERIFICATION_CODE_SUCCESS,
    CHECK_VERIFICATION_CODE_SUCCESS,
    STORE_USER_EMAIL_SUCCESS,
    AUTH_USER_SUCCESS,
    UNAUTH_USER_SUCCESS,
    RESET_USER_MESSAGE_SUCCESS
} from "../constants/ActionTypes";
import axios from "axios";
import { API_BASE_URL } from '../../configs/AppConfig';

//request example
// const registerUserDataExample = {
//    "userEmail":"x@gmail.com",
//    "userPassword":"123321",
//   "reUserPassword":"123321"
// }
export const registerUser = (data) => {
    return dispatch => {
        axios
            .post(API_BASE_URL + 'user/userSignup.php', data, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(res => {
                dispatch({ type: REGISTER_USER_SUCCESS, payload: res.data });
                dispatch({ type: STORE_USER_EMAIL_SUCCESS, payload: data })
            })
            .catch(error => {
                console.log(error)
            });
    };
};

//request example
// const loginUserDataExample = {
// "userEmail":"x@gmail.com",
// "userPassword":"123321"
// }
export const loginUser = (data) => {
    return dispatch => {
        axios
            .post(API_BASE_URL + 'user/userLogin.php', data, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(res => {
                if (res.data.message === 'success') {
                    localStorage.setItem('token', 'Bearer')
                    localStorage.setItem('userId', res.data.data.userId)
                    dispatch({ type: LOGIN_USER_SUCCESS, payload: res.data });
                    dispatch({ type: AUTH_USER_SUCCESS })
                } else {
                    dispatch({ type: STORE_USER_EMAIL_SUCCESS, payload: data.userEmail })
                    dispatch({ type: LOGIN_USER_SUCCESS, payload: res.data });
                }
            })
            .catch(error => {
                console.log(error)
            });
    };
};

//request example
// {
//   "userEmail":"w2957360@gmail.com"
// }
//已激活也会发
export const resendActivationEmail = (data) => {
    return dispatch => {
        axios
            .post(API_BASE_URL + 'user/resendActiveEmail.php', data, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(res => {
                dispatch({ type: RESEND_ACTIVATION_EMAIL_SUCCESS, payload: res.data });
            })
            .catch(error => {
                console.log(error)
            });
    };
};

//验证用户已经点击邮箱验证
export const validateEmail = (data) => {
    return dispatch => {
        axios
            .get(API_BASE_URL + `user/emailValidation.php?token=${data.token}&id=${data.id}`, data, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(res => {
                dispatch({ type: VALIDATE_EMAIL_SUCCESS, payload: res.data });
            })
            .catch(error => {
                console.log(error)
            });
    };
};

//request example
// {
//   "userId":"10",
//   "userPassword":"123321",
//   "reUserPassword":"123321"
// }
//message未细分
export const changePassword = (data) => {
    return dispatch => {
        axios
            .post(API_BASE_URL + 'user/changePassword.php', data, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(res => {
                dispatch({ type: CHANGE_PASSWORD_SUCCESS, payload: res.data });
            })
            .catch(error => {
                console.log(error)
            });
    };
};

//request data - useremail
export const sendResetPassword = (data) => {
    return dispatch => {
        axios
            .get(API_BASE_URL + `user/forgetPassword.php?userEmail=${data}`, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(res => {
                dispatch({ type: STORE_USER_EMAIL_SUCCESS, payload: data })
                dispatch({ type: SEND_RESET_PASSWORD_SUCCESS, payload: res.data });
            })
            .catch(error => {
                console.log(error)
            });
    };
};

//request example
// {
// "userId":"10",
// "newEmail":"a2957360@gmail.com"
// }
export const sendChangeEmail = (data) => {
    return dispatch => {
        axios
            .post(API_BASE_URL + 'user/changeEmailApplication.php', data, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(res => {
                dispatch({ type: SEND_CHANGE_EMAIL_SUCCESS, payload: res.data });
            })
            .catch(error => {
                console.log(error)
            });
    };
};

export const sendVerificationCode = (userPhone) => {
    return dispatch => {
        axios
            .get(API_BASE_URL + `user/getVerificationCode.php?userPhone=${userPhone}&language=En`, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(res => {
                dispatch({ type: SEND_VERIFICATION_CODE_SUCCESS, payload: res.data });
            })
            .catch(error => {
                console.log(error)
            });
    };
};

// {
//     "userId":"10",
//     "userPhone":"6479940788",
//     "verificationCode":"584343"
// }
export const checkVerificationCode = (data) => {
    return dispatch => {
        axios
            .post(API_BASE_URL + 'user/checkVerificationCode.php', data, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(res => {
                dispatch({ type: CHECK_VERIFICATION_CODE_SUCCESS, payload: res.data });
            })
            .catch(error => {
                console.log(error)
            });
    };
};

export const resetMessage = () => {
    return dispatch => {
        dispatch({ type: RESET_AUTH_MESSAGE_SUCCESS });
        dispatch({ type: RESET_USER_MESSAGE_SUCCESS });
    };
}

export const loginUserAuto = () => {
    return dispatch => {
        dispatch({ type: AUTH_USER_SUCCESS })
    }
}

export const logoutUser = () => {
    return dispatch => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        dispatch({ type: UNAUTH_USER_SUCCESS })
    }
}
