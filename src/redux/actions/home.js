import {
  GET_HOME_DATA_SUCCESS,
  GET_HOME_DATA_FAILED,
} from "../constants/ActionTypes";
import axios from "axios";
import { API_BASE_URL } from "../../configs/AppConfig";

export const getHomeData = () => {
  return (dispatch) => {
    axios
      .get(API_BASE_URL + "page/getHomePage.php")
      .then((res) => {
        if (res.data.message === "success") {
          console.log("res.data", res.data);
          dispatch({ type: GET_HOME_DATA_SUCCESS, payload: res.data });
        } else {
          dispatch({
            type: GET_HOME_DATA_FAILED,
            payload: "Fetch data failed, please try again later",
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: GET_HOME_DATA_FAILED,
          payload: "Fetch data failed, please try again later",
        });
      });
  };
};
