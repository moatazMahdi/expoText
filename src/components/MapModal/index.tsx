import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  I18nManager,
  ActivityIndicator,
  Image,
  Platform,
} from 'react-native';
// import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import HMSMap, {HMSMarker} from '@hmscore/react-native-hms-map';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {observer} from 'mobx-react';
import {GOOGLE_API_KEY, initialMapCords} from 'src/utils/Constants';
import {hasHuaweiMobileServices} from 'src/utils/HelpersFunctions';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
import DefaultOverLayLoading from '../DefaultOverLayLoading';
import {useStyles, useTheme} from 'elephanz-rn-ui';
import {useLocalization, useStores} from 'hooks';
import {MapModalInterface} from 'src/Types';
import DefaultButton from '../DefaultButton';
import DefaultModal from '../DefaultModal';
import SvgView from '../SvgView';
import {Assets} from 'assets';
import styles from './styles';

const MapModal: React.FC<MapModalInterface> = props => {
  const {closeModal, modalVisible, confirmLocation} = props;
  const [currentMapCords, setCurrentMapCords] = useState(initialMapCords);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasHms, setHasHms] = useState<Boolean>();

  const {selectStyle} = useStyles(styles);
  const {translate} = useLocalization();
  const searchInputRef = useRef();
  const getMapViewRef = useRef();
  const stores = useStores();

  const {
    images: {
      screens: {creditech},
    },
  } = Assets;

  const {
    theme: {
      palette: {common},
    },
  } = useTheme();

  useEffect(() => {
    const isHms = () => hasHuaweiMobileServices().then(res => setHasHms(res));
    isHms();
  }, []);

  const GooglePlacesInput = () => {
    return null;
    return (
      <GooglePlacesAutocomplete
        ref={searchInputRef}
        debounce={500}
        minLength={3}
        placeholder={translate('SEARCH_COMPANY_ADDRESS')}
        enablePoweredByContainer={false}
        fetchDetails
        styles={{
          textInputContainer: selectStyle('inputContainer'),
          textInput: selectStyle('searchInputStyle'),
          row: {backgroundColor: 'white'},
        }}
        onPress={onGeoPress}
        query={{
          key: GOOGLE_API_KEY,
          language: I18nManager.isRTL ? 'ar' : 'en',
          components: 'country:eg',
        }}
        keepResultsAfterBlur
        renderRightButton={() => (
          <SvgView
            svgFile={creditech.SearchIcon}
            width={15}
            height={15}
            style={selectStyle('searchIcon')}
          />
        )}
      />
    );
  };

  const onGeoPress = async (data, details) => {
    const {lat, lng} = details.geometry.location;
    setCurrentMapCords(value => ({
      ...value,
      latitude: lat,
      longitude: lng,
    }));
    hasHms
      ? getMapViewRef?.current?.setCameraPosition({
          target: {
            latitude: lat,
            longitude: lng,
          },
          zoom: 11,
        })
      : getMapViewRef?.current?.animateToRegion(
          {...currentMapCords, latitude: lat, longitude: lng},
          1000,
        );
  };

  const renderHuaweiMap = () => {
    return (
      <View style={selectStyle('mapContainer')}>
        <HMSMap
          minZoomPreference={10}
          maxZoomPreference={15}
          ref={getMapViewRef}
          style={[selectStyle('mapStyle'), StyleSheet.absoluteFill]}
          mapType={1}
          onCameraMove={onRegionChange}
          onTouchEndCapture={onFetchReadableAddress}
          camera={{
            target: {
              latitude: initialMapCords.latitude,
              longitude: initialMapCords.longitude,
            },
            zoom: 11,
          }}
          zoomControlsEnabled
          useAnimation={true}
          animationDuration={1000}>
          <HMSMarker
            coordinate={{
              latitude: currentMapCords?.latitude,
              longitude: currentMapCords?.longitude,
            }}
          />
        </HMSMap>
      </View>
    );
  };

  const onRegionChange = event => {
    setButtonLoading(true);
    setCurrentMapCords(hasHms ? event.nativeEvent.target : event);
  };

  const onFetchReadableAddress = async event => {
    setButtonLoading(false);
    setCurrentMapCords(
      hasHms
        ? {latitude: event?.locationX, longitude: event?.locationY}
        : event,
    );
  };

  const renderGoogleMap = () => {
    return (
      <View style={selectStyle('mapContainer')}>
        <MapView
          provider={PROVIDER_GOOGLE}
          ref={getMapViewRef}
          style={[selectStyle('mapStyle'), StyleSheet.absoluteFill]}
          mapType="standard"
          initialRegion={initialMapCords}
          key={GOOGLE_API_KEY}
          onRegionChange={onRegionChange}
          onRegionChangeComplete={onFetchReadableAddress}
          showsUserLocation>
          {/* <Marker key={0} coordinate={currentMapCords} /> */}
        </MapView>

        <Image
          source={
            Platform.OS === 'android'
              ? creditech.AndroidMapPin
              : creditech.IosMapPin
          }
          style={selectStyle('markerImage')}
        />
      </View>
    );
  };

  const onConfirmLocation = async () => {
    const setLoadingData = val => {
      setButtonLoading(val);
      setIsLoading(val);
    };

    try {
      setLoadingData(true);
      const response = await stores.backend.general.getReadableAddress(
        currentMapCords.latitude,
        currentMapCords.longitude,
      );
      confirmLocation(currentMapCords, response?.results[0]?.formatted_address);
      searchInputRef?.current?.setAddressText('');
      closeModal();
      setLoadingData(false);
    } catch (e) {
      setLoadingData(false);
    }
  };

  const onCantLocate = () => {
    closeModal();
    ApplicationAnalytics(
      {eventKey: 'locate_company_cant_find_company', type: 'CTA'},
      stores,
    );
  };

  const renderButtons = () => {
    return (
      <View style={{alignSelf: 'center', alignItems: 'center'}}>
        <DefaultButton
          onPress={onConfirmLocation}
          mt={20}
          disabled={buttonLoading}
          title={
            buttonLoading ? (
              <ActivityIndicator color={common.yellowOrange} />
            ) : (
              translate('PROCEED')
            )
          }
        />

        <DefaultButton
          onPress={onCantLocate}
          variant="secondaryBackground"
          buttonStyle={{borderWidth: 0, alignSelf: 'center'}}
          mt={20}
          title={translate('CANT_LOCATE')}
          fromModal="mapModal"
        />
      </View>
    );
  };

  return (
    <DefaultModal bottom isVisible={modalVisible} onCloseModal={closeModal}>
      <KeyboardAwareScrollView
        scrollEnabled={false}
        contentContainerStyle={selectStyle('modalContainer')}>
        <SvgView
          onPress={closeModal}
          svgFile={creditech.Close}
          width={15}
          height={15}
          mb={31}
          ms={10}
          style={{alignSelf: 'flex-end'}}
        />

        {GooglePlacesInput()}

        {hasHms ? renderHuaweiMap() : renderGoogleMap()}

        {renderButtons()}

        {isLoading && <DefaultOverLayLoading />}
      </KeyboardAwareScrollView>
    </DefaultModal>
  );
};

export default observer(MapModal);
