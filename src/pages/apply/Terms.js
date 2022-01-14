import React, { useEffect } from "react";

import { Button, message } from "antd";

import { useHistory } from "react-router-dom";

import RouterLoading from "../../components/loading/RouterLoading";

//redux
import { useDispatch, useSelector } from "react-redux";
import { getPostByType } from "../../redux/actions";
import I18n from "i18n-js";

const Terms = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const language = localStorage.getItem("language");
  const userId = localStorage.getItem("userId");

  const { postListByType } = useSelector((state) => state.userData);

  useEffect(() => {
    dispatch(getPostByType("2"));
  }, []);

  if (!userId) {
    message.error(I18n.t("Please login"));
    history.push("/");
  }

  if (!postListByType) {
    return <RouterLoading />;
  }

  return (
    <div className="terms-wrapper">
      <div className="terms-inner-container">
        <div className="terms-content-button-container">
          {/* content */}
          <div className="terms-content-container margin-bottom-30">
            {/* title */}
            <div className="title $font-size-25">
              {I18n.t("Service Application Policy")}
            </div>

            <div className="agreement-title $font-size-18 ">
              {postListByType[0].postTitle[language]}
            </div>
            {/* detail */}

            <div
              className="detail"
              dangerouslySetInnerHTML={{
                __html: postListByType[0].postContent,
              }}
            />
          </div>

          {/* agree button  */}
          <div className="agree-button">
            <Button
              onClick={() =>
                history.push({
                  pathname: "/serviceapply/applicant",
                })
              }
              size={"large"}
              className="primary-button"
            >
              {I18n.t("Agree with the policy above and continue")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
