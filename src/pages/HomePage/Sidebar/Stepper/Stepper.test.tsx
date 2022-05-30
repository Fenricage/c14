import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'jest-styled-components';
import Stepper from './Stepper';
import { colors } from '../../../../theme';
import applicationSlice, { incrementStep, Steps, initialState } from '../../../../state/applicationSlice';
import { render } from '../../../../utils/test-utils';

describe('Stepper tests', () => {
  it('check initial Stepper active color style', () => {
    const { getByTestId } = render(<Stepper />);
    expect(getByTestId('ItemTitle-0')).toHaveStyle({ color: colors().alt3 });
    expect(getByTestId('ItemText-0')).toHaveStyle({ color: colors().alt3 });

    expect(getByTestId('ItemTitle-1')).toHaveStyle({ color: colors().alt3o1 });
    expect(getByTestId('ItemText-1')).toHaveStyle({ color: colors().alt3o2 });
  });

  it('set another step and check Stepper active color style', () => {
    const storeAfterIncrementStep = applicationSlice.reducer(initialState, incrementStep());

    expect(storeAfterIncrementStep).toEqual({
      ...initialState,
      stepper: {
        currentStep: Steps.PHONE_VERIFICATION,
      },
    });

    const { getByTestId } = render(<Stepper />, {
      preloadedState: {
        [applicationSlice.name]: storeAfterIncrementStep,
      },
    });

    expect(getByTestId('ItemTitle-1')).toHaveStyle({ color: colors().alt3 });
    expect(getByTestId('ItemText-1')).toHaveStyle({ color: colors().alt3 });
  });
});
