import React from 'react';
import { View } from 'react-native';
import { useStyles, useTheme } from 'elephanz-rn-ui';
import DefaultTextInput from '../DefaultTextInput';
import ErrorField from './errorField';
import { formInputData } from 'src/Types';
import styles from './styles';

const FormInputField: React.FC<any> = (props: { data: formInputData }) => {
  const { data } = props;

  const { selectStyle } = useStyles(styles);

  const {
    theme: {
      palette: { common },
    },
  } = useTheme();

  return (
    <>
      <View
        style={[
          selectStyle('fieldContainer'),
          selectStyle('fieldContainerRadius'),
          data?.viewStyle,
        ]}
      >
        <DefaultTextInput
          placeholder={data?.placeholder}
          placeholderTextColor={common.placeHolderText}
          value={data?.value}
          onchangeText={data?.onChangeText}
          keyboardType={data?.keyboardType ?? 'default'}
          viewStyle={selectStyle('inputView')}
          inputContainer={selectStyle('inputContainer')}
          textInputStyle={selectStyle('fieldInputText')}
          onTouchStart={data?.onTouchStart}
          maxLength={data?.maxLength}
        />
      </View>

      <ErrorField
        data={{ errorCondition: data?.errorCondition, error: data?.error }}
      />
    </>
  );
};

export default FormInputField;
