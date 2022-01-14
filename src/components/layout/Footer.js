import React, { useEffect } from "react";
import { APP_NAME } from "../../configs/AppConfig";
import i18n from "i18n-js";

import { useHistory } from "react-router-dom";

import { Row, Col } from "antd";

import RouterLoading from "../../components/loading/RouterLoading";

//redux
import { useDispatch, useSelector } from "react-redux";
import { getPost } from "../../redux/actions";

function Footer() {
  const history = useHistory();
  const dispatch = useDispatch();
  const language = localStorage.getItem("language");
  const { postList } = useSelector((state) => state.userData);

  useEffect(() => {
    dispatch(getPost());
  }, []);

  if (!postList) {
    return <RouterLoading />;
  }

  const renderTitle = postList.map((post, index) => {
    return (
      <Col
        xs={24}
        sm={24}
        md={Math.floor(24 / postList.length)}
        lg={Math.floor(24 / postList.length)}
        key={index}
        className="text-center"
      >
        <span
          onClick={() =>
            history.push({
              pathname: "/user/help/detail",
              state: post,
            })
          }
          className="footer-title span-mouse-click"
        >
          {post.postTitle[language]}
        </span>
      </Col>
    );
  });
  return (
    <div className="footer-main-container">
      <div className="footer-inner-container">
        {/* 链接 */}

        <Row className="w-100 mb-3">{renderTitle}</Row>

        {/* 描述文字 */}
        <div className="footer-detail-container">
          <span className="detail-message text-center">
            {i18n.t("footerMessage")}
          </span>
        </div>
        {/* Copyright */}
        <div className="footer-copyright-container">
          Copyright &copy; {`${new Date().getFullYear()}`} {`${APP_NAME}`} All
          rights reserved.
        </div>
      </div>
    </div>
  );
}

export default Footer;
