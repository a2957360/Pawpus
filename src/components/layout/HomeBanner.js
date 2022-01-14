import React from "react";
import { withRouter } from "react-router-dom";
//components
// import { Carousel } from "react-bootstrap";
//import Carousel from "react-elastic-carousel";
import { Carousel, Row } from "antd";

const HomeBanner = (props) => {
  const { componentContent, history } = props;

  const carouselBreakPoints = [
    { width: 1, itemsToShow: 1, itemsToScroll: 1 },
    { width: 550, itemsToShow: 1, itemsToScroll: 1 },
    { width: 768, itemsToShow: 1, itemsToScroll: 1 },
    { width: 1200, itemsToShow: 1, itemsToScroll: 1 },
  ];

  const contentStyle = {
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
  };

  return (
    <Row className="home-banner-wrapper mb-5 ">
      <Carousel
        className="home-banner-container px-3 "
        autoplaySpeed={5000}
        speed={1000}
        dotsClass="home-banner-dot"
        autoplay={true}
      >
        {componentContent.map((carousel, index) => (
          <img
            key={index}
            className="span-mouse-click"
            style={contentStyle}
            src={carousel.image}
            alt=""
            onClick={(e) => {
              e.stopPropagation();
              // history.push(carousel.link);
              window.location.replace(carousel.link);
            }}
          />
        ))}
      </Carousel>
    </Row>
  );
};

export default withRouter(HomeBanner);

{
  /* <Carousel
          //breakPoints={carouselBreakPoints}
          //showArrows={false}
          renderArrow={({ type, onClick }) => (
            <div onClick={onClick}>
              {type === "PREV" ? (
                <div role="button" className="control-button">
                  <i className="fas fa-chevron-left"></i>
                </div>
              ) : (
                <div role="button" className="control-button">
                  <i className="fas fa-chevron-right"></i>
                </div>
              )}
            </div>
          )}
          pagination={false}
        >
          {componentContent.map((carousel, index) => (
            <img 
              key={index}
              style={contentStyle} 
              className="home-banner-image"
              src={carousel}
              alt="First slide"
              onClick={() => history.push("/product/list")}
            />
          ))}
        </Carousel> */
}
