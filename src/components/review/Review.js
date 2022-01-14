import { Avatar, Rate } from "antd";
import { UserOutlined } from "@ant-design/icons";
import I18n from "i18n-js";

const Review = ({ name, time, content, reviewStar, avatarUrl }) => {
  return (
    <div className="review-main-container">
      {/* 头像 名字 时间 */}
      <div className="review-userInfo-container">
        <div className="review-user-avatar">
          <Avatar
            size="large"
            icon={
              // avatarUrl.includes("http") ? (
              <img src={avatarUrl} alt="avtar" />
              // ) : (
              //   <UserOutlined />
              // )
            }
          />
        </div>
        <div className="review-name-postTime ml-3">
          <div className="user-name">{name}</div>
          <div className="time content-paragraph">
            <span>{I18n.t("Posted at")} </span>
            <span>{time}</span>
          </div>
        </div>
      </div>

      {/* 内容 评级 */}
      <div className="review-content">
        <div className="content-paragraph">{content}</div>
        <Rate value={reviewStar} disabled={true} />
      </div>
    </div>
  );
};

export default Review;
