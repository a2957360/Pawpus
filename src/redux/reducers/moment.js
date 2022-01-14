import {
  REQUEST_ALL_MOMENTS,
  REQUEST_ALL_MOMENTS_SUCCESS,
  REQUEST_ALL_MOMENTS_FAILD,
  REQUEST_MORE_MOMENTS,
  REQUEST_MORE_MOMENTS_SUCCESS,
  REQUEST_MORE_MOMENTS_FAILED,
  GET_MOMENT_DETAIL,
} from "../constants/ActionTypes";

const INIT_STATE = {
  loading: false,
  momentList: [],
  offset: 0,
  momentListMessage: "",
  momentDetail: null,
  loadMore: false,
  userMomentData: {
    data: [],
    message: "",
    offset: 0,
  },
  // userMomentOffset: 0,
};

const Moment = (state = INIT_STATE, action) => {
  switch (action.type) {
    case REQUEST_ALL_MOMENTS: {
      return {
        ...state,
        loading: true,
      };
    }

    case REQUEST_ALL_MOMENTS_SUCCESS: {
      return {
        ...state,
        loading: false,
        momentList: action.payload.data,
        momentListMessage: action.payload.message,
        offset: action.payload.offset,
      };
    }

    case REQUEST_ALL_MOMENTS_FAILD: {
      return {
        ...state,
        loading: false,
        momentListMessage: action.payload,
      };
    }

    case REQUEST_MORE_MOMENTS: {
      return {
        ...state,
        loadMore: true,
      };
    }

    case REQUEST_MORE_MOMENTS_SUCCESS: {
      return {
        ...state,
        loadMore: false,
        momentList: [...state.momentList, ...action.payload.data.data],
        momentListMessage: action.payload.message,
        offset: action.payload.data.offset,
      };
    }

    case REQUEST_MORE_MOMENTS_FAILED: {
      return {
        ...state,
        loadMore: false,
        momentListMessage: action.payload,
      };
    }

    case GET_MOMENT_DETAIL: {
      return {
        ...state,
        momentDetail: action.payload,
      };
    }

    default:
      return state;
  }
};

export default Moment;
