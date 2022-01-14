import React, { useState } from 'react';
//packages
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import i18n from 'i18n-js';
import { Card, Row, message, Modal, Button, Tooltip } from 'antd';
import { DeleteOutlined, StarFilled } from '@ant-design/icons';
//statics
import noAvatar from '../../../assets/img/Success-Dogy.png';
import { API_BASE_URL } from '../../../configs/AppConfig';

const DashboardMomentPreview = (props) => {
  const { data, removable, fetchMomentData, favourite } = props;
  const history = useHistory();

  const userId = localStorage.getItem('userId');

  const [likeState, setLikeState] = useState({
    liked: data.isLiked,
    likeNum: data.momentLikeNumber,
  });
  const [deleteModal, setDeleteModal] = useState(false);
  // const [likeCnt, setLikeCnt] = useState(data.momentLikeNumber);

  const handleLikeMomentClick = async () => {
    if (!userId) {
      message.error(i18n.t('Please login'));
      return;
    }
    const toSubmit = {
      userId,
      momentId: data.momentId,
    };
    const result = await axios.post(
      `${API_BASE_URL}moment/likeAction.php`,
      toSubmit
    );
    if (result.data.message === 'success') {
      if (data.isLiked) {
        //取消点赞
        message.success(i18n.t('Unlike Succeeded'));
        fetchMomentData(0);
        // setLikeState({
        //   liked: false,
        //   likeNum: likeState.likeNum - 1,
        // });
        return;
      } else {
        message.success(i18n.t('Like Succeeded'));
        fetchMomentData(0);
        // setLikeState({
        //   liked: true,
        //   likeNum: likeState.likeNum + 1,
        // });
        return;
      }
    } else {
      if (data.isLiked) {
        message.error(i18n.t('Unlike Failed'));
        return;
      } else {
        message.error(i18n.t('Like Failed'));
        return;
      }
    }
  };

  const handleDeleteMoment = async () => {
    const toDelete = {
      userId,
      momentId: data.momentId,
    };
    const result = await axios.post(
      `${API_BASE_URL}moment/deleteMoment.php`,
      toDelete
    );
    if (result.data.message === 'success') {
      fetchMomentData();
      message.success(i18n.t('Delete moment succeeded'));
    } else {
      message.error(i18n.t('Delete moment failed'));
    }
  };

  const handleRemoveSave = async () => {
    if (!userId) {
      message.error(i18n.t('Please login'));
      return;
    }

    const toRemove = {
      userId,
      targetId: data.momentId,
      targetType: 2,
    };
    const result = await axios.post(
      `${API_BASE_URL}saved/deleteSaved.php`,
      toRemove
    );
    if (result.data.message === 'success') {
      message.success(i18n.t('Unsave Succeeded'));
      fetchMomentData(0);
    } else {
      message.error(i18n.t('Unsave Failed'));
    }
  };

  return (
    <Card
      className='single-moment-container position-relative'
      cover={
        <img
          className='moment-preview-cover'
          src={data.momentImage[0]}
          alt='Pawpus'
          role='button'
          onClick={() => history.push(`/social/detail/${data.momentId}`)}
        />
      }
    >
      {removable && (
        <DeleteOutlined
          className='delete-icon'
          onClick={() => setDeleteModal(true)}
        />
      )}
      {favourite && (
        <StarFilled
          className='delete-icon color-primary'
          onClick={() => handleRemoveSave()}
        />
      )}
      <div className='moment-preview-content-wrapper py-2 px-3'>
        <p
          className='moment-preview-description p-2-lines'
          role='button'
          onClick={() => history.push(`/social/detail/${data.momentId}`)}
        >
          {data.momentTitle}
        </p>
        <Row align='bottom' justify='space-between' className='w-100 mb-3'>
          <div
            className='d-flex align-items-center w-60'
            role='button'
            // onClick={() => history.push(`/user/userInfo/${data.userId}`)}
            onClick={() => history.push(`/social/detail/${data.momentId}`)}
          >
            <img
              className='moment-author-avatar'
              src={!!data.userImage ? data.userImage : noAvatar}
              alt='Pawpus'
            />
            <span className='moment-author text-truncate'>{data.userName}</span>
          </div>
          <div
            className='d-flex align-items-center'
            role='button'
            onClick={handleLikeMomentClick}
          >
            <span className='mr-1'>{data.momentLikeNumber}</span>
            <i
              className={`fas fa-heart ${
                data.isLiked ? 'color-red' : 'color-grey-7'
              } `}
            ></i>
          </div>
        </Row>
      </div>
      {/*<div className='moment-extro-info-container'>
          <img
            className='moment-author-avatar'
            src={data.userImage}
            alt={data.userName}
          />
          <div className='moment-author'>{data.userName}</div>
          <div onClick={() => handleLikeMomentClick(item.id)}>
            {likes.includes(item.id) ? (
              <Tooltip title='取消点赞'>
                <i className='fas fa-heart moment-like'></i>
              </Tooltip>
            ) : (
              <Tooltip title='点赞'>
                <i className='far fa-heart moment-unlike'></i>
              </Tooltip>
            )}
          </div> 
          <div>
            <i className='fas fa-heart moment-like'>{data.likes}</i>
          </div>
        </div>*/}
      <Modal
        visible={deleteModal}
        footer={null}
        closable={false}
        maskClosable={true}
        onCancel={() => setDeleteModal(false)}
        width={500}
        bodyStyle={{
          borderRadius: '8px',
        }}
      >
        <div className='w-100'>
          <div className='w-40 m-auto text-center'>
            <img src={noAvatar} alt='Pawpus' className='w-100 m-auto' />
            <p className='text-20 color-grey-servicePrice mb-1'>
              {i18n.t('Attention')}
            </p>
            <p className='text-14 color-grey-servicePrice mb-1'>
              {i18n.t('Confirm deletion')}
            </p>
          </div>
          <Row
            justify='space-between'
            align='middle'
            className='w-80 m-auto py-3'
          >
            <Button
              type='text'
              className='text-normal text-20'
              onClick={() => setDeleteModal(false)}
            >
              {i18n.t('Cancel')}
            </Button>
            <Button
              className='text-normal text-22 color-button-title loadmore-button w-30'
              onClick={() => handleDeleteMoment()}
            >
              {i18n.t('Confirm')}
            </Button>
          </Row>
        </div>
      </Modal>
    </Card>
  );
};

export default DashboardMomentPreview;
