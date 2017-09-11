import { ApiService } from '../../services';
import { API_ENDPOINTS } from '../../shared/constants';
import TYPES from './types';



const fetchUsers = ({ page, pageSize, reset }) => async dispatch => {
  dispatch({ type: TYPES.FETCH_USERS_REQUEST });
  try {
    const url = API_ENDPOINTS.FETCH_USERS({ page, pageSize });
    const response = await ApiService.get(url);
    if (
      !response ||
      !response.data ||
      !response.status ||
      response.status !== 200
    ) {
      dispatch({
        type: TYPES.FETCH_USERS_FAILED,
      });
      return false;
    }
    const data = response.data;
    const users = Array.isArray(data.records) ? data.records : [];
    const total = data.total;
    const canLoadMore = data.pageSize * data.pageNumber < total;

    dispatch({
      type: TYPES.FETCH_USERS_SUCCESS,
      payload: {
        page: data.pageNumber,
        users,
        reset,
        canLoadMore,
      },
    });
    return {
      page,
      users,
      reset,
      canLoadMore,
    };
  } catch (e) {
    console.log(e);
    dispatch({
      type: TYPES.FETCH_USERS_FAILED,
    });
    return false;
  }
};

const fetchUser = ({ id }) => async dispatch => {
  dispatch({ type: TYPES.GET_USER });
  try {
    const response = await ApiService.get(API_ENDPOINTS.FETCH_USER_BY_ID(id));
    if (!response) {
      dispatch({ type: TYPES.GET_USER_ERROR });
    } else {
      dispatch({
        type: TYPES.GET_USER_SUCCESS,
        payload: { user: response.data },
      });
    }
  } catch (ex) {
    dispatch({ type: TYPES.GET_USER_ERROR });
  }
};

const setUserLocked = (userId, locked) => async dispatch => {
  const response = await ApiService.put(API_ENDPOINTS.LOCK_USER(userId), {
    locked,
  });
  if (!response) {
    return;
  }
  dispatch({
    type: TYPES.SET_USER_LOCKED,
    payload: {
      userId,
      locked,
    },
  });
};

export default {
  fetchUsers,
  fetchUser,
  setUserLocked,
};
