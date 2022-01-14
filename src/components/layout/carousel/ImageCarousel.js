import React from "react";

import { Carousel } from "antd";

const ImageCarousel = ({ data, width, height }) => {
  return (
    <Carousel
      style={{ width: width, height: height, backgroundColor: "white" }}
      autoplay={true}
      dots={false}
    >
      {data.map((img, index) => {
        return (
          <div key={index}>
            <img
              src={img}
              alt=""
              style={{ width: width, height: height }}
              className="image-object-fit-contain"
            />
          </div>
        );
      })}
    </Carousel>
  );
};

export default ImageCarousel;
