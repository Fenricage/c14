describe('Complete Step', () => {
  beforeEach(() => {
    cy.mockRest();
    cy.mockedVisitCompleteStep();
  });

  ['PENDING', 'CUSTOMER_CHARGED'].forEach((status) => {
    it('purchase in progress', () => {
      cy.fixture('get_purchases.json').then((purchase) => {
        purchase.status = status;
        cy.intercept('GET', '**/purchases/3fa85f64-5717-4562-b3fc-2c963f66afa6', { body: purchase }).as('mockedGetPurchase');
        cy.get('[data-testid="processing-transaction-title"]').should('have.text', 'We are Processing Your Payment');
      });
    });
  });

  ['BLOCKCHAIN_TRANSFER_PENDING', 'BLOCKCHAIN_TRANSFER_COMPLETE'].forEach((status) => {
    it('purchase completed', () => {
      cy.fixture('get_purchases.json').then((purchase) => {
        purchase.status = status;
        cy.intercept('GET', '**/purchases/3fa85f64-5717-4562-b3fc-2c963f66afa6', { body: purchase }).as('mockedGetPurchase');
        cy.get('[data-testid="purchase-completed"]').should('have.text', 'Purchase Completed');
      });
    });
  });

  it('purchase failed', () => {
    cy.fixture('get_purchases.json').then((purchase) => {
      purchase.status = 'CUSTOMER_CHARGE_DECLINED';
      cy.intercept('GET', '**/purchases/3fa85f64-5717-4562-b3fc-2c963f66afa6', { body: purchase }).as('mockedGetPurchase');
      cy.get('[data-testid="purchase-failed"]').should('have.text', 'Purchase Failed');
    });
  });
});

export {};
