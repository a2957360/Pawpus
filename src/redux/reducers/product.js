import {
  GET_PRODUCT_CATEGORY_SUCCESS,
  GET_PRODUCT_SUB_CATEGORY_SUCCESS,
  GET_PRODUCT_LIST_SUCCESS,
  GET_PRODUCT_DETAIL_SUCCESS,
  GET_ITEM_PET_CATEGORY,
  GET_ITEM_PET_SUBCATEGORY,
  GET_SIMILAR_PRODUCT_LIST,
  GET_ITEM_REVIEW,
  GET_CART_SUCCESS,
  GET_ITEM_ORDER,
  GET_SAVED_ITEM,
  GET_PRODUCT_DETAIL_START,
} from "../constants/ActionTypes";

const INIT_STATE = {};

const Product = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PRODUCT_CATEGORY_SUCCESS: {
      return {
        ...state,
        productCategoryList: action.payload.data,
      };
    }

    case GET_PRODUCT_SUB_CATEGORY_SUCCESS: {
      return {
        ...state,
      };
    }

    case GET_ITEM_PET_CATEGORY: {
      return {
        ...state,
        itemPetCategoryList: action.payload.data,
      };
    }

    case GET_PRODUCT_LIST_SUCCESS: {
      return {
        ...state,
        productList: action.payload.data,
      };
    }

    case GET_ITEM_PET_SUBCATEGORY: {
      return {
        ...state,
        itemPetSubCategoryList: action.payload.data,
      };
    }

    case GET_PRODUCT_DETAIL_SUCCESS: {
      return {
        ...state,
        productDetail: action.payload.data,
      };
    }

    case GET_SIMILAR_PRODUCT_LIST: {
      return {
        ...state,
        similarProductList: action.payload.data,
      };
    }

    case GET_ITEM_REVIEW: {
      return {
        ...state,
        itemReviewList: action.payload.data,
      };
    }

    case GET_CART_SUCCESS: {
      return {
        ...state,
        cartList: action.payload.data,
      };
    }

    case GET_ITEM_ORDER: {
      return {
        ...state,
        itemOrderList: action.payload.data,
      };
    }

    case GET_SAVED_ITEM: {
      return {
        ...state,
        savedItemList: action.payload.data,
      };
    }

    case GET_PRODUCT_DETAIL_START: {
      return {
        ...state,
        productDetail: null,
      };
    }

    default:
      return state;
  }
};

export default Product;
