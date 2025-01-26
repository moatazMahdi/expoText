import React, {useCallback, useState, useEffect} from 'react';
import {Image, View, Pressable, I18nManager} from 'react-native';
import moment from 'moment';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import DropShadowWrapper from 'src/components/Wrappers/DropShadowWrapper';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import {RTApprovedStatus, RTRejectStatus} from 'src/utils/Constants';
import {Typography, useStyles, useTheme} from 'elephanz-rn-ui';
import ProgressiveImage from 'src/components/ProgressiveImage';
import DefaultFlatList from 'src/components/DefaulFlatList';
import {
  capitalizeFirstChar,
  convertToHttps,
  getCurrency,
  getProperText,
  tempTranslate,
} from 'src/utils/HelpersFunctions';
import {hp, wp} from 'src/utils/Dimensions/dimen';
import {useLocalization, useNavigationUtils, useStores} from 'hooks';
import {baseScreen} from 'hoc';
import {Assets} from 'assets';
import styles from './styles';

const tracking: React.FC = () => {
  const [datalist, setDataList] = useState({});
  const [loading, setLoading] = useState(true);

  const {selectStyle} = useStyles(styles);
  const {translate} = useLocalization();
  const navigation = useNavigationUtils();

  const stores = useStores();

  const userData = stores.backend.users.userData;
  const userCredit = stores.backend.users.userCredits.data;

  const listTap = [
    {translate: translate('RT_ALL_REQUESTS'), item: 'All Requests'},
    {translate: translate('RT_FATORTY_INSTALLMENTS'), item: 'fatorty'},
    {
      translate: translate('RT_CREDIT_LIMIT'),
      item: 'limitIncrease',
    },
    {translate: translate('RT_LEAD_FORM'), item: 'leadForm'},
    {
      translate: translate('RT_CREDIT_LIMIT'),
      item: 'hybrid',
    },
    {
      translate: translate('PURCHASE_MANAGEMENT'),
      item: 'bookingHistory',
    },
  ];
  const [status, setStatus] = useState(listTap[0].translate);

  const {
    images: {
      screens: {requestTracking},
    },
  } = Assets;

  const {
    theme: {
      palette: {common},
    },
  } = useTheme();

  const convertArrayToObj = useCallback(originalArray => {
    const acc = listTap.reduce(
      (obj, status) => ({...obj, [status.translate]: {}}),
      {},
    );
    const newObject = originalArray.reduce((acc, item) => {
      const date = new Date(item.date);
      const month = date.toLocaleString('en-US', {month: 'short'});
      const year = date.getFullYear();
      const key = `${month} ${year}`;
      const type = listTap.filter(e => {
        return e.item === item.type;
      })[0]?.translate;

      if (!acc[translate('RT_ALL_REQUESTS')]) {
        acc[translate('RT_ALL_REQUESTS')] = {};
      }

      if (!acc[translate('RT_ALL_REQUESTS')][key]) {
        acc[translate('RT_ALL_REQUESTS')][key] = [];
      }

      if (!acc[type]) {
        acc[type] = {};
      }

      if (!acc[type][key]) {
        acc[type][key] = [];
      }

      acc[type][key].push({...item});
      acc[translate('RT_ALL_REQUESTS')][key].push({...item});

      return acc;
    }, acc);

    setDataList(newObject);
  }, []);

  useEffect(() => {
    stores.backend.bookingAuth.bookingHistory(userData?.nationalId);
    stores.backend.users
      ?.getRequestTracking({
        nationalId: userData?.nationalId,
        phone: userData?.phone,
      })
      .then(res => {
        convertArrayToObj(res);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userCredit]);

  const StatuesColors = status => {
    switch (status) {
      case tempTranslate('pending', 'معلقة'):
        return {
          backgroundColor: '#FDF6E7',
          textColor: '#FDB022',
        };
      case tempTranslate('approved', 'ناجحة'):
      case tempTranslate('Done', 'ناجحة'):
      case tempTranslate('success', 'ناجحة'):
        return {
          backgroundColor: '#ECFDF3',
          textColor: '#039754',
        };
      case tempTranslate('rejected', 'مرفوضة'):
      case tempTranslate('expired', 'منتهية'):
      case tempTranslate('invalid', 'غير صالحة'):
        return {
          backgroundColor: '#FEE4E2',
          textColor: '#D92C20',
        };
      case tempTranslate('saved', 'محفوظة'):
        return {
          backgroundColor: '#E7F7FD',
          textColor: '#228BDB',
        };
      default:
        return {
          backgroundColor: 'white',
          textColor: common.black,
        };
    }
  };

  const renderInstallmentsTypes = ({item}) => (
    <DropShadowWrapper me={wp(5)} ms={wp(5)} style={{paddingVertical: 1}}>
      <Pressable
        onPress={() => setStatus(item)}
        style={[
          selectStyle('itemContainer'),
          status === item && {
            backgroundColor: common.darkOrange,
          },
        ]}>
        <Typography
          customStyles={() => ({
            text: {
              ...selectStyle('typeText'),
              color: status === item ? common.white : common.darkBlue,
            },
          })}>
          {item}
        </Typography>
      </Pressable>
    </DropShadowWrapper>
  );

  const renderNoRequests = () => (
    <View style={selectStyle('noRequestsView')}>
      <Image
        source={requestTracking.noRequests}
        style={selectStyle('noRequestImage')}
      />

      <Typography
        fontWeight={'400'}
        fontSize={16}
        marginTop={45}
        colorHex={common.darkBlue}>
        {translate('RT_CONTENT')}
      </Typography>
    </View>
  );

  const renderCards = () => {
    return (
      <View style={selectStyle('cardsView')}>
        <DefaultFlatList
          emptyComponent={renderNoRequests}
          flatListProps={{
            contentContainerStyle: {backgroundColor: common.lightGray},
            data: datalist[status] ? Object?.keys(datalist[status]) : [],
            renderItem: ({item: date}) => (
              <>
                <Typography
                  marginLeft={wp(16)}
                  marginBottom={hp(19)}
                  marginRight={wp(16)}
                  fontWeight={'700'}
                  fontSize={16}
                  colorHex={common.darkBlue}>
                  {date}
                </Typography>

                <DefaultFlatList
                  flatListProps={{
                    data: datalist[status][date] ?? [],
                    renderItem: ({item}) => {
                      const leadFormApproved =
                        item?.type === 'leadForm' &&
                        item?.status?.en === 'Request Submitted';
                      const {backgroundColor, textColor} = StatuesColors(
                        item.crmStatus,
                      );
                      let params = {item};
                      const ImageUrlHttps = convertToHttps(
                        item?.merchantImageURL,
                      );
                      let newItem;
                      if (!item?.hasOwnProperty('Image')) {
                        newItem = {
                          title: item.title,
                          image: item.imageUrl || item.image,
                          description: item.description,
                          ...item,
                        };
                      } else {
                        newItem = {
                          title: item.Title,
                          image: item.Image,
                          ...item,
                        };
                      }
                      return (
                        <Pressable
                          onPress={() => {
                            if (item?.type === 'bookingHistory') {
                              if (item?.crmStatus === tempTranslate('saved', 'محفوظة')) {
                                navigation.navigate(
                                  'bookingAuthenticationOfferCalculate',
                                  {
                                    savedData: newItem,
                                    saved: tempTranslate('saved', 'محفوظة'),
                                  },
                                );
                              } else {
                                navigation.navigate('orderSummary', params);
                              }
                            } else {
                              return;
                            }
                          }}>
                          <DropShadowWrapper
                            style={[
                              selectStyle('itemShadowView'),
                              {alignItems: 'center'},
                            ]}>
                            {item?.type === 'bookingHistory' ? (
                              <ProgressiveImage
                                imageSource={{uri: ImageUrlHttps}}
                                resizeMode="contain"
                                imageStyle={[
                                  selectStyle('imageStyle'),
                                  {backgroundColor: 'white', borderRadius: 8},
                                ]}
                                onError={() => {
                                  requestTracking.confirm;
                                }}
                                
                              />
                            ) : (
                              <ProgressiveImage
                                imageSource={
                                  ImageUrlHttps ||
                                  (item?.status?.en === 'Request Rejected' &&
                                    item?.type === 'fatorty')
                                    ? requestTracking.pending
                                    : requestTracking.confirm
                                }
                                imageStyle={[selectStyle('imageStyle')]}
                              />
                            )}

                            <View
                              style={[
                                selectStyle('cardContent'),
                                {alignItems: 'center'},
                              ]}>
                              <View
                                style={{
                                  marginStart: wp(12),
                                  justifyContent: 'center',
                                  width: wp(135),
                                }}>
                                <Typography
                                  fontWeight={'700'}
                                  fontSize={14}
                                  colorHex={common.black}>
                                  {item?.type === 'bookingHistory'
                                    ? item?.merchantTitle
                                    : item.name ?? userData?.name}
                                </Typography>

                                {item?.type === 'fatorty' ? (
                                  <Typography
                                    fontWeight={'400'}
                                    fontSize={14}
                                    colorHex={common.dropDownText}>
                                    {`${
                                      item?.price
                                    } ${getCurrency()} ${translate('RT_ON')} ${
                                      item?.tenor
                                    } ${translate('RT_MONTHS')}`}
                                  </Typography>
                                ) : null}
                                {item?.type === 'bookingHistory' ? (
                                  <Typography
                                    fontWeight={'400'}
                                    fontSize={14}
                                    colorHex={common.dropDownText}
                                    numberOfLines={1}
                                    style={{maxWidth: wp(138), lineHeight: 24}}>
                                    {item?.productName}
                                  </Typography>
                                ) : (
                                  <Typography
                                    fontWeight={'500'}
                                    fontSize={12}
                                    colorHex={common.grey}>
                                    {moment(item?.date).format('MMM Do')}
                                  </Typography>
                                )}

                                {item?.type === 'bookingHistory' ? (
                                  <Typography
                                    fontWeight={'500'}
                                    fontSize={14}
                                    colorHex={common.black}
                                    numberOfLines={1}
                                    style={{maxWidth: wp(138), lineHeight: 24}}>
                                    {item?.offerTitle || item?.tenorTitle}
                                  </Typography>
                                ) : null}

                                {item?.type === 'bookingHistory' ? (
                                  <Typography
                                    fontWeight={'500'}
                                    fontSize={12}
                                    colorHex={common.green}>
                                    {getCurrency()}{' '}
                                    <Typography
                                      fontWeight={'700'}
                                      fontSize={14}
                                      colorHex={common.green}>
                                      {item?.loanAmount}
                                    </Typography>
                                  </Typography>
                                ) : null}
                                {(item?.type === 'limitIncrease' ||
                                  item?.type === 'hybrid') && (
                                  <Typography
                                    customStyles={() => ({
                                      text: {
                                        ...selectStyle('itemText'),
                                        color: common.darkBlue,
                                      },
                                    })}
                                    fontWeight={'400'}
                                    fontSize={11}>
                                    {item?.type === 'limitIncrease'
                                      ? translate('RT_LIMIT_INCREASE')
                                      : translate('RT_LIMIT_REQUEST')}
                                  </Typography>
                                )}

                                {item.type === 'limitIncrease' ||
                                item?.type === 'hybrid' ? (
                                  <Typography
                                    customStyles={() => ({
                                      text: {
                                        ...selectStyle('itemText'),
                                        color:
                                          item?.type === 'limitIncrease'
                                            ? common.darkBlue
                                            : item?.status === 'Approved'
                                            ? '#08C400'
                                            : 'red',
                                      },
                                    })}
                                    fontWeight={'400'}
                                    fontSize={11}>
                                    {item?.type === 'limitIncrease'
                                      ? item?.type
                                      : getProperText(item?.status)}
                                  </Typography>
                                ) : item?.type === 'bookingHistory' ? null : (
                                  <Typography
                                    customStyles={() => ({
                                      text: {
                                        ...selectStyle('itemText'),
                                        color:
                                          RTApprovedStatus.includes(
                                            getProperText(item?.status),
                                          ) || leadFormApproved
                                            ? '#08C400'
                                            : RTRejectStatus.includes(
                                                getProperText(item?.status),
                                              )
                                            ? 'red'
                                            : common.yellowOrange,
                                      },
                                    })}
                                    fontWeight={'400'}
                                    fontSize={11}>
                                    {getProperText(item?.status)}
                                  </Typography>
                                )}
                              </View>
                              <>
                                {item?.type === 'bookingHistory' ? (
                                  <View
                                    style={{
                                      paddingHorizontal: 10,
                                      paddingVertical: 4,
                                      backgroundColor,
                                      borderRadius: 40,
                                    }}>
                                    <Typography
                                      style={{
                                        fontSize: 12,
                                        fontWeight: '600',
                                        lineHeight: 16,
                                        color: textColor,
                                      }}>
                                      {capitalizeFirstChar(item.crmStatus)}
                                    </Typography>
                                  </View>
                                ) : null}
                              </>
                            </View>
                          </DropShadowWrapper>
                        </Pressable>
                      );
                    },
                  }}
                />
              </>
            ),
          }}
        />
      </View>
    );
  };
  return (
    <View style={{flex: 1}}>
      {loading && <DefaultOverLayLoading />}
      <ScrollContainerWithNavHeader
        shapeVariant="blueSlate"
        title={translate('REQUESTS')}
        scrollViewStyle={{backgroundColor: common.lightGray}}>
        {!loading && (
          <>
            <View style={selectStyle('typesView')}>
              <DefaultFlatList
                flatListProps={{
                  horizontal: true,
                  showsHorizontalScrollIndicator: false,
                  data: Object.keys(datalist) ?? [],
                  renderItem: renderInstallmentsTypes,
                  contentContainerStyle: {
                    alignContent: 'flex-start',
                  },
                }}
              />
            </View>

            {renderCards()}
          </>
        )}
      </ScrollContainerWithNavHeader>
    </View>
  );
};

export const Tracking = baseScreen(tracking, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER'],
});
