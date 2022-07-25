import React, { FC, ReactNode } from 'react';
import Div100vh from 'react-div-100vh';
import styled from 'styled-components/macro';
import { bg } from '../../theme';
import Logo from '../Logo/Logo';

type AppLayoutProps = {
  children: ReactNode;
}

const AppLayoutContainer = styled.div`
  background: ${bg};
  height: 100%;
  width: 100%;
  flex-flow: column;
  display: flex;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 32px;
  `};
  
  ${({ theme }) => theme.mediaWidth.upToLarge`
    padding: 48px 68px;
  `};
`;

const AppLayoutBody = styled.div`
  flex: 1;
  width: 100%;
`;

const AppLayoutHeader = styled.div`
  width: 100%;
  display: none;

  ${({ theme }) => theme.mediaWidth.upToSmall`
      display: flex;
  `};
`;

const AppLayoutLogoBox = styled.div`
  transform: translate(-4px, -8px);
`;

const AppLayout: FC<AppLayoutProps> = ({
  children,
}) => (
  <Div100vh>
    <AppLayoutContainer>
      <AppLayoutHeader>
        <AppLayoutLogoBox>
          <Logo />
        </AppLayoutLogoBox>
      </AppLayoutHeader>
      <AppLayoutBody>
        {children}
      </AppLayoutBody>
    </AppLayoutContainer>
  </Div100vh>
);

export default AppLayout;
