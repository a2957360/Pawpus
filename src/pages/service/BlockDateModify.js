import React, { useState } from "react";

//packages
import moment from "moment";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../configs/AppConfig";

import {
  Divider,
  Button,
  Dropdown,
  Radio,
  Row,
  Col,
  Calendar,
  Menu,
  message,
} from "antd";

import { DownOutlined } from "@ant-design/icons";

//components
import BlockDateModifyOrderManage from "./components/BlockDateModifyOrderManage";
import I18n from "i18n-js";

const BlockDateModify = (props) => {
  const history = useHistory();

  const { state } = props.location;

  const [params, setParams] = useState({
    serviceId: state.serviceId,
    serviceBlockDate:
      state.serviceBlockDate && state.serviceBlockDate.length > 0
        ? state.serviceBlockDate
        : [],
    endDate: state.endDate,
    checkinTime: state.checkinTime,
    checkoutTime: state.checkoutTime,
  });

  const [radioButtonValue, setRadioButtonValue] = useState(
    params.endDate
      ? Math.floor(moment(params.endDate).diff(moment(), "months", true))
      : 3
  );

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

  const handleSubmitButton = async () => {
    await axios
      .post(API_BASE_URL + "service/updateServiceDate.php", params, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.data.message === "success") {
          // 返回服务者中心页面
          history.goBack();
        } else {
          message.error(I18n.t("Modify time failed"));
        }
      })
      .catch((error) => {});
  };

  if (!state) {
    message.error(I18n.t("This service does not exist"));
    history.push("/service/center");
  }
  return (
    <div className="blockdate-modify-wrapper ">
      <div className="inner-container ">
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
              className="available-date-setting margin-right-20"
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
                      <span className="input-font ">{params.checkinTime}</span>
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
                      <span className="input-font ">{params.checkoutTime}</span>
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
                      ? Math.floor(
                          moment(params.endDate).diff(moment(), "months", true)
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
              className="unavailable-setting margin-left-20"
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

        {/* 保存按钮 */}
        <div className="proceed-buttons-container  margin-bottom-30">
          <Button
            onClick={() => history.goBack()}
            className="transparent-button w-20 mr-3"
          >
            {I18n.t("Return")}
          </Button>
          <Button
            onClick={() => handleSubmitButton()}
            className="primary-button w-20 mr-3"
          >
            {I18n.t("Save Draft")}
          </Button>
        </div>

        <Divider />
        <div>
          <BlockDateModifyOrderManage
            serviceData={`serviceId=${state.serviceId}&serverId=${state.userId}`}
          />
        </div>
      </div>
    </div>
  );
};

export default BlockDateModify;
