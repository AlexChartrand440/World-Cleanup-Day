import { call, put, take } from 'redux-saga/effects';

import {
  setErrorMessage,
} from '../actions/app';

import {
  FB_LOGIN_ACTION,
  GOOGLE_LOGIN_ACTION,
  LOGOUT,
  setToken,
  logout,
} from '../actions/auth';

import {
  updateEmailProfile,
} from '../actions/profile';

import Api from '../../api';

import {
  login,
  BACKEND_LOGIN_SOURCES,
} from '../../services/Login';

// import strings from '../../assets/strings';

function* loginGoogle() {
  try {
      console.warn("2")
    const user = yield call(Api.auth.googleLogin);
      console.warn("3")
    const accessToken = user.accessToken;
      console.warn("4 " + accessToken)
    const cleanUpToken = yield call(login, BACKEND_LOGIN_SOURCES.GOOGLE, accessToken);
      console.warn("5 " + cleanUpToken)
    yield put(setToken(cleanUpToken));
  } catch (error) {
    setErrorMessage(String(error));
  }
}

export function* loginGoogleFlow() {
  while (true) {
      console.warn("1")
    yield take(GOOGLE_LOGIN_ACTION);
    yield call(loginGoogle);

        // const {name, secondName, role} = yield take(CREATE_PROFILE_ACTION);
        // yield put(rootActions.controlProgress(true));
        // yield call(createProfile, name, secondName, role);
        // yield put(rootActions.controlProgress(false));
  }
}

function* loginFacebook() {
  try {
    const res = yield call(Api.auth.facebookLogin);

    const accessToken = res.token.accessToken;
    const cleanUpToken = yield call(login, BACKEND_LOGIN_SOURCES.FACEBOOK, accessToken);
    yield put(setToken(cleanUpToken));

    if (res.email) {
      yield put(updateEmailProfile(res.email));
    }

  } catch (error) {
    setErrorMessage(String(error));
        //  if (error.code && error.code === 'AUTH_ACCOUNT_IS_LOCKED') {
        //      yield put(setErrorMessage(strings.label_locked_account_warning));
        //  } else {
        //      yield put(setErrorMessage(String(error)));
        // }
  }
}

export function* loginFacebookFlow() {
  while (true) {
    yield take(FB_LOGIN_ACTION);
    yield call(loginFacebook);


        // const {name, secondName, role} = yield take(CREATE_PROFILE_ACTION);
        // yield put(rootActions.controlProgress(true));
        // yield call(createProfile, name, secondName, role);
        // yield put(rootActions.controlProgress(false));
  }
}


function* logoutUser() {
  try {
    yield call(Api.auth.logout);

    yield put(logout());
  } catch (error) {
    setErrorMessage(String(error));
        //  if (error.code && error.code === 'AUTH_ACCOUNT_IS_LOCKED') {
        //      yield put(setErrorMessage(strings.label_locked_account_warning));
        //  } else {
        //      yield put(setErrorMessage(String(error)));
        // }
  }
}

export function* logoutFlow() {
  while (true) {
    yield take(LOGOUT);
    yield call(logoutUser);
  }
}
