import {
    SEARCH_TRASH_POINTS_ACTION,
    SEARCH_TRASH_POINTS_ERROR_ACTION,
    SEARCH_TRASH_POINTS_SUCCESS_ACTION,
    CLEAR_TRASH_POINTS_ACTION, CREATE_TRASH_POINT_ACTION, CREATE_TRASH_POINT_SUCCESS_ACTION,
    CREATE_TRASH_POINT_ERROR_ACTION
} from '../types/trashPoints';

export const searchTrashPointsAction = (query, page, pageSize, location) => ({
    type: SEARCH_TRASH_POINTS_ACTION,
    query,
    page,
    pageSize,
    location
});

export const searchTrashPointsSuccessAction = (trashPoints, page, pageSize) => ({
    type: SEARCH_TRASH_POINTS_SUCCESS_ACTION,
    trashPoints,
    page,
    pageSize
});

export const searchTrashPointsErrorAction = (error) => ({
    type: SEARCH_TRASH_POINTS_ERROR_ACTION,
    error
});

export const clearTrashPointsAction = () => ({
    type: CLEAR_TRASH_POINTS_ACTION
});

export const createTrashPointAction = (
    hashtags,
    composition,
    location,
    status,
    address,
    amount,
    name,
    photos,
) => ({
    type: CREATE_TRASH_POINT_ACTION,
    hashtags,
    composition,
    location,
    status,
    address,
    amount,
    name,
    photos,
});

export const createTrashPointSuccessAction = (trashPoint) => ({
    type: CREATE_TRASH_POINT_SUCCESS_ACTION,
    trashPoint
});

export const createTrashPointErrorAction = (error) => ({
    type: CREATE_TRASH_POINT_ERROR_ACTION,
    error
});