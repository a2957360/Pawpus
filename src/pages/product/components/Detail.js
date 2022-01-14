import React, { useState, useEffect } from "react";

//redux
import axios from "axios";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../../../configs/AppConfig";

//packages
import { withSize } from "react-sizeme";
import { useHistory } from "react-router-dom";
import {
  InputNumber,
  Button,
  Tabs,
  Col,
  Row,
  Divider,
  Tag,
  Modal,
  message,
} from "antd";
import { StarFilled } from "@ant-design/icons";

import ImageGallery from "react-image-gallery";

import SliderImage from "react-zoom-slider";

import i18n from "i18n-js";

//components
import shareButtonImage from "../../../assets/img/service/share.png";
import placeholder_pic from "../../../assets/img/Success-Dogy.png";
import Review from "../../../components/review/Review";
import MakeUrlParam from "../../../components/service/MakeUrlParam";

const { TabPane } = Tabs;
const { CheckableTag } = Tag;

const listWrapperLayout = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 24 },
};

const Detail = ({ size, flag, setFlag }) => {
  const history = useHistory();
  const language = localStorage.getItem("language");
  const userId = localStorage.getItem("userId");

  const {
    productDetail,
    productCategoryList,
    similarProductList,
    itemReviewList,
  } = useSelector((state) => state.productData);

  // const lowestPriceOption = productDetail.itemOption.reduce((acc, loc) =>
  //   acc.itemOptionSalePrice < loc.itemOptionSalePrice && ? acc : loc
  // );

  const [selectedOption, setSelectedOption] = useState(
    productDetail.itemOption[0]
  );
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [itemQuantity, setItemQuantity] = useState(1);

  let images = [];
  if (productDetail.itemImage.length > 0) {
    productDetail.itemImage.forEach((element) => {
      images.push({
        original: element,
        thumbnail: element,
        originalClass: "each-img",
      });
      // images.push({
      //   image: element,
      // });
    });
  }

  const handleFavoriteButton = async (targetId) => {
    if (!userId) {
      message.error(i18n.t("Please login to add this item to favorite"));
    } else {
      const SAVE_TYPE_URL =
        productDetail.isSaved == "1"
          ? "saved/deleteSaved.php"
          : "item/saveItem.php";
      const inputData =
        productDetail.isSaved == "1"
          ? {
              targetType: "1",
              userId: userId,
              targetId: targetId,
            }
          : {
              userId: userId,
              targetId: [targetId],
            };

      await axios
        .post(API_BASE_URL + SAVE_TYPE_URL, inputData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {})
        .catch((error) => {});

      setFlag(!flag);
    }
  };

  const handleNumberChange = (value) => {
    setItemQuantity(value);
  };

  const handleChange = (item, checked) => {
    if (item !== selectedOption) {
      setSelectedOption(item);
    }
  };

  const handleAddToCart = async (type) => {
    if (!userId) {
      message.error(i18n.t("Please login to add this item to cart"));
    } else {
      if (Object.keys(selectedOption).length > 0) {
        const data = {
          userId: userId,
          itemId: productDetail.itemId,
          itemOptionId: selectedOption.itemOptionId,
          itemQuantity: itemQuantity,
        };
        await axios
          .post(API_BASE_URL + `item/addCart.php`, data, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            if (res.data.message === "success") {
              if (type === "ADD_TO_CART") {
                message.success(i18n.t("Add Success"));
              } else if (type === "BUY") {
                history.push("/shop/detail");
              }
            }
          })
          .catch((error) => {});
      } else {
        message.error(i18n.t("Choose a type"));
      }
    }
  };

  let reviewTotalPoints =
    itemReviewList.length > 0
      ? itemReviewList.reduce(
          (total, review) => total + Number(review.reviewStar),
          0
        )
      : 0;

  let reviewPointsAverage =
    itemReviewList.length > 0
      ? (reviewTotalPoints / itemReviewList.length).toFixed(1)
      : i18n.t("No rate currently");

  const renderReview =
    itemReviewList.length > 0
      ? itemReviewList.map((review, index) => {
          return (
            <Col key={index} span={24}>
              <Review
                name={review.userName}
                time={review.createTime}
                content={review.reviewContent}
                reviewStar={review.reviewStar}
                avatarUrl={review.userImage}
              />
            </Col>
          );
        })
      : null;

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

  const renderTags =
    productDetail.itemOption.length > 0
      ? productDetail.itemOption.map((element) => {
          return (
            <CheckableTag
              key={element}
              checked={
                selectedOption &&
                selectedOption.itemOptionId == element.itemOptionId
              }
              onChange={(checked) => {
                console.log(checked);
                handleChange(element, checked);
              }}
            >
              {element.itemOptionName}
            </CheckableTag>
          );
        })
      : null;

  return (
    <div className="detail-main-wrapper">
      {/* 只在手机显示 */}
      <div className="image-gallery-container">
        <ImageGallery items={images} showPlayButton={false} />

        {/* <SliderImage
          data={images}
          width="auto"
          showDescription={false}
          direction="right"

        /> */}
      </div>

      {/* detail card */}
      <div className="product-detail-card-wrapper">
        <div className="title-section">
          <div className="main-header">
            <div className="main-header-font">{productDetail.itemTitle}</div>
          </div>
          <div className="sub-header">
            <div className="number-like-font">
              {productDetail.itemShortDescription}
            </div>
          </div>
        </div>

        {/* 价格 */}
        <div className="price-section">
          <div className="price-row">
            <div className="price-title-inner-container">
              <div className="price-row-title marginRight-2">
                {i18n.t("Price")}
              </div>

              <div className="price-new-font ">
                $
                {selectedOption.itemOptionSalePrice != "0" &&
                Number(selectedOption.itemOptionSalePrice) <
                  Number(selectedOption.itemOptionPrice)
                  ? selectedOption.itemOptionSalePrice
                  : selectedOption.itemOptionPrice}
              </div>

              {selectedOption.itemOptionSalePrice !== "0" && (
                <div className="price-old-font ">
                  <del>${selectedOption.itemOptionPrice}</del>
                </div>
              )}
            </div>
            <div className="share-favorite-button-section">
              {/* favorite button */}
              <StarFilled
                onClick={() => handleFavoriteButton(productDetail.itemId)}
                className={
                  productDetail.isSaved == "1"
                    ? "saved-favorite-button"
                    : "favorite-button"
                }
              />

              {/* share button */}
              <img
                onClick={() => setShareModalVisible(true)}
                className="share-button span-mouse-click"
                src={shareButtonImage}
                alt=""
              />
            </div>
          </div>

          {/* 规格 */}
          <div className="type-row button-vertical-margin">
            <div className="type-row-title marginRight-2">{i18n.t("Type")}</div>
            <div className="tags-container">{renderTags}</div>
          </div>

          {/* 数量 */}
          <div className="type-row margin-vertical">
            <div className="type-row-title marginRight-2">
              {i18n.t("Quantity")}
            </div>
            <div>
              <InputNumber
                className="text-input text-input--grey"
                min={1}
                defaultValue={1}
                onChange={handleNumberChange}
              />
            </div>
          </div>

          {/* 加入购物车button */}
          <div className="button-row">
            <Button
              className="add-to-cart-button marginRight-2 btn-color-light"
              onClick={() => handleAddToCart("ADD_TO_CART")}
            >
              {i18n.t("Add to cart")}
            </Button>
            <Button
              onClick={() => handleAddToCart("BUY")}
              className="add-to-cart-button btn-color-dark"
            >
              {i18n.t("Buy")}
            </Button>
          </div>
        </div>
      </div>

      {/* 商品介绍图片 */}
      <div className="image-review-section">
        <Tabs className="tab-style">
          {/* 商品介绍 */}
          <TabPane tab={i18n.t("Item Description")} key="1">
            <div
              className="image-from-backend"
              dangerouslySetInnerHTML={{
                __html: productDetail.itemDescription,
              }}
            />
          </TabPane>

          {/* 商品评价 */}
          <TabPane tab={i18n.t("Item Comment")} key="2">
            <div className="review-title-section">
              <div className="review-title-inner">
                <div className="review-title">
                  {i18n.t("Comprehensive Score")}
                </div>
                <div className="review-text">
                  <StarFilled className="review-star" />
                  {reviewPointsAverage}
                </div>
              </div>
              <Row>{renderReview}</Row>
            </div>
          </TabPane>
        </Tabs>
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
                              style={{ color: "$color-primary", marginLeft: 5 }}
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

      {/* 分享弹窗 */}
      <Modal
        visible={shareModalVisible}
        onCancel={() => setShareModalVisible(false)}
        footer={null}
      >
        <div className="d-flex flex-column align-items-center">
          <img src={placeholder_pic} alt="success-placeholder" />
          <span className="text-normal text-20 grey-service-price">
            {i18n.t("Please copy the following link to share")}
          </span>
          <span className="w-100 text-normal text-14 grey-service-price align-text-center">
            {window.location.href}
          </span>
          <div className="w-80 d-flex justify-content-center m-3">
            <Button
              className="primary-button"
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.href}`);
                message.success(i18n.t("Link copied"));
              }}
            >
              {i18n.t("Copy link")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default withSize()(Detail);
