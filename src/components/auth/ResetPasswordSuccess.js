import React from 'react';

import Dogy from '../../assets/img/success-dogy.png';

//redux

//packages
import i18n from "i18n-js";
import { Button } from 'antd';

export default function ResetPasswordSuccess(props) {
    const { changeLayout } = props;

    return (
        <div className='auth-container'>
            <div className='auth-image-container'>
                <img src={Dogy} className='auth-image' alt="dogy" />
            </div>

            <div className='message-large-title text-center'>
                {i18n.t("Congratulations")}
            </div>

            <div>
                {i18n.t("Reset link has been sent, please check your e-mail")}
            </div>

            <Button
                className='primary-button w-100'
                type='text'
                onClick={() => changeLayout(0)}
            >
                {i18n.t("Return Login")}
            </Button>
        </div>
    )
}
