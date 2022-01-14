import React, { useEffect, useState } from "react";

//redux
import { useDispatch, useSelector } from "react-redux";
import { getSimilarProductList } from "../../../redux/actions";

//packages
import { useHistory } from "react-router-dom";
import ImageGallery from "react-image-gallery";

import SliderImage from "react-zoom-slider";

import { Row, Col, Divider } from "antd";
import { StarFilled } from "@ant-design/icons";
import { withSize } from "react-sizeme";
import i18n from "i18n-js";

//components
import MakeUrlParam from "../../../components/service/MakeUrlParam";

const Recommend = ({ size }) => {
  const listWrapperLayout = {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 24 },
  };
  const history = useHistory();
  const dispatch = useDispatch();
  const language = localStorage.getItem("language");

  const { productDetail, productCategoryList, similarProductList } =
    useSelector((state) => state.productData);

  useEffect(() => {
    //获取商品相关推荐列表
    const inputData = `itemId=${productDetail.itemId}&itemCategory=${productDetail.itemCategory}`;
    dispatch(getSimilarProductList(inputData));
  }, []);

  let images = [];
  if (productDetail.itemImage.length > 0) {
    productDetail.itemImage.forEach((element) => {
      // images.push({
      //   original: element,
      //   thumbnail: element,
      //   originalClass: "each-img",
      // });
      images.push({
        image: element,
      });
    });
  }

  const renderOtherCategory =
    productCategoryList.length > 0
      ? productCategoryList.map((element, index) => {
          return (
            <Col className="each-col" key={index} span={12}>
              <span
                //返回productList 选中这个category
                onClick={() => {
                  const newRouterParams = MakeUrlParam({
                    itemCategory: element.categoryId,
                  });
                  history.push(`/product/list?${newRouterParams}`);
                }}
                className="category-element span-mouse-click"
              >
                {element.categoryName[language]}
              </span>
            </Col>
          );
        })
      : null;

  const data = [
    {
      image:
        "https://cdn.tgdd.vn/Products/Images/42/209800/oppo-reno2-f-xanh-1-org.jpg",
      text: "img1",
    },
    {
      image:
        "https://cdn.tgdd.vn/Products/Images/42/209800/oppo-reno2-f-xanh-4-org.jpg",
      text: "img2",
    },
    {
      image:
        "https://cdn.tgdd.vn/Products/Images/42/209800/oppo-reno2-f-xanh-10-org.jpg",
      text: "img3",
    },
  ];

  return (
    <div className="product-recommend-cotainer">
      <div className="image-gallery-container">
        <SliderImage
          data={images}
          width="100%"
          showDescription={false}
          direction="right"
        />
        {/* <ImageGallery items={images} showPlayButton={false} /> */}
      </div>

      {/* 其他分类 */}
      <div className="other-category-container ">
        <div className="title fw-bold">{i18n.t("Other Category")}</div>
        <Row>{renderOtherCategory}</Row>
      </div>
      <Divider />

      {/* 相关推荐 */}
      <div className="related-recommend-container">
        <div className="title">{i18n.t("Similar Items")}</div>
        <Row className="product-card-row">
          {similarProductList && similarProductList.length > 0
            ? similarProductList.map((item) => (
                <Col {...listWrapperLayout}>
                  <div
                    onClick={() => {
                      history.push({
                        pathname: `/product/detail/${item.itemId}`,
                      });
                    }}
                    className="each-card span-mouse-click"
                    style={{
                      height: size.width / 0.9,
                      width: size.width,
                    }}
                  >
                    {/* image container */}
                    <div className="image-container">
                      <img
                        className="image"
                        src={item.itemImage.length > 0 && item.itemImage[0]}
                        alt=""
                      />
                    </div>

                    {/* title price container  */}
                    <div className="content-container product-container">
                      <div className="product-container-inner">
                        <div className="card-title-price-container height-1 fw-bold">
                          <div className="card-product-title text-truncate">
                            {item.itemTitle}
                          </div>
                          <div className="card-product-price">
                            $
                            {item.salePrice != "0" &&
                            item.salePrice < item.price
                              ? item.salePrice
                              : item.price}
                          </div>
                        </div>

                        <div className="description-like-container height-2">
                          <div className="card-description">
                            {item.itemShortDescription}
                          </div>
                          <div className="card-like">
                            {item.itemStar}
                            <StarFilled
                              style={{ color: "#fadb14", marginLeft: 5 }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              ))
            : null}
        </Row>
      </div>
    </div>
  );
};

export default withSize()(Recommend);
