import React from "react";
//import { Link } from 'react-router-dom';
import { Col, Row, Pagination } from "antd";

import { StarFilled } from "@ant-design/icons";

import { withSize } from "react-sizeme";

import { useHistory } from "react-router-dom";

//redux
// import { useSelector } from "react-redux";

const listWrapperLayout = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 12 },
  lg: { span: 6 },
};

//components
const List = ({ size, data }) => {
  const history = useHistory();

  return (
    <div className="service-list-wrapper">
      <div className="service-list">
        <Row className="service-row">
          {data.map((item) => (
            <Col {...listWrapperLayout} className="each-col">
              <div
                onClick={() =>
                  history.push({
                    pathname: `/product/detail/${item.itemId}`,
                  })
                }
                style={{
                  display: "flex",
                  flexDirection: "column",
                  // height: (size.width * 0.8) / 4,
                  width: "100%",
                  backgroundColor: "white",
                }}
              >
                {/* image container */}
                <div className="cover-image-container">
                  <img
                    className="cover-image"
                    src={item.itemImage.length > 0 && item.itemImage[0]}
                    alt=""
                  />
                </div>

                {/* title price container */}
                <div className="card-content-container product-container pl-3">
                  <div className="product-container-inner">
                    <div className="card-title-price-container height-1 fw-bold">
                      <div className="card-product-title text-truncate">
                        {item.itemTitle}
                      </div>
                      <div className="card-product-price">
                        $
                        {item.salePrice != "0" && item.salePrice < item.price
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
          ))}
        </Row>
        {/* 页码 */}
        {/* <div className="service-pagination">
          <Pagination defaultCurrent={1} total={50} />
        </div> */}
      </div>
    </div>
  );
};

export default withSize()(List);
