import { Button } from "antd";
import I18n from "i18n-js";

import { useHistory } from "react-router-dom";

const HelpDetail = (props) => {
  const history = useHistory();
  const language = localStorage.getItem("language");
  const { state } = props.location;

  if (!history.location.state) {
    history.push("*");
    return null;
  }

  return (
    <div className="help-detail-wrapper">
      <div className="inner-container margin-top-30">
        {/* title */}
        <span className="title-font margin-top-30 margin-bottom-20">
          {state.postTitle[language]}
        </span>
        <div
          className="content-font margin-bottom-30"
          dangerouslySetInnerHTML={{
            __html: state.postContent,
          }}
        />
        {/* <span className="content-font margin-bottom-large-space">content</span> */}
        <div className="button-row">
          <Button
            onClick={() => history.push("/")}
            className="primary-button width-300"
          >
            {I18n.t("Return Home")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HelpDetail;
