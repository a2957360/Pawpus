import { Divider, message } from "antd";
import { StarFilled } from "@ant-design/icons";

import UserInfo from "../../../components/user/UserInfo";
import PriceCalculate from "../components/PriceCalculate";
import MakeUrlParam from "../../../components/service/MakeUrlParam";

import { useHistory } from "react-router-dom";

import i18n from "i18n-js";

//redux
import { useSelector } from "react-redux";

const ServiceDetailCalculator = ({ data, searchData }) => {
  const history = useHistory();
  const language = localStorage.getItem("language");

  //redux state reviewList
  const reviewList = useSelector((state) => state.serviceData.serviceReview);

  const handleMakeOrder = (serviceOrderPetInfo, serviceOrderExtra) => {
    if (
      serviceOrderPetInfo.length === 0 ||
      !searchData.startDate ||
      !searchData.endDate
    ) {
      message.error(
        i18n.t("Please select service and date, then book the service")
      );
    } else {
      const quantity = serviceOrderPetInfo.reduce(
        (accumulator, currentValue) => {
          if (currentValue.number !== undefined) {
            return accumulator + Number(currentValue.number);
          } else {
            return accumulator + 0;
          }
        },
        0
      );
      const paramsBeforeStringify = {
        serviceId: data.serviceId,
        orderStartDate: searchData.startDate,
        orderEndDate: searchData.endDate,
        serviceOrderPetInfo: serviceOrderPetInfo,
        serviceOrderExtra: serviceOrderExtra,
        quantity: quantity,
      };
      const newRouterParams = MakeUrlParam(paramsBeforeStringify);
      history.push(`/service/order?${newRouterParams}`);
    }
  };

  let totalPetList = [];

  let numberOfPets = "";

  const combineArrayNumberOfPets = data.petList.map((element) => {
    const index = totalPetList.findIndex(
      (animal) => animal.petType === element.petType
    );

    if (element.petType) {
      if (index > -1) {
        totalPetList[index].number++;
      } else {
        totalPetList.push({ petType: element.petType, number: 1 });
      }
    }
  });

  let reviewTotalPoints =
    reviewList.length > 0
      ? reviewList.reduce(
          (total, review) => total + Number(review.reviewStar),
          0
        )
      : 0;

  const combineStringNumberOfPets = totalPetList.map((pet) => {
    return (numberOfPets += pet.petType[language] + pet.number + "只 ");
  });

  return (
    <div className="modal-service-detail-calculator-inner">
      {/* 发布者 */}
      <div>
        <UserInfo
          buttonShown={true}
          url={data.userImage}
          name={data.userName}
          subTitle={data.petList.length > 0 ? "TA拥有" + numberOfPets : ""}
          isCertifyServer={data.serverLevel === "2" ? true : false}
          userId={data.userId}
        />
        <Divider style={{ marginTop: 0, marginBottom: 8 }} dashed />
      </div>

      {/* 狗寄养 */}
      {/* <div>
        <div className="owner-section">
          <div className="animal-type">{data.categoryName[language]}寄养</div>
          <div className="owner-type">
            由<span className="owner-color">{data.userName}</span>提供
          </div>
        </div>
        <div className="location-section">
          <div>加拿大/安省/多伦多</div>
          <div className="star-review-section">
            <StarFilled className="location-star" />
            <div className="review-number"> 4.8 (355人评论) </div>
          </div>
        </div>

        <Divider
          style={{ marginTop: 8, marginBottom: 8 }}
          className='mt-1 mb-1 pd-1 pt-1'
        />
      </div> */}
      {/* 狗寄养 */}
      <div className="pl-2 pr-2">
        <div className="owner-section">
          <div className="text-18 text-grey-8 text-bold mr-3">
            {data.categoryName[language]}
            {i18n.t("care provided by")}
          </div>
          <div className="text-14 text-grey-8">
            {i18n.t("by")}
            <span className="text-14 text-primary">{data.userName}</span>
            {i18n.t("provide")}
          </div>
        </div>

        <div className="mt-1">
          {data.serviceProvince}/{data.serviceCity}
        </div>

        <div className="d-flex align-items-center mt-1">
          <StarFilled className="pr-2 text-16 color-primary" />
          <div className="text-16">
            {reviewList.length === 0
              ? i18n.t("No rate currently")
              : `${(reviewTotalPoints / reviewList.length).toFixed(1)}  (${
                  reviewList.length
                } ${i18n.t("Reviews")})`}

            {/* {(reviewTotalPoints / reviewList.length).toFixed(1) ||
              i18n.t("No rate currently")}{" "}
            ({reviewList.length} {i18n.t("total comments")}) */}
          </div>
        </div>
        <Divider className="mt-3 mb-3" dashed />
      </div>

      {/* 费率计算 */}
      <div className="calculator-inner">
        <PriceCalculate
          searchData={searchData}
          handleMakeOrder={handleMakeOrder}
        />
      </div>
    </div>
  );
};

export default ServiceDetailCalculator;
