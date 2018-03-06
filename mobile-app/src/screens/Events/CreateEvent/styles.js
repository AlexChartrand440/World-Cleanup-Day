import {getWidthPercentage, getHeightPercentage} from '../../../shared/helpers';
import colors from "../../../config/colors";
import dimens from "../../../config/dimens"
import {StyleSheet} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
    view: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    container: {
        width: '100%',
        flexDirection: "column",
        backgroundColor: colors.$mainBackground
    },
    titleStyle: {
        height: getHeightPercentage(35),
        width: '100%',
        justifyContent: 'center'
    },
    titleTextStyle: {
        left: getWidthPercentage(10),
        fontSize: 13,
        color: colors.$textColorDivider,
        fontFamily: 'Lato-Bold'
    },
    itemStyle: {
        height: getHeightPercentage(35),
        width: '100%',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: colors.$white,
    },
    inputContainerStyle: {
        height: getHeightPercentage(35),
        width: '100%',
        backgroundColor: colors.$white,
    },
    inputTextStyle: {
        width: '100%',
        marginLeft: getWidthPercentage(10),
        alignSelf: 'center',
    },
    dateAndTimeContainerStyle: {
        width: '90%',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    imageContainer: {
        height: getHeightPercentage(35),
        marginLeft: getWidthPercentage(10),
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageItemStyle: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
        alignSelf: 'center'
    },
    dateAndTimeRowStyle: {
        height: getHeightPercentage(35),
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
    },
    dateTitleTextStyle: {
        flex: 1,
        marginLeft: getWidthPercentage(10),
        color: colors.$black,
        alignSelf: 'center',
        fontSize: 17,
        fontFamily: 'Lato-Regular'
    },
    dateContainer: {
        height: getHeightPercentage(70),
        width: '100%',
        flexDirection: 'row',
        backgroundColor: colors.$white,
    },
    datePickerContainer: {
        width: 100,
        flex: 1
    },
    dividerStyle: {
        width: '100%',
        height: 1,
        marginLeft: getWidthPercentage(10),
        backgroundColor: colors.$dividerColor
    },
    trashpointTipStyle: {
        backgroundColor: colors.$deepGreyTransparent,
        height: getHeightPercentage(35),
        width: '100%',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    imageTrashStyle: {
        width: 24,
        height: 24,
        marginLeft: getWidthPercentage(10),
        alignSelf: 'center',
        left: 0,
        resizeMode: 'contain'
    },
    textTrashStyle: {
        flex: 1,
        fontSize: 17,
        marginLeft: getWidthPercentage(10),
        color: colors.$blackTransparent,
        alignSelf: 'center',
        fontFamily: 'Lato-Regular'
    },
    locationContainerStyle: {
        backgroundColor: colors.$white,
        height: getHeightPercentage(35),
        width: '100%',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    descriptionContainerStyle: {
        height: 154,
        width: '100%',
        backgroundColor: colors.$white,
    },
    whatBringContainerStyle: {
        height: 72,
        width: '100%',
        backgroundColor: colors.$white,
    },
    eventPhotoContainerStyle: {
        borderRadius: 1,
        height: 236,
        width: '100%',
        justifyContent: 'center',
        backgroundColor: colors.$transparentBlueColor,
        borderWidth: 2,
        borderColor: colors.$mainBlue,
        borderStyle: 'dashed'
    },
        addPhotoIconStyle: {
        height: 21,
        width: 21,
        alignSelf: 'center'
    },
    addPhotoTextStyle: {
        color: colors.$mainBlue,
        fontFamily: 'Lato-Regular',
        fontSize: 14,
        alignSelf: 'center',
        marginTop: getWidthPercentage(5)
    },
    nextButtonStyle: {
        width: '90%',
        marginTop: 38,
        marginBottom: dimens.margin_medium,
        alignSelf: 'center',
    },
    photoIconStyle: {
        position: 'absolute',
        left: 0,
        height: 232,
        width: '100%',
    },
    addCoordinatorContainer: {
        height: '100%',
        width: '100%',
        flexDirection: "column",
        backgroundColor: colors.$mainBackground
    },
    coordinatorNext: {
        position: 'absolute',
        bottom: 0,
        width: '90%',
        marginTop: 38,
        marginBottom: dimens.margin_medium,
        alignSelf: 'center',
    },
    inputUserDataStyle: {
        width: '90%',
            marginLeft: getWidthPercentage(10),
            alignSelf: 'center',
    }
});