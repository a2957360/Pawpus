import React, { useState, useEffect } from "react";

import { useHistory } from "react-router-dom";

import i18n from "i18n-js";
import axios from "axios";
import { API_BASE_URL } from "../../configs/AppConfig";

import Process from "./components/Process";

import placeholder_pic from "../../assets/img/Success-Dogy.png";

import {
  Divider,
  Modal,
  Radio,
  Menu,
  Dropdown,
  Button,
  Checkbox,
  Row,
  Col,
  message,
  InputNumber,
} from "antd";

import { DownOutlined, DeleteOutlined } from "@ant-design/icons";

import LoadingView from "../../components/loading/LoadingView";

import MakeUrlParam from "../../components/service/MakeUrlParam";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  getServiceCategory,
  getServiceSubCategory,
  getAdditionalService,
  getServiceFacility,
} from "../../redux/actions";

const BasicInfo = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const language = localStorage.getItem("language");

  const {
    serviceCategory,
    serviceSubCategory,
    additionalService,
    serviceFacilityList,
  } = useSelector((state) => state.serviceData);

  const emptyData = {
    serviceCategory: null,
    serviceSubCategory: {},
    serviceExtra: {},
    serviceFacility: [],
    serviceStock: "1",
    servicePrice: null,
    serviceLanguage: [],
  };

  const urlParams = new URLSearchParams(window.location.search);

  const entries = urlParams.entries();
  const paredUrlParams = {};
  for (const entry of entries) {
    paredUrlParams[entry[0]] = JSON.parse(entry[1]);
  }

  const [params, setParams] = useState(
    Object.assign(emptyData, paredUrlParams)
  );

  useEffect(() => {
    dispatch(getServiceCategory());
    dispatch(getAdditionalService());
    dispatch(getServiceFacility());
    getCustomerServiceInfo();
    //如果是修改服务过来的，用urlPrams里选好的宠物类型来获取subcategory
    if (params.serviceCategory) {
      dispatch(getServiceSubCategory(params.serviceCategory));
    }
  }, [dispatch]);

  useEffect(() => {
    //取出urlParams里subcagtegory的值，转换成这种格式{id: "", name: "", value : ""}
    let transformedSubCategoryRow = [];
    if (Object.keys(params.serviceSubCategory).length > 0) {
      const selectedSubCategoryKeys = Object.keys(params.serviceSubCategory);
      let i;
      for (i = 0; i < serviceSubCategory?.length; i++) {
        const indexOfKey = selectedSubCategoryKeys.indexOf(
          serviceSubCategory[i].categoryId
        );
        console.log(
          "i am here",
          params.serviceSubCategory,
          params.serviceSubCategory[selectedSubCategoryKeys[indexOfKey]]
        );
        if (indexOfKey > -1) {
          transformedSubCategoryRow.push({
            id: selectedSubCategoryKeys[indexOfKey],
            name: serviceSubCategory[i].categoryName[language],
            value:
              params.serviceSubCategory[selectedSubCategoryKeys[indexOfKey]],
          });
        }
      }
    }
    let transformedServiceExtraRow = [];
    if (Object.keys(params.serviceExtra).length > 0) {
      const selectedExtraKeys = Object.keys(params.serviceExtra);
      let j;
      for (j = 0; j < additionalService?.length; j++) {
        const indexOfKey = selectedExtraKeys.indexOf(
          additionalService[j].categoryId
        );

        if (indexOfKey > -1) {
          transformedServiceExtraRow.push({
            id: selectedExtraKeys[indexOfKey],
            name: additionalService[j].categoryName[language],
            value: params.serviceExtra[selectedExtraKeys[indexOfKey]],
          });
        }
      }
    }

    setSubCategoryRow(transformedSubCategoryRow);
    setServiceExtraRow(transformedServiceExtraRow);
  }, [serviceSubCategory, additionalService]);

  const [subCategoryRow, setSubCategoryRow] = useState([]);
  const [serviceExtraRow, setServiceExtraRow] = useState([]);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [email, setEmail] = useState();

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

  const handleFacilitySelect = (id) => {
    //如果是空，直接加
    if (!params.serviceFacility) {
      setParams({
        ...params,
        serviceFacility: [id],
      });
    } else {
      if (params.serviceFacility.includes(id)) {
        const newArr = params.serviceFacility.filter(
          (element) => element !== id
        );
        setParams({
          ...params,
          serviceFacility: newArr,
        });
      } else {
        setParams({
          ...params,
          serviceFacility: [...params.serviceFacility, id],
        });
      }
    }
  };

  const handleNextPageButton = async () => {
    let subCategoryParam = {};
    let serviceExtraParam = {};
    const res1 = subCategoryRow.map((element) => {
      subCategoryParam[element.id] = element.value;
    });
    const res2 = serviceExtraRow.map((element) => {
      serviceExtraParam[element.id] = element.value;
    });
    const priceOfSub = Object.values(subCategoryParam);
    const priceOfExtra = Object.values(serviceExtraParam);
    const min1 = Math.min(...priceOfSub);
    // const min2 = Math.min(...priceOfExtra);
    // const min = Math.min(min1, min2);

    //添加subCategory和serviceExtra到urlParams
    let temp = params;
    temp["serviceSubCategory"] = subCategoryParam;
    temp["serviceExtra"] = serviceExtraParam;
    temp["servicePrice"] = min1;

    // 查是否有没有填的值
    if (
      params.serviceLanguage.length === 0 ||
      !params.serviceCategory ||
      subCategoryRow.length === 0 ||
      Object.keys(serviceExtraParam).includes("") ||
      Object.keys(subCategoryParam).includes("") ||
      params.serviceFacility.length === 0 ||
      Object.values(params.serviceSubCategory).includes(0) ||
      Object.values(params.serviceExtra).includes(0)
    ) {
      message.error(i18n.t("Please complete the information"));
    } else {
      const newRouterParams = MakeUrlParam(temp);
      history.push({
        pathname: `/serviceapply/detail`,
        search: newRouterParams,
        state: props.location.state,
      });
    }
  };

  if (!serviceCategory || !additionalService || !serviceFacilityList) {
    return <LoadingView />;
  }

  const petCategoryMenu = (
    <Menu
      onClick={(e) => {
        setParams({
          ...params,
          serviceCategory: e.key,
        });
        dispatch(getServiceSubCategory(e.key));
      }}
    >
      {serviceCategory.map((element) => {
        return (
          <Menu.Item
            key={element.categoryId}
            name={element.categoryName[language]}
          >
            {element.categoryName[language]}
          </Menu.Item>
        );
      })}
    </Menu>
  );

  const subCategoryMenu = (index) => {
    return (
      <Menu
        onClick={(e) => {
          const isInArr = subCategoryRow.filter((i) => i.id === e.key);
          if (isInArr.length > 0) {
            message.error(
              i18n.t("You have added this service, please select another one")
            );
          } else {
            const res = [
              ...subCategoryRow.slice(0, index),
              {
                ...subCategoryRow[index],
                name: e.item.props.name,
                id: e.key,
                value: 1,
              },
              ...subCategoryRow.slice(index + 1),
            ];
            setSubCategoryRow(res);
          }
        }}
      >
        {serviceSubCategory.map((element) => {
          return (
            <Menu.Item
              key={element.categoryId}
              name={element.categoryName[language]}
            >
              {element.categoryName[language]}
            </Menu.Item>
          );
        })}
      </Menu>
    );
  };

  const renderSubCategoryRow = subCategoryRow.map((element, index) => {
    return (
      <div key={index} className="each-service margin-bottom-20">
        <Dropdown
          className="service-type-dropdown"
          overlay={subCategoryMenu(index)}
        >
          <Button className="service-dropdown-button input-font">
            <span className="color-9f text-16">
              {element.name ? element.name : i18n.t("Select Standard")}
            </span>
            <DownOutlined />
          </Button>
        </Dropdown>

        {/* price input */}
        <InputNumber
          min={1}
          value={element.value ? element.value : 1}
          formatter={(value) =>
            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          onChange={(e) => {
            const res = [
              ...subCategoryRow.slice(0, index),
              {
                ...subCategoryRow[index],
                value: e,
              },
              ...subCategoryRow.slice(index + 1),
            ];
            setSubCategoryRow(res);
          }}
          className="text-16 input-font service-price text-input text-input--grey"
        />
        <span className="text-18 subtitle service-price-day">
          /{i18n.t("Day")}
        </span>

        {/* delete button */}
        <DeleteOutlined
          onClick={() => {
            const res = subCategoryRow.filter((e) => e !== element);
            setSubCategoryRow(res);
          }}
          className="subtitle service-price-day"
        />
      </div>
    );
  });

  const serviceExtraMenu = (index) => {
    return (
      <Menu
        onClick={(e) => {
          const isInArr = serviceExtraRow.filter((i) => i.id === e.key);
          if (isInArr.length > 0) {
            message.error(
              i18n.t("You have added this service, please select another one")
            );
          } else {
            const res = [
              ...serviceExtraRow.slice(0, index),
              {
                ...serviceExtraRow[index],
                name: e.item.props.name,
                id: e.key,
                value: 1,
              },
              ...serviceExtraRow.slice(index + 1),
            ];
            setServiceExtraRow(res);
          }
        }}
      >
        {additionalService.map((element) => {
          return (
            <Menu.Item
              key={element.categoryId}
              name={element.categoryName[language]}
            >
              {element.categoryName[language]}
            </Menu.Item>
          );
        })}
      </Menu>
    );
  };

  const renderServiceExtraRow =
    serviceExtraRow.length > 0
      ? serviceExtraRow.map((element, index) => {
          return (
            <div key={index} className="each-service margin-bottom-20">
              <Dropdown
                className="service-type-dropdown"
                overlay={serviceExtraMenu(index)}
              >
                <Button className="service-dropdown-button input-font">
                  <span className="color-9f text-16">
                    {element.name ? element.name : i18n.t("Select Standard")}
                  </span>
                  <DownOutlined />
                </Button>
              </Dropdown>

              {/* price input */}
              <InputNumber
                min={1}
                value={element.value ? element.value : 1}
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                onChange={(e) => {
                  const res = [
                    ...serviceExtraRow.slice(0, index),
                    {
                      ...serviceExtraRow[index],
                      value: e,
                    },
                    ...serviceExtraRow.slice(index + 1),
                  ];
                  setServiceExtraRow(res);
                }}
                className="text-16 input-font service-price text-input text-input--grey"
              />
              <span className="text-18 subtitle service-price-day">
                /{i18n.t("Time")}
              </span>

              {/* delete button */}
              <DeleteOutlined
                onClick={() => {
                  const res = serviceExtraRow.filter((e) => e !== element);
                  setServiceExtraRow(res);
                }}
                className="subtitle service-price-day"
              />
            </div>
          );
        })
      : null;

  const renderFacility = serviceFacilityList.map((element, index) => {
    return (
      <Col
        className="margin-bottom-20"
        key={index}
        xs={{ span: 12 }}
        sm={{ span: 8 }}
        lg={{ span: 6 }}
      >
        <Checkbox
          checked={
            params.serviceFacility.includes(element.categoryId) ? true : false
          }
          className="text-16 text-grey-8"
          onChange={() => handleFacilitySelect(element.categoryId)}
        >
          {element.categoryName[language]}
        </Checkbox>
      </Col>
    );
  });

  // 给宠物种类dropdown初始值
  let selectedCategoryName;
  const selectedCategory = serviceCategory.filter(
    (element) => element.categoryId === params.serviceCategory
  );

  if (selectedCategory.length === 0) {
    selectedCategoryName = i18n.t("Select pet type");
  } else {
    selectedCategoryName = selectedCategory[0].categoryName[language];
  }

  const languageOptions = [
    { label: i18n.t("Chinese"), value: 0 },
    { label: i18n.t("English"), value: 1 },
  ];

  return (
    <div className="basicInfo-wrapper">
      {/* 进度条 */}
      <div className="process-container">
        <Process current={1} />
      </div>

      <div className="content-container">
        {/* 居中的div */}
        <div className="inner-container">
          {/* 申请服务 */}
          <div className="address-input-container margin-bottom-30">
            {/* title row */}
            <div className="margin-bottom-10">
              <div className="title-row-section margin-bottom-10">
                <div>
                  <span className="text-20 text-bold text-grey-8 mr-3">
                    {i18n.t("Service Facility")}
                  </span>
                </div>
                <div
                  onClick={() => {
                    setContactModalVisible(true);
                  }}
                  className="service-price-day record-14-70 span-mouse-click underline"
                >
                  {i18n.t("Could not find your setting options, contact us!")}
                </div>
              </div>

              {/* 服务语言 */}
              <div>
                <span className="text-16 text-grey-8 mr-3">
                  {i18n.t("Service Language")}
                </span>
                <Checkbox.Group
                  options={languageOptions}
                  defaultValue={params.serviceLanguage}
                  onChange={(checkedValues) => {
                    setParams({
                      ...params,
                      serviceLanguage: checkedValues,
                    });
                  }}
                />
                {/* <Radio.Group
                  defaultValue={
                    params.serviceLanguage ? params.serviceLanguage : 0
                  }
                  onChange={(e) => {
                    setParams({
                      ...params,
                      serviceLanguage: e.target.value,
                    });
                  }}
                >
                  <Radio className="record-14-70 margin-right-40" value={0}>
                    中文
                  </Radio>
                  <Radio className="record-14-70" value={1}>
                    English
                  </Radio>
                </Radio.Group> */}
              </div>
            </div>

            <div className="input-row">
              <div className="input-col ">
                <div className="text-16 text-grey-8 margin-bottom-10">
                  {i18n.t("Pet Type")}
                </div>
                <div className="two-inputs">
                  <Dropdown className="phone-input" overlay={petCategoryMenu}>
                    <Button className="input-button-container input-font">
                      <span className="color-9f text-16">
                        {selectedCategoryName}
                      </span>
                      <DownOutlined />
                    </Button>
                  </Dropdown>
                </div>
              </div>

              <div className="input-col">
                <div className=" margin-bottom-10">
                  <span className="text-16 text-grey-8 margin-right-10">
                    {i18n.t("Enter the maximum quantity of pet care")}
                  </span>
                  <span className="warning-subtitle-font">
                    {i18n.t("Suggesting no more than 5 pets")}
                  </span>
                </div>

                <InputNumber
                  className="text-16 input-font petStock-input text-input text-input--grey"
                  min={1}
                  defaultValue={params.serviceStock}
                  onChange={(e) =>
                    setParams({
                      ...params,
                      serviceStock: e,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* 设置规格 */}
          <div className="address-input-container margin-bottom-30">
            {/* title row */}
            <div className="title-row-section">
              <div>
                <span className="text-20 text-bold text-grey-8 mr-3">
                  {i18n.t("Standard Setting")}
                </span>
                <span className="text-16 text-grey-8">
                  {i18n.t("Set your service standard and price")}
                </span>
              </div>
              <div className="d-flex">
                <div
                  onClick={() => {
                    setContactModalVisible(true);
                  }}
                  className="service-price-day record-14-70 span-mouse-click underline mr-2"
                >
                  {i18n.t("Could not find your setting options, contact us!")}
                </div>
                <Button
                  className="text-14"
                  onClick={() => {
                    setSubCategoryRow([
                      ...subCategoryRow,
                      { id: "", name: "", value: "" },
                    ]);
                  }}
                  disabled={
                    !serviceSubCategory ||
                    subCategoryRow.length >= serviceSubCategory.length
                      ? true
                      : false
                  }
                >
                  {i18n.t("Add Standard")}
                </Button>
              </div>
            </div>
            <Divider dashed={true} />

            <div className="service-row">{renderSubCategoryRow}</div>
          </div>

          {/* 设置额外服务 */}
          <div className="address-input-container margin-bottom-30">
            {/* title row */}
            <div className="title-row-section">
              <div>
                <span className="text-20 text-bold text-grey-8 mr-3">
                  {i18n.t("Extra Service Setting")}
                </span>
                <span className="text-16 text-grey-8">
                  {i18n.t("Set your service standard and price")}
                </span>
              </div>
              <div className="d-flex">
                <div
                  onClick={() => {
                    setContactModalVisible(true);
                  }}
                  className="service-price-day record-14-70 span-mouse-click underline mr-2"
                >
                  {i18n.t("Could not find your setting options, contact us!")}
                </div>
                <Button
                  className="text-14"
                  onClick={() => {
                    setServiceExtraRow([
                      ...serviceExtraRow,
                      { id: "", name: "", value: "" },
                    ]);
                  }}
                  disabled={
                    serviceExtraRow.length < additionalService.length
                      ? false
                      : true
                  }
                >
                  {i18n.t("Add Standard")}
                </Button>
              </div>
            </div>
            <Divider dashed={true} />

            <div className="service-row">{renderServiceExtraRow}</div>
          </div>

          {/* 服务设施 */}
          <div className="address-input-container mb-5">
            <div className="title-row-section ">
              <div>
                <span className="text-20 text-bold text-grey-8 mr-3">
                  {i18n.t("Service Facility")}
                </span>
                <span className="text-16 text-grey-8">
                  {i18n.t("Select the facilities you are offering")}
                </span>
              </div>
              <div
                onClick={() => {
                  setContactModalVisible(true);
                }}
                className="service-price-day record-14-70 span-mouse-click underline "
              >
                {i18n.t("Could not find your setting options, contact us!")}
              </div>
            </div>

            <Divider dashed />

            <Row className="">{renderFacility}</Row>
          </div>

          {/* 返回按钮 */}
          <div className="proceed-buttons-container  mb-3">
            <Button
              onClick={() => {
                const newRouterParams = MakeUrlParam(params);
                history.push({
                  pathname: `/serviceapply/applicant`,
                  search: newRouterParams,
                  state: props.location.state,
                });
              }}
              className="transparent-button w-20 mr-3"
            >
              {i18n.t("Back")}
            </Button>

            {/* 下一步按钮 */}
            <Button
              onClick={() => handleNextPageButton()}
              className="primary-button w-20"
            >
              {i18n.t("Next")}
            </Button>
          </div>
        </div>
      </div>

      {/* 弹窗 */}
      <Modal
        visible={contactModalVisible}
        onCancel={() => setContactModalVisible(false)}
        footer={null}
      >
        <div className="d-flex flex-column align-items-center">
          <img src={placeholder_pic} alt="success-placeholder" />
          <span className="text-normal text-20 grey-service-price">
            {/* {i18n.t("Please copy the following link to share")} */}
            {i18n.t("Please email us your advice")}
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
                message.success(i18n.t("Link copied"));
              }}
            >
              {i18n.t("Copy link")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BasicInfo;
