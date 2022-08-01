import React, { FC } from 'react';
import { Flex } from 'rebass';
import ReactLoading from 'react-loading';
import styled from 'styled-components/macro';
import WidgetHead from '../../Widget/WidgetHead';
import { DocumentVerificationStatus, resetApplication } from '../../../../state/applicationSlice';
import StepIcon from '../../../../components/StepIcon/StepIcon';
import { ReactComponent as FailedIcon } from '../../../../assets/purchase_failed_icon.svg';
import { Button, FormRow, Subtitle } from '../../../../theme/components';
import { useAppDispatch } from '../../../../app/hooks';

interface IDocumentVerificationStep {
  documentVerificationStatus: DocumentVerificationStatus | null;
}

const TruliooOverlay = styled.div`
  background-color: ${({ theme }) => theme.alt2};
  display: flex;
  position: absolute;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
`;

const DocumentVerificationStepInner = styled.div`
  display: flex;
  flex: 1;
  position: relative;
`;

const DocumentVerificationStep: FC<IDocumentVerificationStep> = ({
  documentVerificationStatus,
}) => {
  const dispatch = useAppDispatch();

  const handleClickTryAgain = () => {
    dispatch(resetApplication());
  };

  const renderInnerContent = () => {
    if (documentVerificationStatus === 'NOT_STARTED' || documentVerificationStatus === null) {
      return (
        <DocumentVerificationStepInner>
          <TruliooOverlay
            id="loading-overlay"
          >
            <ReactLoading
              data-testid="PaymentAddingLoader"
              type="spinningBubbles"
              color="#fff"
              height={50}
              width={50}
            />
          </TruliooOverlay>
          <div id="trulioo-embedid" style={{ zIndex: 1 }} />
        </DocumentVerificationStepInner>
      );
    } if (documentVerificationStatus === 'FAILED') {
      return (
        <Flex
          flex={1}
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <StepIcon>
            <FailedIcon />
          </StepIcon>
          <Flex justifyContent="center">
            <Subtitle margin="28px 0">
              Unfortunately, we were unable to verify your documents.
              Please, try again.
            </Subtitle>
          </Flex>
          <FormRow>
            <Button onClick={handleClickTryAgain}>Try again</Button>
          </FormRow>
        </Flex>
      );
    }
    return (
      <Flex
        flex={1}
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Flex marginBottom="32px">
          <ReactLoading
            data-testid="PaymentAddingLoader"
            type="spinningBubbles"
            color="#fff"
            height={50}
            width={50}
          />
        </Flex>
        <Subtitle>
          We are processing your request. It should take no more than 10 minutes.
        </Subtitle>
      </Flex>
    );
  };

  return (
    <Flex flexDirection="column" flexWrap="nowrap" flex={1}>
      <WidgetHead text="Verify Your Documents" />
      {renderInnerContent()}
    </Flex>
  );
};

export default DocumentVerificationStep;
