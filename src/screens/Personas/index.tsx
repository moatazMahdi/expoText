import React, { useState } from 'react';
import { Pressable, View, Image, I18nManager } from 'react-native';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import { useLocalization, useNavigationUtils, useStores } from 'hooks';
import ProgressiveImage from 'src/components/ProgressiveImage';
import { ApplicationAnalytics } from 'src/utils/firebaseUtils';
import DefaultFlatList from 'src/components/DefaulFlatList';
import { Typography, useStyles } from 'elephanz-rn-ui';
import { personasData } from 'src/utils/Constants';
import { wp } from 'src/utils/Dimensions/dimen';
import { baseScreen } from 'hoc';
import { Assets } from 'assets';
import styles from './styles';

const personas: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { selectStyle } = useStyles(styles);
  const { navigate } = useNavigationUtils();
  const { translate } = useLocalization();

  const stores = useStores();

  const {
    images: {
      screens: { creditech },
    },
  } = Assets;

  const getNewYearOffers = async (item) => {
    try {
      setIsLoading(true);
      const personaTitle = I18nManager.isRTL
        ? item.ArTitle
        : item.EnTitle?.toUpperCase();
      await stores.backend.wallet.newYearOffers.updateOptions({
        productId: '6',
        merchantId: '0',
        categoryId: item?.id,
      });
      ApplicationAnalytics(
        { eventKey: `${item?.title}_watchNow`, type: 'CTA' },
        stores,
      );
      navigate('latestOffers', {
        data: stores.backend.wallet.newYearOffers.data,
        personaTitle: personaTitle,
        EnTitle: item?.title,
        image: item?.image,
      });
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {isLoading && <DefaultOverLayLoading />}
      <ScrollContainerWithNavHeader
        shapeVariant="orange"
        title={translate('WATCH_NOW')}
      >
        <Image
          source={I18nManager.isRTL ? creditech.Banner1AR : creditech.Banner1EN}
          style={selectStyle('image')}
        />

        <Typography
          customStyles={() => ({
            text: selectStyle('headerText'),
          })}
        >
          {translate('WATCH_CATEGORIES')}
        </Typography>

        <DefaultFlatList
          isFetchingData={false}
          flatListProps={{
            data: personasData,
            renderItem: ({ item, index }) => (
              <Pressable
                onPress={() => getNewYearOffers(item)}
                style={[
                  selectStyle('pressable'),
                  {
                    marginRight:
                      index === personasData?.length - 1 ? 0 : wp(20),
                  },
                ]}
              >
                <ProgressiveImage
                  imageSource={{ uri: item.image }}
                  imageStyle={selectStyle('cardImage')}
                />

                <Typography
                  customStyles={() => ({
                    text: selectStyle('titleText'),
                  })}
                >
                  {I18nManager.isRTL
                    ? item.ArTitle
                    : item.EnTitle?.toUpperCase()}
                  {/* {translate(item?.title)} */}
                </Typography>
              </Pressable>
            ),
            horizontal: true,
            contentContainerStyle: { paddingHorizontal: 20 },
            keyExtractor: (item, index) => index + '',
          }}
        />
      </ScrollContainerWithNavHeader>
    </View>
  );
};

export const Personas = baseScreen(personas, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER', 'GUEST'],
});
