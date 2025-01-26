import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useLocalization, useStores } from 'hooks';
import { useStyles } from 'elephanz-rn-ui';
import { baseScreen } from 'hoc';
import styles from './styles';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import DefaultFlatList from 'src/components/DefaulFlatList';
import VerticalFlatListItemWrapper from 'src/components/Wrappers/VerticalFlatListItemWrapper';
import NotificationCard from 'src/components/NotificationCard';
import { LoadingState } from 'utils';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import {
  SendMoEngageNotifications,
  tempTranslate,
} from 'src/utils/HelpersFunctions';

const notificationsCenter: React.FC = () => {
  const stores = useStores();

  const { selectStyle } = useStyles(styles);

  const { translate } = useLocalization();

  const [isLoading, setLoading] = useState(false);

  const loading =
    stores.backend.users.userNotifications.loadingState ===
    LoadingState.LOADING;
  const notifications = stores.backend.users.userNotifications.data;
  const notificationsBadges = stores.backend.users.userNotificationsBadgesCount;

  useEffect(() => {
    const getMoeEngageNotifications = async () => {
      try {
        setLoading(true);
        await SendMoEngageNotifications(stores);
      } catch (error) {
      } finally {
        setLoading(false);
        stores.backend.users.userNotifications.fetch();
      }
    };
    getMoeEngageNotifications();
  }, []);

  const markNotificationsRead = async () => {
    try {
      await stores.backend.users.markAllNotificationsRead();
    } catch (err) {}
  };

  useEffect(() => {
    if (notifications && notifications.length > 0 && notificationsBadges > 0) {
      markNotificationsRead();
    }
  }, [notifications, notificationsBadges]);

  const renderCards = ({ item, index }) => {
    return (
      <VerticalFlatListItemWrapper>
        <NotificationCard item={item} index={index} />
      </VerticalFlatListItemWrapper>
    );
  };

  const renderList = () => {
    return (
      <DefaultFlatList
        isFetchingData={false}
        emptyString={tempTranslate('No notifications found', 'لا توجد إشعارات')}
        flatListProps={{
          data: notifications,
          renderItem: renderCards,
        }}
      />
    );
  };

  const renderContent = () => {
    return <View style={selectStyle('contentContainer')}>{renderList()}</View>;
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollContainerWithNavHeader title={translate('NOTIFICATIONS')}>
        {renderContent()}
      </ScrollContainerWithNavHeader>
      {(loading || isLoading) && <DefaultOverLayLoading />}
    </View>
  );
};
export const NotificationsCenter = baseScreen(notificationsCenter, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER', 'GUEST'],
});
