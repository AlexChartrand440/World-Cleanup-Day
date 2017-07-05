import React, { Component } from 'react';
import {
  StatusBar,
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight,
  KeyboardAvoidingView,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { LinearGradient } from 'expo';

import CameraService from '../../services/Camera';
import { selectors as userSelectors } from '../../reducers/user';
import { actions as mapActions } from '../../reducers/map';
import {
  actions as trashActions,
  selectors as trashSelectors,
} from '../../reducers/trashpile';
import { Button } from '../../components/Buttons';
import { LocationPicker } from './components/LocationPicker';
import { StatusPicker } from './components/StatusPicker';
import { PhotoPicker } from '../../components/PhotoPicker';
import { Divider } from '../../components/Divider';
import { getWidthPercentage, getHeightPercentage } from '../../shared/helpers';
import { Tags } from '../../components/Tags';
import { AmountPicker, AMOUNT_STATUSES } from '../../components/AmountPicker';
import styles from './styles';

const locationPropType = PropTypes.objectOf({
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
});
const MAX_HASHTAGS_NO = 15;
const GRADIENT_COLORS = ['#FFFFFF', '#F1F1F1'];

class CreateMarker extends Component {
  static defaultProps = {
    location: undefined,
  };
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    setLocation: PropTypes.func.isRequired,
    createMarker: PropTypes.func.isRequired,
    types: PropTypes.arrayOf(
      PropTypes.shape({ text: PropTypes.string, selected: PropTypes.bool }),
    ).isRequired,
    location: locationPropType.isRequired,
    initialLocation: locationPropType.isRequired,
    address: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    const { navigation: { state: { params } }, types } = props;

    let state = {
      photos: [],
      temporaryHashtag: '',
      amount: AMOUNT_STATUSES.handful,
      status: 'regular'
    };

    if (params) {
      const { photos = [] } = params;
      state.photos = photos;
    }

    state.types = types;
    state.hashtags = [];
    this.state = state;
  }

  componentWillMount() {
    const { setLocation, initialLocation } = this.props;
    setLocation(initialLocation);
  }

  handleEditLocationPress = () => {
    this.props.navigation.navigate('EditLocation');
  };

  handlePhotoAdd = () => {
    CameraService.takePhotoAsync()
      .then(response => {
        if (!response) {
          return;
        }
        const { cancelled, uri } = response;

        if (cancelled) {
          return;
        }
        const { photos } = this.state;
        this.setState({ photos: photos.concat([uri]) });
      })
      .catch(() => {});
  };

  handlePhotoDelete = index => {
    const { photos } = this.state;
    photos.splice(index, 1);
    this.setState({
      photos,
    });
  };

  handleTypeSelect = index => () => {
    const selectedTag = this.state.types[index];
    this.setState({
      types: [
        ...this.state.types.slice(0, index),
        { ...selectedTag, selected: !selectedTag.selected },
        ...this.state.types.slice(index + 1),
      ],
    });
  };

  handleHashtagDelete = index => () => {
    this.setState({
      hashtags: [
        ...this.state.hashtags.slice(0, index),
        ...this.state.hashtags.slice(index + 1),
      ],
    });
  };

  handleTrashpointCreate = () => {
    const { createMarker, location, navigation } = this.props;
    const { photos, types, hashtags, status = 'threat', amount } = this.state;
    const typeTexts = types.filter(t => t.selected).map(t => t.text);
    const hashtagsTexts = hashtags.map(t => t.text);

    createMarker({
      latlng: location,
      title: 'Title of in app create',
      description: 'Any description',
      status,
      photos,
      types: [...typeTexts, ...hashtagsTexts],
      amount: AMOUNT_STATUSES[amount],
    });
    navigation.navigate('Tabs');
  };

  handleStatusChanged = status => {
    this.setState({
      status,
    });
  };

  handleAddHahstag = () => {
    const { hashtags, temporaryHashtag } = this.state;

    if (hashtags.length === MAX_HASHTAGS_NO) {
      return;
    }

    let text = temporaryHashtag.replace(/[^a-z0-9]+/gi, ' ');

    if (!text) {
      return;
    }

    text = `#${text}`;

    const hashtagAlreadyExists = hashtags.find(
      hashtag => hashtag.text === text,
    );

    if (hashtagAlreadyExists) {
      return this.setState({
        temporaryHashtag: '',
      });
    }

    this.setState({
      hashtags: [...hashtags, { text }],
      temporaryHashtag: '',
    });
  };

  handleChangeHashtagText = text => {
    this.setState({ temporaryHashtag: text });
  };

  handleAmountSelect = amount => {
    this.setState({
      amount: AMOUNT_STATUSES[amount],
    });
  };

  render() {
    const { location, initialLocation, address } = this.props;
    const { photos, types, status, hashtags, temporaryHashtag,
            amount = 0, } = this.state;
    const addHashtagTextStyle = {};
    if (hashtags.length === MAX_HASHTAGS_NO) {
      addHashtagTextStyle.color = '#F1F1F1';
    }

    return (
      <KeyboardAvoidingView behavior="position">
        <ScrollView style={{ backgroundColor: '#eeeeee' }}>
          <StatusBar translucent barStyle="default" />
          <LocationPicker
            onEditLocationPress={this.handleEditLocationPress}
            value={location || initialLocation}
            address={address}
            status={status}
          />
          <Divider />
          <StatusPicker value={status} onChange={this.handleStatusChanged} />
          <Divider />

          <View>
            <PhotoPicker
              maxPhotos={3}
              photos={photos}
              onDeletePress={this.handlePhotoDelete}
              onAddPress={this.handlePhotoAdd}/>
        </View>
        <Divider />
        <View style={{ padding: getWidthPercentage(20) }}>
          <Text style={{ fontFamily: 'noto-sans-bold', fontSize: 16 }}>
            Select trash amount
          </Text>
          <AmountPicker amount={amount} onSelect={this.handleAmountSelect} />
          <View
            style={{
              paddingTop: getHeightPercentage(20),
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: '#3E8EDE',
                fontFamily: 'noto-sans-bold',
                fontSize: 13,
              }}
            >
              {AMOUNT_STATUSES[amount].toUpperCase()}
            </Text>
          </View>
        </View>
        <Divider />
          <View style={styles.tagsContainer}>
            <Text style={styles.trashtypesText}>
              Select trash type
            </Text>
            <Tags tags={types} onTagSelect={this.handleTypeSelect} />
            <Text
              style={[
                styles.trashtypesText,
                { marginTop: getHeightPercentage(15) },
              ]}
            >
              Additional added tags
            </Text>
            <Tags tags={hashtags} onTagDelete={this.handleHashtagDelete} />
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.hashtagInput}
                placeholderStyle={styles.hashtagInputPlaceholder}
                placeholder="ie. #cocacola, #cans"
                onChangeText={this.handleChangeHashtagText}
                value={temporaryHashtag}
                underlineColorAndroid="transparent"
                maxLength={25}
                onSubmitEditing={this.handleAddHahstag}
              />
              <TouchableHighlight
                onPress={this.handleAddHahstag}
                style={styles.addTagTouchable}
                underlayColor="transparent"
                activeOpacity={1}
              >
                <View style={styles.addTagContainer}>
                  <LinearGradient
                    style={styles.addTagGradient}
                    colors={GRADIENT_COLORS}
                  >
                    <Text style={[styles.addTagText, addHashtagTextStyle]}>
                      Add tag
                    </Text>
                  </LinearGradient>
                </View>
              </TouchableHighlight>
            </View>
          </View>
          <Divider />
          <View
            style={{
              padding: getWidthPercentage(20),
            }}
          >
            <Text style={styles.trashtypesText}>
              Something extra to report
            </Text>
            <Text style={styles.notesText}>
              Is this garbage in a difficult place to reach, a recurring dumping
              zone or something else?
            </Text>
            <View style={styles.containerBtnNote}>
              <TouchableHighlight
                onPress={() => {}}
                underlayColor="transparent"
                activeOpacity={1}
              >
                <View style={[styles.addTagContainer]}>
                  <LinearGradient
                    style={styles.addReportLinearGradient}
                    colors={GRADIENT_COLORS}
                  >
                    <Text style={styles.addTagText}>
                      Leave a note
                    </Text>
                  </LinearGradient>
                </View>
              </TouchableHighlight>
            </View>
          </View>
          <Divider />
          <View style={styles.bottomContainer}>
            <Button
              style={styles.createButton}
              text="Create trashpoint"
              onPress={this.handleTrashpointCreate}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = ({ user, trashpile }) => {
  const props = {
    initialLocation: userSelectors.getLocation(user),
    location: trashSelectors.getLocation(trashpile),
    address: trashSelectors.getFullAddress(trashpile),
    types: trashSelectors
      .getTypes(trashpile)
      .map(text => ({ text, selected: false })),
  };
  return props;
};

const mapDispatch = {
  setLocation: trashActions.setFullLocation,
  createMarker: mapActions.createMarker,
  fetchTrashpileAddress: trashActions.fetchTrashpileAddress,
};

export default connect(mapStateToProps, mapDispatch)(CreateMarker);
