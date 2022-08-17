import { PHONE_VERIFICATION_CODE, USER1_COUNTRY_CODE, USER1_PHONE_NUMBER } from './constants';

describe('Full transaction flow (Real E2E test)', () => {
  beforeEach(() => {
    cy.spyRest();
    cy.visit('/?targetAddress=0xe86776a73F27E3b66Bcb66F7CdBB37E0401b1b82');
    cy.wait('@spyPostQuotes');
    cy.wait('@spyGetLimits');
  });

  it('success', () => {
    cy.generateQuote(25, 'USDC (on HARMONY)');
    cy.clickSubmitButton();
    cy.login(USER1_COUNTRY_CODE, USER1_PHONE_NUMBER, PHONE_VERIFICATION_CODE);
    cy.clickSubmitButton();
    cy.clickConfirmTransaction();
    cy.get('[data-testid="purchase-completed"]', { timeout: 180000 }).should('have.text', 'Purchase Completed');
  });
});

export {};
