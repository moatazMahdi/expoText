import React from 'react';
import { Assets } from 'assets';
import { useLocalization, useNavigationUtils, useStores } from 'hooks';
import { observer } from 'mobx-react';
import WelcomeCard from '../WelcomeCard';
import { ApplicationAnalytics } from 'src/utils/firebaseUtils';

const {
  images: {
    screens: { creditech },
  },
} = Assets;

const ManageYourBillsCard = (props) => {
  const { welcome, comingSoon, home, mt } = props;
  const stores = useStores();
  const navigation = useNavigationUtils();
  const { translate } = useLocalization();

  const { controlLoginModalView } = stores.backend.users;

  return (
    <>
      <WelcomeCard
        mt={mt}
        welcome={welcome}
        home={home}
        image={creditech.ManageBills}
        title={translate('MANAGE_YOU_BILLS')}
        bodyText={translate('MANAGE_YOU_BILLS_BODY')}
        comingSoon={comingSoon}
        onPress={() => {
          ApplicationAnalytics(
            {
              eventKey: 'welcome_manage_bills',
              type:'CTA'
            },
            stores,
          );
          controlLoginModalView(true, () => navigation.navigate('billPayment'));
        }}
      />
    </>
  );
};

export default observer(ManageYourBillsCard);
