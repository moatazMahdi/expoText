import React from 'react';
import {useNavigationUtils, useLocalization} from 'hooks';
import {Typography, useStyles} from 'elephanz-rn-ui';
import {baseScreen} from 'hoc';
import styles from './styles';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import {useRoute} from '@react-navigation/native';
import {View} from 'native-base';
import ProgressiveImage from 'src/components/ProgressiveImage';
import DefaultButton from 'src/components/DefaultButton';
import {hp} from 'src/utils/Dimensions/dimen';

interface SubCategoryServiceInterface {
  id: number;
  name: string;
  categoryName: string;
  image: string;
  description: string;
}
const subCategoryService: React.FC = () => {
  const navigation = useNavigationUtils();

  const {subCategoryData} = useRoute().params as {
    subCategoryData: SubCategoryServiceInterface;
  };

  const {selectStyle} = useStyles(styles);

  const {translate} = useLocalization();

  const renderDescription = () => {
    return (
      <Typography
        customStyles={() => ({
          text: selectStyle('descText'),
        })}>
        {subCategoryData?.description}
      </Typography>
    );
  };

  const renderImage = () => {
    return (
      <ProgressiveImage
        resizeMode="cover"
        imageSource={{uri: subCategoryData?.image}}
        imageStyle={selectStyle('headerImage')}
      />
    );
  };
  const renderApplyButton = () => {
    return (
      <View style={{justifyContent: 'flex-end', marginBottom: hp(20)}}>
        <DefaultButton
          onPress={() =>
            navigation.navigate('requestMoreInfoScreen', {
              subproductId: subCategoryData.id,
            })
          }
          title={translate('APPLY')}
        />
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <ScrollContainerWithNavHeader title={subCategoryData?.name}>
        {renderImage()}
        {renderDescription()}
      </ScrollContainerWithNavHeader>

      {renderApplyButton()}
    </View>
  );
};
export const SubCategoryService = baseScreen(subCategoryService, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER', 'GUEST'],
});
