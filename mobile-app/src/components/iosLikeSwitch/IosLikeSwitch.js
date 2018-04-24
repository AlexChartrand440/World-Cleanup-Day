import React, { Component } from 'react';

import PropTypes from 'prop-types';
import {
    ViewPropTypes,
    ColorPropType,
    StyleSheet,
    Animated,
    Easing,
    PanResponder,
    TouchableOpacity,
} from 'react-native';
import colors from '../../config/colors';

const SCALE = 6 / 5;
import EStyleSheet from 'react-native-extended-stylesheet';

export default class IosLikeSwitch extends Component {

  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    value: PropTypes.bool,
    disabled: PropTypes.bool,
    circleColorActive: ColorPropType,
    circleColorInactive: ColorPropType,
    backgroundActive: ColorPropType,
    backgroundInactive: ColorPropType,
    onAsyncPress: PropTypes.func,
    onSyncPress: PropTypes.func,
    style: ViewPropTypes.style,
    circleStyle: ViewPropTypes.style,
  };

  static defaultProps = {
    width: 40,
    height: 21,
    value: false,
    disabled: false,
    circleColorActive: 'white',
    circleColorInactive: 'white',
    backgroundActive: colors.$toggleOnColor,
    backgroundInactive: colors.$toggleOffColor,
    onAsyncPress: (callback) => { callback(true); },
  };

  constructor(props, context) {
    super(props, context);
    const { width, height, value } = props;

    this.offset = width - height + 1;
    this.handlerSize = height - 2;

    this.state = {
      value,
      toggleable: true,
      alignItems: value ? 'flex-end' : 'flex-start',
      handlerAnimation: new Animated.Value(this.handlerSize),
      switchAnimation: new Animated.Value(value ? -1 : 1),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps === this.props) {
      return;
    }

        // componentWillReceiveProps will still be triggered if
        // render function of father component is triggered.
        // Thus, toggleSwitch will be executed without two-way bind.
    if (typeof nextProps.value !== 'undefined' && nextProps.value !== this.props.value) {
            /** you can add animation when changing value programmatically like following:
             /* this.animateHandler(this.handlerSize * SCALE, () => {
      /*   this.toggleSwitch(true)
      /*  })
             * */
      this.toggleSwitch(true);
    }
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderGrant: this.onPanResponderGrant,
      onPanResponderMove: this.onPanResponderMove,
      onPanResponderRelease: this.onPanResponderRelease,
    });
  }

  onPanResponderGrant = (evt, gestureState) => {
    const { disabled } = this.props;
    if (disabled) return;

    this.animateHandler(this.handlerSize * SCALE);
  };

  onPanResponderMove = (evt, gestureState) => {
    const { value, toggleable } = this.state;
    const { disabled } = this.props;
    if (disabled) return;

    this.setState({
      toggleable: value ? (gestureState.dx < 10) : (gestureState.dx > -10),
    });
  };

  onPanResponderRelease = (evt, gestureState) => {
    const { handlerAnimation, toggleable, value } = this.state;
    const { height, disabled, onAsyncPress, onSyncPress } = this.props;
    if (disabled) return;

    if (toggleable) {
      if (onSyncPress) {
        this.toggleSwitch(true, onSyncPress);
      } else {
        onAsyncPress(this.toggleSwitch);
      }
    } else {
      this.animateHandler(this.handlerSize);
    }
  };

  toggleSwitch = (result, callback = () => null) => { // "result" is result of task
    const { switchAnimation } = this.state;
    const { value } = this.props;
    console.log(value, this.state.value)
    this.animateHandler(this.handlerSize);
    if (result) {
      this.animateSwitch(value, () => {
        this.setState({
          value,
          alignItems: !value ? 'flex-end' : 'flex-start',
        }, () => {
          callback(!value);
        });
        switchAnimation.setValue(!value ? -1 : 1);
      });
    }
  };

  animateSwitch = (value, callback = () => null) => {
    const { switchAnimation } = this.state;

    Animated.timing(switchAnimation,
      {
        toValue: !value ? this.offset : -this.offset,
        duration: 200,
        easing: Easing.linear,
      },
        ).start(callback);
  };

  animateHandler = (value, callback = () => null) => {
    const { handlerAnimation } = this.state;

    Animated.timing(handlerAnimation,
      {
        toValue: value,
        duration: 100,
        easing: Easing.linear,
      },
        ).start(callback);
  };

  render() {
    const { switchAnimation, handlerAnimation, alignItems } = this.state;
    const {
            backgroundActive, backgroundInactive,
            width, height, circleColorActive, circleColorInactive, style,
            circleStyle,
            value,
            ...rest         
        } = this.props;

    const interpolatedBackgroundColor = switchAnimation.interpolate({
      inputRange: value ? [-this.offset, -1] : [1, this.offset],
      outputRange: [backgroundInactive, backgroundActive],
    });

    const interpolatedCircleColor = switchAnimation.interpolate({
      inputRange: value ? [-this.offset, -1] : [1, this.offset],
      outputRange: [circleColorInactive, circleColorActive],
    });

    return (
      <Animated.View
        {...rest}
        {...this._panResponder.panHandlers}
        style={[styles.container, style, {
          width,
          height,
          alignItems,
          borderRadius: height / 2,
          backgroundColor: interpolatedBackgroundColor }]}
      >
        <Animated.View style={[{
          backgroundColor: interpolatedCircleColor,
          width: handlerAnimation,
          height: this.handlerSize,
          borderRadius: height / 2,
          transform: [{ translateX: switchAnimation }],
        }, circleStyle]}
        />
      </Animated.View>
    );
  }

}

const styles = EStyleSheet.create({
  container: {
    overflow: 'hidden',
    justifyContent: 'center',
  },
});
