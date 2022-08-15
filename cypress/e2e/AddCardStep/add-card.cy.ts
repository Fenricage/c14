// eslint-disable-next-line import/no-extraneous-dependencies
import 'cypress-iframe';

describe('Add New Card', () => {
  beforeEach(() => {
    cy.mockRest();
    cy.visitAddCardStep();
  });

  it('Submit button enabled only when all fields are populated correctly', () => {
    cy.checkSubmitButtonState('be.disabled');
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
    cy.checkSubmitButtonState('not.be.disabled');
    cy.intercept('GET', '**/cards', { fixture: 'get_cards.json' }).as('mockedCards');
    cy.clickSubmitButton();
  });
});

export {};
