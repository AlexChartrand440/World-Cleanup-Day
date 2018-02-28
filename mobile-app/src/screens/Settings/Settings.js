import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity, Linking, TouchableHighlight} from 'react-native';
import {compose} from 'recompose';
import {connect} from 'react-redux';
import _ from 'lodash';

import {CountryModal} from './components/CountryModal';
import strings from '../../config/strings';
import ToggleSwitch from 'toggle-switch-react-native'

// import {
//   operations as userOps,
//   selectors as userSels,
// } from '../../reducers/user';
import {COUNTRY_LIST} from '../../shared/constants';

import styles, {
    listItemProps,
    downRightIcon,
    defaultRightIcon,
} from './styles';
import {PRIVACY_URL, TERMS_URL} from "../../../env";
import colors from "../../config/colors";
import {ABOUT_SCREEN} from "../index";

export default class Settings extends Component {

    static navigatorStyle = {
        tabBarHidden: true,
        navBarTitleTextCentered: true,
    };

    constructor(props) {
        super(props);

        this.state = {
            showCountryModal: false,
            countryFilter: undefined,
        };
        this.handleCountryItemPress = _.debounce(
            this.handleCountryItemPress,
            2000,
            {
                trailing: false,
                leading: true,
            },
        );
    }

    getFilteredCountries() {
        // const { countryFilter } = this.state;
        // if (!countryFilter) {
        //   return COUNTRY_LIST;
        // }
        // return COUNTRY_LIST.filter(
        //   c => c.name.toLowerCase().indexOf(countryFilter.toLowerCase()) !== -1,
        // );
    }

    closeModal = () => {
        this.setState({
            showCountryModal: false,
        });
    };

    handleCountryItemPress = () => {
        this.setState(prevState => ({
            showCountryModal: !prevState.showCountryModal,
        }));
    };

    handleCountryChanged = (country) => {
        this.setState({
            showCountryModal: false,
            countryFilter: undefined,
        });
        this.props.updateProfile({country: country.code});
    };
    handleCountryFilterChanged = (countryFilter) => {
        this.setState({countryFilter});
    };
    handleLogoutPress = async () => {
        const {logout, navigation} = this.props;
        logout().then(() => {
            // navigation.resetTo('Login');
        }, () => null);
    };

    handleTermsPress = () => {
        this.props.navigator.push({
            screen: TER
        });
    };
    handlePrivacyPress = () => {
        this.props.navigation.navigate('Privacy');
    };
    handleAboutPress = () => {
        this.props.navigator.push({
            screen: ABOUT_SCREEN,
            title: strings.label_about_header
        })
    };

    handleLinkPress = link => () =>
        Linking.openURL(link).catch(err => console.error('An error occurred', err));

    renderModals = () => {
        const {showCountryModal, countryFilter} = this.state;
        return (
            <View>
                <CountryModal
                    visible={showCountryModal}
                    onPress={this.handleCountryChanged}
                    countries={this.getFilteredCountries()}
                    onSearchChange={this.handleCountryFilterChanged}
                    search={countryFilter}
                    onClose={this.closeModal}
                />
            </View>
        );
    };

    render() {
        const {country} = this.props;
        // const countrySubtitle = country
        //   ? country.name
        //   : this.props.t('label_country_picker_placeholder');
        return (
            <View>
                <View style={styles.listContainer}>
                    <View style={styles.titleStyle}>
                        <Text style={styles.titleTextStyle}>{strings.label_profile_settings.toUpperCase()}</Text>
                    </View>
                    <View style={styles.itemStyle}>
                        <Image
                            style={styles.imageItemStyle}

                            source={require('./images/ic_name.png')}/>
                        <Text style={styles.textItemStyle}>{'Yuliya Yonder'}</Text>
                    </View>
                    <View style={styles.itemStyle}>
                        <Image
                            style={styles.imageItemStyle}
                            source={require('./images/ic_location.png')}/>
                        <Text style={styles.textItemStyle}>{'Kiev, Ukraine'}</Text>
                    </View>
                    <View style={styles.itemStyle}>
                        <Image
                            style={styles.imageItemStyle}
                            source={require('./images/ic_phone_number.png')}/>
                        <Text style={styles.textItemStyle}>{'+3809500000000'}</Text>
                    </View>
                    <View style={styles.itemStyle}>
                        <Image
                            style={styles.imageItemStyle}
                            source={require('./images/ic_email.png')}/>
                        <Text style={styles.textItemStyle}>{'yonder@gmail.com'}</Text>
                    </View>
                    <View style={styles.titleStyle}>
                        <Text style={styles.titleTextStyle}>{strings.label_privacy_settings.toUpperCase()}</Text>
                    </View>
                    <View style={styles.itemStyle}>
                        <Text style={styles.textItemStyle}>{strings.label_private_profile}</Text>
                        <View style={styles.switchStyle}>
                        <ToggleSwitch isOn={true}
                                      onColor={colors.$blue}
                                      offColor={colors.$toggleOffColor}
                                      onToggle={(isOn) => console.log('changed to : ', isOn)}/>
                        </View>
                    </View>
                    <View style={styles.titleStyle}>
                        <Text style={styles.titleTextStyle}>{strings.label_general_information.toUpperCase()}</Text>
                    </View>
                    <TouchableOpacity style={styles.itemStyle}
                                      onPress={this.handleLinkPress(TERMS_URL).bind(this)}>
                        <Text style={styles.textItemStyle}>{strings.label_header_tc}</Text>
                        <Image
                            style={styles.arrowItemStyle}
                            source={require('../../assets/images/icon_menu_arrowforward.png')}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.itemStyle}
                                      onPress={this.handleLinkPress(PRIVACY_URL)}>
                        <Text style={styles.textItemStyle}>{strings.label_privacy_policy_header}</Text>
                        <Image
                            style={styles.arrowItemStyle}
                            source={require('../../assets/images/icon_menu_arrowforward.png')}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.itemStyle}
                                      onPress={this.handleAboutPress}>
                        <Text style={styles.textItemStyle}>{strings.label_about_world_cleanup_day}</Text>
                        <Image
                            style={styles.arrowItemStyle}
                            source={require('../../assets/images/icon_menu_arrowforward.png')}/>
                    </TouchableOpacity>
                    <TouchableHighlight style={styles.logoutButtonStyle}
                                        onPress={this.handleLinkPress(TERMS_URL).bind(this)}>
                        <Text style={styles.logOutTextStyle}>{strings.label_button_logout}</Text>
                    </TouchableHighlight>

                    {/*{this.renderModals()}*/}

                </View>
            </View>
        );
    }
}
