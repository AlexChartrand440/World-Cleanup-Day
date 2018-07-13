import { dm } from '../../../themes';

export default {
  itemTouch: {
    height: 79,
    backgroundColor: 'white',
  },
  itemTouchIncluded: {
    height: 79,
    backgroundColor: 'rgb(232, 232, 232)',
  },
  itemContent: {
    flexDirection: 'row',
    marginHorizontal: dm.margin_medium,
    flex: 1,
    alignItems: 'center',
  },
  status: {
    width: 40,
    height: 40,
    marginRight: dm.margin_medium,
  },
  pin: {
    width: 20,
    height: 20,
    marginRight: 3,
  },
  title: {
    fontFamily: 'Lato-Regular',
    color: 'rgb(0, 143, 223)',
    fontSize: 15,
    lineHeight: 14,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  titleBlack: {
    fontFamily: 'Lato-Regular',
    color: 'rgb(40, 38, 51)',
    height: 19,
    fontSize: 15,
    lineHeight: 20,
  },
  includedText: {
    fontFamily: 'Lato-Regular',
    color: 'rgb(123, 125, 128)',
    fontSize: 12,
    lineHeight: 14,
  },
  checkbox: {
    width: 49,
    height: 29,
    marginLeft: 33,
  },
};
