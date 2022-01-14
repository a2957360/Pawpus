import React, { useEffect, useState } from 'react';
//import { useHistory } from "react-router-dom";

//redux
import { useDispatch, useSelector } from "react-redux";
import { getUserInfo, getUserAddress, defaultUserAddress, deleteUserAddress, saveUserAddress, resetMessage } from '../../redux/actions';

//packages
import i18n from "i18n-js";
import { Modal, Button, List, Divider, Tag } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

//components
import Breadcrumb from "../../components/layout/Breadcrumb";
import RouterLoading from '../../components/loading/RouterLoading';
import AddressForm from '../../components/user/AddressForm';

const Address = () => {
    const dispatch = useDispatch();
    //const history = useHistory();

    const [modalVisible, setModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    //const [addressData, setAddressData] = useState();

    const userId = localStorage.getItem('userId');

    //const userInfo = useSelector(state => state.userData.userInfo);
    const userAddress = useSelector(state => state.userData.userAddress);
    const updateMessage = useSelector(state => state.userData.updateMessage)

    useEffect(() => {
        dispatch(getUserInfo(userId));
        dispatch(getUserAddress(userId));
    }, [dispatch, userId, modalVisible])

    useEffect(() => {
        async function handleUpdate() {
            await dispatch(resetMessage());
            await dispatch(getUserInfo(userId));
            await dispatch(getUserAddress(userId));
        }

        handleUpdate();
    }, [dispatch, userId, updateMessage])

    const renderAddressModal = () => {
        return (
            <Modal
                closable={false}
                width={300}
                visible={modalVisible}
                footer={null}
                onCancel={() => setModalVisible(false)}
            >
                <AddressForm
                    setModal={setModalVisible}
                    setAddressData
                />
            </Modal>
        );
    };

    const handleDeleteModal = (data) => {
        Modal.confirm({
            title: i18n.t('Delete') + ` ` + i18n.t('Address'),
            icon: <ExclamationCircleOutlined />,
            content: i18n.t("Are you sure you want to delete this address?"),
            okText: i18n.t('Confirm'),
            cancelText: i18n.t('Cancel'),
            visible: deleteModalVisible,
            maskClosable: true,
            onOk: () => handleDeleteAddress(data),
            onCancel: () => setDeleteModalVisible(false)
        });
    }

    const handleAddressModal = async (item) => {
        await dispatch(saveUserAddress(item));
        await setModalVisible(true)
    }

    const handleDefaultAddress = (data) => {
        dispatch(defaultUserAddress(data))
    }

    const handleDeleteAddress = (data) => {
        dispatch(deleteUserAddress(data))
    }

    if (userAddress === undefined) {
        return <RouterLoading />
    } else {
        return (
            <div className="address-wrapper">
                {renderAddressModal()}
                <div className="address-container">
                    <Breadcrumb
                        breadcrumbList={[
                            { url: "/", title: i18n.t('Home') },
                            { url: "/user/profile", title: i18n.t('Setting') },
                            { url: "/user/address", title: i18n.t('Address') }
                        ]}
                    />

                    <div className="address-list-container w-100">
                        <div className='mt-3 d-flex justify-content-between'>
                            <div className='text-bold'>
                                {i18n.t('Address')}
                            </div>

                            <Button
                                className='transparent-button text-14 text-grey-8 text-bold pr-0'
                                type='text'
                                onClick={() => handleAddressModal({ userId })}
                            >
                                {i18n.t('Add Address')}
                            </Button>
                        </div>

                        <Divider style={{ marginTop: 12, marginBottom: 0 }} />

                        <List className="address-list">
                            {userAddress.map((item) => {
                                const { name, phone, userId, addressId, unit, address, city, province, postal, isDefault } = item;

                                return (
                                    <List.Item>
                                        <div className='item-container'>
                                            <div className='info-container'>
                                                <div className='mr-2'>
                                                    {unit} {address}, {city}, {province}, {postal} ({name}, {phone})
                                                </div>

                                                {isDefault === '1' ?
                                                    <Tag color='$color-primary'>
                                                        <div className='text-12 text-bold text-grey-8'>{i18n.t("Default")}</div>
                                                    </Tag>
                                                    :
                                                    null
                                                }
                                            </div>

                                            <div className='action-container'>
                                                <Button
                                                    className='transparent-button text-14 text-grey-8 mt-2 pl-0'
                                                    type='text'
                                                    onClick={() => handleDefaultAddress({ userId, addressId })}
                                                >
                                                    {i18n.t("Set Default")}
                                                </Button>

                                                <Button
                                                    className='transparent-button text-14 text-grey-8 mt-2 pl-0'
                                                    type='text'
                                                    onClick={() => handleAddressModal(item)}
                                                >
                                                    &nbsp;{i18n.t("Edit")}&nbsp;
                                                </Button>

                                                <Button
                                                    className='transparent-button text-14 text-grey-8 mt-2 pl-0'
                                                    type='text'
                                                    onClick={() => handleDeleteModal({ userId, addressId })}
                                                >
                                                    &nbsp;{i18n.t("Delete")}&nbsp;
                                                </Button>
                                            </div>
                                        </div>
                                    </List.Item>
                                )
                            })}
                        </List>
                    </div>
                </div>
            </div>
        )
    }
}

export default Address;
