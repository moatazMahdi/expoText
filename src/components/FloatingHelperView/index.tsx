import React, { useEffect } from 'react';
import { View, ViewStyle } from 'react-native';
import { useNavigationUtils, useStores } from 'hooks';
import { useRoute } from '@react-navigation/native';
import { useStyles } from 'elephanz-rn-ui';
import RowView from '../Wrappers/RowView';
import { observer } from 'mobx-react';
import { ApplicationAnalytics } from 'src/utils/firebaseUtils';
import { ProductType } from 'src/stores/backend/products';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import WhatsApp from '../WhatsApp';
import SvgView from '../SvgView';
import { Assets } from 'assets';
import styles from './styles';
interface FloatingHelperViewInterface {
  style?: ViewStyle;
  mt?: number;
  jc?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
  wt?: string | number;
  plans?: {};
  bot?: number;
  product?: {
    id: number;
    name: ProductType;
  };
  fromOffer?: boolean;
  onPress?: () => void;
}

const FloatingHelperView: React.FC<FloatingHelperViewInterface> = (props) => {
  const { mt, jc, wt, plans, bot, style, product, fromOffer, onPress } = props;
  const stores = useStores();
  const [noCalculator, setNoCalculator] = React.useState(false);
  const { selectStyle } = useStyles(styles);
  const { navigate } = useNavigationUtils();
  const route = useRoute() || {};

  const {
    images: {
      screens: { creditech },
    },
  } = Assets;

  useEffect(() => {
    if (
      ['Brokerage', 'Leasing', 'Factoring', 'green_finance']?.includes(
        product?.name,
      )
    ) {
      setNoCalculator(true);
    }
  }, []);

  const CTAEvent = () => {
    ApplicationAnalytics(
      {
        eventKey: 'calculator',
        type: 'CTA',
        parameters: { ScreenName: route?.name },
      },
      stores,
    );
  };

  const onNavigateInstallmentCalculator = () => {
    CTAEvent();
    stores.backend.products.setProduct(product?.name);
    navigate('installmentCalculator', {
      data: plans,
      product: product,
      productId: product.id,
      productName: product?.name,
    });
  };

  return (
    <View
      style={[
        selectStyle('overImageContainer'),
        mt && { marginTop: hp(mt) },
        jc && { justifyContent: jc },
        wt && { width: wp(wt) },
        bot && { bottom: hp(bot) },
        !noCalculator && selectStyle('shadowView'),
        style,
      ]}
    >
      {fromOffer ? (
        <RowView
          style={[
            selectStyle('rowView'),
            {
              width: wp(75),
            },
          ]}
        >
          <SvgView
            onPress={() => {
              CTAEvent();
              onPress();
            }}
            svgFile={creditech.CalculatorIcon}
            width={40}
            height={40}
          />
        </RowView>
      ) : (
        <RowView
          style={[
            selectStyle('rowView'),
            noCalculator && {
              width: wp(55),
              justifyContent: 'flex-start',
              backgroundColor: 'transparent',
            },
          ]}
        >
          {!noCalculator && (
            <SvgView
              onPress={onNavigateInstallmentCalculator}
              svgFile={creditech.CalculatorIcon}
              width={40}
              height={40}
            />
          )}
          <WhatsApp serviceTitle={product?.name} />
        </RowView>
      )}
    </View>
  );
};

export default observer(FloatingHelperView);
