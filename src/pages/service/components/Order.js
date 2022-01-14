import { Divider, Button } from "antd";

import i18n from "i18n-js";

import { useHistory } from "react-router-dom";

import { useSelector } from "react-redux";

const Order = ({
  quantity,
  serviceOrderPrice,
  duration,
  handleSubmitServiceOrder,
}) => {
  const { postListByType } = useSelector((state) => state.userData);

  const {
    serviceOrderRentPrice,
    serviceOrderExtraPrice,
    serviceOrderTaxPrice,
    serviceOrderTotalPrice,
    clientChargeFee,
    serviceOrderTotalPyament,
  } = serviceOrderPrice;

  return (
    <div className="submit-order-inner-container bg-white">
      {/* 商品金额 */}
      <div className="price-detail-list-container font-size-20 font-color-9f">
        <div className="each-price-detail-row margin-bottom-10">
          <span className="text-18">
            {`${quantity} ${i18n.t("Quantity")} x ${duration} ${i18n.t("Day")}`}
          </span>
          <span className="text-18">${serviceOrderRentPrice}</span>
        </div>
        <div className="each-price-detail-row margin-bottom-10">
          <span className="text-18">
            {`${i18n.t("Other Services")} x ${duration} ${i18n.t("Day")}`}
          </span>
          <span className="text-18">${serviceOrderExtraPrice}</span>
        </div>
        <div className="each-price-detail-row margin-bottom-10">
          <span className="text-18">{i18n.t("Service Fee")}</span>
          <span className="text-18">${clientChargeFee}</span>
        </div>
        <div className="each-price-detail-row margin-bottom-10">
          <span className="text-18">{i18n.t("Tax")}</span>
          <span className="text-18">${serviceOrderTaxPrice}</span>
        </div>
        <div className="each-price-detail-row margin-bottom-10">
          <span className="text-18">{i18n.t("Total Price")}</span>
          <span className="text-18 color-total-price">
            ${serviceOrderTotalPyament}
          </span>
        </div>
      </div>

      <Divider dashed={true} />

      {/* 退款须知 */}
      <div className="coupon-container text-18 font-color-70 margin-bottom-large-space">
        <span>{i18n.t("Return Policy")}</span>
        <div
          className="detail"
          dangerouslySetInnerHTML={{
            __html: postListByType[0].postContent,
          }}
        />
        {/* <span>
          {postListByType[0].postContent}
        </span> */}
      </div>

      {/* 提交button */}
      <div className="submit-button-container">
        <Button
          onClick={() => handleSubmitServiceOrder()}
          className="primary-button w-100"
        >
          {i18n.t("Submit Order")}
        </Button>
      </div>
    </div>
  );
};

export default Order;
