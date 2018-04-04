import React, {Component} from 'react';
import {FlatList, UIManager, View} from 'react-native';
import styles from './styles';
import {Map as MapView} from '../../components';
import {MIN_ZOOM} from '../../shared/constants';
import {renderItem} from '../Events/List/ListItem/ListItem';
import {HorizontalEvent} from '../../components/index';
import strings from '../../config/strings';
import {EVENT_DETAILS_SCREEN} from '../index';

import has from 'lodash/has';
import isEmpty from 'lodash/isEmpty';

const cancelId = 'cancelId';
const saveId = 'saveId';
const DEFAULT_RADIUS_M = 10000;

export default class EventsMap extends Component {

  static navigatorStyle = styles.navigatorStyle;

  marked = new Map();

  constructor(props) {
    super(props);
    const { location, onLoadMapEventsAction, mapEvents } = props;
    let userLocation;
    if (location === undefined || location === null) {
            // TODO fix me!! Random location?
            // alert(strings.label_no_location);
            // userLocation = {
            //     latitude: 48.8152937,
            //     longitude: 2.4597668
            // }
    } else {
      userLocation = location;
    }

    this.state = {
      markers: undefined,
      mapEvents,
      userLocation,
      radius: DEFAULT_RADIUS_M,
      selectedItem: undefined,
      updateRegion: true,
    };

    this.handleVisibleChange = this.getVisibleRows;
    this.viewabilityConfig = { viewAreaCoveragePercentThreshold: 70 };

    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
  }

    // shouldComponentUpdate(nextProps) {
    //     const locationChanged = this.props.userLocation !== nextProps.userLocation;
    //     return (
    //         locationChanged
    //     );
    // }

  handleEventPress = (event) => {
    this.props.navigator.showModal({
      screen: EVENT_DETAILS_SCREEN,
      title: strings.label_event,
      passProps: {
        eventId: event.id,
      },
    });
  };

  componentDidMount() {
    if (!this.props.datasetUUIDSelector) {
      this.props.onFetchDatasetUUIDAction();
    }
  }

  componentWillReceiveProps(nextProps) {
        // console.log("componentWillReceiveProps", nextProps.mapEvents);

    this.setState((previousState) => {
      return {
        mapEvents: nextProps.mapEvents,
      };
    });
  }

  onCheckedChanged(checked, item) {
        // if (checked) {
        //     this.marked.set(item.id, item)
        // } else {
        //     this.marked.delete(item.id)
        // }

    const markers = this.props.mapEvents.map((mapEvents) => {
      return {
        id: mapEvents.id,
        latlng: mapEvents.location,
        item: mapEvents,
      };
    });
    this.setState((previousState) => {
      return {
        ...previousState,
        markers,
      };
    });
  }

  onPressMarker = (event) => {
      //console.log('Event', event)
    const marker = this.state.mapEvents.find(
            marker => marker.id === event.id,
        );

    this.setState((previousState) => {
      return {
        selectedItem: marker,
      };
    });

    if (!marker.isTrashpile) {
      return;
    }

    if (marker && !marker.count) {
            // TODO add smooth animation to scroll
      this.flatListRef.scrollToItem({ animated: false, item: marker });
    } else if (this.map && has(this.props, 'delta.latitudeDelta')) {
      if (this.props.delta.latitudeDelta === MIN_ZOOM) {
        return this.setState({
          updateRegion: false,
        }, () => {
          this.props.onLoadEventsFromClusterAction({
              cellSize: this.props.delta.cellSize,
              coordinates: marker.coordinates,
              clusterId: marker.id,
              datasetId: this.props.datasetUUIDSelector,
              markers: this.props.mapEvents,
            });
        });
      }
      const region = {
        ...this.props.delta,
        ...marker.location,
      };
      this.map.animateToRegion(region, 100);
    }
  };

  handleOnRegionChangeComplete = (center) => {
    if (!this.state.updateRegion) {
      return this.setState({ updateRegion: true });
    }
    const adjustLongitude = (n) => {
      if (n < -180) {
        return 360 + n;
      }
      if (n > 180) {
        return n - 360;
      }
      return n;
    };
    const adjustLatitude = (n) => {
      const signMultiplier = n > 0 ? 1 : -1;
      if (Math.abs(n) > 90) {
        return signMultiplier * 89.999;
      }

      return n;
    };

    const { latitude, longitude, latitudeDelta, longitudeDelta } = center;
    const northWest = {
      latitude: adjustLatitude(latitude + latitudeDelta / 2),
      longitude: adjustLongitude(longitude - longitudeDelta / 2),
    };
    const southEast = {
      latitude: adjustLatitude(latitude - latitudeDelta / 2),
      longitude: adjustLongitude(longitude + longitudeDelta / 2),
    };

    const delta = {
      latitudeDelta,
      longitudeDelta,
    };

    if (this.props.datasetUUIDSelector) {
      this.props.onLoadMapEventsAction({
        datasetId: this.props.datasetUUIDSelector,
        viewPortLeftTopCoordinate: northWest,
        viewPortRightBottomCoordinate: southEast,
        delta,
      });
    }
  };


  keyExtractor = (item, index) => item.id.toString();

  renderItem(event) {
      const coverPhoto = event.photos && event.photos[0];
    return (
      <HorizontalEvent
        img={coverPhoto}
        title={event.name}
        coordinator={event.coordinator}
        date={event.createDate}
        maxParticipants={event.maxPeopleAmount}
        participants={event.peopleAmount}
        onPress={() => this.handleEventPress(event)}
      />
    );
  }

  renderHeader = () => {
    return (<View style={styles.emptyStyle} />);
  };

  handleSelectStatus(item) {
    if (!item || has(item, 'count')) return null;

    return item.id;
  }

  getVisibleRows = ({ viewableItems }) => {
    if (!isEmpty(viewableItems)) {
      this.setState({ selectedItem: viewableItems[0].item });
    }
  }

  render() {
    const { initialRegion } = this.props;
    const { selectedItem, mapEvents } = this.state;
    //console.log("Render map events ", mapEvents);

    const checked = this.handleSelectStatus(selectedItem);

    let listEvents = [];
    let markers = [];
    if (mapEvents && mapEvents !== undefined) {
      listEvents = mapEvents.filter(event => event.count === undefined);
        markers  = mapEvents.map((mapEvents) => {
            return {
                ...mapEvents,
                latlng: mapEvents.location,
            };
        });
    }

    return (
      <View style={styles.container}>
        <MapView
          onRegionChangeComplete={this.handleOnRegionChangeComplete}
          markers={markers}
          initialRegion={initialRegion}
          style={styles.map}
          handleOnMarkerPress={this.onPressMarker}
          selectedItem={checked}
          getRef={map => this.map = map}
        />

        <FlatList
          ref={(ref) => { this.flatListRef = ref; }}
          style={styles.list}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={this.renderHeader.bind(this)}
          data={listEvents}
          horizontal
          keyExtractor={this.keyExtractor.bind(this)}
          renderItem={({ item }) => this.renderItem(item)}
          onViewableItemsChanged={this.handleVisibleChange}
          viewabilityConfig={this.viewabilityConfig}
        />

      </View>
    );
  }

    // handleOnMarkerPress(marker) {
    //     this.setState(previousState => {
    //         return {
    //             ...previousState,
    //             selectedItem: marker.item
    //         };
    //     });
    // }

  renderSelectedItem(selectedItem, checked) {
    if (checked === undefined) return null;

    if (selectedItem) {
      const onPress = () => {

      };

      return renderItem(
                selectedItem,
                checked,
                styles.trashPointItem,
                onPress,
                this.onCheckedChanged.bind(this),
            );
    }
    return null;
  }

}
