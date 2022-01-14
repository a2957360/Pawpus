import { Modal, Button } from "antd";
import { useEffect, useState } from "react";

import axios from "axios";
import { API_BASE_URL } from "../../../configs/AppConfig";

import i18n from "i18n-js";

import LoadingView from "../../../components/loading/LoadingView";

const CustomerServiceModal = ({ isModalVisible, setIsModalVisible }) => {
  const language = localStorage.getItem("language");
  const [data, setData] = useState([]);

  useEffect(() => {
    const getCustomerServiceInfo = async () => {
      axios
        .get(API_BASE_URL + `config/getConfig.php?configType=1`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (res.data.data) {
            setData(res.data.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getCustomerServiceInfo();
  }, []);

  if (!data) {
    return <LoadingView />;
  }

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
          {i18n.t("Contact Customer Service")}
        </span>
        {data.length > 0 &&
          data.map((e, index) => {
            return (
              <span className="record-14-70 margin-bottom-10" key={index}>
                {language === "en" ? e.configName : e.configZhName}:{" "}
                {e.configValue}
              </span>
            );
          })}
        <Button
          onClick={() => setIsModalVisible(false)}
          className="primary-button confirm-button"
        >
          {i18n.t("Confirm")}
        </Button>
      </div>
    </Modal>
  );
};
export default CustomerServiceModal;
