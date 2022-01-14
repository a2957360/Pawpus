import React, { useEffect } from "react";

//redux
import { useDispatch, useSelector } from "react-redux";
import { registerUser, resetMessage } from "../../redux/actions";

//packages
import i18n from "i18n-js";
import { Form, Input, Button, message, Divider } from 'antd';

export default function RegisterForm(props) {
  const { changeLayout } = props;

  const dispatch = useDispatch();

  const { errorCode, registerMessage } = useSelector(state => state.authData)

  useEffect(() => {
    // async function handleSuccess() {
    //   await changeLayout(4)
    //   await dispatch(resetMessage());
    // }

    // async function handleFail() {
    //   await dispatch(resetMessage());
    //   await message.error(`Error: ${registerMessage}`);
    // }

    // if (registerMessage === null) {

    // } else if (registerMessage === 'success') {
    //   handleSuccess()
    // } else {
    //   handleFail()
    // }

    const handleMessage = async () => {
      if (registerMessage === "success") {
        await changeLayout(4)
        await dispatch(resetMessage());
      } else {
        await message.error(`${i18n.t(JSON.stringify(errorCode))}`);

        if (errorCode === 103) { //账号尚未激活特殊处理，change layout
          await changeLayout(4);
        }
      }
    }

    const handleReset = async () => {
      await dispatch(resetMessage());
    }

    if (registerMessage !== null) {
      handleMessage();
      handleReset();
    }

    console.log(errorCode, registerMessage)
  }, [dispatch, changeLayout, errorCode, registerMessage])

  const handleRegister = async (values) => {
    await dispatch(registerUser(values))
  };

  return (
    <Form
      layout="vertical"
      name="basic"
      className='form-wrapper'
      initialValues={{ remember: true }}
      onFinish={handleRegister}
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

      <Divider
        style={{ marginTop: 0, marginBottom: 8 }}
      />

      <Form.Item
        style={{ marginBottom: 4 }}
      >
        <Button
          className='primary-button w-100 text-bold text-14 text-grey-8'
          type='text'
          htmlType="submit"
          size='large'
        >
          {i18n.t("Sign Up")}
        </Button>
      </Form.Item>

      <Form.Item>
        <Button
          className='transparent-button w-100 text-14 text-grey-8'
          type='text'
          onClick={() => changeLayout(0)}
        >
          {i18n.t("Return Login")}
        </Button>
      </Form.Item>
    </Form>
  );
}