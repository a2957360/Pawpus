import React, { useState, useEffect } from 'react';
//components
import Breadcrumb from '../../components/layout/Breadcrumb';
import { Input, Typography, Button, Upload, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Carousel } from 'react-bootstrap';
import Loading from '../../components/loading/LoadingView';
//packages
import i18n from 'i18n-js';
import Compressor from 'compressorjs';
import axios from 'axios';
import { API_BASE_URL } from '../../configs/AppConfig';
//redux
import { useSelector, useDispatch } from 'react-redux';
import { getUserInfo } from '../../redux/actions';

const PublishPost = (props) => {
  const userId = localStorage.getItem('userId');
  const { history } = props;

  const [newMoment, setNewMoment] = useState({
    title: '',
    content: '',
    images: [],
  });

  const [preview, setPreview] = useState({
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      message.warn(i18n.t('Please login'));
      history.goBack();
    }
  }, []);

  const handleImageUpload = (file) => {
    new Compressor(file, {
      quality: 0.2,
      convertSize: 30000000,
      success(result) {
        const formData = new FormData();
        formData.append('uploadImages', result, result.name);
        formData.append('isUploadImage', '1');
        axios.post(`${API_BASE_URL}imageModule.php`, formData).then((res) => {
          if (res.data.message === 'success') {
            const temp = newMoment.images;
            temp.push({
              uid: Date.now(),
              status: 'done',
              name: result.name,
              url: res.data.data[0],
            });
            setNewMoment({
              ...newMoment,
              images: temp,
            });
          } else {
            console.log('Upload failed');
          }
        });
      },
      error(err) {
        message.error(i18n.t('Compress Failed'));
        console.log('compress failed', err.message);
      },
    });
  };

  const handleChange = (info) => {
    // const { file, fileList } = info;
    // if (file.status === "done") {
    //   message.success(`${file.name} file uploaded successfully.`);
    // } else if (file.status === "error") {
    //   message.error(`${file.name} file upload failed.`);
    // }
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
      const temp = newMoment.images;
      setNewMoment({
        ...newMoment,
        images: temp.filter((img) => img.url !== file.url),
      });
      return true;
    } else {
      return false;
    }
  };

  const handleCancel = () => {
    setPreview({
      previewVisible: false,
      previewImage: '',
      previewTitle: '',
    });
  };

  const handlePreview = async (file) => {
    // if (!file.url && !file.preview) {
    //   file.preview = await getBase64(file.originFileObj);
    // }
    setPreview({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  const handlePublish = async () => {
    if (!newMoment.title) {
      message.error(i18n.t('No Moment Title'));
      // message.error({
      //   content: i18n.t("No Moment Title"),
      //   className: "popup-message",
      // });
      return;
    } else if (!newMoment.content) {
      message.error(i18n.t('No Moment Content'));
      // message.error({
      //   content: i18n.t("No Moment Content"),
      //   className: "popup-message",
      // });
      return;
    } else if (newMoment.images.length === 0) {
      message.error(i18n.t('No Moment Image'));
      // message.error({
      //   content: i18n.t("No Moment Image"),
      //   className: "popup-message",
      // });
      return;
    }

    const toPublish = {
      userId,
      momentImage: newMoment.images.map((img) => img.url),
      momentTitle: newMoment.title,
      momentContent: newMoment.content,
    };

    setLoading(true);
    const { data } = await axios.post(
      `${API_BASE_URL}moment/addMoment.php`,
      toPublish
    );
    if (data.message === 'success') {
      message.success(i18n.t('Publish success'));
      // message.success({
      //   content: i18n.t("Publish success"),
      //   className: "popup-message",
      // });
      setLoading(false);
      history.push('/social/list');
    } else {
      setLoading(false);
      message.error(i18n.t('Publish failed'));
      // message.error({
      //   content: i18n.t("Publish failed"),
      //   className: "popup-message",
      // });
    }
  };

  const handleReturn = async () => {
    const toDelete = {
      deleteImages: newMoment.images.map((img) => img.url),
    };
    history.push('/social/list');
    await axios.post(`${API_BASE_URL}imageModule.php`, toDelete);
    setNewMoment({
      title: '',
      content: '',
      images: [],
    });
  };

  if (loading || !userId) {
    return <Loading />;
  } else {
    return (
      <div className='moment-detail-container d-flex justify-content-center'>
        <div className='responsive-container w-60'>
          <Breadcrumb
            breadcrumbList={[
              {
                url: '/social/list',
                title: '朋友圈',
              },
              {
                url: '',
                title: '发布',
              },
            ]}
          />

          <div className='d-flex flex-row w-100 justify-content-center px-3 my-5'>
            {/* 上传图片 */}
            <div className='w-40 pr-5'>
              <Typography.Title level={3}>
                {i18n.t('Upload Images')}
              </Typography.Title>
              <Typography.Title level={5}>
                {i18n.t('Please upload your images')}
              </Typography.Title>
              {newMoment.images.length === 0 ? (
                <Upload.Dragger
                  accept='image/*'
                  multiple
                  showUploadList={false}
                  fileList={newMoment.images}
                  listType='picture-card'
                  action={handleImageUpload}
                  onPreview={handlePreview}
                  onChange={handleChange}
                  onRemove={handleRemove}
                >
                  <p className='ant-upload-drag-icon'>
                    <i className='fas fa-image upload-icon'></i>
                  </p>
                  <p className='ant-upload-text'>
                    {i18n.t('Upload more images')}
                  </p>
                </Upload.Dragger>
              ) : (
                <>
                  <Carousel fade id='image-gallery'>
                    {newMoment.images.map((img, index) => (
                      <Carousel.Item
                        key={index}
                        className='image-gallery-wrapper'
                      >
                        <img
                          className='d-block moment-image'
                          src={img.url}
                          alt={img.name}
                        />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                  <Upload
                    multiple
                    accept='image/*'
                    action={handleImageUpload}
                    listType='picture-card'
                    fileList={newMoment.images}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    onRemove={handleRemove}
                  >
                    {newMoment.images.length >= 8 ? null : (
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>{i18n.t('Upload')}</div>
                      </div>
                    )}
                  </Upload>
                  <Modal
                    visible={preview.previewVisible}
                    title={preview.previewTitle}
                    footer={null}
                    onCancel={handleCancel}
                  >
                    <img
                      alt={preview.previewTitle}
                      style={{ width: '100%' }}
                      src={preview.previewImage}
                    />
                  </Modal>
                </>
              )}
            </div>

            {/* 朋友圈文字输入 */}
            <div className='w-60 textarea-container'>
              <Typography.Title level={3}>
                {i18n.t('Draft Moment Title')}
              </Typography.Title>
              <Typography.Title level={5}>
                {i18n.t('Draft Title')}
              </Typography.Title>

              <Input
                className='text-input text-input--grey w-50 my-2'
                size='large'
                value={newMoment.title}
                placeholder={i18n.t('Moment Title')}
                onChange={(e) =>
                  setNewMoment({ ...newMoment, title: e.target.value })
                }
              />

              <Input.TextArea
                className='text-input text-input--grey my-3'
                rows={15}
                placeholder={i18n.t('Moment Body')}
                value={newMoment.content}
                onChange={(e) =>
                  setNewMoment({ ...newMoment, content: e.target.value })
                }
              />
              <div className='d-flex align-items-center justify-content-end'>
                <span role='button' className='mx-4 ' onClick={handleReturn}>
                  <u>{i18n.t('Return')}</u>
                </span>
                <div>
                  <Button
                    className='submit-button'
                    onClick={() => handlePublish()}
                  >
                    {i18n.t('Post Now')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default PublishPost;
