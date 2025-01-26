import { View } from 'react-native';
import React from 'react';
import styles from './styles';
import { Typography, useStyles } from 'elephanz-rn-ui';
import { useStores } from 'hooks';
import { observer } from 'mobx-react';

const NotificationBadge: React.FC<{ userImage?: boolean }> = (props) => {
  const { userImage } = props;

  const stores = useStores();

  const { selectStyle } = useStyles(styles);

  const notificationBadges = stores.backend.users.userNotificationsBadgesCount;

  return notificationBadges ? (
    <View style={[selectStyle('badge'), userImage && selectStyle('userImageStyle')]}>
      <Typography
        customStyles={() => ({
          text: selectStyle('badgeFont')
        })}
      >
        {notificationBadges && notificationBadges <= 99 ? notificationBadges : notificationBadges + '+'}
      </Typography>
    </View>
  ) : null;
};

export default observer(NotificationBadge);
