import React, { FC, useEffect, useState } from 'react';
import { Flex } from 'rebass';
import WidgetHead from '../../Widget/WidgetHead';
import {
  AnimatedContainer, Button, FormRow, TemporaryContainer,
} from '../../../../theme/components';
import { useAppDispatch } from '../../../../app/hooks';
import {
  incrementWidgetStep,
} from '../../../../state/applicationSlice';

const PersonalInformationStep: FC = () => {
  const dispatch = useAppDispatch();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleClickNextStep = () => {
    dispatch(incrementWidgetStep());
  };

  return (
    <Flex flexDirection="column" flexWrap="nowrap" flex={1}>
      <WidgetHead
        text="Enter the Personal Informations"
      />
      <AnimatedContainer animate={animate}>
        <TemporaryContainer>
          <b>Personal information</b>
        </TemporaryContainer>
      </AnimatedContainer>
      <FormRow>
        <Button
          onClick={handleClickNextStep}
          data-testid="submitButton"
          type="submit"
        >
          Continue
        </Button>
      </FormRow>
    </Flex>
  );
};

export default PersonalInformationStep;
