import React from "react";

import { message, Modal, Radio, Button } from "antd";

import axios from "axios";
import { API_BASE_URL } from "../../../configs/AppConfig";
import { useDispatch } from "react-redux";
import { getCart } from "../../../redux/actions";
import i18n from "i18n-js";

const DeliverMethodModal = ({
  isDeliverModalVisible,
  setIsDeliverModalVisible,
  selectedDeliverMethod,
  setSelectedDeliverMethod,
  deliverList,
}) => {
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");

  const handleCheckBox = (element) => {
    if (element.deliverId !== selectedDeliverMethod?.deliverId) {
      const data = {
        userId: userId,
        deliverId: element.deliverId,
      };
      axios
        .post(API_BASE_URL + `item/selectDeliver.php`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log("select deliver result", res.data);
          if (res.data.message === "success") {
            //重新获取cart
            dispatch(getCart(userId));
          } else {
            message.error(
              i18n.t(
                "Select this deliver method failed, please try again later"
              )
            );
          }
          setSelectedDeliverMethod(element);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const renderAddressList =
    deliverList.length > 0 ? (
      deliverList.map((element, index) => {
        return (
          <div key={index} className="radio-group-section pb-3">
            <Radio
              checked={selectedDeliverMethod?.deliverId == element.deliverId}
              onClick={() => {
                handleCheckBox(element);
              }}
              className="each-radio address-row-font radio--primary"
            >
              <span className="subtitle">{element.deliverName}</span>
            </Radio>
            <span className="price-font">$ {element.deliverPrice}</span>
          </div>
        );
      })
    ) : (
      <span>{i18n.t("No available deliver method")}</span>
    );

  return (
    <Modal
      width={900}
      closable={false}
      maskClosable={true}
      footer={null}
      visible={isDeliverModalVisible}
      onCancel={() => setIsDeliverModalVisible(false)}
    >
      <div className="modal-edit-address">
        <div className="edit-address-inner">
          <div className="address-title margin-bottom-30">
            {i18n.t("Select Deliver Method")}
          </div>
          <div className="margin-bottom-empty-space ">{renderAddressList}</div>

          <div className="button-container">
            <Button
              onClick={() => {
                setIsDeliverModalVisible(false);
              }}
              className="button-font"
            >
              {i18n.t("Confirm")}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DeliverMethodModal;
