describe('Email confirmation step', () => {
  beforeEach(() => {
    cy.mockRest();
    cy.visitEmailConfirmationStep();
  });

  it('confirmation is shown when email not validated', () => {
    cy.checkStepTitle('Verify Your Email');
  });

  it('when modify email clicked goes to personal information', () => {
    cy.get('[data-testid="modify-email-button"]').click();
    cy.checkStepTitle('Personal Information');
  });

  it('when email is not verified stays on email confirmation', () => {
    cy.fixture('get_user-details.json').then((userDetails) => {
      userDetails.email_verified = false;
      cy.intercept('GET', '**/user-details', userDetails).as('mockedInterceptedUserDetails');
    });

    cy.checkStepTitle('Verify Your Email');
  });

  it('when email is verified and user has cards goes to payment details', () => {
    cy.fixture('get_user-details.json').then((userDetails) => {
      userDetails.email_verified = true;
      cy.intercept('GET', '**/user-details', userDetails).as('mockedInterceptedUserDetails');
    });

    cy.checkStepTitle('Review Your Order');
  });

  it('when email is verified but user has no cards goes to add card page', () => {
    cy.fixture('get_user-details.json').then((userDetails) => {
      userDetails.email_verified = true;
      cy.intercept('GET', '**/user-details', userDetails).as('mockedInterceptedUserDetails');
    });

    cy.fixture('get_cards.json').then((cards) => {
      cards.customer_cards = [];
      cy.intercept('GET', '**/cards', cards).as('mockedInterceptedCards');
    });

    cy.checkStepTitle('Add New Card');
  });
});

export {};
