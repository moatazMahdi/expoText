import React, { useEffect } from 'react';
import { View, Pressable, TextInput, I18nManager } from 'react-native';
import { useLocalization, useNavigationUtils, useStores } from 'hooks';
import { useRoute } from '@react-navigation/native';
import DropShadow from 'react-native-drop-shadow';
import { useStyles } from 'elephanz-rn-ui';
import RotateViewBasedOnLocale from '../RotateViewBasedOnLocale';
import { ApplicationAnalytics } from 'src/utils/firebaseUtils';
import { wp } from 'src/utils/Dimensions/dimen';
import NavUserImage from '../NavUserImage';
import SvgView from '../SvgView';
import { Assets } from 'assets';
import styles from './styles';

interface HomeNavHeaderInterface {
  hiderUserImage?: boolean;
  search?: boolean;
  onChangeText?: (text: string) => void;
  value?: string;
}

const HomeNavHeader: React.FC<HomeNavHeaderInterface> = (props) => {
  const { hiderUserImage, search, onChangeText, value } = props;
  const stores = useStores();
  const { navigate } = useNavigationUtils();
  const route = useRoute() || {};

  const {
    images: {
      screens: { creditech },
    },
  } = Assets;

  const navigation = useNavigationUtils();
  const { selectStyle } = useStyles(styles);
  const { translate } = useLocalization();

  const goToSearch = () => {
    ApplicationAnalytics(
      {
        eventKey: 'search',
        type: 'CTA',
        parameters: { ScreenName: route?.name },
      },
      stores,
    );
  };

  const renderHeaderContentAr = () => {
    return (
      <>
        <View style={{ flexDirection: 'row' }}>
          {!hiderUserImage && <NavUserImage showBadge />}
          <Pressable
            onPress={() => {
              goToSearch();
              navigate('search');
            }}
            style={[
              selectStyle('SearchIconContainer'),
              { marginEnd: 0, marginStart: wp(11) },
            ]}
          >
            <SvgView svgFile={creditech.SearchIcon} width={16} height={16} />
          </Pressable>
        </View>
        <SvgView
          svgFile={creditech.ContactNow}
          me={10}
          width={63}
          height={35}
        />
      </>
    );
  };
  const renderHeaderContentEn = () => {
    return (
      <>
        <SvgView
          svgFile={creditech.ContactNow}
          ms={10}
          width={63}
          height={35}
        />
        <View style={{ flexDirection: 'row' }}>
          <Pressable
            onPress={() => {
              goToSearch();
              navigate('search');
            }}
            style={selectStyle('SearchIconContainer')}
          >
            <SvgView svgFile={creditech.SearchIcon} width={16} height={16} />
          </Pressable>
          {!hiderUserImage && <NavUserImage showBadge />}
        </View>
      </>
    );
  };

  return !search ? (
    <View style={selectStyle('container')}>
      {I18nManager.isRTL ? renderHeaderContentAr() : renderHeaderContentEn()}
    </View>
  ) : (
    <DropShadow style={selectStyle('dropShadow')}>
      <View style={[selectStyle('searchContainer'), { width: '100%' }]}>
        <View style={{ flexDirection: 'row' }}>
          <RotateViewBasedOnLocale>
            <SvgView
              onPress={() => navigation.goBack()}
              style={selectStyle('arrowStyle')}
              svgFile={creditech.longArrow}
              width={32}
              height={16}
            />
          </RotateViewBasedOnLocale>
          <TextInput
            placeholder={translate('SEARCH')}
            onChangeText={onChangeText}
            value={value}
            style={selectStyle('textInputStyle')}
          />
        </View>
      </View>
    </DropShadow>
  );
};

export default HomeNavHeader;
