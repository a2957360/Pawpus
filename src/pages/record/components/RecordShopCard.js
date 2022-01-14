import { useState } from "react";
import { Row, Col, Divider, Button } from "antd";

import { useHistory } from "react-router-dom";

import i18n from "i18n-js";
// import CustomerServiceModal from "./CustomerServiceModal";

const RecordShopCard = ({ data, tab }) => {
  const history = useHistory();
  const language = localStorage.getItem("language");

  // const [isModalVisible, setIsModalVisible] = useState(false);

  const stateTextList = {
    0: i18n.t("UnPaid"),
    1: i18n.t("Unship"),
    2: i18n.t("Sent"),
    3: i18n.t("Delivered"),
    4: i18n.t("Refunding"),
    5: i18n.t("Paid/Canceled"),
    6: i18n.t("Refused"),
    7: i18n.t("UnPaid/Canceled"),
  };

  const orderStateText = stateTextList[data.orderState];

  const renderRow = data.itemList.map((element, index) => {
    return (
      <Row key={index} className="each-row">
        {/* image */}
        <Col span={4} className="text-center">
          <div className="image-section">
            <img
              src={
                element.itemImage &&
                element.itemImage.length > 0 &&
                element.itemImage[0]
              }
              alt="/"
              className="product-image"
            />
          </div>
        </Col>

        {/* name */}
        <Col span={11}>
          <div className="product-content-container padding-left-20">
            <div className="margin-bottom-10">
              <span className="product-name margin-right-10">
                {element.itemTitle}
              </span>
            </div>
            <div>
              <span className="detail-name font-color-8c">
                {element.itemOptionName}
              </span>
            </div>
          </div>
        </Col>

        {/* single price */}
        <Col span={3} className="text-center price-font">
          <div className="center-item">
            ${/* {element.itemOptionSalePrice} */}
            {element.itemOptionSalePrice != "0" &&
            element.itemOptionSalePrice < element.itemOptionPrice
              ? Number(element.itemOptionSalePrice).toFixed(2)
              : Number(element.itemOptionPrice).toFixed(2)}
          </div>
        </Col>

        {/* quantity */}
        <Col span={3} className="text-center">
          <div className="center-item">{element.itemQuantity}</div>
        </Col>

        {/* subtotal */}
        <Col span={3} className="text-center price-font">
          <div className="center-item">${element.subTotal}</div>
        </Col>
      </Row>
    );
  });

  return (
    <div className="record-shop-card-wrapper margin-bottom-30">
      {/* header */}
      <div className="d-flex record-14-70 w-100">
        <Row className="w-100">
          <Col xs={24} sm={7} md={6} xl={6}>
            {data.createTime.split(" ")[1].slice(0, 5) +
              " " +
              data.createTime.split(" ")[0]}
          </Col>

          <Col xs={24} sm={12} md={12} xl={8}>
            {i18n.t("Order#")}: {data.orderNo}
          </Col>

          <Col xs={24} sm={5} md={6} xl={6}>
            {i18n.t("Merchant")}: {data.userName}
          </Col>
        </Row>

        <Button
          onClick={() =>
            history.push({
              pathname: `/record/shopdetail/${data.itemOrderId}`,
              // pathname: "/record/shopdetail",
              state: data,
            })
          }
          className="transparent-button"
        >
          {i18n.t("Detail")}
        </Button>
      </div>

      <div className="shop-product-row-wrapper">{renderRow}</div>

      <Divider dashed={true} className="my-0" />

      <Row className="total-price-section d-flex align-items-center">
        <Col
          xs={24}
          sm={16}
          md={16}
          xl={16}
          className="state-button-section record-14-70 d-flex align-items-center pt-3"
        >
          <div className="margin-right-20">{orderStateText}</div>
          <div className="buttons-contain">
            {/* 未付款 */}
            {data.orderState === "0" && (
              <Button
                onClick={() => {
                  history.push({
                    pathname: "/payment/method",
                    state: data,
                    productPaymentFlag: true,
                  });
                }}
                className="margin-right-20 white-button"
              >
                {i18n.t("Pay Order")}
              </Button>
            )}

            {/* 联系客服 */}
            {(data.orderState === "1" || data.orderState === "2") && (
              <Button
                onClick={() =>
                  history.push({
                    pathname: `/record/shopdetail/${data.itemOrderId}`,
                    state: data,
                    tab: tab,
                  })
                }
                className="white-button"
              >
                {i18n.t("Contact Customer Service")}
              </Button>
            )}

            {/* 评论 */}
            {data.orderState === "4" && !data.userReview && (
              <Button
                onClick={() =>
                  history.push({
                    pathname: `/record/shopdetail/${data.itemOrderId}`,
                    state: data,
                    tab: tab,
                  })
                }
                className="white-button"
              >
                {i18n.t("Rate Service")}
              </Button>
            )}
          </div>
        </Col>

        <Col xs={24} sm={8} md={8} xl={8} className="pt-3">
          <span className="price-total-title margin-right-10">
            {i18n.t("Total Price")}
          </span>
          <span className="total-price-small">${data.total}</span>
          <span className="tax-text">
            ({i18n.t("Including deliver fee and tax")})
          </span>
        </Col>
      </Row>
      {/* <CustomerServiceModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      /> */}
    </div>
  );
};

export default RecordShopCard;
