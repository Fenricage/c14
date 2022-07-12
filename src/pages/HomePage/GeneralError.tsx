import React from 'react';
import styled from 'styled-components/macro';
import { useAppSelector } from '../../app/hooks';
import { selectApp } from '../../state/applicationSlice';
import SadIcon from '../../components/SadIcon/SadIcon';

const GeneralErrorContainer = styled.div`
  width: 100%;
  position: absolute;
  top: -30px;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  right: 0;
  height: 70px;
  color: #842029;
  background-color: #f8d7da;
  border: 1px solid #f5c2c7;
  padding: 12px 24px 12px 74px;
  border-radius: 12px;
`;

const GeneralErrorTextContainer = styled.div`
  display: flex;
  justify-content: center;
  flex: 1;
`;

const GeneralErrorText = styled.span`
  font-size: 14px;
  font-weight: 400;
`;

const GeneralErrorIconContainer = styled.div`
  position: absolute;
  display: flex;
  left: 24px;
  top: 50%;
  transform: translateY(-50%);
`;

const GeneralError = () => {
  const { generalError } = useAppSelector(selectApp);

  if (!generalError) {
    return null;
  }

  return (
    <GeneralErrorContainer>
      <GeneralErrorIconContainer>
        <SadIcon color="#842029" width={26} height={26} />
      </GeneralErrorIconContainer>
      <GeneralErrorTextContainer>
        <GeneralErrorText>{generalError.message}</GeneralErrorText>
      </GeneralErrorTextContainer>
    </GeneralErrorContainer>
  );
};

export default GeneralError;
