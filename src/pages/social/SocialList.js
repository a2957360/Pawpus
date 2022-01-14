import React, { useState, useEffect } from 'react';
//components
import { Button, Row, Col, message } from 'antd';
import LoadingView from '../../components/loading/LoadingView';
import { LoadingOutlined } from '@ant-design/icons';
import SingleMomentPreview from '../../components/moments/SingleMomentPreview';
import Masonry from 'react-masonry-css';
//redux
import { useSelector, useDispatch } from 'react-redux';
import { getMomentData, loadMoreMomentData } from '../../redux/actions/moment';
//packages
import { useHistory } from 'react-router-dom';
import i18n from 'i18n-js';
import axios from 'axios';
//statics
import noAvatar from '../../assets/img/Success-Dogy.png';
import { API_BASE_URL, breakpointColumnsObj } from '../../configs/AppConfig';

const SocialList = () => {
  const history = useHistory();
  const userId = localStorage.getItem('userId');
  const dispatch = useDispatch();

  const { momentList, loading, loadMore, offset, momentListMessage } =
    useSelector((state) => state.momentData);

  const [liked, setLiked] = useState(null);

  useEffect(() => {
    dispatch(getMomentData(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    initMomentList();
  }, [momentList]);

  // const handleLikeMomentClick = async (momentId) => {
  //   if (!userId) {
  //     message.error(i18n.t('Please login'));
  //     return;
  //   }
  //   let temp = [];
  //   const { data } = await axios.post(`${API_BASE_URL}moment/likeAction.php`, {
  //     userId,
  //     momentId,
  //   });
  //   if (data.message === 'success') {
  //     if (liked.includes(momentId)) {
  //       //取消点赞
  //       temp = liked.filter((id) => id !== momentId);
  //       setLiked(temp);
  //       message.success(i18n.t('Unlike Succeeded'));
  //     } else {
  //       temp = [...liked, momentId];
  //       setLiked(temp);
  //       message.success(i18n.t('Like Succeeded'));
  //     }
  //   } else {
  //     if (liked.includes(momentId)) {
  //       message.error(i18n.t('Unlike Failed'));
  //     } else {
  //       message.error(i18n.t('Like Failed'));
  //     }
  //   }
  // };

  const initMomentList = () => {
    if (momentList.length === 0) {
      return;
    }
    const likedIds = momentList
      .filter((moment) => moment.isLiked)
      .map((moment) => moment.momentId);
    setLiked(likedIds);
  };

  const handleLoadMore = () => {
    dispatch(loadMoreMomentData(offset, userId));
  };

  if (!momentList || loading || !liked) {
    return (
      <div className='w-100 page-background border border-3'>
        <LoadingView />
      </div>
    );
  } else {
    return (
      <Row justify='center' className='w-100 page-background pt-4'>
        <Col className='responsive-container page-background mb-5'>
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className='social-list-wrapper'
            columnClassName='social-list-column'
          >
            {momentList.map((moment) => (
              <SingleMomentPreview
                key={moment.momentId}
                data={moment}
                removable={false}
                // handleLikeMomentClick={handleLikeMomentClick}
              />
            ))}
          </Masonry>
        </Col>

        <div className='w-100 text-center'>
          <Button
            className='text-normal text-16 color-button-title loadmore-button'
            onClick={() => handleLoadMore()}
            icon={loadMore ? <LoadingOutlined /> : null}
            loading={loadMore}
            disabled={momentListMessage === 'end'}
          >
            {momentListMessage === 'end'
              ? i18n.t('No More')
              : i18n.t('Load More')}
          </Button>
        </div>
        <div
          className='publish-post-button'
          onClick={() => history.push('/social/publish')}
        >
          <i className='fas fa-camera'></i>
        </div>
      </Row>
    );
  }
};

export default SocialList;
