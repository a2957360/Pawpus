import { combineReducers } from 'redux';
import homeReducer from './home';
import authReducer from './auth';
import userReducer from './user';
import serviceReducer from './service';
import productReducer from './product';
import momentReducer from './moment';
import settingReducer from './setting';
import chatReducer from './chat';
import notificationReducer from './notifications';

export default combineReducers({
    homeData: homeReducer,
    authData: authReducer,
    userData: userReducer,
    serviceData: serviceReducer,
    productData: productReducer,
    momentData: momentReducer,
    settingData: settingReducer,
    chatData: chatReducer,
    notificationData: notificationReducer
});