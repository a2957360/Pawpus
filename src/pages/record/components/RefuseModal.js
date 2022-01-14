import { Modal, Button, Rate, Input } from "antd";
// import { useEffect, useState } from "react";

// import axios from "axios";
// import { API_BASE_URL } from "../../../configs/AppConfig";

import i18n from "i18n-js";

const { TextArea } = Input;

const RefuseModal = ({
  isModalVisible,
  setIsModalVisible,
  setInputReview,
  handleSubmit,
}) => {
  const language = localStorage.getItem("language");

  return (
    <Modal
      // width={860}
      closable={false}
      maskClosable={true}
      footer={null}
      visible={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
    >
      <div className="modal-container">
        <span className="input-font header margin-bottom-10">
          {i18n.t("RefuseServiceMessage")}
        </span>

        <TextArea
          onBlur={(e) => setInputReview(e.target.value)}
          rows={3}
          maxLength={140}
          className="margin-bottom-20"
        />

        <div className="button-row">
          <Button
            onClick={() => setIsModalVisible(false)}
            className="cancel-button transparent-button"
          >
            {i18n.t("Cancel")}
          </Button>
          <Button
            onClick={() => {
              setIsModalVisible(false);
              handleSubmit();
            }}
            className="confirm-button primary-button"
          >
            {i18n.t("Confirm")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
export default RefuseModal;
