import React, { useEffect, useState } from "react";
//import { useHistory } from 'react-router-dom';

//redux
import { useDispatch, useSelector } from "react-redux";
import { loginUser, resetMessage } from '../../redux/actions'

//packages
import i18n from "i18n-js";
import { Form, Input, Button, message, Divider } from 'antd';

export default function LoginForm(props) {
  const { setModal, changeLayout } = props;

  const dispatch = useDispatch();

  const [buttonLoading, setButtonLoading] = useState(false)

  const { errorCode, loginMessage } = useSelector(state => state.authData)

  const handleLogin = async (values) => {
    await setButtonLoading(true)
    await dispatch(loginUser(values))
  };

  useEffect(() => {
    const handleMessage = async () => {
      if (loginMessage === "success") {
        await setModal(false)
      } else {
        await message.error(`${i18n.t(JSON.stringify(errorCode))}`);

        if (errorCode === 103) { //账号尚未激活特殊处理，change layout
          await changeLayout(4);
        }
      }
    }

    const handleReset = async () => {
      await setButtonLoading(false);
      await dispatch(resetMessage());
    }

    if (loginMessage !== null) {
      handleMessage();
      handleReset();
    }
  }, [dispatch, changeLayout, setModal, errorCode, loginMessage])

  return (
    <Form
      layout="vertical"
      name="basic"
      className='form-wrapper'
      initialValues={{ remember: true }}
      onFinish={handleLogin}
    >
      <Form.Item
        name="userEmail"
        className='auth-input-container'
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
        style={{ marginBottom: 6 }}
      >
        <Button
          className='primary-button w-100 text-bold text-14 text-grey-8'
          size='large'
          type='text'
          htmlType="submit"
          loading={buttonLoading}
        >
          {/* {buttonLoading ? null : '登录'} */}
          {i18n.t("Login")}
        </Button>
      </Form.Item>

      <Form.Item
        style={{ marginBottom: 0 }}
      >
        <Button
          className='transparent-button w-100 text-14 text-grey-8'
          type='text'
          onClick={() => changeLayout(2)}
        >
          {i18n.t("Forget Password")}
        </Button>
      </Form.Item>

      <Divider
        style={{ marginTop: 8, marginBottom: 8 }}
      />

      <Form.Item
        style={{ marginBottom: 0 }}
      >
        <Button
          size='large'
          className='white-button w-100 text-bold text-14 text-grey-8'
          onClick={() => changeLayout(1)}
        >
          {i18n.t("Sign Up")}
        </Button>
      </Form.Item>
    </Form>
  );
}