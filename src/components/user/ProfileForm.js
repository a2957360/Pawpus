import React, { useEffect, useState } from 'react';

//redux
import { useDispatch, useSelector } from 'react-redux';
import { updateUserInfo, resetMessage } from '../../redux/actions';

//packages
import i18n from 'i18n-js';
import axios from 'axios';
import { API_BASE_URL } from '../../configs/AppConfig';
import Compressor from 'compressorjs';
import { Form, Input, Button, Upload, message } from 'antd';

export default function ProfileForm(props) {
  const { setModal, data } = props;

  const { userId, userName, userImage } = data;

  const dispatch = useDispatch();

  const [userInfo, setUserInfo] = useState({
    userId: userId,
    userName: userName,
    userImage: userImage,
  });

  const updateMessage = useSelector((state) => state.userData.updateMessage);

  useEffect(() => {
    async function handleSuccess() {
      await dispatch(resetMessage());
      await setModal(false);
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
  }, [dispatch, updateMessage, setModal]);

  const handleImageUpload = async (file) => {
    await handleRemove(userInfo.userImage);
    await handleUpload(file);
  };

  const handleUpload = (file) => {
    new Compressor(file, {
      quality: 0.2,
      convertSize: 30000000,
      success(result) {
        const formData = new FormData();
        formData.append('uploadImages', result, result.name);
        formData.append('isUploadImage', '1');
        axios.post(`${API_BASE_URL}imageModule.php`, formData).then((res) => {
          if (res.data.message === 'success') {
            setUserInfo({
              ...userInfo,
              userImage: res.data.data[0],
            });
          } else {
            console.log('Upload failed');
          }
        });
      },
      error(err) {
        console.log('compress failed', err.message);
      },
    });
  };

  const handleRemove = async (file) => {
    const toDelete = {
      deleteImages: [file.url],
    };
    const { data } = await axios.post(
      `${API_BASE_URL}imageModule.php`,
      toDelete
    );

    if (data.message === 'success') {
      return true;
    } else {
      return false;
    }
  };

  const handleUpdate = async (values) => {
    const { userName } = values;

    await setUserInfo({
      ...userInfo,
      userName: userName,
    });

    await dispatch(updateUserInfo(userInfo));
  };

  return (
    <Form
      layout='vertical'
      name='basic'
      initialValues={{ remember: true }}
      onFinish={handleUpdate}
    >
      <div className='avatar-upload-container'>
        <Upload
          accept='image/*'
          name='avatar'
          className='avatar-upload'
          listType='picture-card'
          showUploadList={false}
          action={handleImageUpload}
        >
          {userInfo.userImage ? (
            <>
              <img
                src={userInfo.userImage}
                className='avatar-preview-image'
                alt='avatar'
              />
            </>
          ) : (
            <div style={{ marginTop: 8 }}>{i18n.t('Upload')}</div>
          )}
        </Upload>

        {userInfo.userImage ? (
          <div className='avatar-upload-text'>
            {i18n.t('Click Image to Upload Again')}
          </div>
        ) : null}
      </div>

      <Form.Item
        name='userName'
        className='auth-input-container'
        style={{ marginBottom: 16 }}
        initialValue={userInfo.userName}
        rules={[
          { required: true, message: i18n.t('Please input your username!') },
        ]}
      >
        <Input
          onChange={(e) =>
            setUserInfo({ ...userInfo, userName: e.target.value })
          }
          className='auth-input'
        />
      </Form.Item>

      <Form.Item style={{ marginBottom: 0 }}>
        <Button
          size='large'
          className='primary-button w-100 text-bold text-14'
          htmlType='submit'
        >
          {i18n.t('Save')}
        </Button>
      </Form.Item>
    </Form>
  );
}
