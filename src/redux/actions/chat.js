import { GET_USER_CONTACT_LIST_SUCCESS } from '../constants/ActionTypes';
import axios from 'axios';
import { API_BASE_URL } from '../../configs/AppConfig';

// export const getUserContactList = (userId) => {
//   if(!userId){
//     return
//   }
//   return (dispatch) => {
//     axios
//       .get(`${API_BASE_URL}contact/getContact.php?userId=${userId}`)
//       .then((res) => {
//         dispatch({
//           type: GET_USER_CONTACT_LIST_SUCCESS,
//           payload: {
//             data:res.data.data.contactList,
//             message:res.data.message
//           }
//         });
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };
// };

export const updateContactList = (userId, contactUserId, serviceId) => {
  return (dispatch) => {
    axios
      .post(`${API_BASE_URL}contact/addContact.php`, {
        userId,
        contactUserId,
        serviceId,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
};
