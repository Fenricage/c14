import React, { FC } from 'react';
import styled from 'styled-components/macro';
import { Flex } from 'rebass/styled-components';
import AppLayout from '../../components/AppLayout/AppLayout';
import Sidebar from './Sidebar/Sidebar';
import Widget from './Widget/Widget';
import Alert, { AlertContainer } from './Alert';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectApp, setGeneralError } from '../../state/applicationSlice';

const SidebarBox = styled.div`
  height: 100%;
  display: none;

  ${({ theme }) => theme.mediaWidth.upToMedium`
      display: block;
  `};
`;

const GeneralError = styled.div`
  ${AlertContainer} {
    z-index: 1;
    width: 95%;
    top: 20px;
    position: fixed;

    ${({ theme }) => theme.mediaWidth.upToSmall`
      position: absolute;
      width: 100%;
      top: -30px;
      left: 0;
      right: 0;
  `};
  }
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

const HomePage: FC = () => {
  const { generalError } = useAppSelector(selectApp);
  const dispatch = useAppDispatch();

  const handleClickCloseGeneralError = () => {
    dispatch(setGeneralError(null));
  };

  return (
    <AppLayout>
      <Flex height="100%" justifyContent="center" alignItems="flex-start">
        <SidebarBox>
          <Sidebar />
        </SidebarBox>
        <WidgetBox>
          {generalError && (
            <GeneralError>
              <Alert
                type="error"
                message={generalError.message}
                onClose={handleClickCloseGeneralError}
              />
            </GeneralError>
          )}
          <Widget />
        </WidgetBox>
      </Flex>
    </AppLayout>
  );
};

export default HomePage;
