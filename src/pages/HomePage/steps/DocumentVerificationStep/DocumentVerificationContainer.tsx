import React, {
  FC, useCallback, useEffect,
} from 'react';
import useClearGeneralError from '../../../../hooks/useClearGeneralError';
import DocumentVerificationStep from './DocumentVerificationStep';
import { useGetUserQuery, useLazyGetUserQuery, useVerifyDocumentsMutation } from '../../../../redux/userApi';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { incrementWidgetStep, logout, setGeneralError } from '../../../../state/applicationSlice';
import { selectUserDetails } from '../../../../state/userDetailsSlice';

type TruliooResponse = {
  experienceTransactionId: string;
  status: number
  statusText: string;
}

const DocumentVerificationContainer: FC = () => {
  useClearGeneralError();

  const publicKey = process.env.REACT_APP_TRULIOO_PUBLIC_KEY;
  const accessTokenURL = process.env.REACT_APP_SERVER_URL;

  const [triggerVerifyDocuments] = useVerifyDocumentsMutation();
  const [triggerLazyGetUser] = useLazyGetUserQuery({ pollingInterval: 5000 });

  const { documentVerificationStatus } = useAppSelector(selectUserDetails);

  const dispatch = useAppDispatch();

  const handleClickTryAgain = () => {
    dispatch(logout());
  };

  const {
    isLoading: isInitialUserLoading,
    isUninitialized: isUserFetchUninitialized,
    data: initialUserDetailsData,
  } = useGetUserQuery();

  useEffect(() => {
    const fetchTriggerLazyGetUser = async () => {
      await triggerLazyGetUser();
    };

    if (initialUserDetailsData?.document_verification_status === 'IN_PROGRESS') {
      fetchTriggerLazyGetUser();
    }
  }, [
    initialUserDetailsData?.document_verification_status,
    triggerLazyGetUser,
  ]);

  useEffect(() => {
    if (documentVerificationStatus === 'SUCCESS') {
      dispatch(incrementWidgetStep());
    }
  }, [dispatch, documentVerificationStatus]);

  const handleResponse = useCallback(async (args: TruliooResponse) => {
    const {
      experienceTransactionId,
      status,
    } = args;

    if (status === 200) {
      try {
        await triggerVerifyDocuments({ document_verification_token: experienceTransactionId }).unwrap();
      } catch {
        dispatch(setGeneralError({
          type: 'error',
          message: 'Can\'t verify Documents',
        }));
        return;
      }

      await triggerLazyGetUser();
    }
  }, [dispatch, triggerLazyGetUser, triggerVerifyDocuments]);

  const onInitialRenderComplete = useCallback(() => {
    const loadingOverlay = document.getElementById('loading-overlay');

    if (loadingOverlay) {
      loadingOverlay.style.visibility = 'hidden';
    }

    // if (e.status !== 200 || e.statusText !== 'Success') {
    //   console.log('@onInitialRenderComplete', e);
    // }
  }, []);

  const truliooScriptLoaded = useCallback(() => {
    // eslint-disable-next-line no-new
    new window.TruliooClient({
      publicKey,
      accessTokenURL,
      handleResponse,
      onInitialRenderComplete,
    });
  }, [
    accessTokenURL,
    handleResponse,
    onInitialRenderComplete,
    publicKey,
  ]);

  useEffect(() => {
    if (documentVerificationStatus === 'SUCCESS' || documentVerificationStatus === null) {
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.trulioo.com/latest/main.js';
    script.async = true;
    script.onload = () => {
      truliooScriptLoaded();
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [
    documentVerificationStatus,
    truliooScriptLoaded,
  ]);

  if (isUserFetchUninitialized || isInitialUserLoading) {
    return null;
  }

  const onClickNavigateBack = () => {
    dispatch(logout());
  };

  const onCloseVerificationModal = () => {
    dispatch(logout());
  };

  return (
    <DocumentVerificationStep
      documentVerificationStatus={documentVerificationStatus}
      onClickNavigateBack={onClickNavigateBack}
      onCloseVerificationModal={onCloseVerificationModal}
      onClickTryAgain={handleClickTryAgain}
    />
  );
};

export default DocumentVerificationContainer;
