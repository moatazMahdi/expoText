import React from 'react';
import {} from 'react-native';
import { Assets } from 'assets';
import { useLocalization } from 'hooks';
import { observer } from 'mobx-react';
import WelcomeCard from '../WelcomeCard';

const {
  images: {
    screens: { creditech },
  },
} = Assets;

const InvestMoneyCard = (props) => {
  const { welcome, comingSoon, home, mt } = props;
  const { translate } = useLocalization();
  return (
    <>
      <WelcomeCard
        mt={mt}
        home={home}
        welcome={welcome}
        image={creditech.InvestMoney}
        title={translate('INVEST_MONEY')}
        bodyText={translate('INVEST_MONEY_BODY')}
        comingSoon={comingSoon}
        onPress={() => alert(translate('COMING_SOON'))}
      />
    </>
  );
};

export default observer(InvestMoneyCard);
