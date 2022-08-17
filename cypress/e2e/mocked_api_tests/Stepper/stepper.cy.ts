describe('Stepper', () => {
  beforeEach(() => {
    cy.mockRest();
  });

  it('stepper at home', () => {
    cy.mockedVisitHome();
    cy.get('[data-testid="ItemTitle-Select Amount-Active-true"]').should('be.visible');
    cy.get('[data-testid="ItemTitle-Verify Your Phone Number-Active-false"]').should('be.visible');
  });

  it('stepper at phone verification step', () => {
    cy.mockedVisitPhoneInputStep();
    cy.get('[data-testid="ItemTitle-Select Amount-Active-true"]').should('be.visible');
    cy.get('[data-testid="ItemTitle-Verify Your Phone Number-Active-true"]').should('be.visible');
    cy.get('[data-testid="ItemTitle-Personal Information-Active-false"]').should('be.visible');
  });

  it('stepper at phone verification step', () => {
    cy.mockedVisitPhoneInputStep();
    cy.get('[data-testid="ItemTitle-Select Amount-Active-true"]').should('be.visible');
    cy.get('[data-testid="ItemTitle-Verify Your Phone Number-Active-true"]').should('be.visible');
    cy.get('[data-testid="ItemTitle-Personal Information-Active-false"]').should('be.visible');
  });

  it('stepper at sms confirmation step', () => {
    cy.mockedVisitSmsConfirmationStep();
    cy.get('[data-testid="ItemTitle-Select Amount-Active-true"]').should('be.visible');
    cy.get('[data-testid="ItemTitle-Verify Your Phone Number-Active-true"]').should('be.visible');
    cy.get('[data-testid="ItemTitle-Personal Information-Active-false"]').should('be.visible');
  });

  it('stepper at sms confirmation step', () => {
    cy.mockedVisitPersonalInformationStep();
    cy.get('[data-testid="ItemTitle-Select Amount-Active-true"]').should('be.visible');
    cy.get('[data-testid="ItemTitle-Verify Your Phone Number-Active-true"]').should('be.visible');
    cy.get('[data-testid="ItemTitle-Personal Information-Active-true"]').should('be.visible');
    cy.get('[data-testid="ItemTitle-Payment Details-Active-false"]').should('be.visible');
  });

  it('stepper at add card step', () => {
    cy.mockedVisitAddCardStep();
    cy.get('[data-testid="ItemTitle-Select Amount-Active-true"]').should('be.visible');
    cy.get('[data-testid="ItemTitle-Verify Your Phone Number-Active-true"]').should('be.visible');
    cy.get('[data-testid="ItemTitle-Personal Information-Active-true"]').should('be.visible');
    cy.get('[data-testid="ItemTitle-Payment Details-Active-true"]').should('be.visible');
    cy.get('[data-testid="ItemTitle-Order Review-Active-false"]').should('be.visible');
  });

  it('stepper at select payment step', () => {
    cy.mockedVisitPaymentSelectStep();
    cy.get('[data-testid="ItemTitle-Select Amount-Active-true"]').should('be.visible');
    cy.get('[data-testid="ItemTitle-Verify Your Phone Number-Active-true"]').should('be.visible');
    cy.get('[data-testid="ItemTitle-Personal Information-Active-true"]').should('be.visible');
    cy.get('[data-testid="ItemTitle-Payment Details-Active-true"]').should('be.visible');
    cy.get('[data-testid="ItemTitle-Order Review-Active-false"]').should('be.visible');
  });

  it('stepper at order review step', () => {
    cy.mockedVisitOrderReview();
    cy.get('[data-testid="ItemTitle-Select Amount-Active-true"]').should('be.visible');
    cy.get('[data-testid="ItemTitle-Verify Your Phone Number-Active-true"]').should('be.visible');
    cy.get('[data-testid="ItemTitle-Personal Information-Active-true"]').should('be.visible');
    cy.get('[data-testid="ItemTitle-Payment Details-Active-true"]').should('be.visible');
    cy.get('[data-testid="ItemTitle-Order Review-Active-true"]').should('be.visible');
  });
});

export {};
