import React, { FC, useEffect, useState } from 'react';
import { FrameCardTokenizedEvent, Frames as FramesLib, FrameValidationChangedEvent } from 'frames-react';
import { alt4, red, white } from '../../theme';
import { FRAMES_KEY } from '../../constants';

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

interface IFrames {
  children: React.ReactElement[];
  onFrameValidationChanged: (e: FrameValidationChangedEvent) => void;
  onReadyToDisplay: () => void;
  onCardSubmitted: () => void;
  onCardTokenized: (e: FrameCardTokenizedEvent) => void;
}

const CheckoutFrames: FC<IFrames> = ({
  onReadyToDisplay,
  onFrameValidationChanged,
  onCardSubmitted,
  onCardTokenized,
  children,
}) => {
  const scriptLoaded = useSetCheckoutScript();

  return (
    scriptLoaded ? (
      <FramesLib
        config={{
          debug: true,
          publicKey: FRAMES_KEY,
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
        ready={onReadyToDisplay}
        frameValidationChanged={onFrameValidationChanged}
        cardSubmitted={onCardSubmitted}
        cardTokenized={onCardTokenized}
      >
        {children}
      </FramesLib>
    ) : null
  );
};

export default CheckoutFrames;
