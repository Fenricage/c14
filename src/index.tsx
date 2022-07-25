import './fonts/index';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import ReactModal from 'react-modal';
import { Normalize } from 'styled-normalize';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ThemeProvider from './theme';
import { store } from './app/store';
import { ThemedGlobalStyle } from './theme/components';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

ReactModal.setAppElement('#root');

root.render(
  <Provider store={store}>
    <ThemeProvider>
      <Normalize />
      <ThemedGlobalStyle />
      <App />
    </ThemeProvider>
  </Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
export { serverQuoteRequestMock } from './testHandlers/quotes/mocks';
export { serverGetUserCardsMock } from './testHandlers/userCards/mocks';
