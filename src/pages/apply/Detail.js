import React, { useState } from "react";

import { useHistory } from "react-router-dom";

import Process from "./components/Process";

import MakeUrlParam from "../../components/service/MakeUrlParam";

// import ImageGallery from "react-image-gallery";

import moment from "moment";

import {
  Divider,
  Input,
  Button,
  message,
  Upload,
  Menu,
  Dropdown,
  Calendar,
  Radio,
  Row,
  Col,
} from "antd";

import {
  DownOutlined,
  LoadingOutlined,
  PlusOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

import axios from "axios";
import Compressor from "compressorjs";
import { API_BASE_URL } from "../../configs/AppConfig";
import I18n from "i18n-js";

const { TextArea } = Input;

const Detail = (props) => {
  const history = useHistory();
  const userId = localStorage.getItem("userId");

  const emptyData = {
    serviceName: null,
    serviceImage: [],
    serviceDescription: null,
    serviceRequirement: null,
    serviceBlockDate: [],
    endDate: moment().add(3, "months").format("YYYY-MM"),
    checkinTime: null,
    checkoutTime: null,
  };

  // 从url中取下参数，parse好
  const urlParams = new URLSearchParams(window.location.search);
  const entries = urlParams.entries();
  const paredUrlParams = {};
  for (const entry of entries) {
    paredUrlParams[entry[0]] = JSON.parse(entry[1]);
  }

  const [params, setParams] = useState(
    Object.assign(emptyData, paredUrlParams)
  );

  const [imageUrl, setImageUrl] = useState(
    params.serviceImage.length > 0 ? params.serviceImage[0] : ""
  );

  const [radioButtonValue, setRadioButtonValue] = useState(
    params.endDate
      ? Math.ceil(moment(params.endDate).diff(moment(), "months", true))
      : 3
  );

  const [loading, setLoading] = useState(false);

  // 生成9-21点时间list
  const generateTimeList = (startTime) => {
    const items = [];
    new Array(13).fill().forEach((acc, index) => {
      items.push(moment({ hour: index + startTime }).format("HH:mm"));
    });
    return items;
  };
  const todayTimeList = generateTimeList(9);
  const tomorrowTimeList = generateTimeList(9);

  const checkInTimeMenu = (
    <Menu
      onClick={(e) =>
        setParams({
          ...params,
          checkinTime: e.key,
        })
      }
    >
      {todayTimeList.map((element) => {
        return <Menu.Item key={element}>{element}</Menu.Item>;
      })}
    </Menu>
  );
  const checkOutTimeMenu = (
    <Menu
      onClick={(e) =>
        setParams({
          ...params,
          checkoutTime: e.key,
        })
      }
    >
      {tomorrowTimeList.map((element) => {
        return <Menu.Item key={element}>{element}</Menu.Item>;
      })}
    </Menu>
  );

  //upload image functions
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error(I18n.t("You can only upload JPG/PNG file!"));
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error(I18n.t("Image must smaller than 2MB!"));
    }
    return isJpgOrPng && isLt2M;
  };

  const handleImageUpload = (file) => {
    new Compressor(file, {
      quality: 0.2,
      convertSize: 30000000,
      success(result) {
        const formData = new FormData();
        formData.append("uploadImages", result, result.name);
        formData.append("isUploadImage", "1");
        axios.post(`${API_BASE_URL}imageModule.php`, formData).then((res) => {
          if (res.data.message === "success") {
            setLoading(false);

            setImageUrl(res.data.data[0]);
            setParams({
              ...params,
              serviceImage: [...params.serviceImage, res.data.data[0]],
            });
          } else {
            message.err(I18n.t("Upload failed"));
          }
        });
      },
      error(err) {
        message.error("Compress Failed");
      },
    });
  };

  const handleImageChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (imageUrl) => {
        setImageUrl(imageUrl);
        setLoading(false);
      });
    }
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  //calender functions
  const handleDateSelect = (date) => {
    const formatedDate = date.format("YYYY-MM-DD");

    if (params.serviceBlockDate.length === 0) {
      setParams({
        ...params,
        serviceBlockDate: [formatedDate],
      });
    } else {
      const indexOfDate = params.serviceBlockDate.indexOf(formatedDate);
      //被选过
      if (indexOfDate > -1) {
        const removedDateList = params.serviceBlockDate.filter(
          (element) => element !== formatedDate
        );
        setParams({
          ...params,
          serviceBlockDate: removedDateList,
        });
      }
      //没有被选过
      else {
        setParams({
          ...params,
          serviceBlockDate: [...params.serviceBlockDate, formatedDate],
        });
      }
    }
  };

  const handleAddAll = (value) => {
    let temp = [];
    const numberOfDays = value.value.daysInMonth() - value.value._d.getDate();

    var i;
    for (i = 0; i < numberOfDays; i++) {
      const formatedDate = value.value.add(1, "day").format("YYYY-MM-DD");
      temp.push(formatedDate);
    }
    //加上今天
    temp.push(value.value._i);
    const sumDates = temp.concat(params.serviceBlockDate);
    let uniqueSelectedDates = [...new Set(sumDates)];
    setParams({
      ...params,
      serviceBlockDate: uniqueSelectedDates,
    });
  };

  const handleClearThisMonth = (value) => {
    let temp = [];
    const numberOfDays = value.value.daysInMonth() - value.value._d.getDate();

    var i;
    for (i = 0; i < numberOfDays; i++) {
      const formatedDate = value.value.add(1, "day").format("YYYY-MM-DD");
      temp.push(formatedDate);
    }
    //加上今天
    temp.push(value.value._i);
    const reducedArray = params.serviceBlockDate.filter(
      (element) => !temp.includes(element)
    );
    setParams({
      ...params,
      serviceBlockDate: reducedArray,
    });
    // setSelectedDate(reducedArray);
  };

  const renderCalenderHeader = (value, type) => {
    const month = value.value.format("YYYY MM");

    return (
      <div className="calender-header-container">
        <span className="record-14-70">{month}</span>

        <Button onClick={() => handleAddAll(value)} className="record-14-70">
          {I18n.t("Select All")}
        </Button>
        <Button
          onClick={() => {
            handleClearThisMonth(value);
          }}
          className="record-14-70"
        >
          {I18n.t("Clear")}
        </Button>
      </div>
    );
  };

  const dateFullCellRender = (date) => {
    const currentDate = date.format("DD");
    const today = date.format("YYYY-MM-DD");
    const indexOfToday = params.serviceBlockDate.indexOf(today);
    return (
      <div className={indexOfToday > -1 && "disable-style"}>{currentDate}</div>
    );
  };

  var monthList = [];
  var i;
  for (i = 0; i < radioButtonValue; i++) {
    monthList.push(moment().add(i, "months").format("YYYY-MM-DD"));
  }

  const renderCalendar = monthList.map((element, index) => {
    //validrange 里放当前月份的第一天和最后一天

    let start, end;
    if (index === 0) {
      start = moment(element);
      end = moment().format("YYYY-MM-") + moment().daysInMonth();
    } else {
      start = moment(element.slice(0, 7) + "-01");
      end = moment(element.slice(0, 8) + moment(element).daysInMonth());
    }

    return (
      <Calendar
        key={index}
        fullscreen={false}
        // disabledDate={disabledDate}
        onSelect={handleDateSelect}
        headerRender={renderCalenderHeader}
        dateFullCellRender={dateFullCellRender}
        validRange={[start, end]}
        value={start}
        className="margin-bottom-30"
      />
    );
  });

  const handleSubmitButton = async (actionType) => {
    let temp = params;
    temp["userId"] = userId;
    if (
      !params.serviceName ||
      !params.serviceDescription ||
      !params.serviceRequirement ||
      params.serviceImage.length === 0 ||
      !params.checkinTime ||
      !params.checkoutTime ||
      !params.endDate
    ) {
      message.error(I18n.t("Please complete the information"));
    } else {
      console.log("add service input", params);
      await axios
        .post(API_BASE_URL + "service/addService.php", params, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log("add service result", res.data);
          if (res.data.message === "success") {
            //保存草稿，跳转服务者中心
            if (actionType === "save") {
              history.push("/service/center");
            }
            //修改状态为审核中
            else if (actionType === "submit") {
              const data = {
                userId: userId,
                serviceId: res.data.data.serviceId,
              };
              console.log("update service to check input", data);
              axios
                .post(API_BASE_URL + "service/updateServiceToCheck.php", data, {
                  headers: {
                    "Content-Type": "application/json",
                  },
                })
                .then((updateServiceResult) => {
                  console.log("updateServiceResult", updateServiceResult);
                  if (updateServiceResult.data.message === "success") {
                    history.push("/serviceapply/success");
                  } else {
                    message.error(I18n.t("Submit failed"));
                  }
                });
            }
          } else {
            message.error(I18n.t("Add service failed"));
          }
        })
        .catch((error) => {});
    }
  };

  const handleEditPulishedService = (actionType) => {
    axios
      .post(API_BASE_URL + "service/updateService.php", params, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((updateServiceResult) => {
        if (updateServiceResult.data.message === "success") {
          if (actionType === "submit") {
            // 修改服务状态为审核中
            const data = {
              userId: userId,
              serviceId: params.serviceId,
            };
            axios
              .post(API_BASE_URL + "service/updateServiceToCheck.php", data, {
                headers: {
                  "Content-Type": "application/json",
                },
              })
              .then((res) => {
                if (res.data.message === "success") {
                  history.push("/serviceapply/success");
                } else {
                  message.error(I18n.t("Submit failed"));
                }
              });
          } else {
            //保存草稿
            history.push({
              pathname: "/serviceapply/success",
              state: "save",
            });
          }
        } else {
          message.error(I18n.t("Submit failed"));
        }
      });
  };

  if (!userId) {
    message.error(I18n.t("Please login"));
    history.push("/");
  }

  return (
    <div className="detail-wrapper">
      {/* 进度条 */}
      <div className="process-container">
        <Process current={2} />
      </div>

      {/* 输入和按钮 */}
      <div className="content-container">
        {/* 居中的div */}
        <div className="inner-container">
          {/* 服务详情 */}
          <div className="address-input-container mb-3">
            {/* title row */}
            <div className="title-row ">
              <span className="text-20 text-bold text-grey-8 mr-3">
                {I18n.t("Service Detail")}
              </span>
              <span className="text-16 text-grey-8">
                {I18n.t("Complete your service information")}
              </span>
            </div>

            <Divider dashed />

            {/* content & photo */}
            <Row className="content-photo-container">
              {/* content */}
              <Col
                xs={24}
                sm={24}
                md={12}
                lg={12}
                className="primary-input-container content-container"
              >
                <div className="text-16 text-grey-8 mb-3">
                  {I18n.t("Service title and content")} (
                  {I18n.t("Suggesting Bilingual")})
                </div>
                <Input
                  defaultValue={params.serviceName}
                  onChange={(e) =>
                    setParams({
                      ...params,
                      serviceName: e.target.value,
                    })
                  }
                  className="primary-input text-16 text-grey-8 mb-3"
                  placeholder={I18n.t("Please write down the service title")}
                />
                <TextArea
                  defaultValue={params.serviceDescription}
                  onChange={(e) =>
                    setParams({
                      ...params,
                      serviceDescription: e.target.value,
                    })
                  }
                  className="primary-input text-16 text-grey-8 mb-3"
                  placeholder={I18n.t("Please write down the description")}
                  maxLength={200}
                />

                <TextArea
                  defaultValue={params.serviceRequirement}
                  onChange={(e) =>
                    setParams({
                      ...params,
                      serviceRequirement: e.target.value,
                    })
                  }
                  className="primary-input text-16 text-grey-8 mb-3"
                  placeholder={I18n.t("Please write down the requirement")}
                  maxLength={200}
                />
              </Col>

              {/* photo */}
              <Col xs={24} sm={24} md={12} lg={12} className="photo-container">
                <div className="text-16 text-grey-8 mb-3">
                  {I18n.t("Upload Images")}
                </div>
                <div className="upload-section margin-bottom-10">
                  {/* 未上传图片前上传区域 */}
                  <div className="upload-container">
                    {!imageUrl ? (
                      <Upload
                        accept="image/*"
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        maxCount={6}
                        action={handleImageUpload}
                        beforeUpload={beforeUpload}
                        onChange={handleImageChange}
                      >
                        <div>
                          {loading ? <LoadingOutlined /> : <PlusOutlined />}
                          <div style={{ marginTop: 8 }}>{I18n.t("Upload")}</div>
                        </div>
                      </Upload>
                    ) : (
                      //箭头
                      <>
                        {params.serviceImage?.length > 0 && (
                          <ArrowLeftOutlined
                            onClick={() => {
                              const indexOfCurrent =
                                params.serviceImage.indexOf(imageUrl);
                              if (indexOfCurrent > 0) {
                                console.log("left", indexOfCurrent);
                                setImageUrl(
                                  params.serviceImage[indexOfCurrent - 1]
                                );
                              }
                            }}
                            className={
                              params.serviceImage.indexOf(imageUrl) > 0
                                ? "center-item left-arrow"
                                : "center-item left-arrow cursorauto"
                            }
                          />
                        )}
                        <img
                          src={imageUrl}
                          alt="avatar"
                          className="selected-image"
                        />
                        {params.serviceImage?.length > 0 && (
                          <ArrowRightOutlined
                            onClick={() => {
                              const indexOfCurrent =
                                params.serviceImage.indexOf(imageUrl);

                              if (
                                indexOfCurrent <
                                params.serviceImage.length - 1
                              ) {
                                setImageUrl(
                                  params.serviceImage[indexOfCurrent + 1]
                                );
                              }
                            }}
                            className={
                              params.serviceImage.indexOf(imageUrl) <
                              params.serviceImage.length - 1
                                ? "center-item right-arrow"
                                : "center-item right-arrow cursorauto"
                            }
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="meesage-button-container">
                  {params.serviceImage?.length > 0 && (
                    <div
                      onClick={() => {
                        const indexOfCurrent =
                          params.serviceImage.indexOf(imageUrl);

                        const newImageList = params.serviceImage.filter(
                          (element) => element !== imageUrl
                        );

                        if (params.serviceImage.length === 1) {
                          setImageUrl("");
                        } else {
                          if (indexOfCurrent + 1 < params.serviceImage.length) {
                            setImageUrl(
                              params.serviceImage[indexOfCurrent + 1]
                            );
                          } else {
                            setImageUrl(
                              params.serviceImage[indexOfCurrent - 1]
                            );
                          }
                        }
                        setParams({
                          ...params,
                          serviceImage: newImageList,
                        });
                      }}
                      className="record-14-70 span-mouse-click"
                    >
                      <Button className="white-button button-font-size-16">
                        {I18n.t("Delete")}
                      </Button>
                    </div>
                  )}
                  <div>
                    <Upload
                      accept="image/*"
                      className="d-flex"
                      showUploadList={false}
                      maxCount={6}
                      action={handleImageUpload}
                      beforeUpload={beforeUpload}
                      onChange={handleImageChange}
                    >
                      <Button className="white-button button-font-size-16">
                        {I18n.t("Keep uploading")}
                      </Button>
                    </Upload>
                  </div>
                </div>
              </Col>
            </Row>

            {/* message */}
            {/* <div className="message-font-14-70 span-mouse-click mt-3">
              不知道写什么，查看参考
            </div> */}
          </div>

          {/* 服务时间 */}
          <div className="address-input-container mb-5">
            {/* title row */}
            <div className="title-row ">
              <span className="text-20 text-bold text-grey-8 mr-3">
                {I18n.t("Service Time")}
              </span>
              <span className="text-16 text-grey-8">
                {I18n.t("Setup your service time")}
              </span>
            </div>

            <Divider className="tablet-hide" dashed />

            <Row className="date-setting-container">
              {/* 设置服务时间 */}
              <Col
                xs={24}
                sm={24}
                md={11}
                lg={11}
                className="available-date-setting"
              >
                {/* 日期 */}
                <div className="title-subtitle-section margin-bottom-20">
                  <span className="text-20 text-bold text-grey-8 margin-bottom-10">
                    {I18n.t("Set service time")}
                  </span>
                  <span className="text-16 text-grey-8">
                    {I18n.t("Select your service time")}
                  </span>
                </div>
                <div className="margin-bottom-20">
                  <Dropdown overlay={checkInTimeMenu}>
                    <Button className="input-button-container description-font">
                      <div>
                        <span className="description-font margin-right-30">
                          {I18n.t("Today")}
                        </span>
                        <span className="input-font ">
                          {params.checkinTime}
                        </span>
                      </div>
                      <DownOutlined />
                    </Button>
                  </Dropdown>
                </div>
                <div className="margin-bottom-20">
                  <Dropdown overlay={checkOutTimeMenu}>
                    <Button className="input-button-container description-font">
                      <div>
                        <span className="description-font margin-right-30">
                          {I18n.t("Nextday")}
                        </span>
                        <span className="input-font ">
                          {params.checkoutTime}
                        </span>
                      </div>
                      <DownOutlined />
                    </Button>
                  </Dropdown>
                </div>

                {/* 月份 */}
                <div className="title-subtitle-section margin-bottom-20">
                  <span className="text-20 text-bold text-grey-8 mt-3 margin-bottom-10">
                    {I18n.t("Service Month")}
                  </span>
                </div>

                <div className="mb-5">
                  <Radio.Group
                    onChange={(e) => {
                      setRadioButtonValue(e.target.value);
                      setParams({
                        ...params,
                        endDate: moment()
                          .add(e.target.value, "months")
                          .format("YYYY-MM"),
                      });
                    }}
                    className="month-radio-group-container radio--primary"
                    name="radiogroup"
                    defaultValue={
                      params.endDate
                        ? Math.ceil(
                            moment(params.endDate).diff(
                              moment(),
                              "months",
                              true
                            )
                          )
                        : 3
                    }
                  >
                    <Radio value={3} className="margin-bottom-10">
                      {I18n.t("Three Months")}
                    </Radio>
                    <Radio value={6}>{I18n.t("Six Months")}</Radio>
                  </Radio.Group>
                </div>
              </Col>

              <Divider
                xs={0}
                sm={0}
                md={2}
                lg={2}
                className="veritical-divider-font"
                type={"vertical"}
              />

              {/* 禁用服务时间 */}
              <Col
                xs={24}
                sm={24}
                md={11}
                lg={11}
                className="unavailable-setting"
              >
                <div className="title-subtitle-section margin-bottom-20">
                  <span className="text-20 text-bold text-grey-8 margin-bottom-10">
                    {I18n.t("Ban some service time")}
                  </span>
                  <span className="text-16 text-grey-8">
                    {I18n.t(
                      "Please select the dates which you do not provide service"
                    )}
                  </span>
                </div>

                {renderCalendar}
              </Col>
            </Row>
          </div>

          {/* 返回按钮 */}
          <div className="proceed-buttons-container  margin-bottom-30">
            <Button
              onClick={() => {
                const newRouterParams = MakeUrlParam(params);
                history.push({
                  pathname: `/serviceapply/basicinfomation`,
                  search: newRouterParams,
                  state: props.location.state,
                });
              }}
              className="transparent-button w-20 mr-3"
            >
              {I18n.t("Back")}
            </Button>

            {/* 下一步按钮 */}
            <Button
              onClick={() => {
                console.log("1props.location.state", props.location.state);
                if (
                  props.location.state !== undefined &&
                  props.location.state
                ) {
                  handleEditPulishedService("save");
                } else {
                  handleSubmitButton("save");
                }
              }}
              className="white-button w-20 mr-3"
            >
              {I18n.t("Save Draft")}
            </Button>
            <Button
              onClick={() => {
                console.log("2props.location.state", props.location.state);
                if (
                  props.location.state !== undefined &&
                  props.location.state
                ) {
                  handleEditPulishedService("submit");
                } else {
                  handleSubmitButton("submit");
                }
              }}
              className="primary-button w-20"
            >
              {I18n.t("Submit")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
