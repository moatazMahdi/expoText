import { Theme } from 'elephanz-rn-ui';
import { StyleSheet, ViewStyle, TextStyle, ImageStyle, Dimensions } from 'react-native';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface IStyles {
  container: ViewStyle;
  imageBackground:ViewStyle;
  buttonContainer:ViewStyle;
  button:ViewStyle;
  getStartText:TextStyle;
  cardContainer:ViewStyle;
  dotContainer:ViewStyle;
  dot:ViewStyle;
  activeDot:ViewStyle;
  inactiveDot:ViewStyle;
  title:TextStyle;
  description:TextStyle
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common },
  } = theme;


  return {
   container:{
    flex:1,
    backgroundColor:common.darkOrange
   },
   imageBackground:{
    height:Dimensions.get("window").height/1.201,
    width:Dimensions.get('window').width,
    justifyContent:'center',
    alignItems:'center'
   },
   buttonContainer:{
    width:Dimensions.get('window').width,
    paddingHorizontal:wp(16),
    flex:1,
    justifyContent:'flex-end',
    paddingBottom:hp(16)
   },
   button:{
    width:"100%",
    backgroundColor:common.darkBlue,
    height:hp(54),
    borderRadius:hp(54),
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row'
   },
   getStartText:{
    color:common.white,
    fontSize:16,
    fontWeight:'500',
    lineHeight:24
   },
   cardContainer:{
    width:Dimensions.get('window').width,
    height:"100%",
    justifyContent:'center',
    alignItems:'center',
   },
   dotContainer: {
    position: 'absolute',
    bottom: 100,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#FD8326',
  },
  inactiveDot: {
    backgroundColor: '#D9D9D9',
  },
  title:{
    fontSize:24,
    lineHeight:33,
    fontWeight:'500',
    color:common.white,
    marginTop:hp(36),
    maxWidth:wp(300),
    textAlign:"center"
  },
  description:{
    fontSize:16,
    lineHeight:22,
    fontWeight:'400',
    color:common.white,
    maxWidth:wp(300),
    textAlign:"center",
    marginTop:hp(8)
  }
  };
};

export default StyleSheet.create(styles);
