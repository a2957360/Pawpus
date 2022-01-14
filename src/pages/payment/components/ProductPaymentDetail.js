import { Row, Col, Divider } from "antd";

import i18n from "i18n-js";

const ProductPaymentDetail = ({ data, orderNumber }) => {
  const { total, itemList } = data;

  const renderProductText = itemList.map((e, index) => {
    let end = index !== itemList.length - 1 ? ", " : " ";
    return (
      e.itemQuantity + " " + e.itemTitle + " " + e.itemOptionName + " " + end
    );
  });

  return (
    <div className="detail-container">
      {/* order number */}
      <Row className='w-100'>
        <Col xs={24} md={9} className="d-flex flex-column justify-content-center p-4">
          <div>
            <div className="order-number-font margin-bottom-5">
              {i18n.t("Order#")}: {orderNumber}
            </div>

            <div className="margin-bottom-5">
              <span className="title mr-3">{i18n.t("Total Price")}</span>
              <span className="total-price">${total}</span>
            </div>

            <div className="order-number-font">
              {i18n.t(
                "There is a prepay service fee, our platform will not charge any fee"
              )}
            </div>
          </div>
        </Col>

        <Divider className="h-auto mx-0 px-0" dashed={true} type={"vertical"} />

        <Col xs={24} md={14} className="d-flex flex-column justify-content-center p-4">
          {/* content */}
          <div>
            <div className="order-type-title margin-bottom-5">
              {i18n.t("Product Recipe")}
            </div>
            <div className="order-number-font">{renderProductText}</div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ProductPaymentDetail;
