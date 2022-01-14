import React from "react";
import { withRouter } from "react-router-dom";
//components
import { Row, Col, Typography } from "antd";
//redux

const HomeFeatures = (props) => {
  const { componentContent } = props;

  const language = localStorage.getItem("language");

  return (
    <Row justify="center">
      <Row
        justify="space-between"
        className="home-features-container mt-4 mb-5 "
      >
        {componentContent.map((feature, index) => (
          <Col
            key={index}
            xs={12}
            lg={6}
            className="d-flex flex-column align-items-center justify-content-center"
          >
            <img
              className="home-feature-image rounded-circle pt-4 pb-4"
              src={feature.image}
              alt={`${feature.title[language]}`}
            />

            <div className="home-feature-title mb-1">
              {feature.title[language]}
            </div>

            <div className="home-feature-description">
              {feature.content[language]}
            </div>
          </Col>
        ))}
      </Row>
    </Row>
  );
};

export default withRouter(HomeFeatures);
