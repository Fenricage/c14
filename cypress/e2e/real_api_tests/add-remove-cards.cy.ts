import { PHONE_VERIFICATION_CODE, USER1_COUNTRY_CODE, USER1_PHONE_NUMBER } from './constants';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'cypress-iframe';

describe('Add/Remove card (Real E2E test)', () => {
  beforeEach(() => {
    cy.spyRest();
    cy.visit('/?targetAddress=0xe86776a73F27E3b66Bcb66F7CdBB37E0401b1b82');
  });

  it('success', () => {
    cy.clickSubmitButton();
    cy.login(USER1_COUNTRY_CODE, USER1_PHONE_NUMBER, PHONE_VERIFICATION_CODE);
    cy.get('[data-testid="select-card"]').click();
    cy.get('[data-testid="AddNewCardButton"]').click();

    cy.enter('#cardNumber').then((getBody) => {
      getBody().find('#checkout-frames-card-number')
        .should('be.visible')
        .click()
        .type('4242424242424242');
    });
    cy.checkSubmitButtonState('be.disabled');

    cy.enter('#expiryDate').then((getBody) => {
      getBody().find('#checkout-frames-expiry-date')
        .should('be.visible')
        .click()
        .type('1232');
    });
    cy.checkSubmitButtonState('be.disabled');

    cy.enter('#cvv').then((getBody) => {
      getBody().find('#checkout-frames-cvv')
        .should('be.visible')
        .click()
        .type('123');
    });

    cy.intercept('POST', '**/cards', cy.spy()).as('spyPostCards');

    cy.clickSubmitButton();

    cy.wait('@spyPostCards').then((interception) => {
      expect(interception.response.statusCode).to.eq(201);

      cy.intercept('DELETE', '**/cards/**', cy.spy()).as('spyDeleteCards');
      cy.get(`[data-testid="CardRadioFieldRemove-${interception.response.body.card_id}"]`).click();
      cy.wait('@spyDeleteCards').then((interception2) => {
        expect(interception2.response.statusCode).to.eq(200);
        cy.get(`[data-testid="CardRadioFieldLabel-${interception.response.body.card_id}"]`).should('not.exist');
      });
    });
  });
});

export {};
