import axios from 'axios';
import { AsyncStorage } from 'react-native';
import I18n from 'react-native-i18n';
import { Navigation } from 'react-native-navigation';
import { LOGIN_SUCCESS, LOGIN_FAIL, LOGIN_RESET_ERROR, LOGOUT } from './types';
import {
  API_ENDPOINT_GATEWAY,
  API_ENDPOINT_FOOD_SERVICE,
} from '../utils/Config';
import { showError } from '../common/utils/localNotifications';
import { AppNavigation } from '../common';
import { setHomeScreen, setHomeScreenDelivery } from '../utils';
import store from '../store';
import { clearWallet, setCollectableMoney, resetFlag } from './Wallet';
import { onSelectTab } from './BottomTabsActions';

const urlBasedOnKind = {
  HOME_COOKER: 'home-cookers',
  PARTY_COOKER: 'party-cookers',
  RESTAURANT: 'restaurants',
  DELIVERY_PLACE: 'delivery-places',
  FOOD_CAR: 'food-cars',
};

export const setCurrentUser = data => async (dispatch, getState) => {
  dispatch({
    type: LOGIN_SUCCESS,
    payload: data,
  });
};

const x = require('../assets/imgs/avatar.png');

export const resetLoginError = () => async (dispatch, getState) => {
  dispatch({
    type: LOGIN_RESET_ERROR,
  });
};
export const signIn = (values, setSubmitting) => async (dispatch, getState) => {
  try {
    const response = await axios.post(`${API_ENDPOINT_GATEWAY}user/login`, {
      email: values.email,
      password: values.password,
    });

    dispatch({ type: LOGIN_SUCCESS, payload: response.data });

    console.log('response', response.data);

    if (response.data) {
      isClient(response.data, setSubmitting)(dispatch, getState);
    }

    console.log('%%%%%%%%%%%', response.data);
  } catch (error) {
    console.log('error====', JSON.parse(JSON.stringify(error)));

    setSubmitting(false);
    if (error[0].response && error[0].response.status === 401) {
      dispatch({ type: LOGIN_FAIL, payload: I18n.t('invalid-user') });
      // showError(I18n.t('invalid-user'));
    } else {
      dispatch({ type: LOGIN_FAIL, payload: error[1].message });
      // showError(error[1].message);
    }
  }
};

export function signUp(values, setSubmitting, countryCode) {
  return async (dispatch, getState) => {
    const data = new FormData();
    console.log('values ==>>', values);

    data.append('nameAr', values.nameAr);
    data.append('nameEn', values.nameEn);
    data.append('email', values.email);
    data.append('password', values.password);

    data.append('profileImage', {
      uri: values.profileImg,
      type: 'image/*',
      name: 'profile-image',
    });

    try {
      const response = await axios.post(`${API_ENDPOINT_GATEWAY}user`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      dispatch({ type: LOGIN_SUCCESS, payload: response.data });
      AsyncStorage.setItem(
        '@CurrentUser',
        JSON.stringify({
          ...response.data,
        }),
      );
      const userData = { ...response.data };
      AppNavigation.setStackRoot({
        name: 'completeData',
        passProps: {
          userData,
        },
      });

      setSubmitting(false);
    } catch (error) {
      console.log('erorr======', JSON.parse(JSON.stringify(error)));

      showError(error[1]);
      setSubmitting(false);
    }
  };
}

export const autoLogin = () => async (dispatch, getState) => {
  let userData = '';
  try {
    userData = await AsyncStorage.getItem('@CurrentUser');
  } catch (error) {
    console.log('AsyncStorage#getItem error: ', error.message);
  }

  if (userData) {
    userData = JSON.parse(userData);

    console.log('auto login');
    console.log(userData);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: userData,
    });
    return { exist: true };
  }
  return { exist: false };
};
export const logout = () => async (dispatch, getState) => {
  // const userId = store.getState().auth.currentUser.user.id;

  await AsyncStorage.setItem('@CurrentUser', '');
  AppNavigation.setStackRoot({
    name: 'signIn',
  });
  setTimeout(() => dispatch({ type: LOGOUT }), 1500);
};

export const isClient = (data, setSubmitting) => async (dispatch, getState) => {
  const { token } = store.getState().auth.currentUser;

  try {
    const response = await axios.get(
      `${API_ENDPOINT_FOOD_SERVICE}clients/check-client`,
      {
        headers: {
          Authorization: `bearer ${token}`,
        },
      },
    );
    if (response.data.foundClient) {
      AsyncStorage.setItem(
        '@CurrentUser',
        JSON.stringify({
          ...data,
        }),
      );
      setHomeScreen();
    } else {
      AppNavigation.setStackRoot({
        name: 'completeData',
      });
    }
    setSubmitting(false);
  } catch (error) {
    setSubmitting(false);
    if (error[0].response && error[0].response.status === 401) {
      dispatch({
        type: LOGIN_FAIL,
        payload: I18n.t('ui-networkConnectionError'),
      });
    } else {
      dispatch({ type: LOGIN_FAIL, payload: error[1].message });
    }
  }
};
export const clientCheck = (values, setSubmitting, dataUser) => async (
  dispatch,
  getState,
) => {
  const { token } = store.getState().auth.currentUser;
  const data = new FormData();
  data.append('location', values.location);
  data.append('image', {
    uri: values.image,
    type: 'image/*',
    name: 'image',
  });

  try {
    const response = await axios.post(
      `${API_ENDPOINT_FOOD_SERVICE}clients`,
      data,
      {
        headers: {
          Authorization: `bearer ${token}`,
        },
      },
    );
    AsyncStorage.setItem('@CurrentUser', JSON.stringify(dataUser));

    setHomeScreen();
    setSubmitting(false);
  } catch (error) {
    setSubmitting(false);
    if (error[0].response && error[0].response.status === 401) {
      dispatch({
        type: LOGIN_FAIL,
        payload: I18n.t('ui-networkConnectionError'),
      });
    } else {
      dispatch({ type: LOGIN_FAIL, payload: error[1].message });
    }
  }
};
