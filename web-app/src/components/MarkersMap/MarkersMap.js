import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MapView from '../MapView';
import {
  selectors as trashpileSelectors,
  actions as trashpileActions,
} from '../../reducers/trashpile';
import {
  selectors as eventSelectors,
  actions as eventActions,
} from '../../reducers/events';
import {
  selectors as appSelectors,
} from '../../reducers/app';
import { getViewportPoints } from '../../shared/helpers';
import {
  GRID_HASH,
  DELTA_HASH,
  GRID_MIN_VALUE,
  FOCUS_EVENT_ZOOM_LEVEL,
} from '../../shared/constants';

class MarkersMap extends React.Component {
  static defaultProps = {
    onMarkerClick: null,
    fetchAllEventMarkers: null,
    tabOpened: ''
  };

  static propTypes = {
    tabOpened: PropTypes.string,
    fetchAllTrashpoints: PropTypes.func.isRequired,
    fetchAllEventMarkers: PropTypes.func,
    onMarkerClick: PropTypes.func,
    gridValue: PropTypes.any.isRequired,
    fetchClusterTrashpoints: PropTypes.func.isRequired,
    isUserLoggedIn: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      updateRegion: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.tabActive !== this.props.tabActive) {
      this.loadMarkers(nextProps.tabActive);
    }
    if (this.map && this.props.currentEventLocation.latitude && nextProps.currentEventLocation !== this.props.currentEventLocation) {
      this.map.panTo({
        lat: nextProps.currentEventLocation.latitude,
        lng: nextProps.currentEventLocation.longitude,
      });
      if (this.map.getZoom() < FOCUS_EVENT_ZOOM_LEVEL) {
        this.map.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.setZoom(FOCUS_EVENT_ZOOM_LEVEL);
        /*
        the only way to setZoom in this library
        expected this.map.setZoom returns 'not a function'
        strange, but just dealing with it
        https://github.com/tomchentw/react-google-maps/issues/188
        */
      }
      this.loadMarkers(nextProps.tabActive);
    }
    if (
      this.props.focusedLocation !== nextProps.focusedLocation &&
      nextProps.focusedLocation
    ) {
      const { focusedLocation } = nextProps;
      if (this.map) {
        const { latitude, longitude } = focusedLocation;
        const bounds = {
          north: latitude - 0.0001,
          south: latitude + 0.0001,
          west: longitude - 0.0001,
          east: longitude + 0.0001,
        };
        this.map.fitBounds(bounds);
      }
    }
  }

  handleSetMapComponent = map => {
    this.map = map;
    if (map) {
      this.loadMarkers(this.props.tabActive);
    }
  };
  handleBoundsChanged = () => {
    if (this.map) {
      this.loadMarkers(this.props.tabActive);
    }
  };

  loadMarkers = (markersType) => {
    if (!this.state.updateRegion) {
      return this.setState({ updateRegion: true });
    }
    if (this.map) {
      const mapElContainer = this.map.getDiv();
      const mapSize = {
        height: parseInt(getComputedStyle(mapElContainer).height, 10),
        width: parseInt(getComputedStyle(mapElContainer).width, 10),
      };
      const { nw, se } = getViewportPoints(this.map.getBounds());
      const action = markersType === 'trashpoints'
         ? 'fetchAllTrashpoints'
         : 'fetchAllEventMarkers';
      this.props[action](nw, se, mapSize);
    }
  };

  handleMarkerClick = marker => {
    if (!marker.isTrashpile) {
      return;
    }
    if (marker && !marker.count) {
      if (typeof this.props.onMarkerClick === 'function') {
        this.props.onMarkerClick(marker);
      }
    } else if (this.map && _.has(this.props, 'gridValue.gridValueToZoom')) {
      const diagonaleInMeters = GRID_HASH[this.props.gridValue.gridValueToZoom];
      const region = {
        ...DELTA_HASH[diagonaleInMeters],
        ...marker.position,
      };
      if (diagonaleInMeters !== GRID_MIN_VALUE) {
        const { lat, lng, latitudeDelta, longitudeDelta } = region;
        const bounds = {
          north: lat - (latitudeDelta / 16),
          south: lat + (latitudeDelta / 16),
          west: lng - (longitudeDelta / 16),
          east: lng + (longitudeDelta / 16),
        };
        this.map.fitBounds(bounds);
      } else {
        this.setState(
          {
            updateRegion: false,
          },
          () => {
            let cellSize = 0;
            const mapElContainer = this.map.getDiv();
            const mapSize = {
              height: parseInt(getComputedStyle(mapElContainer).height, 10),
              width: parseInt(getComputedStyle(mapElContainer).width, 10)
            };
            const { nw, se } = getViewportPoints(this.map.getBounds());
            if (se.longitude > nw.longitude) {
              cellSize = 38 * (se.longitude - nw.longitude) / mapSize.width;
            } else {
              cellSize = (180 - nw.longitude + se.longitude + 180) * 38 / mapSize.width;
            }
            this.props.fetchClusterTrashpoints({
              cellSize,
              coordinates: marker.coordinates,
              clusterId: marker.id,
            });
          },
        );
      }
    }
  };

  render() {
    const {
      trashpointMarkers,
      eventMarkers,
      isUserLoggedIn,
      tabActive
    } = this.props;
    const visiblePoints =
      tabActive === 'trashpoints' ? trashpointMarkers : eventMarkers;
    return (
      <MapView
        isUserLoggedIn={isUserLoggedIn}
        points={visiblePoints}
        setMapComponent={this.handleSetMapComponent}
        boundsChanged={this.handleBoundsChanged}
        onPointClick={this.handleMarkerClick}
      />
    );
  }
}
const mapStateToProps = state => ({
  trashpointMarkers: trashpileSelectors.getAllMarkers(state),
  eventMarkers: eventSelectors.getAllEventMarkers(state),
  currentEventMarker: eventSelectors.getCurrentMarkerID(state),
  currentEventLocation: eventSelectors.getCurrentMarkerLocation(state),
  gridValue: trashpileSelectors.getGridValue(state),
  focusedLocation: trashpileSelectors.getFocusedLocation(state),
  currentLocation: appSelectors.getCurrentLocation(state),
});
const mapDispatchToProps = {
  fetchAllTrashpoints: trashpileActions.fetchAllMarkers,
  fetchAllEventMarkers: eventActions.fetchAllEventMarkers,
  fetchClusterTrashpoints: trashpileActions.fetchClusterTrashpoints,
};
export default connect(mapStateToProps, mapDispatchToProps)(MarkersMap);
