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
import axios from "axios";
import { API_BASE_URL } from "../../configs/AppConfig";

//商品分类
export const getProductCategory = () => {
  return (dispatch) => {
    axios
      .get(API_BASE_URL + "item/getItemCategory.php", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        dispatch({ type: GET_PRODUCT_CATEGORY_SUCCESS, payload: res.data });
      })
      .catch((error) => {});
  };
};

export const getProductSubCategory = (data) => {
  return (dispatch) => {
    axios
      .get(
        API_BASE_URL + `item/getItemSubCategory.php?parentCategoryId=${data}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        dispatch({ type: GET_PRODUCT_SUB_CATEGORY_SUCCESS, payload: res.data });
      })
      .catch((error) => {
        //dispatch({ type: GET_HOME_DATA_FAIL })
      });
  };
};

//商品宠物分类
export const getItemPetCategory = () => {
  return (dispatch) => {
    axios
      .get(API_BASE_URL + `item/getItemPetCategory.php`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        dispatch({ type: GET_ITEM_PET_CATEGORY, payload: res.data });
      })
      .catch((error) => {
        //dispatch({ type: GET_HOME_DATA_FAIL })
      });
  };
};

//商品规格分类
export const getItemPetSubCategory = () => {
  return (dispatch) => {
    axios
      .get(API_BASE_URL + `item/getItemPetSubCategory.php`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        dispatch({ type: GET_ITEM_PET_SUBCATEGORY, payload: res.data });
      })
      .catch((error) => {
        //dispatch({ type: GET_HOME_DATA_FAIL })
      });
  };
};

//get product list by conditions
//request example
// {
//     "itemCategory":"2",
//     "itemSubCategory":["23"],
//     "itemPetCategory":["23"],
//     "itemPetSubCategory":["23"]
// }
//无数据
export const getProductList = (data) => {
  console.log("get product list input", data);
  return (dispatch) => {
    axios
      .post(API_BASE_URL + `item/getItem.php`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log("get product list result", res.data);
        dispatch({ type: GET_PRODUCT_LIST_SUCCESS, payload: res.data });
      })
      .catch((error) => {});
  };
};

export const getProductDetail = (itemId, userId) => {
  return (dispatch) => {
    dispatch({ type: GET_PRODUCT_DETAIL_START });

    axios
      .get(
        API_BASE_URL +
          `item/getSingleItem.php?itemId=${itemId}&userId=${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        dispatch({ type: GET_PRODUCT_DETAIL_SUCCESS, payload: res.data });
      })
      .catch((error) => {});
  };
};

//获取商品相关推荐列表
export const getSimilarProductList = (data) => {
  return (dispatch) => {
    axios
      .get(API_BASE_URL + `item/getRelatedItem.php?${data}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        dispatch({ type: GET_SIMILAR_PRODUCT_LIST, payload: res.data });
      })
      .catch((error) => {});
  };
};

//获取商品的评论
export const getItemReview = (data) => {
  return (dispatch) => {
    // console.log("get item review input", data);
    axios
      .get(API_BASE_URL + `review/getItemReview.php?itemId=${data}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        // console.log("get item review result", res.data);
        dispatch({ type: GET_ITEM_REVIEW, payload: res.data });
      })
      .catch((error) => {});
  };
};

//获取购物车
export const getCart = (data) => {
  return (dispatch) => {
    // console.log("get cart input", data);
    axios
      .get(API_BASE_URL + `item/getCart.php?userId=${data}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        // console.log("get cart result ", res.data);
        dispatch({ type: GET_CART_SUCCESS, payload: res.data });
      })
      .catch((error) => {});
  };
};

//获取商品订单
export const getItemOrder = (data) => {
  return (dispatch) => {
    // console.log("get item order input", data);
    axios
      .get(API_BASE_URL + `item/getItemOrder.php?${data}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        // console.log("get item order result", res.data);
        dispatch({ type: GET_ITEM_ORDER, payload: res.data });
      })
      .catch((error) => {});
  };
};

//获取收藏夹
export const getSavedItem = (data) => {
  return (dispatch) => {
    // console.log("get saved item input", data);
    axios
      .get(API_BASE_URL + `item/getSavedItem.php?userId=${data}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log("get saved item result", res.data);
        dispatch({ type: GET_SAVED_ITEM, payload: res.data });
      })
      .catch((error) => {});
  };
};
