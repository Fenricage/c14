import React, { FC } from 'react';
import styled, { DefaultTheme, useTheme } from 'styled-components/macro';
import { ReactComponent as CrossIcon } from '../../assets/cross_icon.svg';
import SadIcon from '../../components/SadIcon/SadIcon';

const StyledCrossIcon = styled(CrossIcon)<{color: string}>`
  position: absolute;
  top: 10px;
  right: 10px;
  color: ${({ color }) => color};
  height: 18px;
  width: 18px;
  opacity: .5;
`;

const CloseButton = styled.button`
  &:hover ${StyledCrossIcon} {
    opacity: 1;
  }
`;

type AlertColors = {
  alertText: string;
  alertBg: string;
  alertBorder: string;
}

const getAlertColors = (theme: DefaultTheme, type: AlertType) => {
  const colors: AlertColors = {
    alertText: '',
    alertBg: '',
    alertBorder: '',
  };

  switch (type) {
    case 'error': {
      colors.alertText = theme.alertErrorText;
      colors.alertBg = theme.alertErrorBg;
      colors.alertBorder = theme.alertErrorBorder;

      return colors;
    }

    case 'warn': {
      colors.alertText = theme.alertErrorText;
      colors.alertBg = theme.alertErrorBg;
      colors.alertBorder = theme.alertErrorBorder;

      return colors;
    }

    case 'info': {
      colors.alertText = theme.alertInfoText;
      colors.alertBg = theme.alertInfoBg;
      colors.alertBorder = theme.alertInfoBorder;

      return colors;
    }

    case 'success': {
      colors.alertText = theme.alertErrorText;
      colors.alertBg = theme.alertErrorBg;
      colors.alertBorder = theme.alertErrorBorder;

      return colors;
    }

    default: {
      return colors;
    }
  }
};

export const AlertContainer = styled.div<{iconOffset: boolean, alertColors: AlertColors}>`
  display: flex;
  position: relative;
  justify-content: center;
  width: 100%;
  align-items: center;
  height: 70px;
  color: ${({ alertColors }) => alertColors.alertText};
  background-color: ${({ alertColors }) => alertColors.alertBg};
  border: 1px solid ${({ alertColors }) => alertColors.alertBorder};
  padding: 12px 24px 12px ${({ iconOffset }) => (iconOffset ? '74px' : '24px')};
  border-radius: 12px;
`;

const AlertTextContainer = styled.div`
  display: flex;
  justify-content: center;
  flex: 1;
`;

const AlertText = styled.span`
  font-size: 14px;
  font-weight: 400;
`;

const AlertErrorIconContainer = styled.div`
  position: absolute;
  display: flex;
  left: 24px;
  top: 50%;
  transform: translateY(-50%);
`;

export type AlertType = 'warn' | 'success' | 'error' | 'info'

type AlertProps = {
  onClose: () => void;
  type: AlertType;
  children?: React.ReactNode;
  showAlertIcon?: boolean;
  message?: string;
}

const Alert: FC<AlertProps> = ({
  onClose,
  type,
  showAlertIcon = true,
  message,
  children,
}) => {
  const theme = useTheme();

  const renderIcon = () => {
    switch (type) {
      case 'error': {
        return (
          <SadIcon
            color={theme.alertErrorText}
            width={26}
            height={26}
          />
        );
      }
      default: {
        return null;
      }
    }
  };

  const renderAlertChildren = () => {
    if (children) {
      return children;
    } if (message) {
      return (
        <AlertText>{message}</AlertText>
      );
    }
    return null;
  };

  return (
    <AlertContainer iconOffset={showAlertIcon} alertColors={getAlertColors(theme, type)}>
      <CloseButton type="button" onClick={onClose}>
        <StyledCrossIcon color={getAlertColors(theme, type).alertText} />
      </CloseButton>
      {showAlertIcon && (
        <AlertErrorIconContainer>
          {renderIcon()}
        </AlertErrorIconContainer>
      )}
      <AlertTextContainer>
        {renderAlertChildren()}
      </AlertTextContainer>
    </AlertContainer>
  );
};

export default Alert;
