import { Dimensions, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import { Theme } from 'elephanz-rn-ui';

interface IStyles {
  dropdownView:ViewStyle,
  dropdownSty:ViewStyle,
  SelectDurationView:ViewStyle,
  SelectDurationText:TextStyle,
  buttonStyle:ViewStyle,
  ProceedButtonStyle:ViewStyle
} 

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;

  return {
    dropdownView:{width:'100%',marginTop:16,alignItems:'center'},
    dropdownSty:{height:hp(48),borderRadius:44,borderColor:common.cardGray,backgroundColor:common.white},
    SelectDurationView:{
      width:'100%',
      height:hp(48),borderRadius:44,borderColor:common.cardGray,
      borderWidth:1,
      backgroundColor:common.white,
      flexDirection:'row',
      justifyContent:'space-between',
      paddingHorizontal:16,
      alignItems:'center'
    },
    SelectDurationText:{
      fontSize:12,
      fontWeight:'500',
      color:common.black
    },
    buttonStyle: {
      width: Dimensions.get("window").width/2-wp(20),
      height: hp(40),
    },
    ProceedButtonStyle:{
      width: Dimensions.get("window").width-wp(25),
      height: hp(40),
    }
  };
};

export default StyleSheet.create(styles);
