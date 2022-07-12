import { useEffect } from 'react';
import { useAppDispatch } from '../app/hooks';
import { setGeneralError } from '../state/applicationSlice';

const useClearGeneralError = () => {
  const dispatch = useAppDispatch();

  useEffect(() => () => {
    dispatch(setGeneralError(null));
  }, [dispatch]);
};

export default useClearGeneralError;
