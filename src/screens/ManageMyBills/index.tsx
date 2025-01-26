import React from 'react';
import { I18nManager } from 'react-native';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import BillOptionsCard from 'src/components/BillOptionsCard';
import { contactPayIframeURL } from 'src/utils/Constants';
import { useStores, useLocalization } from 'hooks';
import { hp } from 'src/utils/Dimensions/dimen';
import { baseScreen } from 'hoc';
import { Assets } from 'assets';

const manageMyBills: React.FC = () => {
  const { translate } = useLocalization();

  const stores = useStores();
  const userData = stores.backend.users.userData;
  const accessToken = stores.backend.auth.getAccessToken();
  const refreshToken = stores.backend.auth.getRefreshToken();

  const baseUrl = `${contactPayIframeURL}/?lang=${
    I18nManager.isRTL ? 'ar' : 'en'
  }&phone=${userData?.phone}&nationalId=${userData?.nationalId}&name=${
    userData?.name
  }&token=${accessToken}&refreshToken=${refreshToken}`;

  const {
    images: {
      screens: { creditech },
    },
  } = Assets;

  return (
    <ScrollContainerWithNavHeader
      scrollViewStyle={{ paddingTop: hp(20) }}
      showFloatingActionButton
      withUserImage
      title={translate('BILLS')}
    >
      <BillOptionsCard
        first
        icon={creditech.BillWalletAdd}
        title={translate('NEW_BILLS')}
        desc={translate('NEW_BILLS_DESC')}
      />

      <BillOptionsCard
        icon={creditech.BillsHistory}
        title={translate('BILLS_HISTORY')}
        desc={translate('BILLS_HISTORY_DESC')}
        link={`${baseUrl}&history=true`}
      />

      <BillOptionsCard
        icon={creditech.BillsQuickPay}
        title={translate('QUICK_PAY')}
        desc={translate('QUICK_PAY_DESC')}
        link={`${baseUrl}&quickPay=true`}
      />

      <BillOptionsCard
        icon={creditech.BillsManageCredit}
        title={translate('MANAGE_MY_CARDS')}
        desc={translate('COMING_SOON')}
        comingSoon
      />
    </ScrollContainerWithNavHeader>
  );
};
export const ManageMyBills = baseScreen(manageMyBills, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER', 'GUEST'],
});
