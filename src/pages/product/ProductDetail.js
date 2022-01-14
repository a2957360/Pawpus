import React, { useEffect, useState } from "react";

//components
import LoadingView from "../../components/loading/LoadingView";
import Recommend from "./components/Recommend";
import Detail from "./components/Detail";
import { Breadcrumb, message } from "antd";
import { useHistory } from "react-router-dom";
import i18n from "i18n-js";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  getProductDetail,
  getProductCategory,
  getItemReview,
} from "../../redux/actions";

//components
const ProductDetail = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const language = localStorage.getItem("language");
  const userId = localStorage.getItem("userId");

  const itemId = props.match.params.id;

  const { productDetail, productCategoryList, itemReviewList } = useSelector(
    (state) => state.productData
  );

  const [flag, setFlag] = useState(false);

  //flag 用来刷新productDetail
  useEffect(() => {
    dispatch(getProductDetail(itemId, userId));
    dispatch(getProductCategory());
    dispatch(getItemReview(itemId));
  }, [dispatch, flag]);

  // if (serviceDetailMessage === "201") {
  //   console.log("no item");
  //   history.push("*");
  // }

  // if (!userId) {
  //   message.error(i18n.t("Please login to see the product detail"));
  //   history.push("/");
  // }

  if (!productDetail || !productCategoryList || !itemReviewList) {
    return <LoadingView />;
  }

  return (
    <div className="product-page-wrapper">
      <div className="product-page-main-container">
        {/* header */}
        <div className="page-header-container">
          <Breadcrumb>
            <Breadcrumb.Item>
              <span className="page-breadcrumb-text">
                {i18n.t("Online Shop")}
              </span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <span className="page-breadcrumb-text">
                {productDetail.categoryName[language]}
              </span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <span className="page-breadcrumb-text">
                {productDetail.itemTitle}
              </span>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

        {/* content */}
        <div className="contents">
          <div className="product-page-left">
            <Recommend />
          </div>
          <div className="empty-space"></div>
          <div className="product-page-right">
            <Detail flag={flag} setFlag={setFlag} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
