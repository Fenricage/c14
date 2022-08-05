import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import styled from 'styled-components/macro';
import { ErrorBoundary, Provider } from '@rollbar/react';
import HomePage from './pages/HomePage/HomePage';

const StyledContainer = styled(ToastContainer)`
  .Toastify__toast {
    font-weight: 400;
    font-size: 16px;
    background-color: ${({ theme }) => theme.alt2};
    color: ${({ theme }) => theme.white};
  }
  .Toastify__toast-body {
    white-space: break-spaces;
    word-break: break-all;
  }
`;
const rollbarConfig = {
  accessToken: process.env.REACT_APP_ROLLBAR_TOKEN,
  environment: process.env.REACT_APP_ENV,
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    client: {
      javascript: {
        code_version: '1.0.0',
        source_map_enabled: true,
      },
    },
  },
};

function App(): JSX.Element {
  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary>
        <StyledContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <HomePage />
      </ErrorBoundary>
    </Provider>
  );
}

export default App;
