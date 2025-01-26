import React from 'react';
import { Assets } from 'assets';
import { useLocalization } from 'hooks';
import { observer } from 'mobx-react';
import WelcomeCard from '../WelcomeCard';

const {
  images: {
    screens: { creditech },
  }
} = Assets;

const MeezaCard = (props) => {
  const { welcome, comingSoon, home, mt } = props;
  const { translate } = useLocalization();
  return (
    <>
      <WelcomeCard
        mt={mt}
        svgNoRTL={false}
        welcome={welcome}
        home={home}
        image={creditech.Meeza}
        title={translate('REQUEST_OR_ADD_MEEZA')}
        bodyText={translate('REQUEST_OR_ADD_MEEZA_BODY')}
        comingSoon={comingSoon}
        onPress={() => alert(translate('COMING_SOON'))}
      />
    </>
  );
};

export default observer(MeezaCard);
