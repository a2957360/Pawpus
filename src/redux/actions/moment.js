import {
  REQUEST_ALL_MOMENTS,
  REQUEST_ALL_MOMENTS_SUCCESS,
  REQUEST_ALL_MOMENTS_FAILD,
  REQUEST_MORE_MOMENTS,
  REQUEST_MORE_MOMENTS_SUCCESS,
  REQUEST_MORE_MOMENTS_FAILED,
  GET_MOMENT_DETAIL,
} from "../constants/ActionTypes";
import axios from "axios";
import { API_BASE_URL } from "../../configs/AppConfig";
// import { message } from "antd";
// import i18n from "i18n-js";

export const getMomentData = (loginUserId) => {
  return (dispatch) => {
    dispatch({ type: REQUEST_ALL_MOMENTS });
    axios
      .get(`${API_BASE_URL}moment/getMoment.php?loginUserId=${loginUserId}`)
      .then((res) => {
        dispatch({ type: REQUEST_ALL_MOMENTS_SUCCESS, payload: res.data });
      })
      .catch((error) => {
        dispatch({ type: REQUEST_ALL_MOMENTS_FAILD, payload: error });
      });
  };
};

export const loadMoreMomentData = (offset, loginUserId) => {
  return (dispatch) => {
    dispatch({ type: REQUEST_MORE_MOMENTS });
    axios
      .get(
        `${API_BASE_URL}moment/getMoment.php?offset=${offset}&loginUserId=${loginUserId}`
      )
      .then((res) => {
        if (res.data.data.length !== 0) {
          dispatch({ type: REQUEST_MORE_MOMENTS_SUCCESS, payload: res.data });
        } else {
          dispatch({
            type: REQUEST_MORE_MOMENTS_SUCCESS,
            payload: { data: res.data, message: "end" },
          });
        }
      })
      .catch((error) => {
        dispatch({ type: REQUEST_MORE_MOMENTS_FAILED, payload: error });
      });
  };
};

export const getMomentDataByUserId = (userId) => {
  return (dispatch) => {
    dispatch({ type: REQUEST_ALL_MOMENTS });
    axios
      .get(`${API_BASE_URL}moment/getMoment.php?userId=${userId}`)
      .then((res) => {
        dispatch({ type: REQUEST_ALL_MOMENTS_SUCCESS, payload: res.data });
      })
      .catch((error) => {
        dispatch({ type: REQUEST_ALL_MOMENTS_FAILD, payload: error });
      });
  };
};

export const getMomentDataByLoginUserId = (loginUserId) => {
  return (dispatch) => {
    dispatch({ type: REQUEST_ALL_MOMENTS });
    axios
      .get(`${API_BASE_URL}moment/getMoment.php?loginUserId=${loginUserId}`)
      .then((res) => {
        dispatch({ type: REQUEST_ALL_MOMENTS_SUCCESS, payload: res.data });
      })
      .catch((error) => {
        dispatch({ type: REQUEST_ALL_MOMENTS_FAILD, payload: error });
      });
  };
};

export const getSingleMoment = (momentId, loginUserId) => {
  return (dispatch) => {
    axios
      .get(
        `${API_BASE_URL}moment/getSingleMoment.php?momentId=${momentId}&loginUserId=${loginUserId}`
      )
      .then((res) => {
        dispatch({ type: GET_MOMENT_DETAIL, payload: res.data.data });
      })
      .catch((e) => console.log(e.message));
  };
};
