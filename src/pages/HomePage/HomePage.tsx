import React, { FC } from 'react';
import styled from 'styled-components/macro';
import { Flex } from 'rebass';
import AppLayout from '../../components/AppLayout/AppLayout';
import Sidebar from './Sidebar/Sidebar';
import Widget from './Widget/Widget';
import GeneralError from './GeneralError';

const SidebarContainer = styled.div`
  height: 100%;
  display: none;

  ${({ theme }) => theme.mediaWidth.upToMedium`
      display: block;
  `};
`;

const WidgetContainer = styled.div`
  display: flex;
  position: relative;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const HomePage: FC = () => (
  <AppLayout>
    <Flex height="100%" justifyContent="center" alignItems="flex-start">
      <SidebarContainer>
        <Sidebar />
      </SidebarContainer>
      <WidgetContainer>
        <GeneralError />
        <Widget />
      </WidgetContainer>
    </Flex>
  </AppLayout>
);

export default HomePage;
