import { View, ViewStyle, I18nManager } from 'react-native';
import React from 'react';
import styles from './styles';
import { Typography, useStyles } from 'elephanz-rn-ui';
import DropShadowWrapper from '../Wrappers/DropShadowWrapper';
import { hp, wp } from 'src/utils/Dimensions/dimen';
import { useLocalization, useNavigationUtils } from 'hooks';
import ProgressiveImage from '../ProgressiveImage';
import DefaultButton from '../DefaultButton';
import { Article } from 'shared/DTOs/programs';

interface ViewAllProps {
  item: Article;
  cardStyle?: ViewStyle;
  width?: number;
  imageHeight?: number;
  height?: number;
  removeHeight?: boolean;
}

const ArticlesCard: React.FC<ViewAllProps> = (props) => {
  const { item, cardStyle, imageHeight, width, height, removeHeight } = props;
  const { description, title, backgroundImage } = item || {};
  const { selectStyle } = useStyles(styles);
  const { translate } = useLocalization();

  const { navigate } = useNavigationUtils();
  const navigateServiceScreen = async () => {
    item.navigateTo === 'fatorty'
      ? navigate('digitalFatorty')
      : navigate('articleDetails', { article: item });
  };
  const renderContent = () => {
    return (
      <>
        <Typography
          numberOfLines={1}
          customStyles={() => ({
            text: selectStyle('titleStyle'),
          })}
        >
          {title}
        </Typography>
        <Typography
          customStyles={() => ({
            text: I18nManager.isRTL
              ? selectStyle('descStyle')
              : selectStyle('descStyleEn'),
          })}
        >
          {description}
        </Typography>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <DefaultButton
            mt={16}
            mb={10}
            width={199}
            title={translate('KNOW_MORE')}
            onPress={navigateServiceScreen}
          />
        </View>
      </>
    );
  };

  return (
    <DropShadowWrapper style={selectStyle('container')}>
      <View
        style={[
          selectStyle('cardContainer'),
          width && { width: wp(width) },
          height && { height: height },
          !removeHeight && { height: hp(300) },
          cardStyle,
        ]}
      >
        <ProgressiveImage
          imageStyle={[
            selectStyle('imageStyle'),
            width && { width: wp(width) },
            imageHeight && { height: hp(imageHeight) },
          ]}
          imageSource={{ uri: backgroundImage }}
          resizeMode={'cover'}
        />
        {renderContent()}
      </View>
    </DropShadowWrapper>
  );
};

export default ArticlesCard;
