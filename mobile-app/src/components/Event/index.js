import React from 'react';
import { View, Text, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';

import moment from 'moment';

import isNil from 'lodash/isNil';

import { Icon } from '../Icon';

import { Icons } from '../../assets/images';

import styles from './styles';

const Event = ({
  img,
  title,
  coordinator,
  address,
  date,
  maxParticipants,
  participants,
  containerStyle,
  imageStyle,
  feedBackType,
  onPress,
}) => {
  const handleRenderParticipants = () => {
    if (!isNil(maxParticipants) && !isNil(participants)) {
      return (
        <View style={styles.participantsContainer}>
          <Text>{participants}/{maxParticipants}</Text>
        </View>
      );
    }
  };

  const handleRenderCountry = () => {
    if (address) {
      return (
        <View style={styles.locationContainer}>
          <Icon path={Icons.Location} containerStyle={styles.icon} />
          <Text style={styles.locationText}>
            {address}
          </Text>
        </View>
      );
    }
  };

  const handleRenderFeedBack = () => {
    switch (true) {
      case feedBackType === 'withoutFeedBack':
        return TouchableWithoutFeedback;
      case !!onPress:
        return TouchableOpacity;
      default:
        return View;
    }
  };

  const TouchableWrapper = handleRenderFeedBack();

  return (
    <TouchableWrapper onPress={onPress}>
      <View style={!containerStyle ? styles.container : containerStyle}>
        <Image source={img} style={!imageStyle ? styles.image : imageStyle} />

        <View style={styles.middleColumn}>
          <Text style={styles.title}>{title}</Text>
          <View>
            {coordinator &&
              <View style={styles.coordinatorContainer}>
                <Icon path={Icons.GroupPeople} containerStyle={styles.icon} />
                <Text style={styles.coordinatorText}>{coordinator}</Text>
              </View>
            }

            {handleRenderCountry()}
          </View>
        </View>

        <View style={styles.rightColumn}>
          {handleRenderParticipants()}
          <Text style={styles.dateText}>
            {moment(date).format('DD.MM.YYYY')}
          </Text>
        </View>
      </View>
    </TouchableWrapper>
  );
};

Event.propTypes = {
  title: PropTypes.string,
  coordinator: PropTypes.string,
  address: PropTypes.string,
  date: PropTypes.string,
  maxParticipants: PropTypes.number,
  participants: PropTypes.number,
  onPress: PropTypes.func,
};

export { Event };
