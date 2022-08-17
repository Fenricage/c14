describe('Personal information', () => {
  beforeEach(() => {
    cy.mockRest();
    cy.mockedVisitPersonalInformationStep();
  });

  describe('Personal information fields pre-filled and required', () => {
    [
      { test_id: 'firstNames', value: 'Daniil', buttonState: 'not.be.disabled' },
      { test_id: 'lastNames', value: 'Archipov', buttonState: 'not.be.disabled' },
      { test_id: 'dob', value: '1989-03-11', buttonState: 'not.be.disabled' },
      { test_id: 'email', value: 'daniil+232@bitlabs.team', buttonState: 'be.disabled' },
      { test_id: 'building', value: '1', buttonState: 'be.disabled' },
      { test_id: 'unitNumber', value: '6', buttonState: 'not.be.disabled' },
      { test_id: 'streetName', value: 'Stambourne house', buttonState: 'be.disabled' },
      { test_id: 'city', value: 'London', buttonState: 'be.disabled' },
      { test_id: 'postalCode', value: 'E16 1DE', buttonState: 'be.disabled' },
    ].forEach(({ test_id, value, buttonState}) => {
      it(`${test_id} ${value}`, () => {
        cy.checkStepTitle('Personal Information');
        cy.get(`[data-testid="${test_id}"]`).should('have.value', value);
        if (!(['firstNames', 'lastNames', 'dob', 'state', 'country'].includes(test_id))) {
          cy.get(`[data-testid="${test_id}"]`)
            .clear()
            .blur();
        }
        cy.checkSubmitButtonState(buttonState);
      });
    });
  });

  // it('identity verified goes to next step when submit clicked', () => {
  //   cy.clickSubmitButton();
  // });

  it('identity not verified results in general error message', () => {
    cy.fixture('put_user-details.json').then((result) => {
      result.identity_verified = false;
      cy.intercept('PUT', '**/user-details', { body: result }).as('mockedUserDetails');
      cy.clickSubmitButton();
      cy.checkGeneralErrorHasText('Unable to verify your identity. Please check that provided details are correct.');
      cy.checkStepTitle('Personal Information');
    });
  });

  it('email already in use results in general error message', () => {
    cy.intercept('PUT', '**/user-details', {
      statusCode: 422,
      body: { error_code: 'EMAIL_ALREADY_REGISTERED' },
    });
    cy.clickSubmitButton();
    cy.checkGeneralErrorHasText('Email already registered');
    cy.checkStepTitle('Personal Information');
  });
});

export {};
