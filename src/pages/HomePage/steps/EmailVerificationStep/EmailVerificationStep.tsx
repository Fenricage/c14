import React, {
  FC,
} from 'react';
import { Flex } from 'rebass/styled-components';
import styled from 'styled-components/macro';
import WidgetHead from '../../Widget/WidgetHead';
import { BorderButton } from '../../../../theme/components';
import { ReactComponent as EmailIcon } from '../../../../assets/email_icon.svg';
import StepIcon from '../../../../components/StepIcon/StepIcon';

type EmailVerificationStepProps = {
  onClickModifyEmail: () => void;
  onClickResendEmail: () => Promise<void>;
  isLoading: boolean;
}

const ButtonBox = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
`;

const EmailText = styled.p`
  line-height: 24px;
`;

const EmailVerificationStep: FC<EmailVerificationStepProps> = ({
  onClickModifyEmail,
  onClickResendEmail,
  isLoading,
}) => (
  <Flex flexDirection="column" flexWrap="nowrap" flex={1}>
    <WidgetHead
      text="Verify Your Email"
    />
    <Flex
      flex={1}
      flexDirection="column"
      justifyContent="center"
    >
      <Flex
        flex={1}
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
      >
        <StepIcon>
          <EmailIcon />
        </StepIcon>
        <EmailText>
          Verification email has been sent, please confirm your email.
        </EmailText>
      </Flex>
      <Flex flexDirection="column">
        <ButtonBox>
          <BorderButton
            onClick={onClickModifyEmail}
          >
            Modify email
          </BorderButton>
        </ButtonBox>
        <ButtonBox>
          <BorderButton
            disabled={isLoading}
            onClick={onClickResendEmail}
          >
            Resend email
          </BorderButton>
        </ButtonBox>
      </Flex>
    </Flex>
  </Flex>
);

export default EmailVerificationStep;
