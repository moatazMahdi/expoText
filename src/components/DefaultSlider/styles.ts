import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { hp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';
import { wp } from '../../utils/Dimensions/dimen';

interface IStyles {
  sliderBar: ViewStyle;
  sliderMarkerContainer: ViewStyle;
  sliderMarkerText: TextStyle;
  sliderView: ViewStyle;
  maxValueText: TextStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common }
  } = theme;

  return {
    sliderBar: {
      height: hp(1),
      backgroundColor: common.darkBlue
    },
    sliderMarkerContainer: {
      width: wp(58),
      height: wp(43),
      borderRadius: wp(9),
      backgroundColor: common.white,
      borderWidth: 1,
      borderColor: common.creamyWhite,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 4,
      shadowColor: common.azureishWhite,
      shadowOffset: {
        width: 0,
        height: hp(8)
      },
      shadowOpacity: 1,
      shadowRadius: 10
    },
    sliderMarkerText: {
      fontSize: hp(16),
      fontWeight: '400',
      textAlign: 'center',
      color: common.darkBlue
    },
    sliderView: {
      //   paddingVertical: hp(20)
    },
    maxValueText: {
      alignSelf: 'flex-end'
    }
  };
};

export default StyleSheet.create(styles);
