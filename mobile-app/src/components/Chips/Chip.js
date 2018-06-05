import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
} from 'react-native';

const style = {
  borderColor: 'rgb(0, 143, 223)',
  borderWidth: 1,
  paddingVertical: 5,
  paddingHorizontal: 18,
  height: 30,
  borderRadius: 15,
  color: 'rgb(0, 143, 223)',
  fontFamily: 'Lato-Bold',
  fontSize: 15,
  lineHeight: 18,
  margin: 4,
};

const Chip = ({ text }) => {
  return (
    <Text style={style}>
      {text}
    </Text>
  );
};

Chip.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Chip;

