import {
    GET_HOME_DATA_SUCCESS,
} from "../constants/ActionTypes";
import axios from "axios";
import { API_BASE_URL } from '../../configs/AppConfig';

export const placeServiceOrder = (data) => {
    return dispatch => {
        axios
            .get(API_BASE_URL + 'page/getHomePage.php', data, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(res => {
                dispatch({ type: GET_HOME_DATA_SUCCESS, payload: res.data });
            })
            .catch(error => {
                //dispatch({ type: GET_HOME_DATA_FAIL })
            });
    };
};
