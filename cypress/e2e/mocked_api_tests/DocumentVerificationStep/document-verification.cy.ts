describe('Document Verification', () => {
  beforeEach(() => {
    cy.mockRest();
    cy.mockedVisitDocumentVerificationStep();
  });

  it('document verification is shown when not started', () => {
    cy.get('[data-testid="modal-title"]').should('have.text', 'Verify Your Documents');
  });
});

export {};