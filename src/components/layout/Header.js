import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

//packages
import i18n from "i18n-js";
import {
  ShoppingCartOutlined,
  MenuOutlined,
  SearchOutlined,
  DownOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import {
  Modal,
  Menu,
  Dropdown,
  Input,
  Avatar,
  Button,
  message,
  Row,
  Col,
} from "antd";
import logo from "../../assets/img/Logo.png";
import logoMobile from "../../assets/img/Logo-mobile.png";

//redux
import { useDispatch, useSelector } from "react-redux";
import { getUserInfo, logoutUser } from "../../redux/actions";

//components
import LoginForm from "../auth/LoginForm";
import RegisterForm from "../auth/RegisterForm";
import ForgetForm from "../auth/ForgetForm";
import SendResetSuccess from "../auth/SendResetSuccess";
import SendActivationSuccess from "../auth/SendActivationSuccess";
import MessageNotification from "../home/MessageNotification";
import MakeUrlParam from "../../components/service/MakeUrlParam";

export default function Header() {
  const userId = localStorage.getItem("userId");
  const location = useLocation();

  const leftMenu = [
    {
      key: "1",
      name: i18n.t("Home"),
      path: "/",
    },
    {
      key: "2",
      name: i18n.t("Service Section"),
      path: `/service/list`,
      // path: `/service/list?${querystring}`,
    },
    {
      key: "3",
      name: i18n.t("Online Shop"),
      path: "/product/list",
    },
    {
      key: "4",
      name: i18n.t("Social"),
      path: "/social/list",
    },
  ];

  const rightMenu = [
    {
      key: "5",
      name: i18n.t("Provide Service"),
      path: "/serviceapply/apply",
    },
    {
      key: "6",
      name: i18n.t("Switch Language"),
      path: "/",
    },
    {
      key: "7",
      name: i18n.t("Message"),
      path: "/chat",
    },
    {
      key: "8",
      name: i18n.t("Cart"),
      path: "/shop/list",
    },
  ];

  const userMenu = [
    {
      key: "9",
      name: i18n.t("My Social"),
      path: "/user/social",
    },
    {
      key: "10",
      name: i18n.t("Account"),
      path: "/user/profile",
    },
    {
      key: "11",
      name: i18n.t("Favorites"),
      path: "/favorite",
    },
    {
      key: "12",
      name: i18n.t("Service History"),
      path: "/record/service",
    },
    {
      key: "13",
      name: i18n.t("Shopping History"),
      path: "/record/shop",
    },
    {
      key: "14",
      name: i18n.t("My Service"),
      path: "/service/center",
    },
    {
      key: "15",
      name: i18n.t("Help"),
      path: "/user/help",
    },
    {
      key: "16",
      name: i18n.t("Log Out"),
      path: "/",
    },
  ];

  const dispatch = useDispatch();
  const history = useHistory();

  const [layoutState, setLayoutState] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchCategory, setSearchCategory] = useState(i18n.t("Service"));

  const userAuth = useSelector((state) => state.authData.userAuth);
  const showAuthModal = useSelector((state) => state.settingData.showAuthModal);
  const userInfo = useSelector((state) => state.userData.userInfo);

  const language = localStorage.getItem("language");

  const { userImage } = userInfo || {};

  useEffect(() => {
    dispatch(getUserInfo(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    if (showAuthModal === true) {
      setModalVisible(true);
    } else setModalVisible(false);
  }, [showAuthModal]);

  const handleSearch = (value) => {
    //check if input contains numeber
    // var hasNumber = /\d/;
    // if (!hasNumber.test(value)) {
    const data = {
      searchContent: value,
    };
    const newRouterParams = MakeUrlParam(data);
    let pathName =
      searchCategory === i18n.t("Service")
        ? "/service/list?"
        : "/product/list?";
    history.push(`${pathName}${newRouterParams}`);
    // } else {
    //   message.error('搜索关键字不能包含数字');
    // }
  };

  const handleClickMenu = (item) => {
    //切换语言 key = 6
    if (item.key === "6") {
      handleSwitchLanguage();
    }
    //退出账号 key = 16
    if (item.key === "16") {
      handleLogout();
    } else {
      history.push(item.path);
    }
  };

  const handleSwitchLanguage = (value) => {
    if (language === "zh") {
      localStorage.setItem("language", "en");
      i18n.locale = "en";
    } else {
      localStorage.setItem("language", "zh");
      i18n.locale = "zh";
    }

    window.location.reload();
  };

  const languageMenuOption = () => {
    return (
      <Menu>
        {[
          { key: 0, value: "中文", locale: "zh" },
          { key: 1, value: "English", locale: "en" },
        ].map((e) => {
          return (
            <Menu.Item
              key={e.key}
              onClick={() => {
                localStorage.setItem("language", e.locale);
                i18n.locale = e.locale;
                window.location.reload();
              }}
            >
              {e.value}
            </Menu.Item>
          );
        })}
      </Menu>
    );
  };

  const navMenuOption = () => {
    return (
      <Menu>
        {leftMenu.concat(rightMenu).map((item) => (
          <Menu.Item key={item.key} onClick={() => handleClickMenu(item)}>
            {item.name}
          </Menu.Item>
        ))}
      </Menu>
    );
  };

  const searchMenuOption = () => {
    return (
      <Menu>
        <Menu.Item key="1" onClick={() => setSearchCategory(i18n.t("Service"))}>
          {i18n.t("Service")}
        </Menu.Item>

        <Menu.Item key="2" onClick={() => setSearchCategory(i18n.t("Product"))}>
          {i18n.t("Product")}
        </Menu.Item>
      </Menu>
    );
  };

  const userMenuOption = () => {
    return (
      <Menu>
        {userMenu.map((item) => (
          <Menu.Item key={item.key} onClick={() => handleClickMenu(item)}>
            {item.name}
          </Menu.Item>
        ))}
      </Menu>
    );
  };

  const handleAuthButton = async () => {
    await setLayoutState(0);
    await setModalVisible(true);
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    await history.push("/");
    await message.success("登出成功");
  };

  const renderAuthModal = () => {
    const layout = {
      0: <LoginForm setModal={setModalVisible} changeLayout={setLayoutState} />,
      1: (
        <RegisterForm
          setModal={setModalVisible}
          changeLayout={setLayoutState}
        />
      ),
      2: (
        <ForgetForm setModal={setModalVisible} changeLayout={setLayoutState} />
      ),
      3: <SendResetSuccess changeLayout={setLayoutState} />,
      4: <SendActivationSuccess changeLayout={setLayoutState} />,
    };

    return (
      <Modal
        closable={false}
        width={300}
        visible={modalVisible}
        footer={null}
        onCancel={() => setModalVisible(false)}
      >
        {layout[layoutState]}
      </Modal>
    );
  };

  return (
    <div className="app-header-wrapper">
      <div className="app-header-container">
        {renderAuthModal()}
        <div className="app-header">
          {/* logo */}
          <div className="logo-pc">
            <img
              onClick={() => history.push("/")}
              src={logo}
              alt="logo"
              className="logo-img cursor-pointer"
            />
          </div>

          <div className="logo-mobile ml-2">
            <img
              onClick={() => history.push("/")}
              src={logoMobile}
              alt="logo"
              className="logo-img cursor-pointer"
            />
          </div>
          {/* tabs */}
          {/* <div className="left-menu cursor-pointer"> */}
          <Row className="left-menu cursor-pointer">
            {leftMenu.map((item) => {
              return (
                <Col
                  span={6}
                  key={item.key}
                  className={
                    location.pathname == item.path
                      ? "left-menu-item item-border-bottom-color"
                      : "left-menu-item item-border-bottom"
                  }
                  onClick={() => history.push(item.path)}
                >
                  {item.name}
                </Col>
              );
            })}
          </Row>
          {/* </div> */}
          {/* search */}
          <div className="search-input-container">
            <Dropdown overlay={searchMenuOption} className="search-dropdown">
              <Button className="search-dropdown-button transparent-button">
                {searchCategory} <DownOutlined />
              </Button>
            </Dropdown>

            <Input
              className="search-input"
              onBlur={(e) => handleSearch(e.target.value)}
              onPressEnter={(e) => handleSearch(e.target.value)}
            />

            <div className="search-icon">
              <SearchOutlined />
            </div>
          </div>

          <div className="right-menu-pc">
            <span
              onClick={() => history.push("/serviceapply/apply")}
              className="text-16 text-grey-1 pl-2 pr-3 span-mouse-click"
            >
              {i18n.t("Provide Service")}
            </span>

            {/* <Button
              className="transparent-button text-14 text-grey-1 pl-1 pr-2"
              type="text"
              onClick={() => handleSwitchLanguage()}
            >
              {language === "zh" ? "中文" : "English"}
            </Button> */}

            <Dropdown
              trigger={["click"]}
              overlay={languageMenuOption}
              placement="bottomRight"
              arrow
            >
              <GlobalOutlined style={{ fontSize: "18px" }} />
            </Dropdown>
            <div className="pl-3 pr-2 pt-1">
              <MessageNotification />
            </div>

            <ShoppingCartOutlined
              onClick={() => history.push("/shop/list")}
              className="pr-3"
              style={{ fontSize: "18px" }}
            />
          </div>

          <div className="right-menu-mobile mr-2">
            <MessageNotification className="px-2" />
            <Dropdown
              trigger={["click"]}
              overlay={navMenuOption}
              placement="bottomRight"
              arrow
            >
              <MenuOutlined style={{ fontSize: "18px" }} />
            </Dropdown>
          </div>

          <div className="user-menu mr-2">
            {userAuth === true ? (
              <Dropdown
                trigger={["click"]}
                overlay={userMenuOption}
                placement="bottomRight"
                arrow
              >
                <Avatar
                  className="cursor-pointer text-18"
                  // size="small"
                  src={userImage}
                />
              </Dropdown>
            ) : (
              <div>
                <Button
                  type="text"
                  className="auth-button"
                  onClick={() => handleAuthButton()}
                >
                  {i18n.t("Login/Sign Up")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
