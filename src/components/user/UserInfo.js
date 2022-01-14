import { Avatar, Button } from "antd";
// import { UserOutlined } from "@ant-design/icons";

// import stateNew from "../../assets/img/service/state-new.png";
import stateVIP from "../../assets/img/service/state-vip.png";

import i18n from "i18n-js";

import { useHistory } from "react-router-dom";

const UserInfo = ({
  buttonShown,
  url,
  name,
  subTitle,
  isCertifyServer,
  userId,
}) => {
  const history = useHistory();

  return (
    <div className="userInfo-main-container pl-3">
      {/* 头像 名字 时间 */}
      {buttonShown && (
        <div className="d-flex justify-content-between align-items-center">
          <div className="poster">{i18n.t("Author")}</div>
          <Button
            onClick={() => history.push(`/user/userinfo/${userId}`)}
            className="transparent-button"
          >
            {i18n.t("View Profile")}
          </Button>
        </div>
      )}

      <div className="userInfo-content">
        <div className="avatar-box">
          <Avatar
            className="user-avatar"
            icon={<img src={url} alt="user-avatar" className="image-size" />}
          />
          <img className="state-image" src={stateVIP} alt="" />
        </div>
        <div>
          <div className="text-16 text-grey-1 text-bold">
            {name}
            {isCertifyServer && (
              <span className="certified-seller">
                ({i18n.t("Certified Provider")})
              </span>
            )}
          </div>
          <div className="user-subtitle">{subTitle}</div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
