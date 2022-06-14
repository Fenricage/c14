import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import styled from 'styled-components/macro';
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

function App(): JSX.Element {
  return (
    <>
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
    </>
  );
}

export default App;
