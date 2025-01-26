import { Linking, Pressable, View } from 'react-native';
import React, { useCallback, useState } from 'react';
import styles from './styles';
import { Typography, useStyles } from 'elephanz-rn-ui';
import { useLocalization } from 'hooks';
import RowView from '../Wrappers/RowView';
import moment from 'moment';
import { notificationInterface } from 'src/Types';
import ProgressiveImage from '../ProgressiveImage';
import { hasLink } from 'src/utils/HelpersFunctions';

const NotificationCard: React.FC<any> = (props) => {
  const { item } = props as { item: notificationInterface; index: number };

  const { selectStyle } = useStyles(styles);

  const { translate } = useLocalization();

  const time = moment(item.received_time).format('MMM-Do-YY, h:mm a');
  //const timeFromNow =moment(item.received_time, "YYYYMMDD").fromNow();

  const [isTruncatedText, setIsTruncatedText] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const onTextLayout = useCallback(
    (event) => {
      if (!isTruncatedText)
        setIsTruncatedText(event?.nativeEvent?.lines?.length > 2);
    },
    [isTruncatedText],
  );

  const link: string = hasLink(item?.text_content?.message);
  const openLink = () => {
    Linking.openURL(link);
  };
  let msg =
    link != null
      ? item?.text_content?.message.substring(
          0,
          item?.text_content?.message?.indexOf(link),
        )
      : item?.text_content?.message;

  const MoreLessText = ({ children }) => {
    return (
      <>
        <Typography
          numberOfLines={
            isTruncatedText ? (showMore ? undefined : 2) : undefined
          }
          marginTop={10}
          customStyles={() => ({
            text: selectStyle('descriptionText'),
          })}
          onTextLayout={onTextLayout}
        >
          {children}
        </Typography>

        {isTruncatedText ? (
          <Typography
            customStyles={() => ({
              text: selectStyle('seeMoreText'),
            })}
            onPress={() => {
              showMore ? null : setShowMore(true);
            }}
          >
            {!showMore ? translate('SEE_MORE') : null}
          </Typography>
        ) : null}
      </>
    );
  };

  return (
    <Pressable
      onPress={() => (showMore ? setShowMore(false) : null)}
      style={selectStyle('cardContainer')}
    >
      <RowView>
        <ProgressiveImage
          useImage
          resizeMode="cover"
          imageStyle={[selectStyle('image')]}
          style={selectStyle('image')}
          imageSource={
            item?.media.url
              ? { uri: item.media ? item.media.url : '//' }
              : require('../../assets/images/screens/creditech/contactNowImage.png')
          }
        />
        <View style={{ flex: 1 }}>
          <Typography
            customStyles={() => ({
              text: selectStyle('titleText'),
            })}
          >
            {item?.text_content?.title}
          </Typography>
          <MoreLessText>
            {msg}{' '}
            {link && (
              <Typography
                customStyles={() => ({
                  text: selectStyle('linkText'),
                })}
                onPress={openLink}
              >
                {link}
              </Typography>
            )}
          </MoreLessText>
          <View style={{ justifyContent: 'flex-end', flex: 1 }}>
            <Typography
              numberOfLines={2}
              marginTop={8}
              customStyles={() => ({
                text: selectStyle('dateText'),
              })}
            >
              {time}
            </Typography>
          </View>
        </View>
      </RowView>
    </Pressable>
  );
};

export default NotificationCard;
