import React, { useState } from 'react';
import { View } from 'react-native';
import { DropdownField, Typography, useStyles, useTheme } from 'elephanz-rn-ui';
import { tempTranslate } from 'src/utils/HelpersFunctions';
import { DefaultDropDownInterface } from 'src/Types';
import { wp } from 'src/utils/Dimensions/dimen';
import DefaultSeparator from '../DefaultSeparator';
import { Assets } from 'assets';
import styles from './styles';

const DefaultDropdown: React.FC<DefaultDropDownInterface> = (props) => {
  const {
    data,
    value,
    onChange,
    placeholder,
    title,
    disabled,
    style,
    textColor,
    openArrowIcon,
    closeArrowIcon,
    withoutView,
    dropDownStyle,
    isRequired,
    buttonTextStyle,
    SelectedItemObject,
    setIsOpened,
    removeBorderIfNotOpen,
    notFullWidth,
  } = props;

  const { selectStyle } = useStyles(styles);
  const [isOpened, setOpened] = useState(false);

  const {
    theme: {
      palette: { common },
    },
  } = useTheme();

  const {
    images: {
      screens: {
        creditech: { DownArrow, UpArrow },
      },
    },
  } = Assets;

  const renderDropDown = () => (
    <DropdownField
      data={data}
      value={value}
      onChange={(item) => {        
        onChange(item);
      }}
      placeholder={
        placeholder
          ? placeholder
          : title
          ? title
          : tempTranslate('Select', 'اختر')
      }
      openArrowIcon={openArrowIcon ?? UpArrow}
      closeArrowIcon={closeArrowIcon ?? DownArrow}
      textColor={
        textColor
          ? textColor
          : !disabled
          ? common.black
          : common.placeHolderText
      }
      disabled={disabled}
      isRequired={isRequired}
      dropDownStyle={[
        dropDownStyle,
        !isOpened && removeBorderIfNotOpen && { borderWidth: 0 },
      ]}
      buttonTextStyle={buttonTextStyle}
      SelectedItemObject={SelectedItemObject}
      setIsOpened={setIsOpened ?? setOpened}
    />
  );

  const renderTitle = () => {
    return (
      <View style={selectStyle('titleMainView')}>
        <DefaultSeparator width={wp(30)} ms={5} />

        <Typography
          fontWeight="bold"
          customStyles={() => ({ text: selectStyle('titleStyle') })}
        >
          {title}
        </Typography>

        <DefaultSeparator me={5} />
      </View>
    );
  };

  return (
    <>
      {title && renderTitle()}

      <View
        style={[
          selectStyle('container'),
          !notFullWidth && { width: '100%' },
          dropDownStyle,
        ]}
      >
        {withoutView ? (
          renderDropDown()
        ) : (
          <View
            style={[
              selectStyle('dropDownWrapper'),
              style,
              {
                borderColor: disabled
                  ? common.placeHolderText
                  : common.darkBlue,
              },
              isOpened && selectStyle('openedDropDownWrapper'),
              !isOpened && removeBorderIfNotOpen && { borderWidth: 0 },
            ]}
          >
            {renderDropDown()}
          </View>
        )}
      </View>
    </>
  );
};

export default DefaultDropdown;
