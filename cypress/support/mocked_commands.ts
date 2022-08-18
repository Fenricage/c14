/// <reference types="cypress" />

Cypress.Commands.add('mockRest', () => {
  cy.intercept('POST', '**/quotes', { fixture: 'post_quotes_success.json' }).as('mockedQuotes');
  cy.intercept('POST', '**/login', { fixture: 'post_login_success.json' }).as('mockedLogin');
  cy.intercept('GET', '**/user-details', { fixture: 'get_user-details.json' }).as('mockedUserDetails');
  cy.intercept('PUT', '**/user-details', { fixture: 'put_user-details.json' }).as('mockedPutUserDetails');
  cy.intercept('GET', '**/cards', { fixture: 'get_cards.json' }).as('mockedCards');
  cy.intercept('POST', '**/cards', { fixture: 'post_cards.json' }).as('mockedPostCards');
  cy.intercept('DELETE', '**/cards/**', {}).as('mockedDeleteCards');
  cy.intercept('GET', '**/user-limits', { fixture: 'get_user-limits.json' }).as('mockedUserLimits');
  cy.intercept('POST', '**/send-verification-email', cy.spy().as('spySendVerificationEmail'));
  cy.intercept('POST', '**/purchases', { fixture: 'post_purchases.json' }).as('mockedPostPurchases');
  cy.intercept('GET', '**/purchases/3fa85f64-5717-4562-b3fc-2c963f66afa6', { fixture: 'get_purchases.json' }).as('mockedGetPurchases');
});

Cypress.Commands.add('mockedVisitHome', () => {
  cy.visit('/?targetAddress=0xe86776a73F27E3b66Bcb66F7CdBB37E0401b1b82');
  cy.wait('@mockedQuotes');
  cy.wait('@mockedUserLimits');
});

Cypress.Commands.add('mockedVisitPhoneInputStep', () => {
  cy.mockedVisitHome();
  cy.clickSubmitButton();
});

Cypress.Commands.add('mockedVisitSmsConfirmationStep', () => {
  cy.mockedVisitPhoneInputStep();
  cy.get('[data-testid="CountrySelect"]').select('United Kingdom +44');
  cy.get('[data-testid="PhoneInput"]').type('7444444444');
  cy.clickSubmitButton();
});

Cypress.Commands.add(
  'mockedVisitDocumentVerificationStep',
  (document_verification_status = 'NOT_STARTED') => {
    cy.mockedVisitSmsConfirmationStep();
    cy.get('[data-testid="code"]').type('111111');
    cy.fixture('get_user-details.json').then((userDetails) => {
      userDetails.document_verification_status = document_verification_status;
      cy.intercept('GET', '**/user-details', { body: userDetails }).as('mockedUserDetails');
      cy.clickSubmitButton();
    });
  },
);

Cypress.Commands.add('mockedVisitPersonalInformationStep', () => {
  cy.mockedVisitSmsConfirmationStep();
  cy.get('[data-testid="code"]').type('111111');
  cy.fixture('get_user-details.json').then((userDetails) => {
    userDetails.identity_verified = false;
    cy.intercept('GET', '**/user-details', { body: userDetails }).as('mockedUserDetails');
    cy.clickSubmitButton();
  });
});

Cypress.Commands.add('mockedVisitEmailConfirmationStep', () => {
  cy.mockedVisitSmsConfirmationStep();
  cy.get('[data-testid="code"]').type('111111');
  cy.fixture('get_user-details.json').then((userDetails) => {
    userDetails.email_verified = false;
    cy.intercept('GET', '**/user-details', { body: userDetails }).as('mockedUserDetails');
    cy.clickSubmitButton();
  });
});

Cypress.Commands.add('mockedVisitAddCardStep', () => {
  cy.fixture('get_cards.json').then((cards) => {
    cards.customer_cards = [];
    cy.intercept('GET', '**/cards', cards).as('mockedInterceptedCards');
  });

  cy.mockedVisitSmsConfirmationStep();
  cy.get('[data-testid="code"]').type('111111');
  cy.clickSubmitButton();
});

Cypress.Commands.add('mockedVisitOrderReview', () => {
  cy.mockedVisitSmsConfirmationStep();
  cy.get('[data-testid="code"]').type('111111');
  cy.clickSubmitButton();
});

Cypress.Commands.add('mockedVisitPaymentSelectStep', () => {
  cy.mockedVisitOrderReview();
  cy.get('[data-testid="select-card"]').click();
});

Cypress.Commands.add('mockedVisitCompleteStep', () => {
  cy.mockedVisitOrderReview();
  cy.clickSubmitButton();
  cy.clickConfirmTransaction();
});

Cypress.Commands.add('checkSubmitButtonState', (buttonState:string) => {
  cy.get('[data-testid="submitButton"]').should(buttonState);
});

Cypress.Commands.add('checkStepTitle', (title:string, timeout = 4000) => {
  cy.get('[data-testid="WidgetHeadTitle"]', { timeout }).should('have.text', title);
});

Cypress.Commands.add('checkGeneralErrorHasText', (text:string) => {
  cy.get('[data-testid="alert-text"]').should('have.text', text);
});

export { };
