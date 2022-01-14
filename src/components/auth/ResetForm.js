import React, { useEffect } from "react";
//import { useHistory } from "react-router-dom";

//redux
import { useDispatch, useSelector } from "react-redux";
import { changePassword, resetMessage, showAuthModal } from '../../redux/actions'

//packages
import i18n from "i18n-js";
import { Form, Input, Button, message } from 'antd';

export default function ForgetForm(props) {
  const { setModal, userInfo } = props;

  const dispatch = useDispatch();

  const changePasswordMessage = useSelector(state => state.authData.changePasswordMessage)
  const updateMessage = useSelector(state => state.userData.updateMessage)

  const handleChange = (values) => {
    dispatch(changePassword({ ...values, userId: userInfo.userId }))
  };

  useEffect(() => {
    async function handleSuccess() {

    }

    async function handleFail() {
      await dispatch(resetMessage());
      await message.error(`Error: ${changePasswordMessage}`);
    }

    if (changePasswordMessage === null) {

    } else if (changePasswordMessage === 'success') {
      handleSuccess()
    } else {
      handleFail()
    }
  }, [dispatch, setModal, changePasswordMessage])

  useEffect(() => {
    async function handleSuccess() {
      await dispatch(resetMessage());
      await setModal(false)
      await message.success('Success');
    }

    async function handleFail() {
      await dispatch(resetMessage());
      await message.error(`Error: ${updateMessage}`);
    }

    switch (updateMessage) {
      case 'success':
        handleSuccess();
        break;
      case 'change error':
        handleFail();
        break;
      default:
        break;
    }
  }, [dispatch, updateMessage, setModal])

  return (
    <div className='form-container'>
      <div className='form-title m-5'>{i18n.t('Reset Password')}</div>
      <Form
        layout="vertical"
        name="basic"
        initialValues={{ remember: true }}
        onFinish={handleChange}
      >
        <Form.Item
          name="userPassword"
          className='auth-input-container'
          initialValue=""
          rules={[
            ({ getFieldValue }) => ({
              validator() {
                const regexLength = /(?=.{6,})/;
                const regexNumber = /(?=.*[0-9])/;
                const regexUpper = /(?=.*[A-Z])/;
                const regexLower = /(?=.*[a-z])/;
                const regexSpecial = /(?=.*[!@#$%^&*.,-])/;
                const regexSpace = /(^\S*$)/;

                if (!regexLength.test((getFieldValue('userPassword')))) {
                  return Promise.reject(new Error(i18n.t('Length should be at lease 6')));
                } else if (!regexNumber.test((getFieldValue('userPassword')))) {
                  return Promise.reject(new Error(i18n.t('Must include a number')));
                } else if (!regexUpper.test((getFieldValue('userPassword')))) {
                  return Promise.reject(new Error(i18n.t('Must include a upper letter')));
                } else if (!regexLower.test((getFieldValue('userPassword')))) {
                  return Promise.reject(new Error(i18n.t('Must include a lower letter')));
                } else if (!regexSpecial.test((getFieldValue('userPassword')))) {
                  return Promise.reject(new Error(i18n.t('Must include a specical character')));
                } else if (!regexSpace.test((getFieldValue('userPassword')))) {
                  return Promise.reject(new Error(i18n.t('Must not include space')));
                } else {
                  return Promise.resolve();
                }
              },
            }),
          ]}
        >
          <Input.Password
            className='auth-input'
            placeholder={i18n.t('Password')}
            onKeyPress={(e) => {
              const allowRegex = /^(?=.*[A-Z])|(?=.*[a-z])|(?=.*[0-9])|(?=.*[!@#$%^&*.,-])/;
              if (!allowRegex.test(e.key)) {
                e.preventDefault();
                return false;
              }
            }}
          />
        </Form.Item>

        <Form.Item
          name="reUserPassword"
          className='auth-input-container'
          initialValue=""
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('userPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(i18n.t('Password does not match')));
              },
            }),
          ]}
        >
          <Input.Password
            className='auth-input'
            placeholder={i18n.t('Confirm Password')}
            onKeyPress={(e) => {
              const allowRegex = /^(?=.*[A-Z])|(?=.*[a-z])|(?=.*[0-9])|(?=.*[!@#$%^&*.,-])/;
              if (!allowRegex.test(e.key)) {
                e.preventDefault();
                return false;
              }
            }}
          />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 12 }}
        >
          <Button
            className='primary-button w-100'
            style={{ marginBottom: 0 }}
            type='text'
            htmlType="submit"
          >
            {i18n.t('Reset Password')}
          </Button>
        </Form.Item>

        <Form.Item>
          <Button
            className='transparent-button w-100'
            type='text'
            onClick={() => dispatch(showAuthModal())}
          >
            {i18n.t('Return Login')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}