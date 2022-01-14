import {
    SHOW_AUTH_MODAL_SUCCESS,
    HIDE_AUTH_MODAL_SUCCESS
} from "../constants/ActionTypes";

export const showAuthModal = () => {
    return dispatch => {
        dispatch({ type: SHOW_AUTH_MODAL_SUCCESS })
    }
}

export const hideAuthModal = () => {
    return dispatch => {
        dispatch({ type: HIDE_AUTH_MODAL_SUCCESS })
    }
}
