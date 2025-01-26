import React from 'react';
import { useStores, useLocalization } from 'hooks';
import { baseScreen } from 'hoc';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';

const successfulPayWithWallet: React.FC = () => {
  const stores = useStores();
  const { translate } = useLocalization();

  return <ScrollContainerWithNavHeader></ScrollContainerWithNavHeader>;
};
export const SuccessfulPayWithWallet = baseScreen(successfulPayWithWallet, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER'],
});
