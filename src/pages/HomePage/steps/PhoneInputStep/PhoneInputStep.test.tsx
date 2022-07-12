import React from 'react';
import {
  act,
} from '@testing-library/react';
import user from '@testing-library/user-event';
import { render } from '../../../../utils/test-utils';
import PhoneInputStep from './PhoneInputStep';
import { server } from '../../../../testHandlers/utils';

const SECONDS = 1000;
jest.setTimeout(70 * SECONDS);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('PhoneInputStep tests', () => {
  it(
    'check form is rendered correct',
    async () => {
      const {
        getByTestId,
      } = render(<PhoneInputStep />);

      await act(() => {
        expect(getByTestId('PhoneInput')).toBeInTheDocument();
      });

      expect(getByTestId('submitButton')).toBeDisabled();
    },
  );

  it(
    'submit with valid values form',
    async () => {
      const {
        getByTestId,
      } = render(<PhoneInputStep />);

      const validNumber = '3333333333';

      await act(() => {
        expect(getByTestId('PhoneInput')).toBeInTheDocument();
      });

      expect(getByTestId('submitButton')).toBeDisabled();

      const selectCountry = getByTestId('CountrySelect');
      const phoneInput = getByTestId('PhoneInput');

      await act(() => {
        user.selectOptions(selectCountry, ['GB']);
      });

      await act(() => {
        user.type(phoneInput, validNumber);
      });

      expect(getByTestId('submitButton')).not.toBeDisabled();
    },
  );

  it(
    'submit with invalid values form',
    async () => {
      const {
        getByTestId,
      } = render(<PhoneInputStep />);

      const invalidNumber = '234';

      await act(() => {
        expect(getByTestId('PhoneInput')).toBeInTheDocument();
      });

      expect(getByTestId('submitButton')).toBeDisabled();

      const selectCountry = getByTestId('CountrySelect');
      const phoneInput = getByTestId('PhoneInput');

      await act(() => {
        user.selectOptions(selectCountry, ['GB']);
      });

      await act(() => {
        user.type(phoneInput, invalidNumber);
      });

      expect(getByTestId('submitButton')).toBeDisabled();
    },
  );
});
