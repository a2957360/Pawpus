import {
    GET_HOME_DATA_SUCCESS,
    GET_HOME_DATA_FAILED
} from "../constants/ActionTypes";

const INIT_STATE = {
    homePageMessage: '',
    homePageData: null,
};

const Home = (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_HOME_DATA_SUCCESS: {
            return {
                ...state,
                homePageMessage: action.payload.message,
                homePageData: action.payload.data,
            };
        }
        case GET_HOME_DATA_FAILED: {
            return {
                ...state,
                homePageMessage: action.payload
            }
        }

        default:
            return state;
    }
};

export default Home
