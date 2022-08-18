describe('Document Verification', () => {
  beforeEach(() => {
    cy.mockRest();
  });

  it('document verification is shown when not started', () => {
    cy.mockedVisitDocumentVerificationStep();
    cy.get('[data-testid="modal-title"]').should('have.text', 'Verify Your Documents');
  });

  it('document verification redirects to personal information on success', () => {
    cy.mockedVisitDocumentVerificationStep('IN_PROGRESS');
    cy.get('[data-testid="document-verification-in-progress-title"]').should('have.text', 'We are processing your request. It should take no more than 10 minutes.');
    cy.fixture('get_user-details.json').then((userDetails) => {
      userDetails.document_verification_status = 'SUCCESS';
      userDetails.identity_verified = false;
      cy.intercept('GET', '**/user-details', { body: userDetails }).as('mockedUserDetails');
    });

    cy.checkStepTitle('Personal Information', 6000);
  });
});

export {};
