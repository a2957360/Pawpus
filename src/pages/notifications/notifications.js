import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";

//packages
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import i18n from "i18n-js";
import { Avatar, Modal, Button, List, Divider } from 'antd';

//components
import Breadcrumb from "../../components/layout/Breadcrumb";

//redux
import { getNotification, readNotification } from "../../redux/actions";

const Notifications = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const userId = localStorage.getItem("userId");

    const { notifications } = useSelector((state) => state.notificationData);

    const [selectedTab, setSelectedTab] = useState(0);

    useEffect(() => {
        dispatch(getNotification({
            userId: userId
        }))
    }, [dispatch, userId]);

    const serviceNotifications = notifications[0] || [];
    const productNotifications = notifications[1] || [];
    const momentNotifications = notifications[2] || [];

    const menuTabs = [
        {
            id: 1,
            title: i18n.t("Service Notification"),
            state: 1,
            list: serviceNotifications,
            endpoint: '/record/service/'
        },
        {
            id: 2,
            title: i18n.t("Product Notification"),
            state: 2,
            list: productNotifications,
            endpoint: '/record/shopdetail/'
        },
        {
            id: 3,
            title: i18n.t("Moment Notification"),
            state: 3,
            list: momentNotifications,
            endpoint: '/social/detail/'
        }
    ];

    const handleViewMessage = (item) => {
        history.push(menuTabs[selectedTab].endpoint + item.targetId)

        dispatch(readNotification({
            infoId: item.infoId
        }))
    }

    return (
        <div className="profile-wrapper">
            <div className="profile-container">
                <Breadcrumb
                    breadcrumbList={[
                        { url: "/", title: i18n.t('Home') },
                        { url: "/notifications", title: i18n.t('Notifications') }
                    ]}
                />

                <div className="profile-list-container w-100">
                    {/* menu tab */}
                    <div className="header-container-tab-notification ml-2 mt-2">
                        {menuTabs.map((item, index) => {
                            return (
                                <span
                                    key={item.id}
                                    onClick={() => setSelectedTab(index)}
                                    className={`text-center tab-container ${selectedTab === index
                                        ? "tab-container-selected"
                                        : ""
                                        }`}
                                >
                                    {item.title}
                                </span>
                            );
                        })}
                    </div>

                    <Divider style={{ marginTop: 12, marginBottom: 0 }} />

                    <List className="profile-list">
                        {menuTabs[selectedTab].list.map((item) => {
                            return (
                                <List.Item>
                                    <div className="item-container">
                                        <div className='info-container'>
                                            {item.isRead === "0" ?
                                                <div className='info-title text-bold ml-3'>
                                                    {item.infoContent[i18n.locale]}
                                                </div>
                                                :
                                                <div className='info-title ml-3'>
                                                    {item.infoContent[i18n.locale]}
                                                </div>
                                            }
                                        </div>

                                        <Button
                                            className='white-button text-14 text-grey-8'
                                            type='text'
                                            onClick={() => handleViewMessage(item)}
                                        >
                                            {i18n.t('View')}
                                        </Button>
                                    </div>
                                </List.Item>
                            );
                        })}
                    </List>
                </div>
            </div>
        </div>
    )
};

export default Notifications;
