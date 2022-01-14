import React, { useEffect, useState } from "react";

//redux
import { useDispatch, useSelector } from "react-redux";
import { sendChangeEmail, resetMessage, sendVerificationCode, checkVerificationCode } from '../../redux/actions';

//packages
import i18n from "i18n-js";
import { Form, Input, Button, message, Row, Col } from 'antd';

export default function ChangePhoneForm(props) {
  const { setModal, userId } = props;

  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const {
    sendCodeMessage,
    checkCodeMessage
  } = useSelector(state => state.authData)

  useEffect(() => {
    async function handleSuccess() {
      await dispatch(resetMessage());
      await message.success(`验证码发送成功！`);
    }

    async function handleFail() {
      await dispatch(resetMessage());
      await message.error(`Error: ${sendCodeMessage}`);
    }

    if (sendCodeMessage === null) {

    } else if (sendCodeMessage === 'success') {
      handleSuccess()
    } else {
      handleFail()
    }

  }, [dispatch, sendCodeMessage])

  useEffect(() => {
    async function handleSuccess() {
      await dispatch(resetMessage());
      await setModal(false)
      await message.success(`验证成功！`);
    }

    async function handleFail() {
      await dispatch(resetMessage());
      await message.error(`Error: ${checkCodeMessage}`);
    }

    if (checkCodeMessage === null) {

    } else if (checkCodeMessage === 'success') {
      handleSuccess()
    } else {
      handleFail()
    }

  }, [dispatch, setModal, checkCodeMessage])

  const handleSend = async () => {
    await dispatch(sendVerificationCode(form.getFieldValue('userPhone')))
  }

  const handleVerify = async () => {
    const values = form.getFieldsValue();
    await dispatch(checkVerificationCode({
      ...values,
      userId: userId
    }))
  }

  return (
    <div className='form-container'>
      <div className='form-title mb-4'>{i18n.t("Verify new phone")}</div>
      <Form
        form={form}
        layout="vertical"
        name="basic"
        initialValues={{ remember: true }}
      >
        <Form.Item
          name="userPhone"
          className='auth-input-container margin-bottom-16'
          initialValue=''
          rules={[{ required: true, message: 'Please input your phone!' }]}
        >
          <Row>
            <Col span={14}>
              <Input className='auth-input' />
            </Col>

            <Col span={10}>
              <Button
                size='large'
                className='primary-button w-100 h-100 text-bold text-14'
                onClick={() => handleSend()}
              >
                {i18n.t("Send Verification Code")}
              </Button>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item
          name="verificationCode"
          className='auth-input-container margin-bottom-16'
          initialValue=''
          rules={[{ required: true, message:  i18n.t("Please input code!") }]}
        >
          <Input className='auth-input' />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 0 }}
        >
          <Button
            size='large'
            className='primary-button w-100 text-bold text-14'
            onClick={() => handleVerify()}
          >
            {i18n.t("Verify")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}