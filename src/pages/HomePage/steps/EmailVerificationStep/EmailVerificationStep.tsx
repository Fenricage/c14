import React, {
  FC, useCallback, useEffect, useState,
} from 'react';
import { Flex } from 'rebass/styled-components';
import styled from 'styled-components/macro';
import WidgetHead from '../../Widget/WidgetHead';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { useLazyGetUserQuery, useSendEmailVerificationMutation } from '../../../../redux/userApi';
import {
  decrementWidgetStep,
  incrementWidgetStep,
} from '../../../../state/applicationSlice';
import {
  selectUserDetails,
  setEmailVerificationSent,
  setSkipPersonalInfoStep,
} from '../../../../state/userDetailsSlice';
import { BorderButton } from '../../../../theme/components';
import useCallOnExpireTimer from '../../../../hooks/useCallOnExpireTimer';
import { ReactComponent as EmailIcon } from '../../../../assets/email_icon.svg';
import StepIcon from '../../../../components/StepIcon/StepIcon';

const ButtonBox = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
`;

const EmailText = styled.p`
  margin-top: 80px;
  line-height: 24px;
`;

const EmailVerificationStep: FC = () => {
  const dispatch = useAppDispatch();

  const {
    isEmailVerified,
    isEmailVerificationSending,
    isEmailVerificationSent,
  } = useAppSelector(selectUserDetails);

  const [triggerSendEmailVerification] = useSendEmailVerificationMutation();

  const [sendEmailExpiredAt, setSendEmailExpiredAt] = useState<null | string>(null);

  const [triggerGetUser] = useLazyGetUserQuery({ pollingInterval: 3000 });

  const setExpireSendEmailDate = useCallback(() => {
    const currentDate = new Date();
    currentDate.setSeconds(currentDate.getSeconds() + 90);
    const iso = currentDate.toISOString();
    setSendEmailExpiredAt(iso);
  }, []);

  const callOnExpiredEmailSendTimer = useCallback(() => {
    setSendEmailExpiredAt(null);
  }, []);

  useCallOnExpireTimer(sendEmailExpiredAt as string, callOnExpiredEmailSendTimer);

  useEffect(() => {
    dispatch(setEmailVerificationSent(true));
  }, [dispatch]);

  useEffect(() => {
    if (!isEmailVerificationSent) {
      return;
    }

    const getUser = async () => {
      await triggerGetUser();
    };

    getUser();
  }, [isEmailVerificationSent, triggerGetUser]);

  useEffect(() => {
    if (isEmailVerified) {
      dispatch(incrementWidgetStep());
    }
  }, [dispatch, isEmailVerified]);

  const handleClickModifyEmail = () => {
    dispatch(setSkipPersonalInfoStep(false));
    dispatch(decrementWidgetStep());
  };

  const handleClickResendEmail = async () => {
    setExpireSendEmailDate();
    await triggerSendEmailVerification();
  };

  return (
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
              onClick={handleClickModifyEmail}
            >
              Modify email
            </BorderButton>
          </ButtonBox>
          <ButtonBox>
            <BorderButton
              disabled={isEmailVerificationSending || !!sendEmailExpiredAt}
              onClick={handleClickResendEmail}
            >
              Resend email
            </BorderButton>
          </ButtonBox>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default EmailVerificationStep;
