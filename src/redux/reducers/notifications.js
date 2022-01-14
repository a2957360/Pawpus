import {
    GET_NOTIFICATION_SUCCESS,
    READ_NOTIFICATION_SUCCESS
} from "../constants/ActionTypes";

const INIT_STATE = {
    notifications: []
};

const Notifications = (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_NOTIFICATION_SUCCESS: {
            return {
                ...state,
                notifications: action.payload.data,
            };
        }

        case READ_NOTIFICATION_SUCCESS: {
            return {
                ...state,
                notificationMessage: action.payload.message
            }
        }

        default:
            return state;
    }
};

export default Notifications
