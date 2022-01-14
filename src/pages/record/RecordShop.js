import React, { useState, useEffect } from "react";

//packages
import i18n from "i18n-js";
import { Button, Row, Col, Menu, Dropdown, message } from "antd";
import { DownOutlined } from "@ant-design/icons";

//components
import RecordShopCard from "./components/RecordShopCard";
import EmptyDataView from "../../components/loading/EmptyDataView";
import LoadingView from "../../components/loading/LoadingView";

//redux
import { useSelector, useDispatch } from "react-redux";
import { getItemOrder } from "../../redux/actions";

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
    name: i18n.t("Unship"),
  },
  {
    action: "orderState=2",
    name: i18n.t("Sent"),
  },
  // {
  //   action: "orderState=3",
  //   name: i18n.t("Delivered"),
  // },
  // {
  //   action: "orderState=4",
  //   name: i18n.t("Refunding"),
  // },
  // {
  //   action: "orderState=5",
  //   name: i18n.t("Refunded"),
  // },
  // {
  //   action: "orderState=6",
  //   name: i18n.t("Refused refund"),
  // },
];

const RecordShop = (props) => {
  const dispatch = useDispatch();

  const userId = localStorage.getItem("userId");

  const { itemOrderList } = useSelector((state) => state.productData);

  const [selectedTab, setSelectedTab] = useState(
    props.location.state !== undefined ? props.location.state : ""
  );
  const [dropdownDisplay, setDropdownDisplay] = useState(i18n.t("All"));

  // const [selectedTab, setSelectedTab] = useState("");

  useEffect(() => {
    const data =
      selectedTab === ""
        ? `userId=${userId}`
        : `userId=${userId}&${selectedTab}`;
    dispatch(getItemOrder(data));
  }, [selectedTab]);

  const handleDropdownMenu = (item) => {
    setSelectedTab(item.action);
    setDropdownDisplay(item.name);
  };

  if (!userId) {
    message.error(i18n.t("Please login"));
  }

  if (!itemOrderList) {
    return <LoadingView />;
  }

  const renderOrderList =
    itemOrderList.length > 0 ? (
      itemOrderList.map((element) => {
        return <RecordShopCard data={element} tab={selectedTab} />;
      })
    ) : (
      <EmptyDataView message={i18n.t("EmptyPageMessages")} />
    );

  return (
    <div className="record-wrapper">
      <div className="record-inner-container responsive-container">
        {/* header */}
        <div className="header-container text-18 mb-3">
          {i18n.t("Shopping History")}
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
        <div className="record-cards-container">{renderOrderList}</div>
      </div>
    </div>
  );
};

export default RecordShop;

// {/* <span
//             onClick={() => setSelectedTab("")}
//             className={
//               selectedTab === "" ? "selectedTab-container" : "tab-container"
//             }
//           >
//             {i18n.t("All")}
//           </span>
//           <span
//             onClick={() => setSelectedTab("orderState=0")}
//             className={
//               selectedTab === "orderState=0"
//                 ? "selectedTab-container"
//                 : "tab-container"
//             }
//           >
//             {i18n.t("UnPaid")}
//           </span>

//           {/* 未发货 */}
//           <span
//             onClick={() => setSelectedTab("orderState=1")}
//             className={
//               selectedTab === "orderState=1"
//                 ? "selectedTab-container"
//                 : "tab-container"
//             }
//           >
//             {i18n.t("Unship")}
//           </span>

//           {/* 已发货 */}
//           <span
//             onClick={() => setSelectedTab("orderState=2")}
//             className={
//               selectedTab === "orderState=2"
//                 ? "selectedTab-container"
//                 : "tab-container"
//             }
//           >
//             {i18n.t("Sent")}
//           </span>

//           {/* 已收获 */}
//           <span
//             onClick={() => setSelectedTab("orderState=3")}
//             className={
//               selectedTab === "orderState=3"
//                 ? "selectedTab-container"
//                 : "tab-container"
//             }
//           >
//             {i18n.t("Delivered")}
//           </span>

//           {/* 退款中 */}
//           <span
//             onClick={() => setSelectedTab("orderState=4")}
//             className={
//               selectedTab === "orderState=4"
//                 ? "selectedTab-container"
//                 : "tab-container"
//             }
//           >
//             {i18n.t("Refunding")}
//           </span>

//           {/* 退款成功 */}
//           <span
//             onClick={() => setSelectedTab("orderState=5")}
//             className={
//               selectedTab === "orderState=5"
//                 ? "selectedTab-container"
//                 : "tab-container"
//             }
//           >
//             {i18n.t("Refunded")}
//           </span>

//           {/* 拒绝退款 */}
//           <span
//             onClick={() => setSelectedTab("orderState=6")}
//             className={
//               selectedTab === "orderState=6"
//                 ? "selectedTab-container"
//                 : "tab-container"
//             }
//           >
//             {i18n.t("Refused refund")}
//           </span> */}
