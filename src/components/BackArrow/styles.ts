import { StyleSheet, ViewStyle, I18nManager } from "react-native";
import { Theme } from "elephanz-rn-ui";

interface IStyles {
  backContainer: ViewStyle;
  backIcon: ViewStyle;
  roundedType: ViewStyle;
}

const styles = (theme: Theme): IStyles => {
  const {
    palette: { common, primary },
    spacing: { spacing },
  } = theme;

  return {
    backContainer: {
      height: spacing(5),
      width: spacing(5),
      padding: spacing(2),
      justifyContent: "center",
      alignItems: "flex-start",
    //  alignSelf: "stretch",
    },
    roundedType: {
      backgroundColor: primary.value,
      borderRadius: spacing(2.5),
      alignItems: "center",
      marginHorizontal: spacing(2),
      marginTop: spacing(5),
    },
    backIcon: {
      height: spacing(3),
      transform: [
        {
          rotateY: I18nManager.isRTL ? "180deg" : "0deg",
        },
      ],
      backgroundColor: common.transparent,
    },
  };
};

export default StyleSheet.create(styles);
