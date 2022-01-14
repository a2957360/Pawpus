import React from 'react';
import AppLayout from './AppLayout';

//redux
import { useDispatch } from "react-redux";
import { loginUserAuto } from '../redux/actions';

const AppRouter = () => {
    const dispatch = useDispatch();

    const token = localStorage.getItem('token')

    if (token) {
        dispatch(loginUserAuto());
    }

    return (
        <AppLayout />
    )
};

export default AppRouter;
