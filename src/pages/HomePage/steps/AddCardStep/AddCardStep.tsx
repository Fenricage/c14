import React, {
  FC, useCallback, useEffect, useState,
} from 'react';
import styled from 'styled-components/macro';
import {
  Frames, CardNumber, ExpiryDate, Cvv, FrameValidationChangedEvent, FrameCardTokenizedEvent,
} from 'frames-react';
import { Flex } from 'rebass';
import { QueryStatus } from '@reduxjs/toolkit/query';
import ReactLoading from 'react-loading';
import { toast } from 'react-toastify';
import WidgetHead from '../../Widget/WidgetHead';
import { Button, FormRow } from '../../../../theme/components';
import { alt4, red, white } from '../../../../theme';
import { useAddUserCardMutation } from '../../../../redux/cardsApi';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import {
  goToWidgetStep, incrementWidgetStep, selectApp, WidgetSteps,
} from '../../../../state/applicationSlice';

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

const useSetCheckoutScript = () => {
  const [scriptLoaded, setScriptLoaded] = useState(() => {
    const checkoutScript = document.querySelector('[accesskey="checkout"]');

    return !!checkoutScript;
  });

  useEffect(() => {
    if (scriptLoaded) {
      return;
    }

    const script = document.createElement('script');

    script.src = 'https://cdn.checkout.com/js/framesv2.min.js';
    script.async = true;
    script.title = 'checkout';
    script.onload = () => {
      setScriptLoaded(true);
      script.title = 'checkout-loaded';
    };

    document.body.appendChild(script);
  }, [scriptLoaded]);

  return scriptLoaded;
};

const AddCardStep: FC = () => {
  const dispatch = useAppDispatch();

  const [ready, setReady] = useState(false);
  const [cardValidation, setCardValidation] = useState<
    FrameValidationChangedEvent |
    Record<string, never>
    >({});
  const [expireValidation, setExpireValidation] = useState<
    FrameValidationChangedEvent |
    Record<string, never>
    >({});
  const [cvvValidation, setCvvValidation] = useState<
    FrameValidationChangedEvent |
    Record<string, never>
    >({});
  const [cardSubmitted, setCardSubmitted] = useState(false);
  const [tokenizedEvent, setTokenizedEvent] = useState<FrameCardTokenizedEvent | null>(null);

  const {
    isUserCardsEmpty,
  } = useAppSelector(selectApp);

  const [triggerAddCard, { status, error }] = useAddUserCardMutation();

  const scriptLoaded = useSetCheckoutScript();

  useEffect(() => {
    if (status === QueryStatus.rejected) {
      // TODO(@ruslan): serialize errors
      toast.error((error as { data: { message: string; code: number }})?.data?.message);
      Frames.enableSubmitForm();
      setCardSubmitted(false);
    }
  }, [error, status]);

  useEffect(() => {
    if (!tokenizedEvent?.token) {
      return;
    }

    const fetchAddCard = async () => {
      await triggerAddCard({ card_token: tokenizedEvent.token });
    };

    fetchAddCard();
  }, [tokenizedEvent?.token, triggerAddCard]);

  useEffect(() => {
    if (status === QueryStatus.fulfilled) {
      dispatch(incrementWidgetStep());
    }
  }, [dispatch, status]);

  const handleFrameValidationChanged = useCallback((e: FrameValidationChangedEvent) => {
    switch (e.element) {
      case 'cvv': {
        setCvvValidation(e);
        break;
      }
      case 'expiry-date': {
        setExpireValidation(e);
        break;
      }
      case 'card-number': {
        setCardValidation(e);
        break;
      }
      default: {
        setCardValidation({});
      }
    }
  }, []);

  const isFormValid = cardValidation?.isValid && expireValidation?.isValid && cvvValidation?.isValid;

  return (
    <Flex flexDirection="column" flex={1}>
      <WidgetHead
        text="Add New Card"
        customBackCallback={
        isUserCardsEmpty
          ? (() => {
            dispatch(goToWidgetStep(WidgetSteps.PERSONAL_INFORMATION));
          }) : undefined
      }
      />
      <PaymentContainer>
        <Flex flexDirection="column" flex={1}>
          {(!ready || !scriptLoaded) && (
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
          {scriptLoaded && (
            <FramesContainer data-testid="FramesContainer" isVisible={ready}>
              <Frames
                config={{
                  debug: true,
                  publicKey: process.env.REACT_APP_CHECKOUT_PUBLIC_KEY as string,
                  localization: {
                    cardNumberPlaceholder: 'Card number',
                    expiryMonthPlaceholder: 'MM',
                    expiryYearPlaceholder: 'YY',
                    cvvPlaceholder: 'CVV',
                  },
                  style: {
                    base: {
                      padding: '18px',
                      height: '62px',
                      borderRadius: '6px',
                      color: 'black',
                      fontSize: '16px',
                      boxShadow: 'inset 0 0 0 1px #ccc',
                      background: alt4,
                    },
                    focus: {
                      color: white,
                    },
                    valid: {
                      boxShadow: 'inset 0 0 0 1px green',
                      color: white,
                    },
                    invalid: {
                      boxShadow: `inset 0 0 0 1px ${red}`,
                      color: white,
                    },
                    placeholder: {
                      base: {
                        color: 'rgb(82, 120, 141)',
                      },
                    },
                  },
                }}
                ready={() => setReady(true)}
                // frameActivated={(e) => console.log('e frame activated:', e)}
                // frameFocus={(e) => {}}
                // frameBlur={(e) => {}}
                frameValidationChanged={handleFrameValidationChanged}
                // paymentMethodChanged={(e) => {}}
                // cardValidationChanged={(e) => {}}
                cardSubmitted={() => setCardSubmitted(true)}
                cardTokenized={(e) => {
                  setTokenizedEvent(e);
                }}
                // cardTokenizationFailed={(e) => console.log('e tokenization failed: ', e)}
                // cardBinChanged={(e) => {}}
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
              </Frames>
            </FramesContainer>
          )}
          <FormRow margin="auto 0 0 0">
            <Button
              onClick={() => Frames.submitCard()}
              disabled={!isFormValid || cardSubmitted}
              data-testid="submitButton"
              type="submit"
            >
              Continue
            </Button>
          </FormRow>
        </Flex>
      </PaymentContainer>
    </Flex>
  );
};

export default AddCardStep;
