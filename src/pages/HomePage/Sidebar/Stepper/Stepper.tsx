import React, {
  FC, useEffect, useLayoutEffect, useRef, useState,
} from 'react';
import styled from 'styled-components/macro';
import { ReactComponent as CheckIcon } from './assets/check_icon.svg';
import { ReactComponent as PhoneIcon } from './assets/phone_icon.svg';
import { ReactComponent as PersonaIcon } from './assets/persona_icon.svg';
import { ReactComponent as CardIcon } from './assets/card_icon.svg';
import { ReactComponent as CartIcon } from './assets/cart_icon.svg';
import { selectApp } from '../../../../state/applicationSlice';
import { useAppSelector } from '../../../../app/hooks';

const ItemPoint = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  background: ${({ theme }) => theme.alt4};
  border-radius: 50%;
  right: -47.5px;
  transition: background-color ease-in .1s, box-shadow ease .5s;
`;

const ItemTitle = styled.h3`
  color: ${({ theme }) => theme.alt3};
  font-weight: 500;
  margin: 0;
  font-size: 16px;
  line-height: 24px;
  text-align: right;
  transition: color ease-in .3s;
  font-feature-settings: 'pnum' on, 'onum' on;
  font-style: normal;
`;

const ItemText = styled.div`
  margin-top: 4px;
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  transition: color ease-in .3s;
  line-height: 24px;
  text-align: right;
  font-feature-settings: 'pnum' on, 'onum' on;
`;

const ItemBox = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;

const ItemIconBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 38px;
  min-height: 38px;
  transition: background-color .3s ease-in;
  margin-left: 16px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.alt2};
  
  > svg {
    transform: scale(0.8);
  }

  > svg path {
    transition: fill .3s ease-in;
  }
`;

const StepperItem = styled.div<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;

  ${ItemIconBox} {
    background-color: ${({ theme, isActive }) => (isActive ? theme.primary1 : theme.alt2)};

    > svg path {
      fill: ${({ isActive, theme }) => (isActive ? '#FFFFFF' : theme.alt5)};
    }
  }

  ${ItemPoint} {
    background-color: ${({ theme, isActive }) => (isActive ? theme.primary1 : theme.alt4)};
    box-shadow: ${({ isActive, theme }) => (isActive ? `0 0 0 5px ${theme.primary1o}` : 'transparent')};
  }

  ${ItemTitle} {
    color: ${({ isActive, theme }) => (isActive ? theme.alt3 : theme.alt3o1)};
  }

  ${ItemText} {
    color: ${({ isActive, theme }) => (isActive ? theme.alt3 : theme.alt3o2)};
  }
`;

const StepperContainer = styled.div`
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
  flex: 1;
  justify-content: space-between;
`;

const StepperContainerInner = styled.div`
  padding-right: 42px;
  height: 100%;
  display: flex;
  position: relative;
  flex-flow: column;
  flex: 1;
  justify-content: space-between;
`;

const stepperItemList = [
  {
    title: 'Select Amount',
    text: 'Enter your purchase amount in USD.',
    icon: <CheckIcon />,
  },
  {
    title: 'Verify Your Phone Number',
    text: 'You will receive a confirmation code.',
    icon: <PhoneIcon />,
  },
  {
    title: 'Personal Information',
    text: 'Enter your personal information.',
    icon: <PersonaIcon />,
  },
  {
    title: 'Payment Details',
    text: 'Enter your payment details.',
    icon: <CardIcon />,
  },
  {
    title: 'Order Review',
    text: 'Review your order and receive your crypto!',
    icon: <CartIcon />,
  },
];

const StepperLineBox = styled.div<{ paddingTop: string, paddingBottom: string }>`
  height: 100%;
  padding-bottom: ${({ paddingBottom }) => paddingBottom};
  padding-top: ${({ paddingTop }) => paddingTop};
`;

const StepperLine = styled.div`
  height: 100%;
  width: 1px;
  background: ${({ theme }) => theme.alt4};
`;

const Stepper: FC = () => {
  const {
    stepperSteps: {
      currentStep,
    },
  } = useAppSelector(selectApp);

  const [computedVerticalOffsets, setComputedVerticalOffsets] = useState<{ top: number; bottom: number }>({
    bottom: 0,
    top: 0,
  });

  const stepperItemsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    stepperItemsRef.current = stepperItemsRef.current.slice(0, stepperItemList.length);
  }, []);

  // fit line
  useLayoutEffect(() => {
    const firstElementHeight = stepperItemsRef.current[0].offsetHeight;
    const lastElementIndex = stepperItemList.length - 1;
    const lastElementHeight = stepperItemsRef.current[lastElementIndex].offsetHeight;

    setComputedVerticalOffsets({
      top: firstElementHeight / 2,
      bottom: lastElementHeight / 2,
    });
  }, []);

  return (
    <StepperContainer>
      <StepperContainerInner>
        {stepperItemList.map((item, index) => {
          const isActive = currentStep >= index;
          return (
            <StepperItem
              data-testid={`StepperItem-${index}`}
              ref={(el) => {
                stepperItemsRef.current[index] = el as HTMLDivElement;
              }}
              key={item.title}
              isActive={isActive}
            >
              {/* {index === 0 && <Line/>} */}
              <ItemPoint />
              <ItemBox>
                <ItemTitle data-testid={`ItemTitle-${item.title}-Active-${isActive}`}>{item.title}</ItemTitle>
                <ItemText data-testid={`ItemText-${index}`}>{item.text}</ItemText>
              </ItemBox>
              <ItemIconBox>
                {item.icon}
              </ItemIconBox>
            </StepperItem>
          );
        })}
      </StepperContainerInner>
      <StepperLineBox
        paddingBottom={`${computedVerticalOffsets.bottom}px`}
        paddingTop={`${computedVerticalOffsets.top}px`}
      >
        <StepperLine />
      </StepperLineBox>
    </StepperContainer>
  );
};

export default Stepper;
