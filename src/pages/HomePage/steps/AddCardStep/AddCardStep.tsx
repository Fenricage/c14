import React, { FC, useState } from 'react';
import styled from 'styled-components/macro';
import {
  CardNumber, ExpiryDate, Cvv, FrameCardTokenizedEvent, FrameValidationChangedEvent,
} from 'frames-react';
import { Flex } from 'rebass/styled-components';
import ReactLoading from 'react-loading';
import WidgetHead from '../../Widget/WidgetHead';
import { Button, FormRow } from '../../../../theme/components';
import ButtonLoader from '../../../../components/ButtonLoader/ButtonLoader';
import CheckoutFrames from '../../../../components/CheckoutFrames/CheckoutFrames';

const FramesContainer = styled.div<{isVisible: boolean}>`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 40px -12px 0px -12px;
  opacity: ${({ isVisible }) => (isVisible ? '1' : '0')};
  transform: ${({ isVisible }) => (isVisible ? 'scale(1)' : 'scale(.9)')};
  transition: all .5s ease;
`;

const FrameElementContainer = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  
  iframe, html, body {
    height: 62px !important;
  }
`;

const FrameLabel = styled.div`
  font-size: 14px;
  font-weight: 400;
  font-family: HelveticaNeueCyr, serif;
  margin-bottom: 12px;
`;

const LoaderOverlay = styled.div`
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  right: 0;
  bottom: 0;
  left: 0;
`;

const ReactLoadingContainer = styled.div`
  transform: translateY(-62px);
`;

const PaymentContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

interface IAddCardStep {
  isFormValid: boolean;
  isCardSubmitted: boolean;
  onSubmit: () => void;
  onGoBack: (() => void) | undefined;
  onFrameValidationChanged: (e: FrameValidationChangedEvent) => void
  onCardSubmitted: () => void;
  onCardTokenized: (e: FrameCardTokenizedEvent) => void;
}

const AddCardStep: FC<IAddCardStep> = ({
  isFormValid,
  isCardSubmitted,
  onSubmit,
  onGoBack,
  onFrameValidationChanged,
  onCardSubmitted,
  onCardTokenized,
}) => {
  const [ready, setReady] = useState(false);

  return (
    <Flex flexDirection="column" flex={1}>
      <WidgetHead
        text="Add New Card"
        customBackCallback={onGoBack}
      />
      <PaymentContainer>
        <Flex flexDirection="column" flex={1}>
          {!ready
            && (
            <LoaderOverlay>
              <ReactLoadingContainer>
                <ReactLoading
                  data-testid="PaymentAddingLoader"
                  type="spinningBubbles"
                  color="#fff"
                  height={50}
                  width={50}
                />
              </ReactLoadingContainer>
            </LoaderOverlay>
            )}
          <FramesContainer data-testid="FramesContainer" isVisible={ready}>
            <CheckoutFrames
              onFrameValidationChanged={onFrameValidationChanged}
              onReadyToDisplay={() => setReady(true)}
              onCardSubmitted={onCardSubmitted}
              onCardTokenized={onCardTokenized}
            >
              <FrameElementContainer>
                <FrameLabel>Card Number</FrameLabel>
                <CardNumber />
              </FrameElementContainer>
              <Flex>
                <FrameElementContainer>
                  <FrameLabel>Expiry Date</FrameLabel>
                  <ExpiryDate />
                </FrameElementContainer>
                <FrameElementContainer>
                  <FrameLabel>CVV</FrameLabel>
                  <Cvv />
                </FrameElementContainer>
              </Flex>
            </CheckoutFrames>
          </FramesContainer>
          <FormRow margin="auto 0 0 0">
            <Button
              onClick={onSubmit}
              disabled={!isFormValid || isCardSubmitted}
              data-testid="submitButton"
              type="submit"
            >
              {isCardSubmitted ? <ButtonLoader /> : 'Continue'}
            </Button>
          </FormRow>
        </Flex>
      </PaymentContainer>
    </Flex>
  );
};

export default AddCardStep;
