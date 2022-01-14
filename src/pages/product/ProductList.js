import React, { useEffect, useState } from "react";

//global component
import ProductFilter from "../../components/product/ProductFilter";

//page component
import Sort from "./components/Sort";
import List from "./components/List";
import EmptyDataView from "../../components/loading/EmptyDataView";
import RouterLoading from "../../components/loading/RouterLoading";

//packages
import { LeftSquareOutlined, RightSquareOutlined } from "@ant-design/icons";
import { message } from "antd";
import i18n from "i18n-js";

//redux
import axios from "axios";
import { API_BASE_URL } from "../../configs/AppConfig";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductCategory,
  getItemPetCategory,
  getItemPetSubCategory,
  // getProductList,
} from "../../redux/actions";

//components
const ProductList = () => {
  const dispatch = useDispatch();

  const {
    productCategoryList,
    itemPetCategoryList,
    itemPetSubCategoryList,
    // productList,
  } = useSelector((state) => state.productData);

  const [currentPage, setCurrentPage] = useState(1);
  const [offset, setOffset] = useState(null);
  const [productDataList, setProductDataList] = useState({});
  const [data, setData] = useState();

  const emptyData = {
    itemCategory: null,
    itemPetCategory: null,
    itemPetSubCategory: null,
    startPrice: null,
    endPrice: null,
    // offset: null,
    orderBy: "regular",
    sort: null,
    searchContent: null,
  };

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const entries = urlParams.entries();

  const paredUrlParams = {};
  for (const entry of entries) {
    paredUrlParams[entry[0]] = JSON.parse(entry[1]);
  }

  const params = Object.assign(emptyData, paredUrlParams);

  useEffect(() => {
    //获取分类
    dispatch(getProductCategory());
    //获取宠物分类
    dispatch(getItemPetCategory());
    //获取规格分类
    dispatch(getItemPetSubCategory());

    const getServiceDataListFirstTime = async () => {
      const inputData = params
        ? { ...params, offset: null }
        : { ...emptyData, offset: null };
      // console.log("first time get getItem input", inputData);
      await axios
        .post(API_BASE_URL + `item/getItem.php`, inputData, {
          headers: {
            // "Content-Type": "application/json",
          },
        })
        .then((res) => {
          // console.log("first time get getItem result", res.data);
          if (res.data.message === "success") {
            setProductDataList({
              ...productDataList,
              1: res.data.data,
            });
            setOffset(res.data.offset);
            setData(res.data.data);
          }
        })
        .catch((error) => {});
    };
    getServiceDataListFirstTime();
  }, [dispatch]);

  const handlePageChange = (type) => {
    if (type === "left") {
      if (currentPage > 1) {
        setData(productDataList[currentPage - 1]);
        setCurrentPage(currentPage - 1);
      }
    } else if (type === "right") {
      if (productDataList[currentPage + 1]) {
        setData(productDataList[currentPage + 1]);
        setCurrentPage(currentPage + 1);
      } else {
        const inputData = params
          ? { ...params, offset: offset }
          : { ...emptyData, offset: offset };

        axios
          .post(API_BASE_URL + `item/getItem.php`, inputData, {
            headers: {
              // "Content-Type": "application/json",
            },
          })
          .then((res) => {
            console.log("right button get getItem result", res.data);
            if (res.data.data.length > 0) {
              setProductDataList({
                ...productDataList,
                [currentPage + 1]: res.data.data,
              });
              setOffset(res.data.offset);
              setData(res.data.data);
              setCurrentPage(currentPage + 1);
            } else {
              message.error(i18n.t("No next page"));
            }
          })
          .catch((error) => {});
      }
    }
  };

  if (
    !productCategoryList ||
    !itemPetCategoryList ||
    !itemPetSubCategoryList ||
    !data
  ) {
    return <RouterLoading />;
  }

  return (
    <div
      className="w-100 d-flex justify-content-center"
      style={{ backgroundColor: "#F8F8FF" }}
    >
      <div className="responsive-container">
        <ProductFilter routerParams={params} />
        <Sort routerParams={params} />
        {data.length === 0 ? (
          <EmptyDataView message={i18n.t("EmptyPageMessages")} />
        ) : (
          <List data={data} />
        )}

        {/* 页码 */}
        <div className="white-bar-wrapper">
          <div className="white-bar-container">
            <LeftSquareOutlined
              onClick={() => handlePageChange("left")}
              className="arrow-size margin-right-10 span-mouse-click"
            />
            {currentPage}
            <RightSquareOutlined
              onClick={() => handlePageChange("right")}
              className="arrow-size margin-left-10 span-mouse-click"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
