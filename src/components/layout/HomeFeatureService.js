import React from "react";
//packages
import { withRouter } from "react-router-dom";
import i18n from "i18n-js";
import { Row } from "antd";
import Carousel from "react-elastic-carousel";

//components
import SingleServicePreview from "../service/SingleServicePreview";

// import Carousel from "react-bootstrap/Carousel";
// import Carousel from "react-elastic-carousel";

const listWrapperLayout = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 12 },
  lg: { span: 6 },
};

// const carouselBreakPoints = [
//   { width: 1, itemsToShow: 1, itemsToScroll: 1 },
//   { width: 550, itemsToShow: 2, itemsToScroll: 1 },
//   { width: 768, itemsToShow: 2, itemsToScroll: 1 },
//   { width: 1200, itemsToShow: 4, itemsToScroll: 1 },
// ];

const carouselBreakPoints = [
  { width: 1, itemsToShow: 1, itemsToScroll: 1 },
  { width: 380, itemsToShow: 1, itemsToScroll: 1 },
  { width: 550, itemsToShow: 2, itemsToScroll: 1 },
  // { width: 1024, itemsToShow: 3, itemsToScroll: 1 },
  { width: 768, itemsToShow: 3, itemsToScroll: 1 },
  { width: 1200, itemsToShow: 4, itemsToScroll: 1 },
];
const HomeFeatureService = (props) => {
  const { componentContent, history } = props;
  const language = localStorage.getItem("language");

  return (
    <div className="home-grid-wrapper m-auto">
      <Row justify="space-between" className="home-grid-title px-3">
        <span className="text-bold text-20 grey-smalltext mb-2">
          {i18n.t("Feature Services")}
        </span>
        <span
          className="text-normal text-20 grey-service-price"
          role="button"
          onClick={() => history.push("/service/list")}
        >
          {i18n.t("View More")}
        </span>
      </Row>

      <Row className="home-grid-item-wrapper">
        <Carousel
          className="custom-cursor-service mb-4"
          breakPoints={carouselBreakPoints}
        >
          {componentContent.map((service, index) => (
            <div
              className="home-grid-item-container"
              role="button"
              // onClick={(e) => {
              //   e.stopPropagation();
              //   history.push(`/service/detail/${service.serviceId}`)
              // }}
            >
              <SingleServicePreview service={service} key={index} />
            </div>
          ))}
        </Carousel>
      </Row>
    </div>
  );
};

export default withRouter(HomeFeatureService);
