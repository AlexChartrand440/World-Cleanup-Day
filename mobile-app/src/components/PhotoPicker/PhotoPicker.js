import React from 'react';
import PropTypes from 'prop-types';
import { Image, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import _ from 'lodash';
import strings  from '../../assets/strings';
import { AlertModal } from '../AlertModal';
import { LazyImage } from './components/LazyImage';
import styles from './styles';
import Ionicons from "react-native-vector-icons/Ionicons";


class AddPhoto extends React.Component {
    render() {
        return (
            <View style={[styles.photo, styles.photoPlaceholder]}>
                <TouchableOpacity
                    onPress={this.props.onPress}
                    style={[styles.photoButtonContainer, styles.photoButtonPlaceholder]}
                >
                    <Ionicons
                        size={styles.$photoSize}
                        name="md-add"
                        style={styles.photoButton}
                    />
                </TouchableOpacity>
            </View>
        );
    }
}

class PhotoComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showingConfirm: false,
    };

    this.buttons = [
      {
        text: strings.label_button_cancel,
        onPress: this.handleModalClosed,
      },
      {
        text: strings.label_button_delete,
        onPress: this.handleModalConfirmed,
        style: styles.deleteButton,
      },
    ];
  }
  setConfirmState = (showingConfirm) => {
    this.setState({
      showingConfirm,
    });
  };
  handlePhotoDeletePress = () => {
    this.setConfirmState(true);
  };
  handleModalClosed = () => {
    this.setConfirmState(false);
  };
  handleModalConfirmed = () => {
    this.setConfirmState(false);
    this.props.onPress();
  };
  render() {
    const { photo, onPress } = this.props;
    const { showingConfirm } = this.state;

    console.log(photo)

    return(
        <View
            key={photo}
            style={[styles.photo]}
        >
            <LazyImage
                style={[styles.photo]}
                source={{ uri: photo }}
            />
            {onPress &&
            <TouchableOpacity
                onPress={this.handlePhotoDeletePress}
                style={styles.photoButtonContainer}
            >
                <Ionicons
                    size={styles.$photoSize}
                    name="md-close"
                    style={styles.photoButton}
                />
            </TouchableOpacity>
            }
            <AlertModal
                visible={showingConfirm}
                buttons={this.buttons}
                onOverlayPress={this.handleModalClosed}
                title={strings.label_delete_photo_title}
                subtitle={strings.label_delete_photo_subtitle}
            />
        </View>
    );
  }
}

export default class PhotoPicker extends React.Component {
  render() {
      const {
          maxPhotos,
          title,
          photos,
          onDeletePress,
          onAddPress
      } = this.props;

      const hasAdd = !!onAddPress;
      const hasDelete = !!onDeletePress;
      const hasPhotos = !!photos;
      const couldAddMorePhotos =
          maxPhotos && hasPhotos && photos.length < maxPhotos;
      return (
          <View style={styles.container}>
              <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.photoContainer}
                  style={styles.photoContainer}
              >
                  {hasPhotos &&
                  photos.map((uri, index) => {
                      const onDeletePhotoPress = hasDelete
                          ? () => onDeletePress(index)
                          : undefined;
                      return (
                          <PhotoComponent
                              key={uri}
                              photo={uri}
                              onPress={onDeletePhotoPress}
                          />
                      );
                  })}

                  {hasAdd &&
                  couldAddMorePhotos &&
                  <AddPhoto key="add_photo" onPress={onAddPress} />}

              </ScrollView>
          </View>
      );
  }
}
