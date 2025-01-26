import React from 'react';
import {useLocalization} from 'hooks';
import {baseScreen} from 'hoc';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import {useRoute} from '@react-navigation/native';
import {ProductLoanCalculator} from './loanCalculator';

const installmentCalculator: React.FC = () => {
  const {translate} = useLocalization();

  const {productId, productName, product} = useRoute().params as {
    product: {};
    productId: string;
    productName: string;
  };

  const renderLoanCalculatorModal = () => {
    return (
      <ProductLoanCalculator
        product={product}
        productId={productId.toString()}
      />
    );
  };
  const isShoppingOrFinishing = ['Shopping', 'Finishing']?.includes(
    productName,
  );

  return (
    <ScrollContainerWithNavHeader
      showFloatingActionButton
      scrollViewStyle={{flexGrow: 1}}
      title={
        isShoppingOrFinishing
          ? translate('CALCULATE_YOUR_INSTALLMENT')
          : translate('LOAN_CALCULATOR')
      }>
      {renderLoanCalculatorModal()}
    </ScrollContainerWithNavHeader>
  );
};
export const InstallmentCalculator = baseScreen(installmentCalculator, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER', 'GUEST'],
});
