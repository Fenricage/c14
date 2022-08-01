import React, { FC } from 'react';
import styled from 'styled-components/macro';
import { v4 as uuidv4 } from 'uuid';
import { Button, FormRow } from '../../../../theme/components';

type ModalInnerTooManyYearsProps = {
  onClose: (e: any) => void;
}

const ModalInnerTooManyYearsContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
`;

const ModalInnerTooManyYearsList = styled.ol`
  padding-left: 26px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.alt3}
`;

const text1 = 'Thank you for verifying.';

const text2 = 'In order to verify this transaction please e-mail "legal@c14.money" with the\n'
  + 'following information.';

const text3 = 'After review, our compliance team may reach'
  + ' out with additional questions before approving your transaction.';

const list = [
  'Use the subject line "Today\'s Date - YOUR NAME - Crypto"',
  'Please include a selfie of you holding your ID in one hand',
  'In that selfie please hold today\'s newspaper in the other hand',
  'Please write a paragraph that describes your use case for purchasing crypto'
  + ' (four sentences at a minimum.)',
  'Please include a contact number',
];

const ModalTooManyYearsText = styled.p`
  font-weight: 500;
  margin: 12px 0;
  color: ${({ theme }) => theme.alt3}
`;

const ModalInnerTooManyYears: FC<ModalInnerTooManyYearsProps> = ({ onClose }) => (
  <ModalInnerTooManyYearsContainer data-testid="ModalInnerTooManyYearsContainer">
    <ModalTooManyYearsText>{text1}</ModalTooManyYearsText>
    <ModalTooManyYearsText>{text2}</ModalTooManyYearsText>
    <ModalTooManyYearsText>{text3}</ModalTooManyYearsText>
    <ModalInnerTooManyYearsList>
      {list.map((l) => (<li key={uuidv4()}>{l}</li>))}
    </ModalInnerTooManyYearsList>
    <FormRow margin="auto 0 0 0">
      <Button
        onClick={onClose}
        data-testid="submitButton"
        type="submit"
      >
        Close
      </Button>
    </FormRow>
  </ModalInnerTooManyYearsContainer>
);

export default ModalInnerTooManyYears;
