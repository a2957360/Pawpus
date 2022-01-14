import {
  GET_SERVICE_CATEGORY_SUCCESS,
  GET_SERVICE_SUB_CATEGORY_SUCCESS,
  GET_ADDITIONAL_SERVICE_SUCCESS,
  GET_SERVICE_LIST_SUCCESS,
  GET_SERVICE_DETAIL_SUCCESS,
  ADD_SERVICE_DETAIL_SUCCESS,
  GET_SERVICE_PRICE_SUCCESS,
  GET_SERVICE_LOCATION_LIST,
  GET_SERVICE_REVIEW_LIST,
  GET_SERVICE_REVIEW_LIST_START,
  GET_SERVICE_DATE_LIST,
  GET_SERVICE_DATE_LIST_START,
  GET_PET_LIST,
  GET_SERVICE_FACILITY_SUCCESS,
  GET_DRAFT_SERVICE_LIST,
  GET_SERVICE_ORDER_LIST_START,
  GET_SERVICE_ORDER_LIST,
  GET_SAVED_SERVICE,
  // ADD_PET_SUCCESS,
} from "../constants/ActionTypes";
import axios from "axios";
import { API_BASE_URL } from "../../configs/AppConfig";

export const getServiceCategory = () => {
  return (dispatch) => {
    axios
      .get(API_BASE_URL + "service/getServiceCategory.php", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        // console.log("get service category result", res.data);
        dispatch({ type: GET_SERVICE_CATEGORY_SUCCESS, payload: res.data });
      })
      .catch((error) => {});
  };
};

export const getServiceSubCategory = (data) => {
  // console.log("getServiceSubCategory input", data);
  return (dispatch) => {
    axios
      .get(
        API_BASE_URL +
          `service/getServiceSubCategory.php?parentCategoryId=${data}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        // console.log("get servicesub category result", res.data);
        dispatch({ type: GET_SERVICE_SUB_CATEGORY_SUCCESS, payload: res.data });
      })
      .catch((error) => {
        //dispatch({ type: GET_HOME_DATA_FAIL })
      });
  };
};

export const getAdditionalService = () => {
  return (dispatch) => {
    axios
      .get(API_BASE_URL + `service/getServiceExtra.php`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        // console.log("this is get service extra result", res.data);
        dispatch({ type: GET_ADDITIONAL_SERVICE_SUCCESS, payload: res.data });
      })
      .catch((error) => {
        //dispatch({ type: GET_HOME_DATA_FAIL })
      });
  };
};

export const getServiceFacility = () => {
  return (dispatch) => {
    axios
      .get(API_BASE_URL + `service/getServiceFacility.php`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        // console.log("this is getServiceFacilityresult", res.data);
        dispatch({ type: GET_SERVICE_FACILITY_SUCCESS, payload: res.data });
      })
      .catch((error) => {});
  };
};

export const getDraftServiceList = (data) => {
  return (dispatch) => {
    // console.log("get draft service list inout", data);
    axios
      .get(API_BASE_URL + `user/getDraftService.php?userId=${data}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        // console.log("this is get draft list result", res.data);
        dispatch({ type: GET_DRAFT_SERVICE_LIST, payload: res.data });
      })
      .catch((error) => {});
  };
};

//request example
// {
//     "categoryId":"2",
//     "serviceSubCategory":["23"],
//     "serviceExtra":["10"],
//     "serviceCity":"toronto",
//     "startPrice":"10",
//     "endPrice":"11",
//     "startDate":"2021-03-01",
//     "endDate":"2021-03-05"
// }
export const getServiceList = (data) => {
  console.log("this is get servicelist input data", data);
  return (dispatch) => {
    axios
      .post(API_BASE_URL + "service/getService.php", data, {
        headers: {
          // "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log("get service list result", res.data);
        dispatch({ type: GET_SERVICE_LIST_SUCCESS, payload: res.data });
      })
      .catch((error) => {
        //dispatch({ type: GET_HOME_DATA_FAIL })
      });
  };
};

export const getServiceDetail = (serviceId, userId) => {
  // console.log("this is service detail input", serviceId, userId);
  return (dispatch) => {
    axios
      .get(
        API_BASE_URL +
          `service/getSingleService.php?serviceId=${serviceId}&userId=${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        // console.log("this is result", res.data);
        dispatch({ type: GET_SERVICE_DETAIL_SUCCESS, payload: res.data });
      })
      .catch((error) => {});
  };
};

//request example
// {
//     "userId":"10",
//     "serviceImage":["123.png"],
//     "serviceName":"6479940788",
//     "serviceCategory":"2",
//     "serviceSubCategory":["1","2"],
//     "serviceDescription":"6479940788",
//     "serviceExtra":["22","23"],
//     "servicePrice":"10",
//     "serviceTax":"13",
//     "serviceStock":"5",
//     "serviceAddress":"123321",
//     "serviceCity":"123321",
//     "serviceProvince":"123321",
//     "servicePhone":"123321",
//     "serviceBlockDate":["2021-03-05"],
//     "serviceType":"0",
//     "serviceState":"0",
//     "endDate":"08"
// }
export const addServiceDetail = (data) => {
  return (dispatch) => {
    axios
      .post(API_BASE_URL + "service/addService.php", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        dispatch({ type: ADD_SERVICE_DETAIL_SUCCESS, payload: res.data });
      })
      .catch((error) => {});
  };
};

//获取服务金额
export const getServicePrice = (data) => {
  return (dispatch) => {
    axios
      .post(API_BASE_URL + "service/getServiceOrderPrice.php", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        dispatch({ type: GET_SERVICE_PRICE_SUCCESS, payload: res.data });
      })
      .catch((error) => {});
  };
};

//获取服务区域列表
export const getServiceLocationList = () => {
  return (dispatch) => {
    axios
      .get(API_BASE_URL + "service/getServiceCity.php")
      .then((res) => {
        // console.log(res.data);
        dispatch({ type: GET_SERVICE_LOCATION_LIST, payload: res.data.data });
      })
      .catch((error) => {});
  };
};

//获取服务评论
export const getServiceReivewList = (data) => {
  return (dispatch) => {
    dispatch({ type: GET_SERVICE_REVIEW_LIST_START });
    axios
      .get(API_BASE_URL + `review/getServiceReview.php?serviceId=${data}`)
      .then((res) => {
        dispatch({ type: GET_SERVICE_REVIEW_LIST, payload: res.data.data });
      })
      .catch((error) => {});
  };
};

//获取服务订单列表
export const getServiceOrderList = (data) => {
  return (dispatch) => {
    dispatch({ type: GET_SERVICE_ORDER_LIST_START });

    axios
      .get(API_BASE_URL + `service/getServiceOrder.php?${data}`)
      .then((res) => {
        dispatch({ type: GET_SERVICE_ORDER_LIST, payload: res.data.data });
      })
      .catch((error) => {});
  };
};

//获取用户宠物列表
export const getPetList = (data) => {
  return (dispatch) => {
    axios
      .get(API_BASE_URL + `pet/getPet.php?userId=${data}`)
      .then((res) => {
        dispatch({ type: GET_PET_LIST, payload: res.data.data });
      })
      .catch((error) => {});
  };
};

//添加宠物卡片
// export const addPetCard = (data) => {
//   console.log("add pet input", data);
//   return (dispatch) => {
//     axios
//       .post(API_BASE_URL + "pet/addPet.php", data, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//       .then((res) => {
//         console.log("add pet result", res.data);
//         dispatch({ type: ADD_PET_SUCCESS, payload: res.data });
//       })
//       .catch((error) => {});
//   };
// };

//获取预定日期
export const getServiceDateList = (data) => {
  return (dispatch) => {
    dispatch({ type: GET_SERVICE_DATE_LIST_START });
    axios
      .get(API_BASE_URL + `service/getServiceDate.php?serviceId=${data}`)
      .then((res) => {
        dispatch({ type: GET_SERVICE_DATE_LIST, payload: res.data.data });
      })
      .catch((error) => {});
  };
};

//获取收藏服务
export const getSavedService = (data) => {
  return (dispatch) => {
    // console.log("get saved service input", data);
    axios
      .get(API_BASE_URL + `service/getSavedService.php?userId=${data}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        // console.log("get saved service result", res.data);
        dispatch({ type: GET_SAVED_SERVICE, payload: res.data.data });
      })
      .catch((error) => {});
  };
};
