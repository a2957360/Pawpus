import { Button, Input, Modal } from "antd";
import I18n from "i18n-js";

const AddAddressModal = ({
  setIsModalVisible,
  isModalVisible,
  setInputAddress,
  handleAddAddress,
  inputAddress,
}) => {
  return (
    <Modal
      width={500}
      closable={false}
      maskClosable={true}
      footer={null}
      visible={isModalVisible}
      // onOk={handleOk}
      onCancel={() => setIsModalVisible(false)}
    >
      <div className="modal-add-address">
        <div className="add-address-inner">
          <div className="address-title margin-bottom-20">
            {I18n.t("Add Address")}
          </div>
          <div className="margin-bottom-20">
            <Input
              value={inputAddress.unit}
              onChange={(e) =>
                setInputAddress({ ...inputAddress, unit: e.target.value })
              }
              placeholder={I18n.t("Unit#")}
              className="input-font text-input text-input--grey"
            />
          </div>
          <div className="margin-bottom-20">
            <Input
              value={inputAddress.address}
              onChange={(e) =>
                setInputAddress({ ...inputAddress, address: e.target.value })
              }
              placeholder={I18n.t("Street Name")}
              className="input-font text-input text-input--grey"
            />
          </div>
          <div className="margin-bottom-20">
            <Input
              value={inputAddress.city}
              onChange={(e) =>
                setInputAddress({ ...inputAddress, city: e.target.value })
              }
              placeholder={I18n.t("City")}
              className="input-font text-input text-input--grey"
            />
          </div>
          <div className="margin-bottom-20">
            <Input
              value={inputAddress.province}
              onChange={(e) =>
                setInputAddress({ ...inputAddress, province: e.target.value })
              }
              placeholder={I18n.t("Province")}
              className="input-font text-input text-input--grey"
            />
          </div>
          <div className="margin-bottom-20">
            <Input
              value={inputAddress.postal}
              onChange={(e) =>
                setInputAddress({ ...inputAddress, postal: e.target.value })
              }
              placeholder={I18n.t("Postal Code")}
              className="input-font text-input text-input--grey"
            />
          </div>
          <div className="margin-bottom-20">
            <Input
              value={inputAddress.name}
              onChange={(e) =>
                setInputAddress({ ...inputAddress, name: e.target.value })
              }
              placeholder={I18n.t("Name")}
              className="input-font text-input text-input--grey"
            />
          </div>
          <div className="margin-bottom-20">
            <Input
              value={inputAddress.phone}
              onChange={(e) =>
                setInputAddress({ ...inputAddress, phone: e.target.value })
              }
              placeholder={I18n.t("Contact")}
              className="input-font text-input text-input--grey"
            />
          </div>
          <div className="button-container">
            <Button onClick={handleAddAddress} className="button-font">
              {I18n.t("Add Address")}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddAddressModal;
