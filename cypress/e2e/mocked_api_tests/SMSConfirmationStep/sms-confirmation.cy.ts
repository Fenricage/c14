describe('SMS confirmation step', () => {
  beforeEach(() => {
    cy.mockRest();
    cy.mockedVisitSmsConfirmationStep();
  });

  it('invalid code submit disabled', () => {
    cy.get('[data-testid="code"]').type('11111');
    cy.checkSubmitButtonState('be.disabled');
    cy.get('[data-testid="code"]').clear().type('1111111');
    cy.checkSubmitButtonState('be.disabled');

    cy.get('[data-testid="code"]').blur();
    cy.get('[data-testid="ErrorMessage-code"]').should('be.visible');
  });

  it('valid code submit enabled', () => {
    cy.get('[data-testid="code"]').type('000000');
    cy.checkSubmitButtonState('not.be.disabled');
    cy.get('[data-testid="code"]').blur();
    cy.get('[data-testid="ErrorMessage-code"]').should('not.exist');
  });

  it('login existing user success', () => {
    cy.get('[data-testid="code"]').type('666666');
    cy.clickSubmitButton();
    cy.get('[data-testid="WidgetHeadTitle"]').should('have.text', 'Review Your Order');
  });
});

export {};
