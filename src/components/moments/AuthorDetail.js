import React, { useState, useEffect } from "react";
//packages
import { withRouter } from "react-router-dom";
import i18n from "i18n-js";
import axios from "axios";
//components
import { List, Button, Row, Col } from "antd";
import { API_BASE_URL } from "../../configs/AppConfig";
import noAvatar from "../../assets/img/Success-Dogy.png";

const AuthorDetail = (props) => {
  const { history, momentDetail } = props;
  const [momentList, setMomentList] = useState({
    initLoading: true,
    loading: false,
    data: [],
    list: [],
    noMore: false,
  });

  useEffect(() => {
    getAuthorMoments();
  }, []);

  const getAuthorMoments = async () => {
    const { data } = await axios.get(
      `${API_BASE_URL}moment/getMoment.php?userId=${momentDetail.userId}`
    );

    setMomentList({
      ...momentList,
      initLoading: false,
      data: data.data,
    });
  };

  const onLoadMore = async () => {
    const offset = momentList.data.length;
    setMomentList({
      ...momentList,
      loading: true,
    });
    const { data } = await axios.get(
      `${API_BASE_URL}moment/getMoment.php?userId=${momentDetail.userId}&offset=${offset}`
    );

    if (data.data.length === 0) {
      setMomentList({
        ...momentList,
        loading: false,
        noMore: true,
      });
    } else {
      setMomentList({
        ...momentList,
        loading: false,
        data: [...momentList.data, ...data.data],
      });
    }
  };

  return (
    <div className="w-100">
      {/* 作者资料 */}
      <div className="py-3 px-4 white-background border-radius-8">
        <div className="moment-author-profile position-relative">
          <Row>
            <span className="text-normal text-14 color-grey-typeAnimal">
              {i18n.t("Author")}
            </span>
          </Row>

          <Row className="pt-3">
            <div className="author-avatar">
              <img
                src={
                  !momentDetail.userImage ? noAvatar : momentDetail.userImage
                }
                alt={momentDetail.userName}
              />
            </div>
            <div className="w-50">
              <p className="text-bold text-14 text-truncate color-grey-typeAnimal mb-0">
                {momentDetail.userName}
              </p>
              <span className="text-normal text-12 color-grey-typeAnimal text-truncate">
                {momentDetail.userDescription}
              </span>
            </div>
          </Row>
          <div className="view-profile-button">
            <Button
              className="text-bold text-14 view-profile-button text-truncate px-3"
              onClick={() =>
                history.push(`/user/userInfo/${momentDetail.userId}`)
              }
            >
              {i18n.t("View Profile")}
            </Button>
          </div>
        </div>
      </div>
      {/* 更多朋友圈 */}
      {momentList.data.length > 0 && (
        <Row className="mt-3">
          <div className="w-100 pt-2 px-3 white-background border-radius-8">
            <span className="text-normal text-14 color-grey-typeAnimal w-100 d-inline-block text-truncate">
              {i18n.t("More moments")}
            </span>
            <div>
              <List
                className="loadmore-list"
                loading={momentList.initLoading || momentList.loading}
                loadMore={
                  <Row className="my-2" justify="center">
                    <Button
                      type="text"
                      className="color-grey-8 text-normal text-20"
                      onClick={() => onLoadMore()}
                      loading={momentList.initLoading || momentList.loading}
                      disabled={momentList.noMore}
                    >
                      {i18n.t(momentList.noMore ? "No More" : "Load More")}
                    </Button>
                  </Row>
                }
                dataSource={momentList.data}
                renderItem={(item) => {
                  console.log("this is item", item);
                  return (
                    <List.Item
                      // actions={[
                      //   <a key='list-loadmore-edit'>edit</a>,
                      //   <a key='list-loadmore-more'>more</a>,
                      // ]}
                      role="button"
                      onClick={() =>
                        history.push(`/social/detail/${item.momentId}`)
                      }
                    >
                      <Row className="w-100">
                        <div className="moment-cover-image">
                          <img src={item.momentImage[0]} alt="Pawpus" />
                        </div>
                        <div className="moment-detail d-flex flex-column justify-content-between">
                          <p className="text-bold text-16 color-grey-typeAnimal mb-0">
                            {item.momentTitle}
                          </p>
                          <div className="w-100 color-grey-typeAnimal d-flex align-items-center">
                            <p className="w-80 text-14 text-truncate mb-0">
                              {`${item.createTime}`}
                            </p>
                            <p className="mb-0 ml-1">
                              <i className="fas fa-heart color-grey-typeAnimal text-16">
                                <span className="ml-1">
                                  {item.momentLikeNumber}
                                </span>
                              </i>
                            </p>
                          </div>
                        </div>
                      </Row>
                    </List.Item>
                  );
                }}
              />
            </div>
          </div>
        </Row>
      )}
    </div>
  );
};

export default withRouter(AuthorDetail);
