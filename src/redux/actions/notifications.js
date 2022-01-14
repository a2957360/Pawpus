import {
    GET_NOTIFICATION_SUCCESS,
    READ_NOTIFICATION_SUCCESS
} from "../constants/ActionTypes";
import axios from "axios";
import { API_BASE_URL } from '../../configs/AppConfig';

export const getNotification = (data) => {
    return dispatch => {
        axios
            .post(API_BASE_URL + 'info/getInfo.php', data, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(res => {
                dispatch({ type: GET_NOTIFICATION_SUCCESS, payload: res.data });
            })
            .catch(error => {

            });
    };
};

export const readNotification = (data) => {
    return dispatch => {
        axios
            .post(API_BASE_URL + 'info/readInfo.php', data, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(res => {
                dispatch({ type: READ_NOTIFICATION_SUCCESS, payload: res.data });
            })
            .catch(error => {

            });
    };
};
