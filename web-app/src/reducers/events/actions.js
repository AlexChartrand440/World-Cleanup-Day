import TYPES from './types';
// import events from './events.json';
import { getEventsList, getAllEventMarkers } from './selectors';
import { ApiService } from '../../services';
import {
  getDistanceBetweenPointsInMeters,
  getGridValue,
  guid,
  destinationPoint,
} from '../../shared/helpers';
import { API_ENDPOINTS } from '../../shared/constants';
import { actions as appActions, selectors as appSelectors } from '../app';

const toggleEventWindow = () => ({
  type: TYPES.TOGGLE_EVENT_WINDOW,
});

const fetchAllEventMarkers = (
  viewPortLeftTopCoordinate,
  viewPortRightBottomCoordinate,
  mapSize,
) => async (dispatch, getState) => {
  dispatch({ type: TYPES.FETCH_ALL_EVENT_MARKERS_REQUEST });
  let datasetId = appSelectors.getTrashpointsDatasetUUID(getState());

  if (!datasetId) {
    try {
      await dispatch(appActions.fetchDatasets());
      datasetId = appSelectors.getTrashpointsDatasetUUID(getState());
    } catch (ex) {
      return dispatch({ type: TYPES.FETCH_ALL_EVENT_MARKERS_FAILED });
    }
  }

  const diagonaleInMeters = getDistanceBetweenPointsInMeters(
    viewPortLeftTopCoordinate.latitude,
    viewPortLeftTopCoordinate.longitude,
    viewPortRightBottomCoordinate.latitude,
    viewPortRightBottomCoordinate.longitude,
  );
  const grid = getGridValue(diagonaleInMeters);
  let cellSize = 0;
  if (
    viewPortRightBottomCoordinate.longitude >
    viewPortLeftTopCoordinate.longitude
  ) {
    cellSize =
      38 *
      (viewPortRightBottomCoordinate.longitude -
        viewPortLeftTopCoordinate.longitude) /
      mapSize.width;
  } else {
    cellSize =
      (180 -
        viewPortLeftTopCoordinate.longitude +
        viewPortRightBottomCoordinate.longitude +
        180) *
      38 /
      mapSize.width;
  }

  const body = {
    datasetId,
    rectangle: {
      nw: viewPortLeftTopCoordinate,
      se: viewPortRightBottomCoordinate,
    },
    cellSize,
  };

  const [markersRes, clustersRes] = await Promise.all([
    ApiService.post(API_ENDPOINTS.FETCH_EVENTS, body, {
      withToken: false,
    }),
    ApiService.post(
      API_ENDPOINTS.FETCH_OVERVIEW_EVENT_CLUSTERS,
      {
        ...body,
      },
      {
        withToken: false,
      },
    ),
  ]);

  const list = await ApiService.post(API_ENDPOINTS.FETCH_EVENTS, body, {
    withToken: false,
  });

  let markers = [];

  if (markersRes && markersRes.data && Array.isArray(markersRes.data)) {
    markers = [
      ...markersRes.data.map(marker => ({
        ...marker,
        position: {
          lat: marker.location.latitude,
          lng: marker.location.longitude,
        },
        isTrashpile: true,
      })),
    ];
  }

  if (clustersRes && clustersRes.data && Array.isArray(clustersRes.data)) {
    markers = [
      ...markers,
      ...clustersRes.data.map(cluster => ({
        ...cluster,
        position: {
          lat: cluster.location.latitude,
          lng: cluster.location.longitude,
        },
        isTrashpile: true,
        id: guid(),
      })),
    ];
  }

  if (!markersRes && !clustersRes) {
    return dispatch({ type: TYPES.FETCH_ALL_EVENT_MARKERS_FAILED });
  }

  dispatch({
    type: TYPES.FETCH_ALL_EVENT_MARKERS_SUCCESS,
    markers,
  });
  dispatch({
    type: TYPES.FETCH_ALL_EVENTS_SUCCESS,
    events: list.data,
  });
};

const fetchEventsList = ({
  cellSize,
  coordinates,
  clusterId,
}) => async (dispatch, getState) => {
  try {
    let datasetId = appSelectors.getTrashpointsDatasetUUID(getState());
    const markers = getAllEventMarkers(getState());

    if (!datasetId) {
      try {
        await dispatch(appActions.fetchDatasets());
        datasetId = appSelectors.getTrashpointsDatasetUUID(getState());
      } catch (ex) {
        return dispatch({ type: TYPES.FETCH_ALL_EVENTS_FAILED });
      }
    }

    const body = {
      datasetId,
      cellSize,
      coordinates,
    };
    const response = await ApiService.post(
      API_ENDPOINTS.FETCH_EVENTS,
      body,
    );

    if (response && response.data && Array.isArray(response.data)) {
      const angleBetweenPoints = 360 / response.data.length;
      dispatch({
        type: TYPES.FETCH_ALL_EVENT_MARKERS_SUCCESS,
        markers: [
          ...markers.filter(({ id }) => id !== clusterId),
          ...response.data.map((marker, index) => ({
            ...marker,
            position: destinationPoint(
              marker.location,
              3,
              index * angleBetweenPoints,
            ),
            isTrashpile: true,
          })),
        ],
      });
    }
  } catch (e) {
    console.log(e);
  }
};


const fetchEventTitle = (id) => ({
  type: TYPES.FETCH_EVENT_TITLE,
  id,
});

const fetchEventDetails = eventId => async dispatch => {
  dispatch({ type: TYPES.FETCH_EVENT_DETAILS_REQUEST });
  const res = await ApiService.get(API_ENDPOINTS.FETCH_EVENT_DETAILS(eventId), {
    withToken: false,
  });
  if (!res) {
    dispatch({ type: TYPES.FETCH_EVENT_DETAILS_FAILED });
    return false;
  }
  dispatch({
    type: TYPES.FETCH_EVENT_DETAILS_SUCCESS,
    event: res.data,
  });
};

export default {
  toggleEventWindow,
  fetchAllEventMarkers,
  fetchEventsList,
  fetchEventTitle,
  fetchEventDetails,
};
