import React, { FC } from 'react';
import styled, { useTheme } from 'styled-components/macro';
import ReactModal, { Styles } from 'react-modal';
import { Title } from '../../theme/components';
import { ReactComponent as CrossIcon } from '../../assets/cross_icon.svg';

type ModalProps = {
  style?: Styles;
  title: string;
  isOpen: boolean;
  children: React.ReactNode;
  parentSelector: () => HTMLElement;
  handleClickClose: (e: any) => void;
}

const StyledCrossIcon = styled(CrossIcon)`
  color: ${({ theme }) => theme.black};
`;

const ModalHeader = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  min-height: 36px;
  min-width: 36px;
  padding: 0;
  display: flex;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  
  &:hover {
    background: ${({ theme }) => theme.lgray};
  }
`;

const ModalBody = styled.div`
  flex: 1;
  overflow: auto;
`;

const Modal: FC<ModalProps> = (props) => {
  const {
    style,
    isOpen,
    parentSelector,
    children,
    handleClickClose,
    title,
  } = props;

  const theme = useTheme();

  return (
    <ReactModal
      style={style}
      parentSelector={parentSelector}
      isOpen={isOpen}
    >
      <ModalHeader>
        <Title color={theme.alt3}>{title}</Title>
        <CloseButton type="button" onClick={handleClickClose}>
          <StyledCrossIcon />
        </CloseButton>
      </ModalHeader>
      <ModalBody>
        {children}
      </ModalBody>
    </ReactModal>
  );
};

export default Modal;
