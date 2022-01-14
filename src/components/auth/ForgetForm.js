import React, { useEffect } from "react";

//redux
import { useDispatch, useSelector } from "react-redux";
import { sendResetPassword, resetMessage } from '../../redux/actions'

//packages
import i18n from "i18n-js";
import { Form, Input, Button, Divider, message } from 'antd';

export default function ForgetForm(props) {
  const { changeLayout } = props;

  const dispatch = useDispatch();

  const sendEmailMessage = useSelector(state => state.authData.sendEmailMessage)

  const handleReset = (values) => {
    const { userEmail } = values;
    dispatch(sendResetPassword(userEmail))
  };

  useEffect(() => {
    async function handleSuccess() {
      await dispatch(resetMessage());
      await changeLayout(3)
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
  }, [dispatch, changeLayout, sendEmailMessage])

  return (
    <Form
      layout="vertical"
      name="basic"
      className='form-wrapper'
      initialValues={{ remember: true }}
      onFinish={handleReset}
    >
      <Form.Item
        name="userEmail"
        className='auth-input-container'
        style={{ minHeight: 140 }}
        initialValue=""
        rules={[
          {
            required: true,
            message: i18n.t('Please input your email')
          },
          {
            type: 'email',
            message: i18n.t('The input is not valid E-mail'),
          }
        ]}
      >
        <Input className='auth-input' placeholder={i18n.t('E-mail')} />
      </Form.Item>

      <Divider
        style={{ marginBottom: 16 }}
      />

      <Form.Item
        style={{ marginBottom: 4 }}
      >
        <Button
          className='primary-button w-100 text-bold text-14 text-grey-8'
          size='large'
          type='text'
          htmlType="submit"
        >
          {i18n.t('Reset Password')}
        </Button>
      </Form.Item>

      <Form.Item
        style={{ marginBottom: 0 }}
      >
        <Button
          className='transparent-button w-100 text-14 text-grey-8'
          type='text'
          onClick={() => changeLayout(0)}
        >
          {i18n.t('Return Login')}
        </Button>
      </Form.Item>
    </Form>
  );
}