import { View, Pressable, ImageBackground,Image } from 'react-native';
import React from 'react';
import styles from './styles';
import { Typography, useStyles } from 'elephanz-rn-ui';
import { Assets } from 'assets';
import { useLocalization } from 'hooks';
import { onCallNumber } from 'src/utils/HelpersFunctions';
import DropShadowWrapper from '../Wrappers/DropShadowWrapper';
import RowView from '../Wrappers/RowView';
import SvgView from '../SvgView';
import DefaultModal from '../DefaultModal';
import { openMap } from '../../helperFunctions/navigations';
import { hp, wp } from 'src/utils/Dimensions/dimen';

interface BranchCardInterface {
  item: {
    title: string;
    address: string;
    phoneNumber: string;
    latitude: number;
    longitude: number;
  };
  imageOnly?: boolean;
  mt?: number;
  mapMerchants?:boolean
}

const BranchCard: React.FC<BranchCardInterface> = (props) => {
  const { item, mt, imageOnly,mapMerchants } = props;

  const { selectStyle } = useStyles(styles);

  const { translate } = useLocalization();

  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const {
    images: {
      screens: { creditech },
    },
  } = Assets;

  const onOpenMap = () => {
    openMap(item?.longitude, item?.latitude, item?.address);
  };
  
  const renderContactModalView = () => {
    return (
      <View>
        <RowView jc="space-between">
          <Typography
            customStyles={() => ({
              text: selectStyle('modalTitleText'),
            })}
          >
            {item?.title}
          </Typography>
          <SvgView
            onPress={() => setIsModalVisible(false)}
            svgFile={creditech.Close}
            width={22}
            height={22}
          />
        </RowView>
        <RowView onPress={onOpenMap} mt={70} ms={12}>
          <SvgView svgFile={creditech.LocationPin} width={25} height={25} />
          <Typography
            customStyles={() => ({
              text: selectStyle('itemText'),
            })}
          >
            {translate('NAVIGATE_ON_GOOGLE_MAPS')}
          </Typography>
        </RowView>
        <RowView
          onPress={() =>
            onCallNumber(item?.phoneNumber ==='' ? '16177' : item?.phoneNumber)
          }
          mt={30}
          ms={12}
        >
          <SvgView svgFile={creditech.Phone} width={25} height={25} />
          <Typography
            customStyles={() => ({
              text: selectStyle('itemText'),
            })}
          >
            {translate('CALL_BRANCH')}
          </Typography>
        </RowView>
      </View>
    );
  };

  const renderContactModal = () => {
    return (
      <DefaultModal
        bottom
        onCloseModal={() => setIsModalVisible(false)}
        isVisible={isModalVisible}
      >
        {renderContactModalView()}
      </DefaultModal>
    );
  };

  const renderMapImage = (card?: boolean) => {
    return (
      <ImageBackground
        source={creditech.mapImage}
        style={card ? selectStyle('imageStyle') : selectStyle('fullImage')}
        imageStyle={card ? selectStyle('imageStyle') : selectStyle('fullImage')}
      >
        <SvgView
          svgFile={creditech.mapPiWithShadow}
          width={card ? 25 : 50}
          height={card ? 25 : 50}
        />
        <View
          style={
            card
              ? selectStyle('locationCircleCard')
              : selectStyle('locationCircle')
          }
        >
          <Typography
            adjustsFontSizeToFit
            customStyles={() => ({
              text: {
                ...selectStyle('imageAddress'),
                margin: card ? wp(10) : 0,
              },
            })}
          >
            {item?.title ? item?.title : item?.address}
          </Typography>
        </View>
      </ImageBackground>
    );
  };
  
  const renderMapMerchantImage = ()=>{
    return(
      <>
      <Pressable  onPress={() => setIsModalVisible(true)} style={{height:hp(215)}}>
      <Image source={creditech.mapImage} style={selectStyle('merchantImageMap')} />
      <Typography style={selectStyle('merchantMapTitle')} numberOfLines={2}>{item?.address}</Typography>
      </Pressable>
      {renderContactModal()}
      </>
    )
  }
  return mapMerchants? <>{renderMapMerchantImage()}</> : !imageOnly ? (
    <View>
      
      {renderContactModal()}
      <DropShadowWrapper>
        <Pressable
          onPress={() => setIsModalVisible(true)}
          style={[selectStyle('cardContainer'), mt && { marginTop: hp(mt) }]}
        >
          {renderMapImage(true)}
          <View style={selectStyle('branchDetails')}>
            <Typography
              customStyles={() => ({
                text: selectStyle('titleText'),
              })}
            >
              {item?.title ? item?.title : item?.address}
            </Typography>

            {item?.title ? (
              <Typography
                customStyles={() => ({
                  text: selectStyle('detailsText'),
                })}
              >
                {item?.address}
              </Typography>
            ) : null}
          </View>
        </Pressable>
      </DropShadowWrapper>
    </View>
  ) : (
    <Pressable onPress={() => setIsModalVisible(true)}>
      {renderContactModal()}
     {renderMapImage()}
      
    </Pressable>
  );
};

export default BranchCard;
