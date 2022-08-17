/// <reference types="cypress" />

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

Cypress.Commands.add('login', () => {
  cy.get('[data-testid="CountrySelect"]').select('United Kingdom +44');
  cy.get('[data-testid="PhoneInput"]').type('4444444444');
  cy.clickSubmitButton();
  cy.get('[data-testid="code"]').type('111111');
  cy.clickSubmitButton();
});
