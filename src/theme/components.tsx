import styled, { createGlobalStyle } from 'styled-components/macro';
import React, { ReactNode } from 'react';
import { Transition, TransitionStatus } from 'react-transition-group';

export const Title = styled.h1<{margin?: string; color?: string}>`
  font-family: 'Pragmatica Extended',serif;
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 40px;
  color: ${({ color }) => color || 'inherit'};
  width: 100%;
  margin: ${({ margin }) => margin || '0'};
  text-align: center;
`;

export const BorderButton = styled.button`
  font-size: 12px;
  padding: 0;
  color: #fff;
  border-bottom: 1px dotted rgba(255, 255, 255, .5);
  margin-top: 6px;
  
  &:hover {
    border-bottom: 1px dotted rgba(255, 255, 255, 1);
  }
  
  &:disabled {
    opacity: .5;
  }
`;

export const Subtitle = styled.h2<{margin?: string}>`
  font-size: 14px;
  line-height: 24px;
  text-align: center;
  margin: ${({ margin }) => margin || '0'};
  letter-spacing: 1px;
  font-weight: 400;
`;

export const Button = styled.button`
  display: flex;
  cursor: pointer;
  width: 100%;
  justify-content: center;
  background: ${({ theme }) => theme.primary1};
  border-radius: 10.3333px;
  align-items: center;
  border: 0;
  padding: 14px 28px;
  font-weight: 700;
  font-family: 'Pragmatica Extended',serif;
  font-size: 16px;
  line-height: 16px;
  color: #FFFFFF;
  
  &:hover {
    background: ${({ theme }) => theme.alt1};
  }

  &:active {
    background: ${({ theme }) => theme.alt1};
  }
  
  &:disabled {
    opacity: .5
  }

  &:disabled:hover {
    cursor: default;
    background: ${({ theme }) => theme.primary1};
    opacity: .5
  }
`;

export const InputLabel = styled.label`
  display: inline-block;
  white-space: nowrap;
  width: 100%;
  font-style: normal;
`;

export const FormRow = styled.div<{
  alignItems?: string
  margin?: string;
}>`
  display: flex;
  flex-flow: column nowrap;
  margin: ${({ margin }) => (margin || '0')};
  align-items: ${(props) => (props.alignItems ? props.alignItems : 'flex-start')};
`;

export const AnimationContainer = styled.div<{ state: TransitionStatus }>`
  transition: 0.5s;
  width: 100%;
  flex: 1;
  display: flex;
  height: auto;
  transform: translateY(${({ state }) => (state === 'entering' || state === 'entered' ? 0 : -10)}px);
  opacity: ${({ state }) => {
    switch (state) {
      case 'entering':
        return 1;
      case 'entered':
        return 1;
      case 'exiting':
        return 0;
      case 'exited':
        return 0;
      default:
        return 0;
    }
  }};
`;

export const TemporaryContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 46px;
  font-style: italic;
  opacity: .6;
  
  > b {
    font-size: 22px;
  }
  
  > p {
    font-size: 18px;
  }
`;

export function AnimatedContainer({
  children,
  animate,
}: { children: ReactNode, animate: boolean }) {
  return (
    <Transition in={animate} timeout={500}>
      {(state) => (
        // state change: exited -> entering -> entered -> exiting -> exited
        <AnimationContainer state={state}>
          {children}
        </AnimationContainer>
      )}
    </Transition>
  );
}

export const ThemedGlobalStyle = createGlobalStyle`
html {
  color: ${({ theme }) => theme.white};
  background: ${({ theme }) => theme.bg};
  min-height: 100vh;
  font-weight: 700;
  height: 100vh;
}

* {
  box-sizing: border-box;
  *::before, *::after {
    box-sizing: border-box;
  }
}

a {
 color: ${({ theme }) => theme.white}; 
}

body {
  margin: 0;
  font-family: "HelveticaNeueCyr", serif;
}

button {
  border: 0;
  background-color: transparent;
  cursor: pointer;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}
`;
