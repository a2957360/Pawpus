import React, { useState } from "react";

import { useHistory } from "react-router-dom";
import { Breadcrumb, Button, Divider, Row, Col, Input, message } from "antd";

import AddAddressModal from "./AddAddressModal";
import EditAddressModal from "./EditAddressModal";
import DeliverMethodModal from "./DeliverMethodModal";

//redux
import axios from "axios";
import { API_BASE_URL } from "../../../configs/AppConfig";
import { useDispatch, useSelector } from "react-redux";
import { getUserAddress } from "../../../redux/actions";
import I18n from "i18n-js";

const Order = ({
  addressText,
  setAddressText,
  setNote,
  inputAddress,
  setInputAddress,
  selectedAdressId,
  setSelectedAddressId,
  selectedDeliverMethod,
  setSelectedDeliverMethod,
  deliverList,
}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");

  const { userAddress } = useSelector((state) => state.userData);
  const { cartList } = useSelector((state) => state.productData);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditAddressModalVisible, setIsEditAddressModalVisible] =
    useState(false);
  const [isDeliverModalVisible, setIsDeliverModalVisible] = useState(false);

  const handleAddAddress = async () => {
    const { unit, address, city, province, postal, name, phone } = inputAddress;
    if (!address || !city || !province || !postal || !name || !phone) {
      message.error(I18n.t("Please complete the information"));
      setIsModalVisible(false);
    } else {
      const data = {
        userId: userId,
        ...inputAddress,
      };

      axios
        .post(API_BASE_URL + `address/addAddress.php`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          // console.log("add address result", res.data);
          if (res.data.message === "success") {
            dispatch(getUserAddress(userId));
            setAddressText(inputAddress);
            setSelectedAddressId(res.data.data.addressId);
            setInputAddress({
              unit: "",
              address: "",
              city: "",
              province: "",
              postal: "",
              name: "",
              phone: "",
            });
            setIsModalVisible(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const renderProductList = cartList.itemList.map((element) => {
    return (
      <Row className="each-row">
        <Col xs={24} sm={24} md={24} xl={18} className="pt-4">
          {/* image & name */}
          <div className="image-content-container">
            <img
              src={
                element.itemImage &&
                element.itemImage.length > 0 &&
                element.itemImage[0]
              }
              alt="/"
              className="product-image margin-right-30"
            />
            <div className="product-content-container">
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
          </div>
        </Col>

        {/* single price */}
        <Col
          xs={24}
          sm={24}
          md={24}
          xl={6}
          className="d-flex align-items-center justify-content-end pt-4"
        >
          <div className="d-flex">
            <div className="d-flex align-items-center pr-4 price-font">
              {/* ${element.itemOptionSalePrice} */}

              {element.itemOptionSalePrice != "0" &&
              Number(element.itemOptionSalePrice) <
                Number(element.itemOptionPrice)
                ? Number(element.itemOptionSalePrice).toFixed(2)
                : Number(element.itemOptionPrice).toFixed(2)}
            </div>

            {/* quantity */}
            <div className="d-flex align-items-center pr-4 font-size-16 font-col-70">
              x{element.itemQuantity}
            </div>

            {/* subtotal */}
            <div className="d-flex align-items-center pr-4 price-font">
              ${element.subTotal}
            </div>
          </div>
        </Col>
      </Row>
    );
  });

  return (
    <div>
      {/* header */}
      <div className="header-container margin-bottom-20">
        <Breadcrumb>
          <Breadcrumb.Item>
            <span
              onClick={() => history.push("/shop/list")}
              className="header-font span-mouse-click"
            >
              {I18n.t("Cart")}
            </span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <span className="header-font">{I18n.t("Comfirm Order")}</span>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      {/* 添加收货地址 */}
      <div className="add-deliver-address  margin-bottom-20">
        <span className="font-size-25 font-color-70 margin-bottom-10">
          {I18n.t("Confirm Deliver Address")}
        </span>

        <div>
          {userAddress.length > 0 ? (
            <div className="added-address-row">
              <span className="text-20 font-color-70">
                {addressText.unit +
                  " " +
                  addressText.address +
                  ", " +
                  addressText.city +
                  ", " +
                  addressText.province +
                  ", " +
                  addressText.postal +
                  "(" +
                  addressText.name +
                  addressText.phone +
                  ")"}
              </span>
              <Button
                onClick={() => setIsEditAddressModalVisible(true)}
                className="white-button"
              >
                {I18n.t("Edit Address")}
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setIsModalVisible(true)}
              className="white-button"
            >
              {I18n.t("Add Address")}
            </Button>
          )}
        </div>
      </div>

      <div className="add-deliver-address  margin-bottom-20">
        <span className="font-size-25 font-color-70 margin-bottom-10">
          {I18n.t("Confirm Deliver Method")}
        </span>
        <span className="font-size-20 font-color-70 margin-bottom-10">
          {selectedDeliverMethod &&
            selectedDeliverMethod.deliverName +
              ", " +
              selectedDeliverMethod.deliverPrice}
        </span>
        <div className="added-address-row">
          <Button
            onClick={() => setIsDeliverModalVisible(true)}
            className="white-button"
          >
            {I18n.t("Select")}
          </Button>
        </div>
      </div>

      {/* 商品信息 */}
      <div className="product-info-container margin-bottom-20">
        {/* 商品信息 */}
        <div className="title-section">
          <span className="font-size-25 font-color-70">
            {I18n.t("Product Information")}
          </span>
        </div>

        <Divider dashed={true} className="mb-0 pb-0" />

        {/* 商品列表 */}
        <div className="product-info-list-wrapper">{renderProductList}</div>

        <Divider dashed={true} />

        {/* 商品金额 */}
        <div className="product-info-list-wrapper d-flex justify-content-end align-items-center">
          <div className="font-size-18 font-col-70 pr-4">{I18n.t("Price")}</div>

          <div className="price-font pr-4">${cartList.subTotal}</div>
        </div>
      </div>

      {/* 备注 */}
      <div className="note-container margin-bottom-20">
        <span className="font-size-25 font-color-70 margin-bottom-10">
          {I18n.t("Notes")}
        </span>
        <div>
          <Input
            className="text-input text-input--grey"
            onChange={(e) => setNote(e.target.value)}
            placeholder={I18n.t("Write your notes")}
          />
        </div>
      </div>

      <AddAddressModal
        setIsModalVisible={setIsModalVisible}
        isModalVisible={isModalVisible}
        setInputAddress={setInputAddress}
        handleAddAddress={handleAddAddress}
        inputAddress={inputAddress}
      />
      <EditAddressModal
        setIsModalVisible={setIsModalVisible}
        setAddressText={setAddressText}
        isEditAddressModalVisible={isEditAddressModalVisible}
        setIsEditAddressModalVisible={setIsEditAddressModalVisible}
        selectedAdressId={selectedAdressId}
        setSelectedAddressId={setSelectedAddressId}
      />
      <DeliverMethodModal
        isDeliverModalVisible={isDeliverModalVisible}
        setIsDeliverModalVisible={setIsDeliverModalVisible}
        selectedDeliverMethod={selectedDeliverMethod}
        setSelectedDeliverMethod={setSelectedDeliverMethod}
        deliverList={deliverList}
      />
    </div>
  );
};

export default Order;
