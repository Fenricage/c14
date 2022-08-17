describe('Payment select step', () => {
  beforeEach(() => {
    cy.mockRest();
    cy.mockedVisitPaymentSelectStep();
  });

  it('card details are correctly rendered', () => {
    cy.get('[data-testid="CardPaymentMethod-src_mlbcjos2g5netluudgozasw56u"]').should('have.text', 'VISA');
    cy.get('[data-testid="CardPaymentMethod-src_mlbcjos2g5netluudgozasw56z"]').should('have.text', 'MasterCard');

    cy.get('[data-testid="CardLastNumbers-src_mlbcjos2g5netluudgozasw56u"]').should('have.text', '1234');
    cy.get('[data-testid="CardLastNumbers-src_mlbcjos2g5netluudgozasw56z"]').should('have.text', '7777');

    cy.get('[data-testid="CardExpiry-src_mlbcjos2g5netluudgozasw56u"]').should('have.text', '4/2025');
    cy.get('[data-testid="CardExpiry-src_mlbcjos2g5netluudgozasw56z"]').should('have.text', '7/2026');

    cy.get('[data-testid="CardRadioPoint-src_mlbcjos2g5netluudgozasw56u-isChecked-true"]');
    cy.get('[data-testid="CardRadioPoint-src_mlbcjos2g5netluudgozasw56z-isChecked-false"]');
  });

  it('on click card selects different card', () => {
    cy.get('[data-testid="CardRadioPoint-src_mlbcjos2g5netluudgozasw56u-isChecked-true"]').should('be.visible');
    cy.get('[data-testid="CardRadioPoint-src_mlbcjos2g5netluudgozasw56z-isChecked-false"]').should('be.visible');

    cy.get('[data-testid="CardRadioPoint-src_mlbcjos2g5netluudgozasw56z-isChecked-false"]').click();

    cy.get('[data-testid="CardRadioPoint-src_mlbcjos2g5netluudgozasw56u-isChecked-false"]').should('be.visible');
    cy.get('[data-testid="CardRadioPoint-src_mlbcjos2g5netluudgozasw56z-isChecked-true"]').should('be.visible');
  });

  it('on click different card select for order review', () => {
    cy.get('[data-testid="CardRadioPoint-src_mlbcjos2g5netluudgozasw56z-isChecked-false"]').click();
    cy.clickSubmitButton();
    cy.get('[data-testid="BadgeCardPaymentMethod"]').should('have.text', 'MasterCard');
    cy.get('[data-testid="BadgeCardLastNumbers"]').should('have.text', '7777');
  });

  it('on delete card has been removed', () => {
    cy.get('[data-testid="CardRadioPoint-src_mlbcjos2g5netluudgozasw56u-isChecked-true"]').should('be.visible');
    cy.get('[data-testid="CardRadioPoint-src_mlbcjos2g5netluudgozasw56z-isChecked-false"]').should('be.visible');

    cy.get('[data-testid="CardRadioFieldRemove-src_mlbcjos2g5netluudgozasw56u"]').click();

    cy.get('[data-testid="CardRadioPoint-src_mlbcjos2g5netluudgozasw56z-isChecked-true"]').should('be.visible');
    cy.get('[data-testid="CardPaymentMethod-src_mlbcjos2g5netluudgozasw56u"]').should('not.exist');
  });

  it('when last card has been deleted moves to add card step', () => {
    cy.get('[data-testid="CardRadioPoint-src_mlbcjos2g5netluudgozasw56u-isChecked-true"]').should('be.visible');
    cy.get('[data-testid="CardRadioPoint-src_mlbcjos2g5netluudgozasw56z-isChecked-false"]').should('be.visible');
    cy.get('[data-testid="CardRadioFieldRemove-src_mlbcjos2g5netluudgozasw56u"]').click();
    cy.get('[data-testid="CardRadioFieldRemove-src_mlbcjos2g5netluudgozasw56z"]').click();
    cy.checkStepTitle('Add New Card');
  });

  it('Add new cards goes to Add card step', () => {
    cy.get('[data-testid="AddNewCardButton"]').click();
    cy.checkStepTitle('Add New Card');
  });
});

export {};
