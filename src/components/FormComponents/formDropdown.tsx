import React, { useState } from 'react';
import { View } from 'react-native';
import DefaultDropdown from 'src/components/DefaultDropdown';
import { useStyles, useTheme } from 'elephanz-rn-ui';
import ErrorField from './errorField';
import { formDropdownData } from 'src/Types';
import styles from './styles';

const FormDropdown: React.FC<any> = (props: {
  data: formDropdownData;
  customStyle?: any;
}) => {
  const { data, customStyle } = props;

  const [isOpened, setIsOpened] = useState(false);

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
          {
            flexDirection: 'column',
            borderColor: data?.disabled
              ? common.placeHolderText
              : common.darkBlue,
          },
          // isOpened && selectStyle('openedFieldContainer'),
          data?.viewStyle,
          customStyle,
        ]}
      >
        <DefaultDropdown
          data={data?.data}
          value={data?.value}
          placeholder={data?.placeholder}
          onChange={data?.onChange}
          withoutView={data?.withoutView}
          buttonTextStyle={
            data?.defaultStyle
              ? selectStyle('fieldInputText')
              : data?.buttonTextStyle
          }
          isRequired={data?.isRequired}
          dropDownStyle={
            data?.defaultStyle
              ? selectStyle('fieldContainerRadius')
              : data?.dropDownStyle
          }
          disabled={data?.disabled}
          setIsOpened={setIsOpened}
        />
      </View>

      <ErrorField
        data={{ errorCondition: data?.errorCondition, error: data?.error }}
      />
    </>
  );
};

export default FormDropdown;
