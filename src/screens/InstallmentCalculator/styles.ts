import { StyleSheet, ViewStyle, Dimensions, ImageStyle, TextStyle, Platform, I18nManager } from 'react-native';
import { Theme } from 'elephanz-rn-ui';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import { Fonts } from 'src/assets/fonts';

const { width, height } = Dimensions.get('window');

interface IStyles {
  container: ViewStyle;
  animationContainer: ViewStyle;
  backContainer: ViewStyle;
  backArrowArabic: ViewStyle;
  topContainer: ViewStyle;
  subHeader: ViewStyle;
  headerBackgroundContainer: ViewStyle;
  headerBackgroundImage: ImageStyle;
  headerBackgroundOverlay: ViewStyle;
  logoContainer: ViewStyle;
  pageDescriptionContainer: ViewStyle;
  pageDescriptionLabel: TextStyle;
  socialContainer: ViewStyle;
  socialItem: ViewStyle;
  cardContainer: ViewStyle;
  cardContainerList: ViewStyle;
  cardFiller: ViewStyle;
  searchFieldContainer: ViewStyle;
  searchFieldInput: TextStyle;
  searchIconContainer: ViewStyle;
  filterIcon: ImageStyle;
  offersBody: ViewStyle;
  offersItem: ViewStyle;
  offersItemImage: ImageStyle;
  offerItemImageStyle: ImageStyle;
  offerItemStyle: ViewStyle;
  offersHeader: ViewStyle;
  offersContainer: ViewStyle;
  offersSlider: ViewStyle;
  offersSliderRTL: ViewStyle;
  offersTitleContainer: ViewStyle;
  merchantsTitleContainer: ViewStyle;
  subproductsTitleContainer: ViewStyle;
  offersTitle: TextStyle;
  offersSeeAll: TextStyle;
  offersDescription: TextStyle;
  plansItem: ViewStyle;
  plansTitle: TextStyle;
  plansTitleRTL: TextStyle;
  plansArrow: ImageStyle;
  merchantCategoryItem: ViewStyle;
  merchantCategoryTitle: TextStyle;
  merchantCategoryItemDisabled: ViewStyle;
  merchantCategoryTitleDisabled: TextStyle;
  merchantCarouselItem: ViewStyle;
  merchantCarouselImage: ImageStyle;
  subproductCategoryItem: ViewStyle;
  subproductCategoryTitle: TextStyle;
  subproductCategoryItemDisabled: ViewStyle;
  subproductCategoryTitleDisabled: TextStyle;
  subproductCarouselItem: ViewStyle;
  subproductCarouselImage: ImageStyle;
  subproductCarouselText: TextStyle;
  subproductCarouselContainer: ViewStyle;
  formButtonContainer: ViewStyle;
  formContinueButton: ViewStyle;
  moreMerchantsButton: ViewStyle;
  formContinueLabel: TextStyle;
  fieldContainer: ViewStyle;
  fieldInput: TextStyle;
  loanCardContainer: ViewStyle;
  loanCardOverlay: ViewStyle;
  loanTitleContainer: ViewStyle;
  loanCardTitleLabel: TextStyle;
  loanBodyContainer: ViewStyle;
  titleLabel: TextStyle;
  loanResultContainer: ViewStyle;
  loanResultTextContainer: ViewStyle;
  loanResultAmount: TextStyle;
  loanResultSubtext: TextStyle;
  loanResultSubtextContainer: ViewStyle;
  loanResultDisclaimerContainer: ViewStyle;
  loanCalculatorButton: ViewStyle;
  loanCalculatorButtonIconContainer: ViewStyle;
  loanCalculatorButtonTextContainer: ViewStyle;
  loanCalculatorButtonTitle: TextStyle;
  loanCalculatorButtonDescription: TextStyle;
  contentContainerStyle: ViewStyle;
  merchantListItem: ImageStyle;
  merchantListContainer: ViewStyle;
  smallArrow: ViewStyle;
  loanCalculatorErrorDownPayment: TextStyle;

  itemText: TextStyle;
  itemContainer: ViewStyle;
  titleText: TextStyle;
  inputStyle: ViewStyle | TextStyle;
  inputStyleDisabled: ViewStyle | TextStyle;
  inputTitleContainer: ViewStyle | TextStyle;
  inputTitleText: TextStyle;
  installmentText: TextStyle;
  installmentAmountText: TextStyle;
  modalContainer: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { primary, secondary, info, common, others },
    spacing: { spacing },
    typography: { fontFamily, fontSize }
  } = theme;

  return {
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      paddingTop: Platform.OS === 'ios' ? spacing(3) : spacing(1),
      backgroundColor: common.white
    },
    contentContainerStyle: {
      padding: spacing(2),
      flexGrow: 1,
      justifyContent: 'center'
    },
    filterIcon: {
      height: spacing(56 / 6),
      flex: 0.2,
      marginTop: spacing(1)
    },
    animationContainer: {
      width: '100%'
    },
    subHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'space-evenly',
      width: '100%',
      paddingHorizontal: spacing(1),
      marginTop: spacing(1),
      elevation: 4
    },
    backContainer: {
      height: spacing(3),
      display: 'flex',
      marginTop: spacing(3),
      marginLeft: spacing(2),
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignSelf: 'stretch',
      backgroundColor: common.transparent
    },
    backArrowArabic: {
      transform: [
        {
          rotateZ: '180deg'
        }
      ]
    },
    topContainer: {
      width,
      paddingHorizontal: spacing(2),
      paddingBottom: spacing(2),
      // flex: 1,
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'space-between',
      paddingTop: spacing(2),
      backgroundColor: common.transparent
    },
    logoContainer: {
      marginVertical: spacing(1),
      alignItems: 'center',
      justifyContent: 'center'
    },
    pageDescriptionContainer: {
      justifyContent: 'flex-start',
      alignSelf: 'center',
      alignItems: 'stretch',
      width: '70%',
      marginTop: spacing(3)
    },
    pageDescriptionLabel: {
      color: primary.value,
      fontSize: 13,
      fontFamily,
      fontWeight: '400',
      textAlign: 'center'
    },
    socialContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignSelf: 'stretch',
      alignItems: 'center',
      marginVertical: spacing(1)
    },
    socialItem: {
      marginHorizontal: spacing(1)
    },
    headerBackgroundContainer: {
      width,
      height: spacing(40),
      justifyContent: 'flex-end',
      alignItems: 'center',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0
    },
    headerBackgroundImage: {
      width,
      flex: 1,
      height: spacing(40),
      position: 'absolute',
      opacity: 0.4,
      top: 0,
      left: 0,
      right: 0
    },
    headerBackgroundOverlay: {
      width,
      height: spacing(40),
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0
    },
    cardContainer: {
      width,
      backgroundColor: common.white,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center'
    },
    cardContainerList: {
      width,
      backgroundColor: common.white,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexGrow: 1
    },
    cardFiller: {
      width,

      backgroundColor: common.white
    },
    searchFieldContainer: {
      backgroundColor: primary.contrast,
      borderRadius: spacing(3),
      paddingHorizontal: spacing(2),
      height: spacing(56 / 8),
      flexDirection: 'row',
      alignItems: 'center',
      flex: 0.9,
      justifyContent: 'flex-start',
      marginLeft: spacing(1.5)
    },
    searchFieldInput: {
      backgroundColor: common.transparent,
      marginHorizontal: spacing(2),
      flex: 1,
      fontSize,
      fontFamily,
      textAlign: 'auto',
      color: primary.value
    },
    searchIconContainer: {
      width: spacing(13 / 8)
    },
    offersContainer: {
      flexDirection: 'column',
      alignItems: 'stretch',
      alignSelf: 'stretch',
      justifyContent: 'flex-start',
      marginTop: spacing(3),
      marginBottom: spacing(2)
    },
    merchantListContainer: {
      flexDirection: 'column',
      alignItems: 'stretch',
      alignSelf: 'stretch',
      justifyContent: 'flex-start',
      marginTop: spacing(1),
      marginBottom: spacing(2),
      maxHeight: '90%',
      flexGrow: 1
    },
    offersSlider: {
      paddingHorizontal: spacing(1.5),
      paddingVertical: spacing(1),
      flexGrow: 1,
      justifyContent: 'flex-start'
    },
    offersSliderRTL: {
      paddingHorizontal: spacing(1.5),
      paddingVertical: spacing(1),
      flexGrow: 1,
      justifyContent: 'flex-start'
    },
    offersBody: {
      marginLeft: spacing(2)
    },
    offersItem: {
      width: 180,
      borderRadius: spacing(1),
      borderWidth: spacing(2),
      borderColor: others.bottomTabsBackground,
      marginHorizontal: spacing(1),
      marginBottom: spacing(0.5),
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,

      elevation: 6
    },
    offersItemImage: {
      width: '100%',
      // Without height undefined it won't work
      height: undefined,
      backgroundColor: others.bottomTabsBackground,
      aspectRatio: 40 / 29,
      resizeMode: 'cover'
    },
    offerItemStyle: {
      width: '90%',
      alignSelf: 'center',
      borderRadius: spacing(1),
      borderWidth: spacing(3),
      borderColor: others.bottomTabsBackground,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,

      elevation: 6
    },
    offerItemImageStyle: {
      marginHorizontal: spacing(2),
      alignSelf: 'center',
      height: spacing(30),
      alignContent: 'center',
      width: '100%',
      backgroundColor: others.bottomTabsBackground,
      resizeMode: 'contain'
    },
    merchantCarouselItem: {
      height: 116,
      width: 160,
      marginHorizontal: spacing(1),
      marginTop: spacing(1),
      borderRadius: spacing(2),
      overflow: 'hidden',
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: common.lightgrey
    },
    merchantCarouselImage: {
      width: '100%',
      // Without height undefined it won't work
      height: undefined,
      aspectRatio: 40 / 29,
      resizeMode: 'contain'
    },
    subproductCarouselItem: {
      margin: spacing(0.6),
      height: (width * 30) / 100,
      width: (width * 45) / 100,
      borderRadius: spacing(2),
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 5
      },
      shadowOpacity: 0.1,
      shadowRadius: 5.65,

      elevation: 6
    },
    subproductCarouselImage: {
      height: (width * 30) / 100,
      width: (width * 45) / 100,
      // height: 125,
      // width: (width - spacing(5)) / 2,
      borderRadius: spacing(2),
      position: 'absolute',
      bottom: 0
      // marginTop: 10,
    },
    subproductCarouselText: {
      bottom: spacing(2),
      width: (width - spacing(5)) / 2,
      textAlign: 'center',
      fontSize: 13,
      fontWeight: '700',
      fontFamily,
      position: 'absolute'
      // marginTop: 10,
    },
    subproductCarouselContainer: {
      alignSelf: 'stretch',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      margin: spacing(1.5),
      flex: 1,
      marginBottom: spacing(3)
    },
    offersHeader: {
      marginHorizontal: spacing(2),
      alignItems: 'flex-start',
      justifyContent: 'center'
    },
    offersTitleContainer: {
      flexDirection: 'row',
      alignSelf: 'stretch',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    merchantsTitleContainer: {
      flexDirection: 'row',
      alignSelf: 'flex-start',
      alignItems: 'center',
      marginLeft: spacing(2),
      marginTop: spacing(1)
    },
    subproductsTitleContainer: {
      marginHorizontal: spacing(2),
      marginTop: spacing(3),
      alignItems: 'flex-start',
      justifyContent: 'center'
    },
    offersTitle: {
      color: primary.value,
      fontWeight: '700',
      fontFamily,
      fontSize: 18
      // // lineHeight: 18,
    },
    offersSeeAll: {
      color: secondary.value,
      fontWeight: '500',
      fontFamily,
      fontSize: 14
      // // lineHeight: 12,
    },
    offersDescription: {
      color: info.value,
      fontWeight: '400',
      fontFamily,
      fontSize: 12
      // // lineHeight: 16,
    },
    plansItem: {
      minHeight: 50,
      borderRadius: spacing(2),
      justifyContent: 'space-between',
      flexDirection: 'row',
      marginBottom: spacing(1.5),
      alignItems: 'center',
      alignSelf: 'center',
      backgroundColor: others.carousselBackground,
      paddingVertical: spacing(1.5),
      paddingRight: spacing(1),
      flexWrap: 'wrap',
      width: '100%'
    },
    plansTitle: {
      color: primary.value,
      fontWeight: '700',
      fontFamily,
      fontSize: 14,
      // // lineHeight: 14,
      textAlign: 'left',
      width: '90%',
      paddingHorizontal: spacing(3)
    },
    plansTitleRTL: {
      color: primary.value,
      fontWeight: '700',
      fontFamily,
      fontSize: 14,
      // // lineHeight: 14,
      textAlign: 'center',
      paddingLeft: spacing(6)
    },
    plansArrow: {
      width: 15,
      height: 15,
      marginHorizontal: spacing(1),
      transform: [
        {
          rotateY: I18nManager.isRTL ? '180deg' : '0deg'
        }
      ]
    },
    merchantCategoryItem: {
      marginRight: spacing(1),
      justifyContent: 'center',
      height: 33,
      width: 60,
      alignItems: 'center',
      borderBottomColor: common.orange,
      borderBottomWidth: 3
    },
    merchantCategoryTitle: {
      color: common.orange,
      fontWeight: '400',
      fontFamily,
      fontSize: 12,
      // // lineHeight: 12,
      textAlign: 'center'
    },
    merchantCategoryItemDisabled: {
      marginRight: spacing(1),
      height: 47,
      width: 90,
      justifyContent: 'center',
      alignItems: 'center'
    },
    merchantCategoryTitleDisabled: {
      color: primary.value,
      fontWeight: '400',
      fontFamily,
      fontSize: 12,
      // // lineHeight: 12,
      textAlign: 'center'
    },
    subproductCategoryItem: {
      marginRight: spacing(1),
      justifyContent: 'center',
      height: 33,
      width: 60,
      alignItems: 'center',
      borderBottomColor: common.orange,
      borderBottomWidth: 3
    },
    subproductCategoryTitle: {
      color: common.orange,
      fontWeight: '400',
      fontFamily,
      fontSize: 12,
      // // lineHeight: 12,
      textAlign: 'center'
    },
    subproductCategoryItemDisabled: {
      marginRight: spacing(1),
      height: 33,
      width: 60,
      justifyContent: 'center',
      alignItems: 'center'
    },
    subproductCategoryTitleDisabled: {
      color: primary.value,
      fontWeight: '400',
      fontFamily,
      fontSize: 12,
      // // lineHeight: 12,
      textAlign: 'center'
    },
    formButtonContainer: {
      marginHorizontal: spacing(1),
      marginBottom: spacing(1),
      alignSelf: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    formContinueButton: {
      backgroundColor: primary.value,
      borderBottomLeftRadius: spacing(2),
      borderBottomRightRadius: spacing(2),
      borderTopLeftRadius: spacing(2),
      borderTopRightRadius: spacing(2),
      height: spacing(56 / 7),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 0,
      margin: 0,
      paddingTop: 0
    },
    moreMerchantsButton: {
      backgroundColor: others.white,
      borderColor: primary.value,
      borderWidth: spacing(0.2),
      borderBottomLeftRadius: spacing(2),
      borderBottomRightRadius: spacing(2),
      borderTopLeftRadius: spacing(2),
      borderTopRightRadius: spacing(2),
      height: spacing(56 / 7),
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'center',
      marginTop: 0,
      margin: 0,
      paddingTop: 0
    },
    formContinueLabel: {
      fontFamily
    },
    fieldContainer: {
      backgroundColor: primary.contrast,
      borderRadius: spacing(2),
      paddingHorizontal: spacing(2),
      height: spacing(56 / 8),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: spacing(0.5),
      marginHorizontal: spacing(1)
    },
    fieldInput: {
      backgroundColor: common.transparent,
      marginHorizontal: spacing(2),
      flex: 1,
      fontSize,
      fontFamily,
      textAlign: I18nManager.isRTL ? 'right' : 'left'
    },
    loanCardContainer: {
      height: '100%',
      backgroundColor: common.white,
      flexDirection: 'column',
      justifyContent: 'flex-start'
      // position: 'absolute',
      // bottom: 0,
    },
    loanCardOverlay: {
      width,
      height: height * 1.5,
      backgroundColor: primary.value,
      position: 'absolute',
      bottom: 0,
      opacity: 0.8
    },
    loanTitleContainer: {
      marginHorizontal: spacing(2.7),
      marginTop: spacing(3),
      marginBottom: spacing(2),
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    loanBodyContainer: {
      // marginTop: spacing(2),
      marginBottom: hp(20)
    },
    loanCardTitleLabel: {
      color: primary.value,
      fontSize: 24,
      fontFamily,
      fontWeight: '500'
      // // lineHeight: 30,
    },
    titleLabel: {
      color: primary.value,
      fontSize: 24,
      fontFamily,
      fontWeight: '700',
      flex: 1,
      marginHorizontal: spacing(2),
      textAlign: 'left'
    },
    loanResultContainer: {
      height: 78,
      borderWidth: 1,
      borderColor: primary.value,
      borderStyle: 'dashed',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: hp(1),
      marginHorizontal: wp(2),
      marginBottom: hp(2),
      borderRadius: spacing(2)
    },
    loanResultAmount: {
      color: primary.value,
      fontSize: 36,
      fontFamily,
      fontWeight: '700'
      // // lineHeight: 36,
    },
    loanResultSubtext: {
      color: info.value,
      fontSize: 14,
      fontFamily,
      fontWeight: '400'
      // // lineHeight: 14,
    },
    loanResultTextContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-end'
    },
    loanResultSubtextContainer: {
      // height: '100%',
      justifyContent: 'flex-end',
      marginBottom: spacing(1),
      marginHorizontal: spacing(1)
    },
    loanResultDisclaimerContainer: {
      flex: 1,
      flexDirection: 'row',
      marginHorizontal: wp(20)
    },
    loanCalculatorButton: {
      backgroundColor: others.secondaryOrange,
      borderBottomLeftRadius: spacing(2),
      borderBottomRightRadius: spacing(2),
      borderTopLeftRadius: spacing(2),
      borderTopRightRadius: spacing(2),
      height: spacing(56 / 7),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 13
    },
    loanCalculatorButtonIconContainer: {
      height: 30,
      width: 30
    },
    loanCalculatorButtonTextContainer: {
      height: 35,
      flex: 1,
      marginHorizontal: spacing(1),
      justifyContent: 'space-between'
    },
    loanCalculatorButtonTitle: {
      color: primary.value,
      fontSize: 18,
      fontFamily,
      fontWeight: '700'
      // // lineHeight: 18,
    },
    loanCalculatorButtonDescription: {
      color: info.value,
      fontSize: 10,
      fontFamily,
      fontWeight: '400',
      marginTop: spacing(0.2)
      // // lineHeight: 12,
    },
    merchantListItem: {
      marginHorizontal: spacing(1),
      height: undefined,
      aspectRatio: 40 / 29,
      width: 160,
      borderWidth: 1,
      borderColor: common.lightgrey,
      marginBottom: 10,
      resizeMode: 'contain'
    },
    smallArrow: {
      width: 15,
      height: 15.5,
      alignSelf: 'center',
      transform: [
        {
          rotateY: I18nManager.isRTL ? '180deg' : '0deg'
        }
      ],
      marginLeft: spacing(1.8),
      marginTop: spacing(0.5)
    },
    loanCalculatorErrorDownPayment: {
      width: '90%',
      justifyContent: 'center',
      marginTop: hp(10),
      marginStart: wp(20)
    },

    itemText: {
      fontSize: hp(16)
    },
    itemContainer: {
      height: hp(50),
      borderRadius: 20,
      backgroundColor: common.white,
      justifyContent: 'center',
      paddingHorizontal: wp(15)
    },
    titleText: {
      fontSize: hp(16),
      marginStart: wp(20)
    },
    inputStyle: {
      width: wp(161),
      height: hp(50),
      backgroundColor: common.white,
      borderWidth: 1,
      borderRadius: 20,
      borderColor: common.lightBlue,
      fontSize: hp(16),
      color: common.darkBlue,
      fontFamily: Fonts.regular,
      fontWeight: '400',
      paddingHorizontal: wp(20)
    }, 
    inputStyleDisabled: {
      width: wp(161),
      height: hp(50),
      backgroundColor: common.lightSilver,
      borderWidth: 1,
      borderRadius: 20,
      borderColor: common.grey,
      fontSize: hp(16),
      color: common.grey,
      fontFamily: Fonts.regular,
      fontWeight: '400',
      paddingHorizontal: wp(20)
    },
    inputTitleContainer: {},
    inputTitleText: {
      fontSize: hp(16),
      marginBottom: hp(17),
      marginTop: hp(21)
    },
    installmentText: {
      fontSize: hp(16),
      marginStart: wp(20),
      marginTop: hp(21)
    },
    installmentAmountText: {
      marginStart: wp(20),
      fontSize: hp(48),
      marginTop: hp(16)
    },
    modalContainer: {
      width: wp(300),
      borderRadius: 20,
      alignSelf: 'center',
      backgroundColor: common.white,
      padding: wp(20)
    }
  };
};

export default StyleSheet.create(styles);
