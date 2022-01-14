import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";

//redux
import { useDispatch, useSelector } from "react-redux";
import { getUserInfo, getUserAddress } from '../../redux/actions';

//packages
import i18n from "i18n-js";
import { Avatar, Modal, Button, List, Divider } from 'antd';

//components
import Breadcrumb from "../../components/layout/Breadcrumb";
import RouterLoading from '../../components/loading/RouterLoading';
import ProfileForm from '../../components/user/ProfileForm';
import ResetForm from '../../components/auth/ResetForm';
import ChangeEmailForm from '../../components/user/ChangeEmailForm';
import ChangePhoneForm from '../../components/user/ChangePhoneForm';

const Profile = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const [modalVisible, setModalVisible] = useState(false);
    const [layoutState, setLayoutState] = useState(0);

    const userId = localStorage.getItem('userId');

    const userInfo = useSelector(state => state.userData.userInfo);
    const userAddress = useSelector(state => state.userData.userAddress);

    const { userImage, userEmail, userName, userPhone } = userInfo || {};

    useEffect(() => {
        dispatch(getUserInfo(userId));
        dispatch(getUserAddress(userId));
    }, [dispatch, userId, modalVisible])

    const renderProfileModal = () => {
        const layout = {
            0:
                <ProfileForm
                    setModal={setModalVisible}
                    data={{
                        ...userInfo,
                        userId: userId
                    }}
                />,
            1:
                <ResetForm
                    setModal={setModalVisible}
                    userInfo={userInfo}
                />,
            2:
                <ChangeEmailForm
                    setModal={setModalVisible}
                    userId={userId}
                />,
            3:
                <ChangePhoneForm
                    setModal={setModalVisible}
                    userId={userId}
                />

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

    const showModal = async (layoutCode) => {
        await setLayoutState(layoutCode)
        await setModalVisible(true)
    }

    if (userInfo === undefined || userAddress === undefined) {
        return <RouterLoading />
    } else {
        const defaultAddress = userAddress.filter(item => item.isDefault === '1')
        const { unit, address, city, province, postal } = defaultAddress[0] || {};

        return (
            <div className="profile-wrapper">
                {renderProfileModal()}
                <div className="profile-container">
                    <Breadcrumb
                        breadcrumbList={[
                            { url: "/", title: i18n.t('Home') },
                            { url: "/user/profile", title: i18n.t('Setting') }
                        ]}
                    />

                    <div className="profile-list-container w-100">
                        <div className='mt-3 text-bold'>
                            {i18n.t('Setting')}
                        </div>

                        <Divider style={{ marginTop: 12, marginBottom: 0 }} />

                        <List className="profile-list">
                            <List.Item>
                                <div className="item-container">
                                    <div className='info-container'>
                                        <div className='info-title'>
                                            {i18n.t('My Avatar')}
                                        </div>

                                        <Avatar size={80} src={userImage} />
                                    </div>

                                    <Button
                                        className='transparent-button text-14 text-grey-8 pr-0'
                                        type='text'
                                        onClick={() => showModal(0)}
                                    >
                                        {i18n.t('Edit')}
                                    </Button>
                                </div>
                            </List.Item>

                            <List.Item>
                                <div className="item-container">
                                    <div className='info-container'>
                                        <div className='info-title'>
                                            {i18n.t('My Username')}
                                        </div>

                                        <div>
                                            {userName}
                                        </div>
                                    </div>

                                    <Button
                                        className='transparent-button text-14 text-grey-8 pr-0'
                                        type='text'
                                        onClick={() => showModal(0)}
                                    >
                                        {i18n.t('Edit')}
                                    </Button>
                                </div>
                            </List.Item>

                            <List.Item>
                                <div className="item-container">
                                    <div className='info-container'>
                                        <div className='info-title'>
                                            {i18n.t('Login Account')}
                                        </div>

                                        <div>
                                            {userEmail}
                                        </div>
                                    </div>

                                    <Button
                                        className='transparent-button text-14 text-grey-8 pr-0'
                                        type='text'
                                        onClick={() => showModal(2)}
                                    >
                                        {i18n.t('Edit')}
                                    </Button>
                                </div>
                            </List.Item>

                            <List.Item>
                                <div className="item-container">
                                    <div className='info-container'>
                                        <div className='info-title'>
                                            {i18n.t('Login Password')}
                                        </div>
                                    </div>

                                    <Button
                                        className='transparent-button text-14 text-grey-8 pr-0'
                                        type='text'
                                        onClick={() => showModal(1)}
                                    >
                                        {i18n.t('Edit')}
                                    </Button>
                                </div>
                            </List.Item>

                            <List.Item>
                                <div className="item-container">
                                    <div className='info-container'>
                                        <div className='info-title'>
                                            {i18n.t("Phone Number")}
                                        </div>

                                        <div className='info-content'>
                                            {userPhone}
                                        </div>
                                    </div>

                                    <Button
                                        className='transparent-button text-14 text-grey-8 pr-0'
                                        type='text'
                                        onClick={() => showModal(3)}
                                    >
                                        {i18n.t('Edit')}
                                    </Button>
                                </div>
                            </List.Item>

                            <List.Item>
                                <div className="item-container">
                                    <div className='info-container'>
                                        <div className='info-title'>
                                            {i18n.t("Default Address")}
                                        </div>
                                        {console.log(defaultAddress)}
                                        {defaultAddress.length !== 0 ?
                                            <div className='info-content'>{unit}, {address}, {city}, {province} {postal}</div>
                                            :
                                            null
                                        }
                                    </div>

                                    <Button
                                        className='transparent-button text-14 text-grey-8 pr-0'
                                        type='text'
                                        onClick={() => history.push('/user/address')}
                                    >
                                        {i18n.t('View')}
                                    </Button>
                                </div>
                            </List.Item>
                        </List>
                    </div>
                </div>
            </div>
        )
    }
}

export default Profile;
