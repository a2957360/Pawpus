import {
  GET_SERVICE_CATEGORY_SUCCESS,
  GET_SERVICE_SUB_CATEGORY_SUCCESS,
  GET_ADDITIONAL_SERVICE_SUCCESS,
  GET_SERVICE_LIST_SUCCESS,
  GET_SERVICE_DETAIL_SUCCESS,
  GET_SERVICE_PRICE_SUCCESS,
  GET_SERVICE_LOCATION_LIST,
  GET_SERVICE_REVIEW_LIST,
  GET_SERVICE_REVIEW_LIST_START,
  GET_SERVICE_DATE_LIST,
  GET_PET_LIST,
  GET_SERVICE_FACILITY_SUCCESS,
  GET_DRAFT_SERVICE_LIST,
  GET_SERVICE_ORDER_LIST_START,
  GET_SERVICE_ORDER_LIST,
  GET_SAVED_SERVICE,
  GET_SERVICE_DATE_LIST_START,
} from "../constants/ActionTypes";

const INIT_STATE = {
  serviceCategory: null,
  serviceSubCategory: null,
  additionalService: null,
  serviceList: null,
  serviceDetail: null,
  servicePrice: null,
  serviceLocation: null,
  serviceReview: null,
  serviceDates: {},
  petList: null,
  serviceOrderList: null,
};

const Service = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_SERVICE_CATEGORY_SUCCESS: {
      return {
        ...state,
        serviceCategory: action.payload.data,
      };
    }

    case GET_SERVICE_SUB_CATEGORY_SUCCESS: {
      return {
        ...state,
        serviceSubCategory: action.payload.data,
      };
    }

    case GET_SERVICE_FACILITY_SUCCESS: {
      return {
        ...state,
        serviceFacilityList: action.payload.data,
      };
    }

    case GET_DRAFT_SERVICE_LIST: {
      return {
        ...state,
        draftServiceList: action.payload.data,
      };
    }

    case GET_ADDITIONAL_SERVICE_SUCCESS: {
      return {
        ...state,
        additionalService: action.payload.data,
      };
    }

    case GET_SERVICE_LIST_SUCCESS: {
      return {
        ...state,
        serviceList: action.payload.data,
      };
    }

    case GET_SERVICE_DETAIL_SUCCESS: {
      return {
        ...state,
        serviceDetail: action.payload.data,
        serviceDetailMessage: action.payload.message,
      };
    }

    case GET_SERVICE_PRICE_SUCCESS: {
      return {
        ...state,
        servicePrice: action.payload.data,
      };
    }

    case GET_SERVICE_LOCATION_LIST: {
      return {
        ...state,
        serviceLocation: action.payload,
      };
    }

    case GET_SERVICE_DATE_LIST: {
      return {
        ...state,
        serviceDates: action.payload,
      };
    }

    case GET_SERVICE_DATE_LIST_START: {
      return {
        ...state,
        serviceDates: null,
      };
    }

    case GET_SERVICE_REVIEW_LIST: {
      return {
        ...state,
        serviceReview: action.payload,
      };
    }
    case GET_SERVICE_REVIEW_LIST_START: {
      return {
        ...state,
        serviceReview: null,
      };
    }

    case GET_PET_LIST: {
      return {
        ...state,
        petList: action.payload,
      };
    }

    case GET_SERVICE_ORDER_LIST: {
      return {
        ...state,
        serviceOrderList: action.payload,
      };
    }

    case GET_SERVICE_ORDER_LIST_START: {
      return {
        ...state,
        serviceOrderList: null,
      };
    }

    case GET_SAVED_SERVICE: {
      return {
        ...state,
        savedServiceList: action.payload,
      };
    }

    default:
      return state;
  }
};

export default Service;
