import React from 'react';
import { View, Dimensions, Pressable } from 'react-native';
import FastImage from 'react-native-fast-image';
import { baseScreen } from 'hoc';
import HorizontalFlatListItemWrapper from 'src/components/Wrappers/HorizontalFlatListItemWrapper';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import DefaultFlatList from 'src/components/DefaulFlatList';
import LoyaltyPoints from 'src/components/LoyaltyPoints';
import DefaultSeparator from 'src/components/DefaultSeparator';
import { useNavigation } from '@react-navigation/native';
import { useStyles } from 'elephanz-rn-ui';
import { useLocalization } from 'hooks';
import styles from './styles';

const transactionsScreen = ({ route }) => {
  const { data, title, isFromCashback } = route.params || {};

  const { selectStyle } = useStyles(styles);
  const { translate } = useLocalization();
  const navigation = useNavigation();

  const onPressMerchantOnline = (title, data) => {
    navigation.navigate('merchantsOnlineDetails', {
      title: title,
      data: data,
    });
  };
  const renderRedeemableMerchant = ({ item, index }) => {
    const itemsPerRow = 2;
    const marginStart = index % itemsPerRow === 0 ? 0 : 16;
    return (
      <Pressable
        onPress={() =>
          title === translate('ONLINE_MERCHANTS')
            ? onPressMerchantOnline(translate('ONLINE_MERCHANTS'), item)
            : navigation.navigate('merchantDetails', {
                merchant: { ...item, image: item.imageUrl },
                isFromCashback: isFromCashback,
                enName: item.enName,
              })
        }
      >
        <HorizontalFlatListItemWrapper
          style={[
            selectStyle('RedeemCard'),
            {
              width: Dimensions.get('window').width / itemsPerRow - 22,
              marginStart: marginStart,
            },
          ]}
        >
          <FastImage
            source={{ uri: item.imageURL }}
            style={{ width: 75, height: 50 }}
            resizeMode="contain"
          />
        </HorizontalFlatListItemWrapper>
      </Pressable>
    );
  };

  const renderTransactionsHistory = ({ item }) => {
    return (
      <View style={selectStyle('HistoryCard')}>
        <LoyaltyPoints item={item} />
      </View>
    );
  };

  return (
    <ScrollContainerWithNavHeader
      shapeVariant="orange"
      title={title}
      scrollViewStyle={{
        paddingHorizontal: 16,
        paddingBottom: 16,
      }}
    >
      <DefaultSeparator mt={8} height={0} color={'transparent'} />

      <DefaultFlatList
        flatListProps={{
          contentContainerStyle: {
            paddingLeft: 0,
            alignItems: 'flex-start',
          },

          numColumns: title === translate('TRANSACTION_HISTORY') ? 0 : 2,
          data: data,
          renderItem:
            title === translate('TRANSACTION_HISTORY')
              ? renderTransactionsHistory
              : renderRedeemableMerchant,
          horizontal: false,
          keyExtractor: (item, index) => index + '',
        }}
      />
    </ScrollContainerWithNavHeader>
  );
};

export const TransactionsScreen = baseScreen(transactionsScreen, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER'],
});
