import React from "react";

//packages
import { withRouter } from "react-router-dom";
import i18n from "i18n-js";

//components
import { Row, Avatar } from "antd";
import { StarFilled } from "@ant-design/icons";
import Carousel from "react-bootstrap/Carousel";

//statics
import vipBadge from "../../assets/img/service/state-vip.png";
import newBadge from "../../assets/img/service/state-new.png";
import flag from "../../assets/img/service/flag.png";
import stateNew from "../../assets/img/service/state-new.png";
import stateVIP from "../../assets/img/service/state-vip.png";
import cardImageCut from "../../assets/img/service/card-background-cut.png";

const SingleServicePreview = (props) => {
  const { service, history } = props;
  const language = localStorage.getItem("language");

  const avatarStateObj = {
    0: stateNew,
    2: stateVIP,
  };

  return (
    <div
      className={`item-card-container border-radius-8 position-relative ${
        service.serviceStar >= 4 && "ml-1"
      }`}
    >
      <div className="cover-image-container">
        <Carousel
          indicators={false}
          interval={null}
          className="item-image-carousel"
        >
          {service.serviceImage.map((img, index) => {
            return (
              <Carousel.Item key={index}>
                <img
                  src={img}
                  alt="Pawpus"
                  className="service-card-cover-image cover-image"
                  role="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    history.push(`/service/detail/${service.serviceId}`);
                  }}
                />
              </Carousel.Item>
            );
          })}
        </Carousel>

        {/* 高分服务 */}
        {/* <div
  role="button"
  onClick={(e) => {
    e.stopPropagation();
    history.push(`/service/detail/${service.serviceId}`);
  }}
> */}
        {service.serviceStar >= 4 && (
          <div className="flag">
            <img src={flag} alt="flag" />
            <div className="city pl-2">
              <div className="city-font text-bold ">{service.serviceCity}</div>
              <div className="flag-font text-bold ">{i18n.t("High Rated")}</div>
            </div>
          </div>
        )}

        {/* 宠物寄养 */}
        <div
          role="button"
          onClick={(e) => {
            e.stopPropagation();
            history.push(`/service/detail/${service.serviceId}`);
          }}
          className="title-price-container color-total-price fw-bold"
        >
          <div>
            <div className="price-title">
              {`${i18n.t("Pet")} ${
                service.categoryName && service.categoryName[language]
              } ${i18n.t("Care")}`}
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <div className="price mr-1">
                ${Number(service.servicePrice).toFixed(2)} /{" "}
              </div>
              <div className="day">{i18n.t("Day")}</div>
            </div>
          </div>
        </div>
      </div>

      {/* avatar title container */}
      <div
        role="button"
        onClick={(e) => {
          e.stopPropagation();
          history.push(`/service/detail/${service.serviceId}`);
        }}
        className="card-content-container-service pl-3"
      >
        <div className="user-avatar-name">
          <div className="user-avatar-name-inner">
            {/* 头像 */}
            <div className="user-avatar">
              <Avatar
                className="avatar-img"
                icon={
                  <img
                    src={
                      service.serviceImage.length > 0
                        ? service.userImage
                        : "http://pawpus.finestudiotest.com/include/pic/backend/21030105112901.jpg"
                    }
                    alt="user-avatar"
                  />
                }
              />

              {(service.serverLevel == "0" || service.serverLevel == "2") && (
                <img
                  src={avatarStateObj[service.serverLevel]}
                  alt=""
                  className="state-img"
                />
              )}
            </div>

            {/* 发布者名字 */}
            <div className="author-name">
              <span className="text-14">{service.userName} </span>
              {service.serverLevel === "2" && (
                <span className="certify-server text-12">
                  ({i18n.t("Certified Provider")})
                </span>
              )}
            </div>
          </div>
        </div>

        <div>
          <div>&nbsp;</div>
        </div>

        <div className="description-like-container-service">
          <div className="card-description">{service.serviceDescription}</div>
          <div className="card-like text-14 pr-3">
            {Number(service.serviceStar) === 0
              ? 0
              : Number(service.serviceStar).toFixed(1)}

            <StarFilled style={{ color: "#fadb14", marginLeft: 5 }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(SingleServicePreview);

// {service.serviceStar >= 4 && (
//   <div className="home-service-badge">
//     <div className="pl-2">
//       <div className="text-bold text-capitalize ml-1">
//         {service.serviceCity}
//       </div>
//       <div className="text-bold ml-1">{i18n.t("High Rated")}</div>
//     </div>
//   </div>
// )}
// <div className="item-image-carousel">
//   <Carousel indicators={false} interval={60000}>
//     {service.serviceImage.map((img, index) => (
//       <Carousel.Item key={index}>
//         <img
//           src={img}
//           alt="Pawpus"
//           className="service-card-cover-image"
//           role="button"
//           onClick={() =>
//             history.push(`/service/detail/${service.serviceId}`)
//           }
//         />
//       </Carousel.Item>
//     ))}
//   </Carousel>
// </div>
// {/* <div className="position-relative">
//   <img
//     src={service.serviceImage[0]}
//     alt={service.serviceName}
//     className="service-card-cover-image"
//               // onMouseEnter={(e) => e.currentTarget.src = service.serviceImage[1]}
//     // onMouseLeave ={(e) => e.currentTarget.src = service.serviceImage[0]}
//   />
//   <img
//     src={service.serviceImage[1]}
//     alt={service.serviceName}
//     className="service-card-cover-image service-card-cover-image-hover"
//   />
// </div> */}

// <div className="item-card-content item-card-content-service">
//   <div className="item-info-container">
//     <div className="item-avatar-container">
//       <img
//         src={service.userImage}
//         alt="Pawpus"
//         className="rounded-circle w-100 avatar-image"
//       />
//       {service.serverLevel !== "1" && (
//         <img
//           src={service.serverLevel === "0" ? newBadge : vipBadge}
//           alt="Pawpus"
//           className="home-avatar-badge"
//         />
//       )}
//     </div>

//     <div className="item-text-name text-14 fw-bold">
//       <span>
//         {service.userName}
//         {/* <span className="color-red pl-1">
//           ({i18n.t("Certified Provider")})
//         </span> */}
//         {service.serverLevel === "2" && (
//           <span className="color-red pl-1">
//             ({i18n.t("Certified Provider")})
//           </span>
//         )}
//       </span>
//     </div>

//     <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1 color-total-price fw-bold">
//       <span className="text-capitalize">
//         {language.includes("zh")
//           ? service.categoryName.zh
//           : service.categoryName.en}
//         {i18n.t("Boarding")}
//       </span>
//       <span className="d-inline-block w-90 text-truncate text-center">
//         ${service.servicePrice}/{i18n.t("Day")}
//       </span>
//     </div>
//   </div>

//   <Row align="middle" className="pt-3 px-3 pb-1 text-16">
//     <span className="d-inline-block w-100 text-normal color-card-detail text-truncate pl-2">
//       {service.serviceDescription}
//     </span>
//   </Row>
//   <Row justify="end" className="px-2">
//     {service.serviceStar > 0 ? (
//       <div className="text-14">
//         <span className="text-normal color-card-detail pr-1">
//           {Number(service.serviceStar) === 0
//             ? 0
//             : Number(service.serviceStar).toFixed(1)}
//         </span>
//         <i className="fas fa-star color-total-price"></i>
//       </div>
//     ) : null}
//   </Row>
// </div>

///new cursor
