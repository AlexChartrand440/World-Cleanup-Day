import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, Image } from 'react-native';

import { Map } from '../../../../components/Map/Map';
import { SCREEN_WIDTH, DEFAULT_ZOOM } from '../../../../shared/constants';

import styles from './styles';
import strings from '../../../../assets/strings'

const getFullAddress = ({ subLocality, locality, country }) => {
  return [subLocality, locality, country].filter(x => !!x).join(', ');
};

const LocationPicker = ({
  value: { latitude, longitude },
  address: { streetAddress = '', locality = '', country = '', streetNumber = '', subLocality = '' },
  onEditLocationPress,
  status,
  t,
}) => {
  const latitudeDelta = DEFAULT_ZOOM;
  const longitudeDelta = latitudeDelta * SCREEN_WIDTH / styles.$mapContainerHeight;
  const marker = {
    latlng: { latitude, longitude },
    status,
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <Map
          markers={[marker]}
          scrollEnabled={false}
          zoomEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
          region={{
            latitudeDelta,
            longitudeDelta,
            latitude,
            longitude,
          }}
          liteMode
        />
      </View>
      <Text style={styles.streetContainer}>
        {`${streetAddress} ${streetNumber}`}
      </Text>
      <View style={styles.bottomContainer}>
        <View style={styles.iconContainer}>
          <Image source={require('../../../../assets/images/icLocationPinActive.png')}/>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            {`${getFullAddress({ subLocality, locality, country })} | ${latitude.toFixed(
              6,
            )}, ${longitude.toFixed(6)}`}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={onEditLocationPress} style={styles.editLocationContainer}>
        <Text style={styles.editLocation}>{strings.label_button_createTP_editloc}</Text>
      </TouchableOpacity>
    </View>
  );
};
//
// LocationPicker.defaultProps = {
//   value: undefined,
//   onEditLocationPress: undefined,
// };
// LocationPicker.propTypes = {
//   value: PropTypes.shape({
//     latitude: PropTypes.number,
//     longitude: PropTypes.number,
//   }),
//   address: PropTypes.any,
//   onEditLocationPress: PropTypes.func,
// };
// export default translate()(LocationPicker);
