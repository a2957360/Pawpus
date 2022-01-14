import React, { useState } from "react";

import { Divider, Input, Button, message } from "antd";

import { DeleteOutlined } from "@ant-design/icons";

//redux
import axios from "axios";
import { API_BASE_URL } from "../../../configs/AppConfig";
import { useDispatch, useSelector } from "react-redux";
import { getCart } from "../../../redux/actions";
import i18n from "i18n-js";

const SubmitOrder = ({ handleSubmitOrder }) => {
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");

  const { cartList } = useSelector((state) => state.productData);
  const { postListByType } = useSelector((state) => state.userData);

  const [couponCode, setCouponCode] = useState();

  const handleApplyCoupon = async () => {
    if (!couponCode) {
      message.error(i18n.t("Please enter your coupon code"));
    } else {
      const data = {
        userId: userId,
        couponCode: couponCode,
      };
      console.log("apply copon code input", data);
      await axios
        .post(API_BASE_URL + `item/applyCoupon.php`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log("apply coupon code reulst", res.data);
          if (res.data.message === "success") {
            dispatch(getCart(userId));
          } else {
            message.error(
              i18n.t("Apply coupon failed, please try again later")
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleDeleteCoupon = async () => {
    const data = {
      userId: userId,
    };
    await axios
      .post(API_BASE_URL + `item/deleteCoupon.php`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log("delete coupon code reulst", res.data);
        if (res.data.message === "success") {
          dispatch(getCart(userId));
        } else {
          message.error(i18n.t("Remove coupon failed"));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="submit-order-inner-container">
      {/* 商品金额 */}
      <div className="price-detail-list-container font-size-20 font-color-9f">
        <div className="each-price-detail-row margin-bottom-10">
          <span>{i18n.t("Price")}</span>
          <span>${cartList.subTotal}</span>
        </div>
        <div className="each-price-detail-row margin-bottom-10">
          <span>{i18n.t("Deliver Fee")}</span>
          <span>${cartList.deliverPrice}</span>
        </div>

        <div className="each-price-detail-row margin-bottom-10">
          <span>{i18n.t("Coupon Deduction")}</span>
          <span>-${cartList.coupon}</span>
        </div>
        <div className="each-price-detail-row margin-bottom-10">
          <span>{i18n.t("Tax")}</span>
          <span>${cartList.tax}</span>
        </div>

        <div className="each-price-detail-row margin-bottom-10">
          <span>{i18n.t("Total Price")}</span>
          <span className="total-price-font">${cartList.total}</span>
        </div>
      </div>

      <Divider dashed={true} />

      {/* 优惠码 */}
      <div className="coupon-container font-size-20 font-color-9f">
        <div className="d-flex align-item-center">
          <span className="mr-3  mb-2">{i18n.t("Coupon Code")}</span>

          {/* 已使用的优惠卷 */}
          {cartList.couponCode && (
            <div className="d-flex align-items-center  mb-2">
              <span className="mr-2 color-primary">{cartList.couponCode}</span>
              <DeleteOutlined onClick={() => handleDeleteCoupon()} />
            </div>
          )}
        </div>
        <Input
          onChange={(e) => setCouponCode(e.target.value)}
          className="font-size-20 margin-bottom-20 text-input text-input--grey"
          placeholder={i18n.t("Please enter your coupon code")}
        />
        <Button onClick={() => handleApplyCoupon()} className="white-button">
          {i18n.t("Apply Coupon")}
        </Button>
      </div>

      <Divider dashed={true} />

      {/* 退款须知 */}
      <div className="coupon-container font-size-20 font-color-70 margin-bottom-large-space">
        <span>{i18n.t("Return Policy")}</span>

        <div
          className="text-18"
          dangerouslySetInnerHTML={{
            __html: postListByType[0].postContent,
          }}
        />
      </div>
      {/* 提交button */}
      <div className="submit-button-container">
        <Button onClick={handleSubmitOrder} className="primary-button w-100">
          {i18n.t("Submit Order")}
        </Button>
      </div>
    </div>
  );
};

export default SubmitOrder;
