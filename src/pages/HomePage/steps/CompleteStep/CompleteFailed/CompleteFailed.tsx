import React, { FC } from 'react';
import { Flex } from 'rebass/styled-components';
import { ReactComponent as PurchaseFailedIcon } from '../../../../../assets/purchase_failed_icon.svg';
import { Button, Subtitle, Title } from '../../../../../theme/components';
import { useAppDispatch } from '../../../../../app/hooks';
import { logout } from '../../../../../state/applicationSlice';
import StepIcon from '../../../../../components/StepIcon/StepIcon';

const CompleteFailed: FC = () => {
  const dispatch = useAppDispatch();

  const handleClickTryAgain = () => {
    dispatch(logout());
  };

  return (
    <Flex flex={1} flexDirection="column" justifyContent="center">
      <Title>Purchase Failed</Title>
      <StepIcon>
        <PurchaseFailedIcon />
      </StepIcon>
      <Flex justifyContent="center">
        <Subtitle margin="28px 0">
          Unfortunately, we were unable to charge your card.
          Please ensure you have sufficient balance or try another card.
        </Subtitle>
      </Flex>
      <Button onClick={handleClickTryAgain}>Try again</Button>
    </Flex>
  );
};

export default CompleteFailed;
