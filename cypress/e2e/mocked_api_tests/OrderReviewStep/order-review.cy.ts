describe('Order review', () => {
  beforeEach(() => {
    cy.mockRest();
    cy.mockedVisitOrderReview();
  });

  it('Order review information correctly rendered', () => {
    cy.checkStepTitle('Review Your Order');

    cy.get('[data-testid="quoteSourceAmount"]').should('have.value', 100.1);
    cy.get('[data-testid="quoteTargetAmount"]').should('have.value', 95.1);

    cy.contains('USDC').should('have.text', 'USDC');

    cy.get('[data-testid="NetworkFee"]').contains('1.13 USD');
    cy.get('[data-testid="C14Fee"]').contains('2.83 USD');
    cy.get('[data-testid="TotalFee"]').contains('3.96 USD');

    cy.get('[data-testid="BadgeCardPaymentMethod"]').should('have.text', 'VISA');
    cy.get('[data-testid="BadgeCardLastNumbers"]').should('have.text', '1234');

    cy.get('[data-testid="BadgeCardOwner"]').should('have.text', 'Daniil Archipov, London, E16 1DE');

    cy.checkSubmitButtonState('be.enabled');
  });

  it('change card click goes to Payment Select Step', () => {
    cy.get('[data-testid="select-card"]').click();
    cy.checkStepTitle('Select or Add a Credit Card');
  });

  it('change personal information click goes to Personal Information', () => {
    cy.get('[data-testid="modify-personal-information"]').click();
    cy.checkStepTitle('Personal Information');
  });

  it('click on submit button opens confirmation modal and starts transaction', () => {
    cy.clickSubmitButton();
    cy.clickConfirmTransaction();
    cy.get('[data-testid="processing-transaction-title"]').should('have.text', 'We are Processing Your Payment');
  });
});

export {};
