import React, { useState, useEffect } from "react";

import { useHistory } from "react-router-dom";

//components
import RecordServiceCard from "./components/RecordServiceCard";
import EmptyDataView from "../../components/loading/EmptyDataView";
import LoadingView from "../../components/loading/LoadingView";
import RateModal from "./components/RateModal";

//packages
import i18n from "i18n-js";
import { Button, Row, Col, Menu, Dropdown, message } from "antd";
import { DownOutlined } from "@ant-design/icons";

//redux
import axios from "axios";
import { API_BASE_URL } from "../../configs/AppConfig";
import { useSelector, useDispatch } from "react-redux";
import { getServiceOrderList } from "../../redux/actions";

const RecordService = (props) => {
  const menuTab = [
    {
      action: "",
      name: i18n.t("All"),
    },
    {
      action: "orderState=0",
      name: i18n.t("UnPaid"),
    },
    {
      action: "orderState=1",
      name: i18n.t("UnConfirm"),
    },
    {
      action: "orderState=2",
      name: i18n.t("UnCheckin"),
    },
    {
      action: "orderState=3",
      name: i18n.t("BeingBoarding"),
    },
    {
      action: "orderState=4",
      name: i18n.t("Completed"),
    },
    {
      action: "orderState=5",
      name: i18n.t("Canceled"),
    },
    {
      action: "orderState=6",
      name: i18n.t("Refused"),
    },
  ];

  const history = useHistory();
  const dispatch = useDispatch();

  const userId = localStorage.getItem("userId");

  const [selectedTab, setSelectedTab] = useState(
    props.location.state !== undefined ? props.location.state : ""
  );

  const [dropdownDisplay, setDropdownDisplay] = useState(i18n.t("All"));

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [selectedService, setSelectedService] = useState();

  const [inputReview, setInputReview] = useState();

  const [reviewStar, setReviewStar] = useState();

  const [localList, setLocalList] = useState(null);

  // const serviceOrderList = useSelector(
  //   (state) => state.serviceData.serviceOrderList
  // );

  useEffect(() => {
    const data =
      selectedTab === ""
        ? `userId=${userId}`
        : `userId=${userId}&${selectedTab}`;

    // dispatch(getServiceOrderList(data));

    getList(data, selectedTab);
  }, [dispatch, selectedTab]);

  const getList = (data, selectedTab) => {
    axios
      .get(API_BASE_URL + `service/getServiceOrder.php?${data}`)
      .then((res1) => {
        const result1 = res1.data.data;
        if (selectedTab === "orderState=5") {
          axios
            .get(
              API_BASE_URL +
                `service/getServiceOrder.php?userId=${userId}&orderState=7`
            )
            .then((res2) => {
              const result2 = res2.data.data;
              if (result2.length > 0) {
                const combinedArr = result1.concat(result2);
                setLocalList(combinedArr);
              } else {
                setLocalList(result1);
              }
            });
        } else {
          if (res1.data.message === "success") {
            setLocalList(result1);
          }
        }
      })
      .catch((error) => {});
  };

  const handleCancelOrder = (serviceOrderId, orderState) => {
    const data = {
      userId: userId,
      orderState: "10",
      serviceOrderId: serviceOrderId,
      cancelType: orderState,
    };
    // console.log("cancel order input", data);
    axios
      .post(API_BASE_URL + "service/clientCancelOrder.php", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        // console.log("cancel order result", res.data);
        //重新获取list
        setSelectedTab("orderState=5");
      })
      .catch((error) => {});
  };

  const handleDropdownMenu = (item) => {
    setSelectedTab(item.action);
    setDropdownDisplay(item.name);
  };

  // const handleRateButton = () => {
  //   if (!inputReview || !reviewStar) {
  //     message.error(
  //       !reviewStar
  //         ? i18n.t("Please complete rating")
  //         : i18n.t("Please write down your review")
  //     );
  //   } else {
  //     const data = {
  //       targetId: selectedService.serviceId,
  //       fromId: userId,
  //       orderId: selectedService.serviceOrderId,
  //       reviewContent: inputReview,
  //       reviewStar: reviewStar.toString(),
  //       targetType: "0",
  //     };

  //     axios
  //       .post(API_BASE_URL + "review/addReview.php", data, {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       })
  //       .then((res) => {
  //         //重新获取list
  //         if (res.data.message === "success") {
  //           setIsModalVisible(false);
  //           const url =
  //             selectedTab === ""
  //               ? `userId=${userId}`
  //               : `userId=${userId}&${selectedTab}`;

  //           // dispatch(getServiceOrderList(url));
  //           getList(data, selectedTab);
  //         }
  //       })
  //       .catch((error) => {});
  //   }
  // };

  if (!userId) {
    message.error(i18n.t("Please login"));
  }

  if (!localList) {
    return <LoadingView />;
  }

  return (
    <div className="record-wrapper">
      <div className="record-inner-container responsive-container">
        {/* header */}
        <div className="header-container text-18 mb-3">
          {i18n.t("Service History")}
        </div>

        {/* menu tab pc*/}
        <div className="header-container-tab mb-3 text-18">
          {menuTab.map((item, index) => {
            return (
              <span
                key={index}
                onClick={() => setSelectedTab(item.action)}
                className={
                  selectedTab === item.action
                    ? "selectedTab-container"
                    : "tab-container"
                }
              >
                {item.name}
              </span>
            );
          })}
        </div>

        {/* menu tab mobile*/}
        <div className="header-container-tab-mobile mb-3 text-18">
          <Dropdown
            trigger={["click"]}
            overlay={
              <Menu>
                {menuTab.map((item, index) => {
                  return (
                    <Menu.Item
                      key={index}
                      onClick={() => handleDropdownMenu(item)}
                    >
                      {item.name}
                    </Menu.Item>
                  );
                })}
              </Menu>
            }
          >
            <Button className="transparent-button ml-2" size="medium">
              {dropdownDisplay}
              <DownOutlined className="margin-left-10" />
            </Button>
          </Dropdown>
        </div>

        {/* record card list */}
        <div className="record-cards-container">
          {localList.length > 0 ? (
            localList.map((element) => {
              return (
                <RecordServiceCard
                  data={element}
                  tab={selectedTab}
                  handleCancelOrder={handleCancelOrder}
                  // setIsModalVisible={setIsModalVisible}
                  // setSelectedService={setSelectedService}
                />
              );
            })
          ) : (
            <EmptyDataView message={i18n.t("EmptyPageMessages")} />
          )}
        </div>
      </div>

      {/* <RateModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        handleRateButton={handleRateButton}
        setInputReview={setInputReview}
        setReviewStar={setReviewStar}
      /> */}
    </div>
  );
};

export default RecordService;
