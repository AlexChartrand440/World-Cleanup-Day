
import { colors } from '../../../themes';

export default {

  containerProgress: {
    flex: 1,
    justifyContent: 'center',
  },
  containerContent: {
    flex: 1,
    backgroundColor: colors.$mainBackground,
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  searchContainerStyle: {
    backgroundColor: 'rgb(228, 241, 253)',
  },
  mainContentContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
  },
  vertical: {
    flexDirection: 'column',
  },
  spinner: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  map: {
  },
  navigatorStyle: {
    tabBarHidden: true,
    navBarTitleTextCentered: true,
    navBarBackgroundColor: 'white',
    navBarTextColor: '$textColor',
    navBarTextFontSize: 17,
    navBarTextFontFamily: 'Lato-Bold',
    statusBarColor: 'white',
    statusBarTextColorScheme: 'dark',
  },
  trashPointItem: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  counterContainer: {
    width: '100%',
    height: 30,
    backgroundColor: 'rgb(255, 216, 0)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counter: {
    fontFamily: 'Lato-Bold',
    fontSize: 15,
    color: 'rgb(40, 38, 51)',
  },
  searchButtonContainer: {
    backgroundColor: 'white',
    position: 'absolute',
    borderRadius: 22,
    width: 138,
    height: 34,
    top: 12,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 40,
  },
};
