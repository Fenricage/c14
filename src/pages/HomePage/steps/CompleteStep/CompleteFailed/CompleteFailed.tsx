import React, { FC } from 'react';
import { Flex } from 'rebass';
import { ReactComponent as PurchaseFailedIcon } from '../../../../../assets/purchase_failed_icon.svg';
import { Button, Subtitle, Title } from '../../../../../theme/components';
import { useAppDispatch } from '../../../../../app/hooks';
import { resetApplication } from '../../../../../state/applicationSlice';

const CompleteFailed: FC = () => {
  const dispatch = useAppDispatch();

  const handleClickTryAgain = () => {
    dispatch(resetApplication());
  };

  return (
    <Flex flex={1} flexDirection="column" justifyContent="center">
      <Title>Purchase Failed</Title>
      <Flex marginTop="12px" width="100%" justifyContent="center">
        <PurchaseFailedIcon />
      </Flex>
      <Flex justifyContent="center">
        <Subtitle margin="28px 0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Odio nunc amet enim velit at sapien.
        </Subtitle>
      </Flex>
      <Button onClick={handleClickTryAgain}>Try again</Button>
    </Flex>
  );
};

export default CompleteFailed;
