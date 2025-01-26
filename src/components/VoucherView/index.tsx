import { Image, View, Clipboard, Pressable, I18nManager } from 'react-native';
import React, { useState } from 'react';
import styles from './styles';
import { Typography, useStyles } from 'elephanz-rn-ui';
import DefaultButton from '../DefaultButton';
import { Assets } from 'assets';
import { useLocalization } from 'hooks';
import { hp } from 'src/utils/Dimensions/dimen';
import SvgView from '../SvgView';
import { getCurrency } from 'src/utils/HelpersFunctions';

interface VoucherViewInterface {
  description: string;
  onCloseModal: () => void;
  brandName: string | number;
  voucherNumber: string;
  footerText?: string;
  merchantTitle?: string;
}

const VoucherView: React.FC<VoucherViewInterface> = (props) => {
  const {
    description,
    onCloseModal,
    brandName,
    voucherNumber,
    footerText,
    merchantTitle,
  } = props;
  const [isCopied, setIsCopied] = useState(false);

  const {
    images: {
      screens: { creditech },
    },
  } = Assets;

  const { translate } = useLocalization();

  const { selectStyle } = useStyles(styles);

  const handleCopyText = () => {
    Clipboard.setString(voucherNumber);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  const renderCopySection = () => {
    return (
      <Pressable style={selectStyle('CopyContainer')}>
        <Typography
          customStyles={() => ({ text: selectStyle('discountValueText') })}
        >
          {voucherNumber}
        </Typography>
        <Pressable
          style={{ flexDirection: 'row', alignItems: 'center' }}
          onPress={handleCopyText}
        >
          <SvgView svgFile={creditech.copyicon} width={24} height={24} />
          <Typography customStyles={() => ({ text: selectStyle('CopyText') })}>
            Copy
          </Typography>
        </Pressable>
      </Pressable>
    );
  };
  //missing translations
  return (
    <View style={selectStyle('QRCodeViewContainer')}>
      <View style={{ width: '100%' }}>
        <Image
          source={creditech.congratulationsImage}
          style={{ width: hp(248), height: hp(248), alignSelf: 'center' }}
        />
        <Typography style={{ color: '#31363F', alignSelf: 'center' }}>
          {merchantTitle}
        </Typography>
        {renderCopySection()}
      </View>

      <Typography
        customStyles={() => ({ text: selectStyle('discountAmountText') })}
      >
        {description}
      </Typography>
      <Typography customStyles={() => ({ text: selectStyle('nextOrderText') })}>
        {!I18nManager?.isRTL && (
          <Typography customStyles={() => ({ text: selectStyle('TextEgp') })}>
            {getCurrency()}{' '}
          </Typography>
        )}
        {brandName}
        {I18nManager?.isRTL && (
          <Typography customStyles={() => ({ text: selectStyle('TextEgp') })}>
            {' '}
            {getCurrency()}
          </Typography>
        )}
      </Typography>
      {/* <DefaultButton
        fromModal="voucherModal"
        bottom
        loading={false}
        onPress={onCloseModal}
        title={translate('DONE')}
      /> */}
      <Typography
        customStyles={() => ({ text: selectStyle('qrCodeTextStyle') })}
      >
        {footerText ? footerText : translate('USE_CODE_ABOVE')}
      </Typography>

      {isCopied && (
        <View style={selectStyle('CopyTextContainer')}>
          <Typography style={{ color: 'black' }}>Copied!</Typography>
        </View>
      )}
    </View>
  );
};

export default VoucherView;
