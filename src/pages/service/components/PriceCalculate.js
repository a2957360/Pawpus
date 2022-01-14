import { useState, useEffect } from "react";
import {
  DatePicker,
  Divider,
  InputNumber,
  Button,
  message,
  Row,
  Col,
} from "antd";
import { CalendarOutlined, CalculatorOutlined } from "@ant-design/icons";
import moment from "moment";
import { useHistory } from "react-router-dom";
import MakeUrlParam from "../../../components/service/MakeUrlParam";
import i18n from "i18n-js";

//redux
import { useSelector } from "react-redux";

const PriceCalculate = ({ searchData, handleMakeOrder }) => {
  const history = useHistory();
  const { RangePicker } = DatePicker;

  const language = localStorage.getItem("language");

  const [selectedStart, setSelectedStart] = useState(
    searchData.startDate && searchData.startDate
  );
  const [selectedEnd, setSelectedEnd] = useState(
    searchData.endDate && searchData.endDate
  );
  const [closeBlockDate, setCloseBlockDate] = useState(
    searchData.closeBlockDate && searchData.closeBlockDate
  );

  const [buttonDisable, setButtonDisable] = useState(false);

  //redux state
  const { serviceSubCategory, serviceExtra, serviceId, serviceStock } =
    useSelector((state) => state.serviceData.serviceDetail);

  const serviceDates = useSelector((state) => state.serviceData.serviceDates);

  useEffect(() => {
    //检测已选的日期取件里有没有blockdate
    if (searchData.startDate && searchData.endDate) {
      if (getDates(searchData.startDate, searchData.endDate)) {
        message.error(
          i18n.t(
            "There are banned dates among the dates you have selected, please select again"
          )
        );
      }
    }
  }, []);

  function getDates(start, end) {
    var dateArray = [];
    var sd = moment(start);
    var ed = moment(end);
    let subCategoryQuantity =
      searchData["serviceOrderPetInfoInput"].length !== 0
        ? searchData["serviceOrderPetInfoInput"]
        : serviceSubCategory;
    const petStock = subCategoryQuantity.reduce((accumulator, currentValue) => {
      if (currentValue.number !== undefined) {
        return accumulator + Number(currentValue.number);
      } else {
        return accumulator + 0;
      }
    }, 0);

    while (sd <= ed) {
      dateArray.push(moment(sd).format("YYYY-MM-DD"));
      sd = moment(sd).add(1, "days");
    }

    // const blockDatePetStock = Object.values(serviceDates);
    // const blockDateList = Object.keys(serviceDates);

    for (const d of dateArray) {
      if (serviceDates[d] && serviceDates[d]["number"] < petStock) {
        setButtonDisable(true);
        return true;
      }
    }

    // if (blockDateList.length > 0) {
    //   const isInsideBlockDate = dateArray.some((e) =>
    //     blockDateList.includes(e)
    //   );

    //   setButtonDisable(isInsideBlockDate);
    //   return isInsideBlockDate;
    // }
  }

  let serviceExtraQuantity =
    searchData["serviceOrderExtraInput"].length !== 0
      ? searchData["serviceOrderExtraInput"]
      : serviceExtra;

  let subCategoryQuantity =
    searchData["serviceOrderPetInfoInput"].length !== 0
      ? searchData["serviceOrderPetInfoInput"]
      : serviceSubCategory;

  // 已选中的日期,算选中的天数
  let selectedDates = [];
  let duration = 0;
  if (searchData.startDate && searchData.endDate) {
    let startDate = moment(searchData.startDate);
    let endDate = moment(searchData.endDate);
    selectedDates = [startDate, endDate];
    duration = endDate.diff(startDate, "days");
  } else {
    duration = 1;
  }

  const petStock = subCategoryQuantity.reduce((accumulator, currentValue) => {
    if (currentValue.number !== undefined) {
      return accumulator + Number(currentValue.number);
    } else {
      return accumulator + 0;
    }
  }, 0);

  const disabledDate = (current) => {
    if (
      (serviceDates[current.format("YYYY-MM-DD")] !== undefined &&
        petStock > serviceDates[current.format("YYYY-MM-DD")]["number"]) ||
      current.isBefore(moment()) ||
      (closeBlockDate !== undefined &&
        current.isAfter(closeBlockDate) &&
        petStock > serviceDates[closeBlockDate]["number"]) ||
      current.format("YYYY-MM-DD") == selectedStart ||
      current.format("YYYY-MM-DD") == selectedEnd
    ) {
      // 不可选
      return true;
    }

    return false;
  };

  let tempArray;
  const handleInputNumer = (type, index, value) => {
    let sum = 0;
    tempArray =
      type === "subCategory" ? subCategoryQuantity : serviceExtraQuantity;

    if (type === "subCategory") {
      for (let i = 0; i < subCategoryQuantity.length; i++) {
        const result = i != index ? subCategoryQuantity[i]["number"] : value;
        sum += result !== undefined ? Number(result) : 0;
      }

      if (sum > serviceStock) {
        message.error(`${i18n.t("serviceStockWarning")} ${serviceStock}`);
      } else {
        subCategoryQuantity[index]["number"] = value;

        //added code to remove handleEnterPress function
        const petStock = tempArray.reduce((accumulator, currentValue) => {
          if (currentValue.number !== undefined) {
            return accumulator + Number(currentValue.number);
          } else {
            return accumulator + 0;
          }
        }, 0);
        searchData["serviceOrderPetInfoInput"] = tempArray;
        searchData["petStock"] = petStock;

        //
      }
    } else {
      serviceExtraQuantity[index]["number"] = value;

      //added code to remove handleEnterPress function
      searchData["serviceOrderExtraInput"] = tempArray;
      //
    }

    const newRouterParams = MakeUrlParam(searchData);
    history.push(`/service/detail/${serviceId}?${newRouterParams}`);
  };

  // const handleEnterPress = (type) => {
  //   if (tempArray && type === "subCategory") {
  //     const petStock = tempArray.reduce((accumulator, currentValue) => {
  //       if (currentValue.number !== undefined) {
  //         return accumulator + Number(currentValue.number);
  //       } else {
  //         return accumulator + 0;
  //       }
  //     }, 0);
  //     searchData["serviceOrderPetInfoInput"] = tempArray;
  //     searchData["petStock"] = petStock;
  //   } else {
  //     searchData["serviceOrderExtraInput"] = tempArray;
  //   }

  //   const newRouterParams = MakeUrlParam(searchData);
  //   history.push(`/service/detail/${serviceId}?${newRouterParams}`);
  // };

  const handleDateSelect = (dates, dateStrings) => {
    //dates === null, means clear button clicked
    searchData.startDate = dates ? dateStrings[0] : null;
    searchData.endDate = dates ? dateStrings[1] : null;
    searchData.closeBlockDate = dates ? closeBlockDate : null;
    const newRouterParams = MakeUrlParam(searchData);
    history.push(`/service/detail/${serviceId}?${newRouterParams}`);
    // window.history.replaceState(null, null, /product/${this.props.product.id});
  };

  const handleDateClick = (dates, dateStrings) => {
    let serviceDateArray = Object.keys(serviceDates);
    let sortedArray = serviceDateArray.sort(
      (a, b) => moment(a).valueOf() - moment(b).valueOf()
    );

    if (dates) {
      if (dateStrings[0]) {
        setSelectedStart(dateStrings[0]);
        //找到离已选的startDate最近的blockDate
        if (serviceDateArray.length > 0) {
          const nearestBlockDate = sortedArray.find((e) =>
            moment(e).isAfter(dateStrings[0])
          );

          setCloseBlockDate(nearestBlockDate);
        }
      } else if (dateStrings[1]) {
        setSelectedEnd(dateStrings[1]);

        if (serviceDateArray.length > 0) {
          const nearestBlockDate = sortedArray.find((e) =>
            moment(e).isBefore(dateStrings[1])
          );
          setCloseBlockDate(nearestBlockDate);
        }
      }
    }
  };

  // const extraFooter = () => {
  //   return (
  //     <Button
  //       onClick={() => {
  //         searchData.startDate = null;
  //         searchData.endDate = null;
  //         const newRouterParams = MakeUrlParam(searchData);
  //         history.push(`/service/detail/${serviceId}?${newRouterParams}`);
  //       }}
  //       className="ant-tag ant-tag-blue"
  //     >
  //       Clear
  //     </Button>
  //   );
  // };

  //serviceExtra
  const renderServiceExtra =
    serviceExtra.length > 0
      ? serviceExtra.map((service, index) => {
          let initialNumber =
            searchData["serviceOrderExtraInput"].length !== 0 &&
            searchData["serviceOrderExtraInput"][index]["number"] !== undefined
              ? searchData["serviceOrderExtraInput"][index]["number"]
              : 0;
          return (
            <div
              key={index}
              className="d-flex align-items-center justify-content-between pt-1"
            >
              <div className="text-17 text-grey-1">
                {service.name[language]} ${service.price}/{i18n.t("Day")}
              </div>
              <div className="primary-input-container">
                <InputNumber
                  min={0}
                  max={100000}
                  defaultValue={initialNumber}
                  onChange={(value) => {
                    handleInputNumer("extraService", index, value.toFixed());
                    // handleEnterPress("extraService");
                  }}
                  // onPressEnter={() => handleEnterPress("extraService")}
                  // onBlur={() => handleEnterPress("extraService")}
                  size={"small"}
                  className="primary-input--small"
                />
              </div>
            </div>
          );
        })
      : null;

  //serviceSubCategory
  const renderServiceSubCategory =
    serviceSubCategory.length > 0
      ? serviceSubCategory.map((category, index) => {
          let initialNumber =
            searchData["serviceOrderPetInfoInput"].length !== 0 &&
            searchData["serviceOrderPetInfoInput"][index]["number"] !==
              undefined
              ? searchData["serviceOrderPetInfoInput"][index]["number"]
              : 0;
          return (
            <div
              key={index}
              className="d-flex align-items-center justify-content-between pt-2"
            >
              <div className="text-17 text-grey-1">
                {category.name[language]} ${category.price}/{i18n.t("Day")}
              </div>

              <div className="primary-input-container">
                <InputNumber
                  min={0}
                  max={100000}
                  defaultValue={initialNumber}
                  className="primary-input--small"
                  onChange={(value) =>
                    handleInputNumer("subCategory", index, value.toFixed())
                  }
                  // onPressEnter={() => handleEnterPress("subCategory")}
                  // onBlur={() => handleEnterPress("subCategory")}
                />
              </div>
            </div>
          );
        })
      : null;

  //更新总价
  const categoryPrice =
    subCategoryQuantity.length !== 0
      ? subCategoryQuantity.reduce((accumulator, currentValue) => {
          if (currentValue.number !== undefined) {
            return (
              accumulator +
              Number(currentValue.price) * Number(currentValue.number)
            );
          } else {
            return accumulator + 0;
          }
        }, 0) * duration
      : 0;

  const extraServicePrice =
    serviceExtraQuantity.length !== 0
      ? serviceExtraQuantity.reduce((accumulator, currentValue) => {
          if (currentValue.number !== undefined) {
            return (
              accumulator +
              Number(currentValue.price) * Number(currentValue.number)
            );
          } else {
            return accumulator + 0;
          }
        }, 0) * duration
      : 0;

  let totalPrice, taxPrice;
  taxPrice = (Number(categoryPrice) + Number(extraServicePrice)) * 0.13;

  totalPrice = categoryPrice + extraServicePrice + taxPrice;

  return (
    <div className="price-calculator-main-wrapper">
      {/* 宠物信息 */}
      <div>
        {/* <div className="line-padding-top"> */}
        <div className="calculate-title fw-bold">
          {i18n.t("Pet infomation")}
        </div>

        {serviceSubCategory.length > 0 && renderServiceSubCategory}

        <div className="text-12 text-bold line-padding-top">
          *{i18n.t("SelectPetInfoMessage")}
        </div>
      </div>

      {/* <div className="calculate-title line-padding-top">
        {i18n.t("Price Calculate")}
      </div> */}
      <Row>
        <Col className="w-100" id="inputServiceDate">
          <div className="line-padding-top">
            <RangePicker
              getPopupContainer={() =>
                document.getElementById("inputServiceDate")
              }
              ranges={{
                Today: [moment(), moment().add(1, "days")],
                "This Month": [
                  moment().startOf("month"),
                  moment().endOf("month"),
                ],
              }}
              allowClear={true}
              disabled={!categoryPrice ? true : false}
              placeholder={[i18n.t("Checkin Time"), i18n.t("Checkout Time")]}
              className="rangepicker-size ant-calendar-picker-clear w-100"
              value={selectedDates && selectedDates}
              disabledDate={disabledDate}
              onChange={(dates, dateStrings) => {
                handleDateSelect(dates, dateStrings);
              }}
              onCalendarChange={(dates, dateStrings) =>
                handleDateClick(dates, dateStrings)
              }
              // renderExtraFooter={() => extraFooter()}
              onOpenChange={(open) => {
                if (!open) {
                  if (selectedStart && selectedEnd) {
                    return;
                  }
                  if (selectedStart) {
                    setCloseBlockDate(null);
                  }
                  if (selectedEnd) {
                    setCloseBlockDate(null);
                  }
                }
              }}
            />
          </div>
        </Col>
      </Row>

      <Divider className="mt-3 mb-3" dashed />

      {/* 服务项目 */}
      {serviceExtra.length > 0 && (
        <>
          <div className="calculate-title mb-2 fw-bold">
            {i18n.t("Extra Service")}
          </div>
          <div>{renderServiceExtra}</div>
        </>
      )}

      {/* 预定服务button */}
      <Button
        onClick={() => {
          handleMakeOrder(
            subCategoryQuantity.filter(
              (service) => service.number !== undefined
            ),
            serviceExtraQuantity.filter(
              (service) => service.number !== undefined
            )
          );
        }}
        disabled={buttonDisable}
        className="primary-button w-100 mt-2"
      >
        {i18n.t("Book Service")}
      </Button>

      <div className="warning-text-container warning-small line-padding-top">
        {i18n.t("No charges for this step")}
      </div>

      <div className="calculate-title line-padding-top fw-bold">
        {i18n.t("Price Calculate")}
      </div>

      <div className="animal-type-section service-calculate-price-text line-padding-top">
        <div className="text-16 text-bold">
          {i18n.t("Pet Care")} {duration} {i18n.t("Day")}
        </div>
        <div className="text-16">${categoryPrice}</div>
      </div>
      <div className="animal-type-section service-calculate-price-text line-padding-top">
        <div className="text-16 text-bold">
          {i18n.t("Other Services")} {duration} {i18n.t("Day")}
        </div>
        <div className="text-16">${extraServicePrice}</div>
      </div>
      <div className="animal-type-section service-calculate-price-text line-padding-top">
        <div className="text-16 text-bold">{i18n.t("Tax")}</div>
        <div className="text-16">${taxPrice.toFixed(2)}</div>
      </div>
      <div className="animal-type-section line-padding-top ">
        <div className="text-18 text-bold color-orange-1">
          {i18n.t("Total Price")}
        </div>
        <div className="text-18 text-bold color-orange-1">
          ${totalPrice.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default PriceCalculate;
