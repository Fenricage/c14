/// <reference types="cypress" />

Cypress.Commands.add('visitHome', () => {
  cy.visit('/?targetAddress=0xe86776a73F27E3b66Bcb66F7CdBB37E0401b1b82');
  cy.wait('@mockedQuotes');
  cy.wait('@mockedUserLimits');
});

Cypress.Commands.add('clickSubmitButton', () => {
  cy.get('[data-testid="submitButton"]').click();
});

Cypress.Commands.add('login', () => {
  cy.get('[data-testid="CountrySelect"]').select('United Kingdom +44');
  cy.get('[data-testid="PhoneInput"]').type('4444444444');
  cy.clickSubmitButton();
  cy.get('[data-testid="code"]').type('111111');
  cy.clickSubmitButton();
});

Cypress.Commands.add('mockRest', () => {
  cy.intercept('POST', '**/quotes', { fixture: 'post_quotes_success.json' }).as('mockedQuotes');
  cy.intercept('POST', '**/login', { fixture: 'post_login_success.json' }).as('mockedLogin');
  cy.intercept('GET', '**/user-details', { fixture: 'get_user-details.json' }).as('mockedUserDetails');
  cy.intercept('PUT', '**/user-details', { fixture: 'put_user-details.json' }).as('mockedPutUserDetails');
  cy.intercept('GET', '**/cards', { fixture: 'get_cards.json' }).as('mockedCards');
  cy.intercept('POST', '**/cards', { fixture: 'post_cards.json' }).as('mockedPostCards');
  cy.intercept('DELETE', '**/cards').as('mockedDeleteCards');
  cy.intercept('GET', '**/user-limits', { fixture: 'get_user-limits.json' }).as('mockedUserLimits');
  cy.intercept('POST', '**/send-verification-email', cy.spy().as('spySendVerificationEmail'));
});

Cypress.Commands.add('visitPhoneInputStep', () => {
  cy.visitHome();
  cy.clickSubmitButton();
});

Cypress.Commands.add('visitSmsConfirmationStep', () => {
  cy.visitPhoneInputStep();
  cy.get('[data-testid="CountrySelect"]').select('United Kingdom +44');
  cy.get('[data-testid="PhoneInput"]').type('7444444444');
  cy.clickSubmitButton();
});

Cypress.Commands.add('visitDocumentVerificationStep', () => {
  cy.visitSmsConfirmationStep();
  cy.get('[data-testid="code"]').type('111111');
  cy.fixture('get_user-details.json').then((userDetails) => {
    userDetails.document_verification_status = 'NOT_STARTED';
    cy.intercept('GET', '**/user-details', { body: userDetails }).as('mockedUserDetails');
    cy.clickSubmitButton();
  });
});

Cypress.Commands.add('visitPersonalInformationStep', () => {
  cy.visitSmsConfirmationStep();
  cy.get('[data-testid="code"]').type('111111');
  cy.fixture('get_user-details.json').then((userDetails) => {
    userDetails.identity_verified = false;
    cy.intercept('GET', '**/user-details', { body: userDetails }).as('mockedUserDetails');
    cy.clickSubmitButton();
  });
});

Cypress.Commands.add('visitEmailConfirmationStep', () => {
  cy.visitSmsConfirmationStep();
  cy.get('[data-testid="code"]').type('111111');
  cy.fixture('get_user-details.json').then((userDetails) => {
    userDetails.email_verified = false;
    cy.intercept('GET', '**/user-details', { body: userDetails }).as('mockedUserDetails');
    cy.clickSubmitButton();
  });
});

Cypress.Commands.add('visitAddCardStep', () => {
  cy.fixture('get_cards.json').then((cards) => {
    cards.customer_cards = [];
    cy.intercept('GET', '**/cards', cards).as('mockedInterceptedCards');
  });

  cy.visitSmsConfirmationStep();
  cy.get('[data-testid="code"]').type('111111');
  cy.clickSubmitButton();
});

Cypress.Commands.add('checkSubmitButtonState', (buttonState:string) => {
  cy.get('[data-testid="submitButton"]').should(buttonState);
});

Cypress.Commands.add('checkStepTitle', (title:string) => {
  cy.get('[data-testid="WidgetHeadTitle"]').should('have.text', title);
});

Cypress.Commands.add('checkGeneralErrorHasText', (text:string) => {
  cy.get('[data-testid="alert-text"]').should('have.text', text);
});

/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

export { };
