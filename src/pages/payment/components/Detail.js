import { Divider } from "antd";
import i18n from "i18n-js";

const Detail = ({ data, serviceInfo, orderNumber }) => {
  const language = localStorage.getItem("language");

  let serviceExtraMessage = "";

  if (data.selectedServiceExtra !== undefined) {
    data.selectedServiceExtra.forEach((element) => {
      serviceExtraMessage += i18n.t("Include") + element.name[language] + " ";
    });
  }

  console.log("data", data);

  return (
    <div className="detail-container">
      {/* order number */}
      <div className="order-number-container">
        <div className="order-number-font margin-bottom-5">
          {i18n.t("Order#")}: {orderNumber}
        </div>
        <div className="margin-bottom-5">
          <span className="title margin-right-5">{i18n.t("Total Price")}</span>
          <span className="total-price">${data.serviceOrderTotalPyament}</span>
        </div>
        <div className="order-number-font">
          {i18n.t(
            "There is a prepay service fee, our platform will not charge any fee"
          )}
        </div>
      </div>

      <Divider className="divider-font" dashed={true} type={"vertical"} />

      {/* order time */}
      <div className="order-time-container ">
        {/* img */}
        <div className="margin-right-20 ">
          <img
            src={
              serviceInfo.serviceImage?.length && serviceInfo.serviceImage[0]
            }
            className="order-image-size"
          />
        </div>

        {/* content */}
        <div className="time-detail-container">
          <div className="order-type-title margin-bottom-5">
            {`${i18n.t("Pet")} ${serviceInfo.categoryName[language]} ${i18n.t(
              "Care"
            )} ${serviceInfo.serviceName}`}
          </div>
          <div className="order-number-font">
            {`${i18n.t("Booked")} ${data.OrderDayNumber} ${i18n.t(
              "Day"
            )} ${i18n.t("Pet Care Service")} ${serviceExtraMessage}`}
          </div>
          <div className="order-number-font">
            {i18n.t("Checkin Time")}： {data.orderStartDate}，
            {i18n.t("Checkout Time")}: {data.orderEndDate}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
