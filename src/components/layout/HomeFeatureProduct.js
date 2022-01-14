import React from "react";
//packages
import { withRouter } from "react-router-dom";
import i18n from "i18n-js";
import { Row } from "antd";
import Carousel from "react-elastic-carousel";

// import Carousel from "react-bootstrap/Carousel";
// import Carousel from "react-elastic-carousel";

//components
import SingleProductPreview from "../product/SingleProductPreview";

const HomeFeatureProduct = (props) => {
  const { componentContent, history } = props;

  // const carouselBreakPoints = [
  //   { width: 1, itemsToShow: 1, itemsToScroll: 1 },
  //   { width: 550, itemsToShow: 2, itemsToScroll: 1 },
  //   { width: 1024, itemsToShow: 3, itemsToScroll: 1 },
  //   // { width: 768, itemsToShow: 3, itemsToScroll: 1 },
  //   { width: 1200, itemsToShow: 4, itemsToScroll: 1 },
  // ];

  const carouselBreakPoints = [
    { width: 1, itemsToShow: 1, itemsToScroll: 1 },
    { width: 380, itemsToShow: 1, itemsToScroll: 1 },
    { width: 550, itemsToShow: 2, itemsToScroll: 1 },
    // { width: 1024, itemsToShow: 3, itemsToScroll: 1 },
    { width: 768, itemsToShow: 3, itemsToScroll: 1 },
    { width: 1200, itemsToShow: 4, itemsToScroll: 1 },
  ];

  const listWrapperLayout = {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 12 },
    lg: { span: 6 },
  };

  return (
    <div className="home-grid-wrapper m-auto">
      <Row justify="space-between" className="home-grid-title px-3">
        <span className="text-bold text-20 grey-smalltext mb-2">
          {i18n.t("Feature Products")}
        </span>
        <span
          className="text-normal text-20 grey-service-price"
          role="button"
          onClick={(e) => {
            e.stopPropagation();
            history.push("/product/list");
          }}
        >
          {i18n.t("View More")}
        </span>
      </Row>

      <Row className="home-grid-item-wrapper">
        <Carousel
          className="custom-cursor mb-4"
          breakPoints={carouselBreakPoints}
        >
          {componentContent.map((product, index) => (
            <div
              className="home-grid-item-container-product "
              role="button"
              // onClick={() => history.push(`/product/detail/${product.itemId}`)}
            >
              <SingleProductPreview product={product} key={index} />
            </div>
          ))}
        </Carousel>
      </Row>

      {/* <Row
        justify="space-between"
        align="middle"
        className={
          componentContent.length > 4 || window.innerWidth < 768
            ? "home-feature-product-container-ext"
            : "home-feature-product-container"
        }
      >
        <Carousel
          breakPoints={carouselBreakPoints}
          showArrows={
            componentContent.length > 4 || window.innerWidth < 768
              ? true
              : false
          }
          pagination={false}
          renderArrow={({ type, onClick }) => (
            <div onClick={onClick}>
              {type === "PREV" ? (
                <div role="button" className="control-button">
                  <i className="fas fa-chevron-left"></i>
                </div>
              ) : (
                <div role="button" className="control-button">
                  <i className="fas fa-chevron-right"></i>
                </div>
              )}
            </div>
          )}
        >
          {componentContent.map((product, index) => (
            // <div className="border border-3 home-feature-product-container">
            <SingleProductPreview product={product} key={index} />
            // </div>
          ))}
        </Carousel>
      </Row> */}
    </div>
  );
};

export default withRouter(HomeFeatureProduct);
