import {
  Theme,
} from '../../../theming/Theme';
import {
  Styles,
} from './types';

export const defaultStyles = (theme: Theme): Styles => {
  const {
    palette: {
      others,
      error,
      common,
    },
    spacing: {
      spacing,
    },
  } = theme;
  return {
    correctPickerStyle: {
      flexDirection: 'row',
      height: spacing(4.5),
      borderRadius: spacing(3.5),
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: others.inputBorder,
    },
    incorrectPickerStyle: {
      flexDirection: 'row',
      height: spacing(4.5),
      borderRadius: spacing(3.5),
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: error.value,
    },
    container: {
      width: '100%',
      height: spacing(7),
      alignSelf: 'flex-start',
      paddingHorizontal: spacing(1),
    },
    inputError: {
      ...theme.typography.subtitle1,
      marginLeft: spacing(2.5),
    },
    inputWithLableStyle: {
      marginVertical: spacing(2),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignContent: 'stretch',
    },
    textInputContainer: {
      marginVertical: spacing(0.625),
    },
    labelContainerStyle: {
      color: others.title,
      fontSize: spacing(2),
      marginBottom: spacing(1),
    },
    countryPickerContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      width: '100%',
      flex: 1,
      alignItems: 'flex-start',
      overflow: 'hidden',
      borderColor: others.inputBorder,
    },
    chevron: {
      maxWidth: spacing(3),
      maxHeight: spacing(3),
      alignSelf: 'flex-end',
    },
    callingCode: {
      ...theme.typography.subtitle1,
      marginHorizontal: spacing(1.25),
      color: common.black,
      fontSize: spacing(2),
    },
  };
};
