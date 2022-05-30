import React, { FC, ReactNode } from 'react';
import styled from 'styled-components/macro';
import { bg } from '../../theme';
import Logo from '../Logo/Logo';

type AppLayoutProps = {
  children: ReactNode;
}

const AppLayoutContainer = styled.div`
  background: ${bg};
  height: 100vh;
  width: 100%;
  min-height: 100vh;
  flex-flow: column;
  display: flex;
  padding: 32px;
  
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
`;

const AppLayoutLogoBox = styled.div`
  transform: translate(-4px, -8px);
`;

const AppLayout: FC<AppLayoutProps> = ({
  children,
}) => (
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
);

export default AppLayout;
