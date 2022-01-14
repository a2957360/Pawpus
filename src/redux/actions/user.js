import {
  GET_USER_INFO_SUCCESS,
  UPDATE_USER_INFO_SUCCESS,
  GET_USER_ADDRESS_SUCCESS,
  POST_USER_ADDRESS_SUCCESS,
  DEFAULT_USER_ADDRESS_SUCCESS,
  CHANGE_USER_ADDRESS_SUCCESS,
  DELETE_USER_ADDRESS_SUCCESS,
  SAVE_USER_ADDRESS_SUCCESS,
  GET_POST_SUCCESS,
  GET_POST_BY_TYPE,
  GET_USER_INFO_START,
  GET_USER_REVIEW_SUCCESS,
} from "../constants/ActionTypes";
import axios from "axios";
import { API_BASE_URL } from "../../configs/AppConfig";

export const getUserInfo = (data) => {
  return (dispatch) => {
    dispatch({ type: GET_USER_INFO_START });

    axios
      .get(API_BASE_URL + `user/getUserInfo.php?userId=${data}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        dispatch({ type: GET_USER_INFO_SUCCESS, payload: res.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

//request example
// {
// "userId":"10",
// "userName":"123321",
// "userImage":"啊实打实大多数"
// }
//message未细分
export const updateUserInfo = (data) => {
  return (dispatch) => {
    axios
      .post(API_BASE_URL + `user/changeUser.php`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        dispatch({ type: UPDATE_USER_INFO_SUCCESS, payload: res.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const getUserAddress = (data) => {
  return (dispatch) => {
    axios
      .get(API_BASE_URL + `address/getAddress.php?userId=${data}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        dispatch({ type: GET_USER_ADDRESS_SUCCESS, payload: res.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const postUserAddress = (data) => {
  return (dispatch) => {
    axios
      .post(API_BASE_URL + `address/addAddress.php`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        dispatch({ type: POST_USER_ADDRESS_SUCCESS, payload: res.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const changeUserAddress = (data) => {
  return (dispatch) => {
    axios
      .post(API_BASE_URL + `address/changeAddress.php`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        dispatch({ type: CHANGE_USER_ADDRESS_SUCCESS, payload: res.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const defaultUserAddress = (data) => {
  return (dispatch) => {
    axios
      .post(API_BASE_URL + `address/setDefault.php`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        dispatch({ type: DEFAULT_USER_ADDRESS_SUCCESS, payload: res.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const deleteUserAddress = (data) => {
  return (dispatch) => {
    axios
      .post(API_BASE_URL + `address/deleteAddress.php`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        dispatch({ type: DELETE_USER_ADDRESS_SUCCESS, payload: res.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const saveUserAddress = (data) => {
  return (dispatch) => {
    dispatch({ type: SAVE_USER_ADDRESS_SUCCESS, payload: data });
  };
};

export const getPost = () => {
  return (dispatch) => {
    axios
      .get(API_BASE_URL + `post/getPost.php`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        dispatch({ type: GET_POST_SUCCESS, payload: res.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const getPostByType = (data) => {
  return (dispatch) => {
    axios
      .get(API_BASE_URL + `post/getPost.php?postType=${data}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        dispatch({ type: GET_POST_BY_TYPE, payload: res.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const getUserReview = (data) => {
  // console.log("get user review input data", data);
  return (dispatch) => {
    axios
      .get(API_BASE_URL + `review/getUserReview.php?userId=${data}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        // console.log("get user review result", res.data);
        dispatch({ type: GET_USER_REVIEW_SUCCESS, payload: res.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};
