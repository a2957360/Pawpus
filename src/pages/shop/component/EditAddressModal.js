import React, { useState } from "react";

import { Button, message, Modal, Radio } from "antd";

import { DeleteOutlined } from "@ant-design/icons";

//redux
import axios from "axios";
import { API_BASE_URL } from "../../../configs/AppConfig";
import { useDispatch, useSelector } from "react-redux";
import { getUserAddress } from "../../../redux/actions";
import I18n from "i18n-js";

const EditAddressModal = ({
  setIsModalVisible,
  setAddressText,
  isEditAddressModalVisible,
  setIsEditAddressModalVisible,
  selectedAdressId,
  setSelectedAddressId,
}) => {
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");

  const { userAddress } = useSelector((state) => state.userData);

  const handleCheckBox = (e, element) => {
    setSelectedAddressId(element.addressId);
    setAddressText({
      unit: element.unit,
      address: element.address,
      city: element.city,
      province: element.province,
      postal: element.postal,
      name: element.name,
      phone: element.phone,
    });
    setIsEditAddressModalVisible(false);
  };

  const handleDeleteAddress = async (addressId) => {
    if (selectedAdressId == addressId) {
      setSelectedAddressId("");
      setAddressText("");
    }

    const data = {
      userId: userId,
      addressId: addressId,
    };

    await axios
      .post(API_BASE_URL + `address/deleteAddress.php`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.data.message === "success") {
          dispatch(getUserAddress(userId));
        } else {
          message.error(
            I18n.t("Delete address failed, please try again later")
          );
        }
        setIsEditAddressModalVisible(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const renderAddressList =
    userAddress.length > 0
      ? userAddress.map((element, index) => {
          return (
            <div key={index} className="radio-group-section">
              <Radio
                checked={selectedAdressId == element.addressId}
                onClick={(e) => {
                  handleCheckBox(e, element);
                }}
                className="each-radio address-row-font radio--primary"
              >
                <span>
                  {element.unit} {element.address},{element.city},
                  {element.province}, {element.postal} ({element.name}
                  {element.phone})
                </span>
              </Radio>
              <DeleteOutlined
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteAddress(element.addressId);
                }}
              />
            </div>
          );
        })
      : null;

  return (
    <Modal
      width={900}
      closable={false}
      maskClosable={true}
      footer={null}
      visible={isEditAddressModalVisible}
      onCancel={() => setIsEditAddressModalVisible(false)}
    >
      <div className="modal-edit-address">
        <div className="edit-address-inner">
          <div className="address-title margin-bottom-30">
            {I18n.t("Edit Address")}
          </div>
          <div className="margin-bottom-empty-space">{renderAddressList}</div>

          <div className="button-container">
            <Button
              onClick={() => {
                setIsEditAddressModalVisible(false);
                setIsModalVisible(true);
              }}
              className="button-font"
            >
              {I18n.t("Add Address")}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditAddressModal;
