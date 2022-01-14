import {
    SHOW_AUTH_MODAL_SUCCESS,
    HIDE_AUTH_MODAL_SUCCESS
} from "../constants/ActionTypes";

const INIT_STATE = {
    showAuthModal: false
};

const Setting = (state = INIT_STATE, action) => {
    switch (action.type) {
        case SHOW_AUTH_MODAL_SUCCESS: {
            return {
                ...state,
                showAuthModal: true
            };
        }

        case HIDE_AUTH_MODAL_SUCCESS: {
            return {
                ...state,
                showAuthModal: false
            };
        }

        default:
            return state;
    }
};

export default Setting
