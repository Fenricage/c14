import React from 'react';
import styled from 'styled-components/macro';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectApp, setGeneralError } from '../../state/applicationSlice';
import { ReactComponent as CrossIcon } from '../../assets/cross_icon.svg';
import SadIcon from '../../components/SadIcon/SadIcon';

const StyledCrossIcon = styled(CrossIcon)`
  position: absolute;
  top: 10px;
  right: 10px;
  color: #842029;
  height: 18px;
  width: 18px;
  opacity: .5;
`;

const CloseButton = styled.button`
  &:hover ${StyledCrossIcon} {
    opacity: 1;
  }
`;

const GeneralErrorContainer = styled.div`
  z-index: 1;
  width: 95%;
  display: flex;
  top: 20px;
  justify-content: center;
  position: fixed;
  align-items: center;
  height: 70px;
  color: #842029;
  background-color: #f8d7da;
  border: 1px solid #f5c2c7;
  padding: 12px 24px 12px 74px;
  border-radius: 12px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    position: absolute;
    width: 100%;
    top: -30px;
    left: 0;
    right: 0;
  `};
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
  const dispatch = useAppDispatch();

  if (!generalError) {
    return null;
  }

  const handleClickClose = () => {
    dispatch(setGeneralError(null));
  };

  return (
    <GeneralErrorContainer>
      <CloseButton type="button" onClick={handleClickClose}>
        <StyledCrossIcon />
      </CloseButton>
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
