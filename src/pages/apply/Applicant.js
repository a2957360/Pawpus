import React, { useState, useEffect } from "react";

//components
import LoadingView from "../../components/loading/LoadingView";
import PetCardNoCheckBox from "./components/PetCardNoCheckBox";
import PetCardModal from "../service/components/PetCardModal";
import MakeUrlParam from "../../components/service/MakeUrlParam";
import placeholder_pic from "../../assets/img/Success-Dogy.png";

//redux
import { useDispatch, useSelector } from "react-redux";
import { getPetList, getServiceCategory } from "../../redux/actions";
import axios from "axios";
import { API_BASE_URL } from "../../configs/AppConfig";

//packages
import I18n from "i18n-js";
import moment from "moment";
import Autocomplete from "react-google-autocomplete";
import { useHistory } from "react-router-dom";
import Process from "./components/Process";
import {
  Divider,
  Input,
  Menu,
  Dropdown,
  Button,
  Checkbox,
  Row,
  Col,
  message,
  Switch,
  Statistic,
  Modal,
} from "antd";
import { DownOutlined } from "@ant-design/icons";

const Applicant = (props) => {
  const { Countdown } = Statistic;

  const dispatch = useDispatch();
  const history = useHistory();

  const userId = localStorage.getItem("userId");
  const language = localStorage.getItem("language");

  const urlParams = new URLSearchParams(window.location.search);
  const entries = urlParams.entries();
  const paredUrlParams = {};
  for (const entry of entries) {
    paredUrlParams[entry[0]] = JSON.parse(entry[1]);
  }

  const emptyData = {
    // userId: userId,
    serviceAddress: null,
    serviceCity: null,
    serviceProvince: null,
    servicePostal: null,
    servicePhone: null,
    servicePet: [],
    serviceHourseType: Number(0),
  };

  const [params, setParams] = useState(
    props.location.state != undefined && props.location.state
      ? paredUrlParams
      : Object.assign(emptyData, paredUrlParams)
  );

  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [email, setEmail] = useState();
  const [isAddPetModalVisible, setIsAddPetModalVisible] = useState(false);
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
  const [inputVerificationCode, setInputVerificationCode] = useState("");
  const [isChangePhone, setIsChangePhone] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [countDownTime, setCountDownTime] = useState();

  const { petList, serviceCategory } = useSelector(
    (state) => state.serviceData
  );

  useEffect(() => {
    if (userId) {
      dispatch(getPetList(userId));
      dispatch(getServiceCategory());
      getCustomerServiceInfo();
    } else {
      message.error(I18n.t("Please login"));
      history.push("/");
    }
  }, [dispatch, isAddPetModalVisible]);

  const getCustomerServiceInfo = async () => {
    axios
      .get(API_BASE_URL + `config/getConfig.php?configType=1`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.data.data) {
          const email = res.data.data.filter((e) => e.configName === "email");

          setEmail(email[0].configValue);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const menu = (
    <Menu
      onClick={(e) => {
        setParams({
          ...params,
          serviceHourseType: Number(e.key),
        });
      }}
    >
      <Menu.Item key={0}>{I18n.t("Apartment")}</Menu.Item>
      <Menu.Item key={1}>{I18n.t("House")}</Menu.Item>
      <Menu.Item key={2}>{I18n.t("TownHouse")}</Menu.Item>
      <Menu.Item key={3}>{I18n.t("Pet Care")}</Menu.Item>
    </Menu>
  );

  const handleSendVerifyCode = async () => {
    if (!params.servicePhone) {
      message.error(I18n.t("Please complete your phone number"));
    } else {
      await axios
        .get(
          API_BASE_URL +
            `user/getServerVerificationCode.php?userPhone=${params.servicePhone}&language=${language}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          if (res.data.message !== "success") {
            message.error(
              I18n.t("Get verification failed, please try again later")
            );
          } else {
            message.success(I18n.t("sendVerificationCodeSuccess"));
            setCountDownTime(moment().add(60, "seconds"));
            setShowTimer(true);
          }
        })
        .catch((error) => {});
    }
  };

  const handleAddPetButton = async () => {
    const { petName, petGender, petType } = addPetInfo;
    console.log("addPetInfo", addPetInfo);
    if (!petName || !petGender || !petType) {
      message.error(I18n.t("Please complete the information"));
    } else {
      // 添加宠物卡

      await axios
        .post(API_BASE_URL + "pet/addPet.php", addPetInfo, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (res.data.message !== "success") {
            message.error(I18n.t("AddPetCardFailed"));
          }
          setIsAddPetModalVisible(false);
        })
        .catch((error) => {
          console.log(error);
          setIsAddPetModalVisible(false);
        });
    }
  };

  const errorMessageHandler = () => {
    if (!params.serviceAddress) {
      message.error(
        I18n.t("Please select your address from auto-complete system!")
      );
    }
    //  else if (!params.serviceHourseType) {
    //   message.error(I18n.t("Please select a house type"));
    // }
    else if (!inputVerificationCode) {
      message.error(I18n.t("Please enter verification code"));
    }
  };

  //验证手机，正确跳转下个页面，错误就显示warning
  const handleNextButton = async () => {
    // 从服务中心跳转过来的，不需要检测是否填写了验证码
    if (props.location.state != undefined && props.location.state) {
      if (isChangePhone) {
        if (!params.servicePhone || !inputVerificationCode) {
          errorMessageHandler();
          // message.error(I18n.t("Please complete the information"));
        } else {
          const data = {
            serverId: userId,
            serverPhone: params.servicePhone,
            verificationCode: inputVerificationCode,
          };

          await axios
            .post(API_BASE_URL + "user/checkServerVerificationCode.php", data, {
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then((res) => {
              console.log("verify phone number result", res.data);

              if (res.data.message !== "success") {
                message.error(
                  I18n.t("Verification code is wrong, please try again later")
                );
              } else {
                const newRouterParams = MakeUrlParam(params);
                // history.push(
                //   `/serviceapply/basicinfomation?${newRouterParams}`
                // );
                history.push({
                  pathname: `/serviceapply/basicinfomation`,
                  search: newRouterParams,
                  state: true,
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      } else {
        if (
          !params.serviceAddress ||
          // !params.serviceHourseType ||
          !params.servicePhone
        ) {
          errorMessageHandler();
          // message.error(I18n.t("Please complete the information"));
        } else {
          const newRouterParams = MakeUrlParam(params);
          history.push({
            pathname: `/serviceapply/basicinfomation`,
            search: newRouterParams,
            state: true,
          });
        }
      }
    }
    // 要检测是否填写验证码
    else {
      if (
        !inputVerificationCode ||
        !params.serviceAddress
        // ||!params.serviceHourseType
      ) {
        errorMessageHandler();
      } else {
        const data = {
          serverId: userId,
          serverPhone: params.servicePhone,
          verificationCode: inputVerificationCode,
        };

        await axios
          .post(API_BASE_URL + "user/checkServerVerificationCode.php", data, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            console.log("verify phone number result", res.data);

            if (res.data.message !== "success") {
              message.error(I18n.t("Verification number is wrong"));
            } else {
              const newRouterParams = MakeUrlParam(params);
              history.push(`/serviceapply/basicinfomation?${newRouterParams}`);
            }
            // const newRouterParams = MakeUrlParam(params);
            // history.push(`/serviceapply/basicinfomation?${newRouterParams}`);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  };

  const handleAddressSelect = (place) => {
    const { formatted_address } = place;
    const longAddress = formatted_address.split(",");
    const province_postal = longAddress[2].split(" ");
    setParams({
      ...params,
      serviceAddress: longAddress[0],
      serviceCity: longAddress[1],
      serviceProvince: province_postal[1],
      servicePostal: province_postal[2] + province_postal[3],
    });
  };

  const handlePetCardSelector = (petId) => {
    if (params.servicePet.indexOf(petId) > -1) {
      const updatedList = params.servicePet.filter(
        (element) => element !== petId
      );
      setParams({
        ...params,
        servicePet: updatedList,
      });
    } else {
      const updatedList = [...params.servicePet, petId];
      setParams({
        ...params,
        servicePet: updatedList,
      });
    }
  };

  const renderPetCards =
    petList && petList.length > 0
      ? petList.map((element, index) => {
          return (
            <Col key={index} sm={24} md={12}>
              <PetCardNoCheckBox
                data={element}
                checkedList={params.servicePet}
                handlePetCardSelector={handlePetCardSelector}
              />
            </Col>
          );
        })
      : null;

  if (!userId) {
    message.error(I18n.t("Please login"));
    history.push("/");
  }

  if (!petList || !serviceCategory) {
    return <LoadingView />;
  }

  let serviceHuseTypeText;
  if (params.serviceHourseType) {
    switch (params.serviceHourseType) {
      case 0:
        serviceHuseTypeText = I18n.t("Apartment");
        break;
      case 1:
        serviceHuseTypeText = I18n.t("House");
        break;
      case 2:
        serviceHuseTypeText = I18n.t("TownHouse");
        break;
      case 3:
        serviceHuseTypeText = I18n.t("Pet Care");
        break;

      default:
        break;
    }
  } else {
    serviceHuseTypeText = I18n.t("Apartment");
  }

  return (
    <div className="applicant-wrapper">
      {/* 进度条 */}
      <div className="process-container">
        <Process current={0} />
      </div>

      {/* 输入和按钮 */}
      <div className="content-container">
        {/* 居中的div */}
        <div className="inner-container">
          {/* 地址信息 */}
          <div className="address-input-container margin-bottom-30">
            {/* title row */}
            <div className="title-row">
              <span className="text-20 text-bold text-grey-8 mr-3">
                {I18n.t("Address Information")}
              </span>
              <span className="text-16 text-grey-8">
                {I18n.t("Please provide the address of your service")} (
                {I18n.t(
                  "After completing this form, you can reapply new service"
                )}
                )
              </span>
              <div
                onClick={() => {
                  setContactModalVisible(true);
                }}
                className="service-price-day record-14-70 span-mouse-click underline"
              >
                {I18n.t("Could not find your setting options, contact us!")}
              </div>
            </div>
            <Divider dashed={true} />

            <div className="input-row">
              <div className="primary-input-container input-col">
                <div className="text-16 text-grey-8 mb-3">
                  {I18n.t("Service Address")}
                </div>
                <Autocomplete
                  defaultValue={
                    params.serviceAddress &&
                    `${params.serviceAddress}, ${params.serviceCity}, ${params.serviceProvince}`
                  }
                  className="primary-input w-100 text-16 text-grey-8 address-input"
                  onPlaceSelected={(place) => handleAddressSelect(place)}
                  types={["address"]}
                  componentRestrictions={{ country: "ca" }}
                  placeholder={`Autofill ${I18n.t("Address")}`}
                />
              </div>

              <div className="input-col">
                <div className="text-16 text-grey-8 mb-3">
                  {I18n.t("Choose house type")}
                </div>
                <div>
                  <Dropdown overlay={menu}>
                    <Button className="text-16 text-grey-8 white-button input-button-container">
                      <span className="text-grey-8">{serviceHuseTypeText}</span>
                      <DownOutlined />
                    </Button>
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>

          {/* 联系电话 */}
          <div className="address-input-container margin-bottom-30">
            {/* title row */}
            <div className="title-row margin-bottom-20">
              <span className="text-20 text-bold text-grey-8 mr-3">
                {I18n.t("Contact number")}
              </span>
              <span className="text-16 text-grey-8 mb-3">
                {I18n.t(
                  "Please provide your service contact number and verify"
                )}
              </span>
              {props.location.state !== undefined && props.location.state && (
                <Switch onChange={(value) => setIsChangePhone(value)} />
              )}
            </div>

            <Row className="input-row">
              <Col
                xs={24}
                md={12}
                className="primary-input-container input-col two-inputs"
              >
                <Input
                  maxLength={10}
                  onChange={(e) =>
                    setParams({
                      ...params,
                      servicePhone: e.target.value,
                    })
                  }
                  className="text-input text-input--grey text-16 text-grey-8 mr-3"
                  placeholder={I18n.t("Phone number")}
                  defaultValue={params.servicePhone && params.servicePhone}
                />

                {props.location.state != undefined &&
                props.location.state &&
                !isChangePhone ? null : (
                  <Input
                    onChange={(e) => setInputVerificationCode(e.target.value)}
                    className="text-input text-input--grey text-16 text-grey-8"
                    placeholder={I18n.t("Enter verify number")}
                  />
                )}
              </Col>

              {props.location.state !== undefined &&
              props.location.state &&
              !isChangePhone ? null : (
                <Col
                  xs={24}
                  md={12}
                  className="d-flex align-items-center justify-content-end pt-2"
                >
                  <Button disabled={showTimer} className="white-button">
                    {showTimer ? (
                      <Countdown
                        onFinish={() => setShowTimer(false)}
                        value={countDownTime}
                        format="ss"
                        valueStyle={{
                          color: "#686868",
                          fontSize: "14px",
                          fontWeight: "400",
                        }}
                      />
                    ) : (
                      <span
                        onClick={() => {
                          handleSendVerifyCode();
                        }}
                      >
                        {I18n.t("Send verify number")}
                      </span>
                    )}
                  </Button>
                </Col>
              )}
            </Row>
          </div>

          {/* 宠物信息 */}
          <div className="address-input-container mb-5">
            {/* title row */}
            <div className="input-row d-flex align-items-end">
              <div className="text-20 text-bold text-grey-8">
                {I18n.t("My Pets")}
              </div>
              <div>
                {!petList || petList.length === 0 ? (
                  <Checkbox
                    // onChange={onChange}
                    className="subtitle margin-right-20"
                  >
                    {I18n.t("No pet card")}
                  </Checkbox>
                ) : null}

                <Button
                  className="white-button"
                  onClick={() => setIsAddPetModalVisible(true)}
                >
                  {I18n.t("Add pet card")}
                </Button>
              </div>
            </div>

            <Divider dashed />

            <div className="input-row margin-bottom-30">
              {!petList || petList.length === 0
                ? I18n.t("No pet information")
                : null}
            </div>

            <div className="pet-cards-section">
              <Row className="row-container">{renderPetCards}</Row>
            </div>
          </div>

          {/* 下一步按钮 */}
          <div className="proceed-buttons-container mb-3">
            <Button
              onClick={() => {
                history.push("/serviceapply/apply");
              }}
              className="transparent-button w-20 mr-3"
            >
              {I18n.t("Back")}
            </Button>
            <Button
              onClick={() => handleNextButton()}
              className="primary-button w-20"
            >
              {I18n.t("Next")}
            </Button>
          </div>

          {/* 添加宠物卡modal */}
          <PetCardModal
            isAddPetModalVisible={isAddPetModalVisible}
            setIsAddPetModalVisible={setIsAddPetModalVisible}
            addPetInfo={addPetInfo}
            setAddPetInfo={setAddPetInfo}
            handleSubmitButton={handleAddPetButton}
          />

          {/* 联系我们弹窗 */}
          <Modal
            visible={contactModalVisible}
            onCancel={() => setContactModalVisible(false)}
            footer={null}
          >
            <div className="d-flex flex-column align-items-center">
              <img src={placeholder_pic} alt="success-placeholder" />
              <span className="text-normal text-20 grey-service-price">
                {/* {i18n.t("Please copy the following link to share")} */}
                {I18n.t("Please email us your advice")}
              </span>
              <span className="text-normal text-20 grey-service-price align-text-center">
                {email}
              </span>
              <div className="w-80 d-flex justify-content-center m-3">
                <Button
                  type="primary"
                  className="primary-background text-normal-20 text-dark"
                  onClick={() => {
                    navigator.clipboard.writeText(`${email}`);
                    message.success(I18n.t("Link copied"));
                  }}
                >
                  {I18n.t("Copy link")}
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Applicant;

//  {/* 地址信息 */}
//  <div className="address-input-container margin-bottom-30">
//  {/* title row */}
//  <div className="title-row">
//    <span className="title font-size-25">地址信息</span>
//    <span className="subtitle font-size-20">
//      请提供您所要提供服务的地址 (完成表格后可再次申请其他服务)）
//    </span>
//  </div>
//  <Divider dashed={true} />

//  <div className="input-row">
//    <div className="input-col ">
//      <div className="subtitle margin-bottom-10">服务地址</div>
//      <Input
//        placeholder="Autofill 地址"
//        className="subtitle color-9f"
//      />
//    </div>

//    <div className="input-col">
//      <div className="subtitle  margin-bottom-10">
//        请填写您的地址所对应的类型
//      </div>
//      <div>
//        <Dropdown overlay={menu}>
//          <Button className="input-button-container subtitle">
//            <span className="color-9f">
//              {selectedMenu ? selectedMenu : "公寓"}
//            </span>
//            <DownOutlined />
//          </Button>
//        </Dropdown>
//      </div>
//    </div>
//  </div>
// </div>

// if (
//   (isChangePhone && params.servicePhone) ||
//   !inputVerificationCode ||
//   !params.serviceAddress ||
//   !params.serviceHourseType
// ) {
//   console.log(1, isChangePhone && params.servicePhone);
//   message.error("请完成信息填写再进行下一步");
// } else {
//   const data = {
//     serverId: userId,
//     serverPhone: params.servicePhone,
//     verificationCode: inputVerificationCode,
//   };

//   await axios
//     .post(API_BASE_URL + "user/checkServerVerificationCode.php", data, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     })
//     .then((res) => {
//       console.log("verify phone number result", res.data);

//       // if (res.data.message !== "success") {
//       //   message.error("手机验证码错误，请稍后再试");
//       // } else {

//       //   // history.push(`/serviceapply/basicinfomation?${newRouterParams}`);
//       // }
//       const newRouterParams = MakeUrlParam(params);
//       history.push(`/serviceapply/basicinfomation?${newRouterParams}`);
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// }
