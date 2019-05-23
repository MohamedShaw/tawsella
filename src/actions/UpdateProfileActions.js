import axios from 'axios';
import { AsyncStorage } from 'react-native';
import { LOGIN_SUCCESS } from './types';
import { API_ENDPOINT_GATEWAY } from '../utils/Config';
import { AppNavigation, showError } from '../common';

export function updateProfile(values, setSubmitting) {
  return async (dispatch, getState) => {
    const data = new FormData();
    data.append('nameAr', values.nameAr);
    data.append('nameEn', values.nameEn);
    data.append('email', values.email);
    data.append('city', values.city);
    if (values.country === 1 && values.phone.startsWith('0')) {
      data.append('phone', values.phone.slice(1));
    } else {
      data.append('phone', values.phone);
    }
    if (values.location) {
      if (values.location.latitude && values.location.longitude) {
        data.append('location', values.location.longitude);
        data.append('location', values.location.latitude);
      } else {
        data.append('location', values.location[0]);
        data.append('location', values.location[1]);
      }
    }

    if (
      values.profileImg &&
      values.profileImg !==
        getState().auth.currentUser.user.profileImg.thumbnail
    ) {
      data.append('profileImg', {
        uri: values.profileImg,
        type: 'image/*',
        name: 'profile-image',
      });
    }

    try {
      const userId = getState().auth.currentUser.user.id;
      const response = await axios.patch(
        `${API_ENDPOINT_GATEWAY}users/${userId}`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      const reduxData = {
        ...getState().auth.currentUser,
        user: response.data.user,
      };

      dispatch({ type: LOGIN_SUCCESS, payload: reduxData });
      await AsyncStorage.setItem('@CurrentUser', JSON.stringify(reduxData));
      AppNavigation.pop();
    } catch (error) {
      console.log('error ===>>>>>>>>>>>>>', error);
      console.log(JSON.stringify(error));
      showError(error[1].message);
      setSubmitting(false);
    }
  };
}
