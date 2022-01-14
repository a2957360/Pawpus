import React from "react";
import { withRouter } from "react-router-dom";
//import i18n from "i18n-js";

//components
import { Row } from "antd";
// import Carousel from "react-bootstrap/Carousel";
import { StarFilled } from "@ant-design/icons";

const SingleProductPreview = (props) => {
  const { product, history } = props;

  return (
    <div className="item-card-container-copy border-radius-8 position-relative">
      {/* <div className="position-relative">
        <img
          src={product.itemImage[0]}
          alt={product.itemTitle}
          className="w-100 home-product-card-cover "
        />
        <img
          src={product.itemImage[1]}
          onMouseEnter={(e) => (e.currentTarget.src = product.itemImage[1])}
          onMouseLeave={(e) => (e.currentTarget.src = product.itemImage[0])}
          // onMouseOver={(e) => (e.currentTarget.src = product.itemImage[1])}
          alt={product.itemTitle}
          className="w-100 home-product-card-cover home-product-card-cover-hover"
        />
      </div> */}

      {/* <div>
        <Carousel
          className="item-image-carousel"
          indicators={false}
          interval={60000}
        >
          {product.itemImage.map((img, index) => (
            <Carousel.Item key={index}>
              <img
                src={img}
                alt="Pawpus"
                className="service-card-cover-image"
                role="button"
                onClick={() =>
                  history.push(`/product/detail/${product.itemId}`)
                }
              />
            </Carousel.Item>
          ))}
        </Carousel>
      </div> */}

      {/* <div className="item-image-carousel bg-primary"> 1</div> */}
      <div className="item-image-carousel">
        <img
          src={product.itemImage[0]}
          alt="Pawpus"
          role="button"
          onClick={() => history.push(`/product/detail/${product.itemId}`)}
        />
      </div>

      <div className="item-card-content  item-card-content-product">
        <Row justify="space-between" className="pt-3 px-3 pb-1 text-14 w-100">
          <span className="text-bold grey-smalltext d-inline-block w-70 text-truncate">
            {product.itemTitle}
          </span>

          <span className="text-bold text-16 color-total-price d-inline-block w-30 text-truncate text-right">
            $
            {product.salePrice !== "0" &&
            Number(product.salePrice) < Number(product.price)
              ? Number(product.salePrice).toFixed(2)
              : Number(product.price).toFixed(2)}
          </span>
        </Row>
        <Row className="px-3">
          <span className="text-14 color-card-detail d-inline-block w-100 text-truncate">
            {product.itemShortDescription}
          </span>
        </Row>

        <Row className="px-3 pb-3 justify-content-end align-items-center">
          {product.itemStar === "0" ? null : (
            <div className="text-14">
              <span className="text-normal color-card-detail pr-1">
                {/* {product.itemStar} */}
                {Number(product.itemStar) === 0
                  ? 0
                  : Number(product.itemStar).toFixed(1)}
              </span>
              <i className="fas fa-star color-total-price"></i>
            </div>
          )}
        </Row>
        <Row className="px-3 pb-3 justify-content-end align-items-center text-14 ">
          <div className="color-card-detail">{product.itemStar}</div>
          <StarFilled style={{ color: "#fadb14", marginLeft: 5 }} />
        </Row>
      </div>
    </div>
  );
};

export default withRouter(SingleProductPreview);
