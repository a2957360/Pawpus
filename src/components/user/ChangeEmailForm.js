import React, { useEffect, useState } from "react";

//redux
import { useDispatch, useSelector } from "react-redux";
import { sendChangeEmail, resetMessage } from '../../redux/actions';

//packages
import i18n from "i18n-js";
import { Form, Input, Button, message } from 'antd';

export default function ChangeEmailForm(props) {
  const { setModal, userId } = props;

  const dispatch = useDispatch();

  const sendEmailMessage = useSelector(state => state.authData.sendEmailMessage)

  useEffect(() => {
    async function handleSuccess() {
      await dispatch(resetMessage());
      await setModal(false);
      await message.success('Send Success!');
    }

    async function handleFail() {
      await dispatch(resetMessage());
      await message.error(`Error: ${sendEmailMessage}`);
    }

    if (sendEmailMessage === null) {

    } else if (sendEmailMessage === 'success') {
      handleSuccess()
    } else {
      handleFail()
    }
    console.log(sendEmailMessage)
  }, [dispatch, setModal, sendEmailMessage])

  const handleChange = async (values) => {
    await dispatch(sendChangeEmail({
      ...values,
      userId: userId
    }))
  }

  return (
    <div className='form-container'>
      <div className='form-title mb-3'>{i18n.t("Verify new Email")}</div>
      <Form
        layout="vertical"
        name="basic"
        initialValues={{ remember: true }}
        onFinish={handleChange}
      >
        <Form.Item
          name="newEmail"
          className='auth-input-container'
          style={{ marginBottom: 16 }}
          initialValue=''
          rules={[{ required: true, message: i18n.t("Please input your new Email!")}]}
        >
          <Input className='auth-input' />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 0 }}
        >
          <Button
            size='large'
            className='primary-button w-100 text-bold text-14'
            htmlType="submit"
          >
            {i18n.t("Send Link")}
          </Button>
        </Form.Item>
      </Form>
      </div>
  );
}