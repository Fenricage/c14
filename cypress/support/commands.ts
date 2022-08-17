/// <reference types="cypress" />

Cypress.Commands.add('spyRest', () => {
  cy.intercept('POST', '**/quotes', cy.spy()).as('spyPostQuotes');
  cy.intercept('GET', '**/user-limits', cy.spy()).as('spyGetLimits');
  cy.intercept('POST', '**/send-verification-email', cy.spy().as('spySendVerificationEmail'));
});

Cypress.Commands.add('clickSubmitButton', () => {
  cy.get('[data-testid="submitButton"]').should('be.enabled');
  cy.get('[data-testid="submitButton"]').click();
});

Cypress.Commands.add('clickConfirmTransaction', () => {
  cy.get('[data-testid="terms-free-will-checkbox"]').should('not.be.checked').click();
  cy.get('[data-testid="confirm-transaction"]').should('not.be.enabled');
  cy.get('[data-testid="terms-no-broker"]').should('not.be.checked').click();
  cy.get('[data-testid="confirm-transaction"]').should('not.be.enabled');
  cy.get('[data-testid="terms-agree-service"]').should('not.be.checked').click();
  cy.get('[data-testid="confirm-transaction"]').should('be.enabled');
  cy.get('[data-testid="confirm-transaction"]').click();
});

Cypress.Commands.add('generateQuote', (sourceAmount: number, targetCurrency: string) => {
  cy.get('[data-testid="quoteSourceAmount"]').clear().type(sourceAmount.toString());

  cy.intercept('POST', '**/quotes', cy.spy().as('spyGetQuotes'));
  cy.get('[data-testid="quoteTargetAmountCurrencySelect"]').click();
  cy.contains(targetCurrency).click();
  cy.get('@spyGetQuotes').should('have.been.calledOnce');
});

Cypress.Commands.add('login', (countryCode: string, phoneNumber: string, verificationCode: string) => {
  cy.get('[data-testid="CountrySelect"]').select(countryCode);
  cy.get('[data-testid="PhoneInput"]').type(phoneNumber);
  cy.clickSubmitButton();
  cy.get('[data-testid="code"]').type(verificationCode);
  cy.clickSubmitButton();
});
