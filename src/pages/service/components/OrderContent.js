import { useState } from "react";

import moment from "moment";

import i18n from "i18n-js";

import {
  Breadcrumb,
  Divider,
  Avatar,
  DatePicker,
  Button,
  Input,
  Row,
  Col,
  message,
  TimePicker,
} from "antd";

//page component

import stateNew from "../../../assets/img/service/state-new.png";
import stateVIP from "../../../assets/img/service/state-vip.png";

import PetCardModal from "./PetCardModal";
import PetCard from "./PetCard";

//redux
import { useSelector } from "react-redux";
import axios from "axios";
import { API_BASE_URL } from "../../../configs/AppConfig";

const OrderContent = ({
  priceParam,
  orderParams,
  setPriceParam,
  serviceOrderPrice,
  isAddPetModalVisible,
  setIsAddPetModalVisible,
}) => {
  const userId = localStorage.getItem("userId");
  const language = localStorage.getItem("language");

  const hourFormat = "HH:mm";

  const [addPetInfo, setAddPetInfo] = useState({
    userId: userId,
    petName: null,
    petGender: null,
    petAge: null,
    isOperated: null,
    petType: null,
    petWeight: null,
    petDescription: null,
    petPortfolio: [],
    petImage: null,
    petVariety: null,
  });

  const { serviceDetail, petList } = useSelector((state) => state.serviceData);

  const {
    categoryName,
    userName,
    userImage,
    serverLevel,
    serviceRequirement,
    serviceName,
    checkinTime,
    checkoutTime,
  } = serviceDetail;

  const handlePetCardSelector = (petCard) => {
    if (priceParam.serviceOrderPetCard.indexOf(petCard) > -1) {
      const updatedList = priceParam.serviceOrderPetCard.filter(
        (element) => element !== petCard
      );
      setPriceParam({
        ...priceParam,
        serviceOrderPetCard: updatedList,
      });
    } else {
      const updatedList = [...priceParam.serviceOrderPetCard, petCard];
      setPriceParam({
        ...priceParam,
        serviceOrderPetCard: updatedList,
      });
    }
  };

  const renderPetCards = petList.map((element, index) => {
    const indexElement = priceParam.serviceOrderPetCard.indexOf(element);
    return (
      <Col key={index} xs={24} md={12} xl={8}>
        <PetCard
          data={element}
          handlePetCardSelector={handlePetCardSelector}
          isCardDisable={
            priceParam.serviceOrderPetCard.length >= orderParams.quantity &&
            indexElement === -1
              ? true
              : false
          }
        />
      </Col>
    );
  });

  const avatarStateObj = {
    0: stateNew,
    2: stateVIP,
  };

  const handleSubmitButton = () => {
    const { petName, petGender, petType } = addPetInfo;
    if (!petName || !petGender || !petType) {
      message.error(i18n.t("Please complete required infomation"));
    } else {
      // 添加宠物卡
      console.log("add pet card", addPetInfo);
      axios
        .post(API_BASE_URL + "pet/addPet.php", addPetInfo, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log("add pet card result", res.data);
          setIsAddPetModalVisible(false);
        })
        .catch((error) => {
          console.log(error);
          setIsAddPetModalVisible(false);
        });
    }
  };

  const handleTimeSelect = (time, timeString) => {
    setPriceParam({
      ...priceParam,
      arriveTime: time ? timeString : null,
    });
  };

  function range(start, end) {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  const disabledDateTime = () => {
    const hoursArr = range(0, 24);
    const blockHours = hoursArr.slice(0, Number(checkinTime.substring(0, 2)));

    return blockHours;
    // const operateHours = hoursArr.slice(
    //   Number(checkinTime.substring(0, 2)),
    //   Number(checkoutTime.substring(0, 2))
    // );
    // return hoursArr.filter((e) => !operateHours.includes(e));
  };

  return (
    <div>
      {/* header */}
      <div className="pageHeader-1 component-inner-padding margin-bottom-30 ">
        <Breadcrumb>
          <Breadcrumb.Item>
            <span className="header-font">{i18n.t("Order Process")}</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <span className="header-font">{i18n.t("Comfirm Order")}</span>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      {/* provider info */}
      <div className="provider-policy-container component-inner-padding margin-bottom-30">
        <div className="provider-info-container">
          <div className="provider-row">
            <div className="d-flex align-items-end">
              <span className="text-22 text-grey-8 text-bold mr-3">
                {i18n.t("Pet")} {categoryName[language]} {i18n.t("Care")}
                {serviceName}
              </span>
              <div className="text-16 text-grey-8">
                <span>{i18n.t("Below content provided by")} </span>
                <span className="text-16 text-primary">{userName}</span>
                {i18n.t("provide")}
              </div>
            </div>
            <div className="provider-avatar">
              <Avatar
                className="user-avatar"
                icon={<img src={userImage} alt="" className="image-size" />}
              />

              {(serverLevel == 0 || serverLevel == 2) && (
                <img
                  className="state-image"
                  src={avatarStateObj[serverLevel]}
                  alt=""
                />
              )}
            </div>
          </div>
        </div>
        <Divider dashed={true} />

        {/* 入住须知 */}
        <div className="policy-container font-color-70">
          <div className="margin-bottom-15">
            <span className="text-22 text-grey-8 text-bold mr-">
              {i18n.t("Checkin notes")}
            </span>
          </div>
          <div className="text-18 text-grey-8">{serviceRequirement}</div>
        </div>
      </div>

      {/* 入住信息 */}
      <div className="checkin-info-container component-inner-padding font-color-70 margin-bottom-30">
        <div className="text-22 text-grey-8 text-bold">
          {i18n.t("Checkin information")}
        </div>
        <div className="text-18 text-grey-8  mt-2">
          {i18n.t("Confirm checkin information")}
        </div>
        <div className="text-16 text-grey-8">
          {i18n.t("Before")} {checkinTime} {i18n.t("After")} {checkoutTime}
        </div>
        <Row>
          <Col xs={24} md={24} lg={8}>
            <div className="mt-2 pr-2">
              <span className="text-18 text-grey-8 mr-3">
                {i18n.t("Checkin Time")}:
              </span>
              <DatePicker
                className="mt-2 w-100"
                disabled
                defaultValue={moment(orderParams.orderStartDate)}
              />
            </div>
          </Col>

          <Col xs={24} lg={8}>
            <div className="mt-2 pr-2">
              <span className="text-18 text-grey-8 mb-3 mr-3">
                {i18n.t("Checkout Time")}:
              </span>
              <DatePicker
                className="mt-2 w-100"
                disabled
                defaultValue={moment(orderParams.orderEndDate)}
              />
            </div>
          </Col>

          <Col xs={24} lg={8} id="testThis">
            <div className="mt-2 pr-2">
              <span className="text-18 text-grey-8 mr-3">
                {i18n.t("Arrive Time")}:
              </span>
              <div className="date-picker-container">
                <TimePicker
                  getPopupContainer={() => document.getElementById("testThis")}
                  allowClear={false}
                  format={hourFormat}
                  onChange={handleTimeSelect}
                  disabledHours={disabledDateTime}
                  className="mt-2 date-picker"
                  // picker={"time"}
                  // showNow={false}
                />
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* 宠物信息 */}
      <div className="pet-info-container component-inner-padding font-color-70  mb-3">
        <div className="title-row">
          <div className="text-22 text-grey-8 text-bold">
            {i18n.t("Pet infomation")}
          </div>
          <div>
            <Button
              onClick={() => setIsAddPetModalVisible(true)}
              className="white-button"
            >
              {i18n.t("Add new pet card")}
            </Button>
          </div>
        </div>

        <Divider dashed={true} />

        <div className="text-16 text-grey-8 mb-3">
          {`${i18n.t("Confirm pet information")} (${i18n.t("Selected")} ${
            priceParam.serviceOrderPetCard.length
          } ${i18n.t("pets")})`}
        </div>
        <div className="pet-cards-section">
          <Row className="row-container">{renderPetCards}</Row>
        </div>
      </div>

      {/* 主人联系方式 */}
      <div className="pet-info-container component-inner-padding font-color-70 margin-bottom-30 ">
        <div className="text-22 text-grey-8 text-bold mb-3">
          {i18n.t("Contact number")}
        </div>
        <div className="primary-input-container">
          <Input
            onChange={(e) => {
              setPriceParam({
                ...priceParam,
                userPhone: e.target.value,
              });
            }}
            className="primary-input--medium"
            placeholder={i18n.t("Phone number")}
          />
        </div>
      </div>

      {/* 总计金额 */}
      {/* <div className="pet-info-container component-inner-padding font-color-70 margin-bottom-30 ">
        <div className="margin-bottom-15">
          <span className="text-22 text-grey-8 text-bold mb-3">总计金额</span>
          <span className="total-price-font">
            ${serviceOrderPrice.serviceOrderTotalPrice}
          </span>
        </div>
        <div className="font-size-20 font-color-9f">
          您需要预付服务费用，平台未扣去任何费用
        </div>
      </div> */}

      {/* 备注 */}
      <div className="pet-info-container component-inner-padding font-color-70 margin-bottom-30 ">
        <div className="text-22 text-grey-8 text-bold mb-3">
          {i18n.t("Notes")}
        </div>
        <div className="primary-input-container w-100">
          <Input
            maxLength={50}
            onChange={(e) => {
              setPriceParam({
                ...priceParam,
                serviceComment: e.target.value,
              });
            }}
            placeholder={i18n.t("Write your notes")}
            className="primary-input--medium w-100"
          />
        </div>
      </div>

      <PetCardModal
        addPetInfo={addPetInfo}
        setAddPetInfo={setAddPetInfo}
        isAddPetModalVisible={isAddPetModalVisible}
        setIsAddPetModalVisible={setIsAddPetModalVisible}
        handleSubmitButton={handleSubmitButton}
      />
    </div>
  );
};

export default OrderContent;
