import React, { FC } from 'react';
import styled from 'styled-components/macro';
import { Flex } from 'rebass/styled-components';
import AppLayout from '../../components/AppLayout/AppLayout';
import Sidebar from './Sidebar/Sidebar';
import Widget from './Widget/Widget';
import GeneralError from './GeneralError';

const SidebarBox = styled.div`
  height: 100%;
  display: none;

  ${({ theme }) => theme.mediaWidth.upToMedium`
      display: block;
  `};
`;

const WidgetBox = styled.div`
  display: flex;
  position: relative;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;

  ${({ theme }) => theme.mediaWidth.upToSmall`
     width: auto;
  `};
`;

const HomePage: FC = () => (
  <AppLayout>
    <Flex height="100%" justifyContent="center" alignItems="flex-start">
      <SidebarBox>
        <Sidebar />
      </SidebarBox>
      <WidgetBox>
        <GeneralError />
        <Widget />
      </WidgetBox>
    </Flex>
  </AppLayout>
);

export default HomePage;
