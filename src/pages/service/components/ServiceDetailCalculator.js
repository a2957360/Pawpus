import React from "react";

import { useHistory } from "react-router-dom";

import { Divider, message } from "antd";
import { StarFilled } from "@ant-design/icons";

import i18n from "i18n-js";

import UserInfo from "../../../components/user/UserInfo";
import PriceCalculate from "../components/PriceCalculate";
import MakeUrlParam from "../../../components/service/MakeUrlParam";

//redux
import { useSelector } from "react-redux";

const ServiceDetailCalculator = ({ searchData }) => {
  const history = useHistory();
  const userId = localStorage.getItem("userId");
  const language = localStorage.getItem("language");

  //redux state serviceDetail
  const data = useSelector((state) => state.serviceData.serviceDetail);
  //redux state reviewList
  const reviewList = useSelector((state) => state.serviceData.serviceReview);

  const handleMakeOrder = (serviceOrderPetInfo, serviceOrderExtra) => {
    if (!userId) {
      message.error(i18n.t("Please login"));
    }

    //如果该服务是自己发布的，不允许下单
    if (userId == data.userId) {
      message.error(i18n.t("Can not order your own service"));
    } else {
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

  const combineStringNumberOfPets = totalPetList.map((pet) => {
    return (numberOfPets +=
      pet.petType[language] + pet.number + i18n.t("quantityOfPet"));
  });

  let reviewTotalPoints =
    reviewList.length > 0
      ? reviewList.reduce(
          (total, review) => total + Number(review.reviewStar),
          0
        )
      : 0;
  // const [reviewPointsAverage, setReviewPointAverage] = useState(
  //   reviewTotalPoints / reviewList.length
  // );

  return (
    <div className="service-detail-calculator-inner">
      {/* 发布者 */}
      <div>
        <UserInfo
          buttonShown={true}
          url={data.userImage}
          name={data.userName}
          subTitle={
            data.petList.length > 0 ? i18n.t("TA owns") + numberOfPets : ""
          }
          isCertifyServer={data.serverLevel === "2" ? true : false}
          userId={data.userId}
        />
      </div>

      <Divider className="mt-3 mb-3" dashed />

      {/* 狗寄养 */}
      <div className="pl-2 pr-2">
        <div className="owner-section">
          <div className="text-18 text-grey-8 text-bold mr-3">
            <span>{data.categoryName[language]}</span>
            <span> {i18n.t("Care")}</span>
          </div>
          <div className="text-14 text-grey-8">
            {i18n.t("By")}
            <span className="text-14 text-primary"> {data.userName}</span>
            {i18n.t("Provide")}
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
              i18n.t("No rate currently")}
            ({reviewList.length}
            {i18n.t("Reviews")}) */}
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
