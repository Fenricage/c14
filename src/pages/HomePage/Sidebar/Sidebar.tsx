import React, { FC } from 'react';
import styled from 'styled-components/macro';
import { Flex } from 'rebass';
import Stepper from './Stepper/Stepper';

const SidebarContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  padding-right: 40px;
  height: 100%;

  ${({ theme }) => theme.mediaWidth.upToLarge`
        padding-right: 80px;
  `};
`;

const SidebarTitle = styled.h1`
  margin: 0;
  font-family: 'Pragmatica Extended', serif;
  font-weight: bold;
  text-align: right;
  font-size: 24px;
  line-height: 36px;
  font-feature-settings: 'pnum' on, 'onum' on;
  color: ${({ theme }) => theme.alt3};
`;

const SidebarText = styled.p`
  margin: 12px 0 50px 0;
  font-weight: 400;
  font-size: 16px;
  text-align: right;
  max-width: 340px;
  line-height: 24px;
  font-feature-settings: 'pnum' on, 'onum' on;
  color: ${({ theme }) => theme.alt3};
  word-break: break-word;
`;

const StepperContainer = styled.div`
  width: 371px;
  height: 380px;
`;

const Sidebar: FC = () => (
  <SidebarContainer data-testid="Sidebar">
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="flex-end"
      flex="1"
    >
      <SidebarTitle>BUY CRYPTO</SidebarTitle>
      <SidebarText>
        Purchase crypto with your credit or debit card.
        Complete these simple steps to trade USD for USDC on EVMOS.
      </SidebarText>
      <StepperContainer>
        <Stepper />
      </StepperContainer>
    </Flex>
  </SidebarContainer>
);

export default Sidebar;
