import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { Text, View, TouchableHighlight } from 'react-native';
import { colors } from '../../themes';


const buttonStyle = {
  buttonStyle: {
    borderRadius: 10,
    height: 48,
    alignSelf: 'stretch',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  buttonTextStyle: {
    fontFamily: 'Lato-Regular',
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  overlayStyle: {
    borderRadius: 10,
    backgroundColor: 'white',
    alignSelf: 'stretch',
    height: 48,
    width: '100%',
    opacity: 0.5,
    position: 'absolute',
    paddingBottom: 2,
  },
};

export default class MainButton extends Component {
  renderOverlay() {
    if (this.props.disabled) {
      return (<View style={buttonStyle.overlayStyle} />);
    }
  }

  render() {
    const { style, disabled, isValid } = this.props;

    const normalColor = colors.$buttonDisableColor;
    const activeColor = colors.$mainBlue;

    const buttonBuiltStyle = {
      backgroundColor: isValid ? activeColor : normalColor,
    };

    return (
      <View
        style={style}
      >
        <TouchableHighlight
          disabled={disabled}
          underlayColor={activeColor}
          style={[buttonStyle.buttonStyle, buttonBuiltStyle]}
          onPress={this.props.onPress}
        >
          <Text
            style={[buttonStyle.buttonTextStyle, { color: 'white' }]}
          >
            {this.props.text}
          </Text>
        </TouchableHighlight>
        {this.renderOverlay()}
      </View>
    );
  }
}

MainButton.propTypes = {
  style: PropTypes.any,
  disabled: PropTypes.bool,
  isValid: PropTypes.bool,
  onPress: PropTypes.func,
  text: PropTypes.string,
};

