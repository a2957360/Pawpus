import React, { useEffect, useState } from "react";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  postUserAddress,
  changeUserAddress,
  resetMessage,
} from "../../redux/actions";

//packages
import { Form, Input, Button, Divider, message } from "antd";
import i18n from "i18n-js";

export default function AddressForm(props) {
  const { setModal } = props;

  const [form] = Form.useForm();

  const dispatch = useDispatch();

  const updateMessage = useSelector((state) => state.userData.updateMessage);
  const savedAddress = useSelector((state) => state.userData.savedAddress);

  const [addressInfo, setAddressInfo] = useState(savedAddress);

  useEffect(() => {
    if (savedAddress.addressId === null) {
      form.resetFields();
    } else {
      setAddressInfo(savedAddress);
      form.setFieldsValue(savedAddress);
    }
  }, [form, savedAddress]);

  useEffect(() => {
    async function handleSuccess() {
      await dispatch(resetMessage());
      await setModal(false);
      await message.success("Success");
    }

    async function handleFail() {
      await dispatch(resetMessage());
      await message.error(`Error: ${updateMessage}`);
    }

    switch (updateMessage) {
      case "success":
        handleSuccess();
        break;
      case "change error":
        handleFail();
        break;
      default:
        break;
    }
  }, [dispatch, updateMessage, setModal]);

  const handleSubmit = async (values) => {
    if (addressInfo.addressId === undefined) {
      await dispatch(postUserAddress(Object.assign(addressInfo, values)));
    } else {
      await dispatch(changeUserAddress(Object.assign(addressInfo, values)));
    }

    await setModal(false);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      name="basic"
      onFinish={handleSubmit}
      initialValues={savedAddress}
    >
      <div className="d-flex text-bold text-18 align-item-center justify-content-center mb-3">
        {i18n.t("Address")}
      </div>

      <Form.Item
        name="unit"
        className="auth-input-container"
        style={{ marginBottom: 16 }}
      >
        <Input
          onChange={(e) =>
            setAddressInfo({ ...addressInfo, userName: e.target.value })
          }
          className="auth-input"
          placeholder={i18n.t("Unit")}
        />
      </Form.Item>

      <Form.Item
        name="address"
        className="auth-input-container"
        style={{ marginBottom: 16 }}
        rules={[
          { required: true, message: i18n.t("Please input your address!") },
        ]}
      >
        <Input
          onChange={(e) =>
            setAddressInfo({ ...addressInfo, userName: e.target.value })
          }
          className="auth-input"
          placeholder={i18n.t("Address")}
        />
      </Form.Item>

      <Form.Item
        name="city"
        className="auth-input-container"
        style={{ marginBottom: 16 }}
        rules={[{ required: true, message: i18n.t("Please input your city!") }]}
      >
        <Input
          onChange={(e) =>
            setAddressInfo({ ...addressInfo, userName: e.target.value })
          }
          className="auth-input"
          placeholder={i18n.t("City")}
        />
      </Form.Item>

      <Form.Item
        name="province"
        className="auth-input-container"
        style={{ marginBottom: 16 }}
        rules={[
          { required: true, message: i18n.t("Please input your province!") },
        ]}
      >
        <Input
          onChange={(e) =>
            setAddressInfo({ ...addressInfo, userName: e.target.value })
          }
          className="auth-input"
          placeholder={i18n.t("Province")}
        />
      </Form.Item>

      <Form.Item
        name="postal"
        className="auth-input-container"
        style={{ marginBottom: 16 }}
        rules={[
          { required: true, message: i18n.t("Please input your postal code!") },
        ]}
      >
        <Input
          onChange={(e) =>
            setAddressInfo({ ...addressInfo, userName: e.target.value })
          }
          className="auth-input"
          placeholder={i18n.t("Postal Code")}
        />
      </Form.Item>

      <Divider />

      <Form.Item
        name="name"
        className="auth-input-container"
        style={{ marginBottom: 16 }}
        rules={[{ required: true, message: i18n.t("Please input your name!") }]}
      >
        <Input
          onChange={(e) =>
            setAddressInfo({ ...addressInfo, userName: e.target.value })
          }
          className="auth-input"
          placeholder={i18n.t("Contact Man")}
        />
      </Form.Item>

      <Form.Item
        name="phone"
        className="auth-input-container"
        style={{ marginBottom: 16 }}
        rules={[
          { required: true, message: i18n.t("Please input your phone!") },
        ]}
      >
        <Input
          onChange={(e) =>
            setAddressInfo({ ...addressInfo, userName: e.target.value })
          }
          className="auth-input"
          placeholder={i18n.t("Phone Number")}
        />
      </Form.Item>

      <Form.Item style={{ marginBottom: 0 }}>
        <Button
          size="large"
          className="primary-button w-100 text-bold text-14"
          htmlType="submit"
        >
          {i18n.t("Save")}
        </Button>
      </Form.Item>
    </Form>
  );
}
