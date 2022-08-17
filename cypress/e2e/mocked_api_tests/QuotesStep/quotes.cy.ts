describe('Quote step tests', () => {
  beforeEach(() => {
    // cy.intercept('POST', '**/quotes').as('getQuotes');
    // cy.intercept('GET', '**/user-limits').as('getLimits');
    cy.mockRest();
    cy.mockedVisitHome();

    // cy.wait('@getQuotes');
    // cy.wait('@getLimits');
  });

  it('default quote values are loaded', () => {
    cy.get('[data-testid="quoteSourceAmount"]').should('have.value', 100.1);
    cy.get('[data-testid="quoteTargetAmount"]').should('have.value', 95.1);
  });

  describe('min/max limits respected', () => {
    [{ test_id: 'quoteSourceAmount', value: 19 }, { test_id: 'quoteSourceAmount', value: 20001 }].forEach(({ test_id, value }) => {
      it(`invalid limits ${value}`, () => {
        cy.get(`[data-testid="${test_id}"]`).clear().type(value.toString());
        cy.get('[data-testid="ErrorMessage-quoteSourceAmount"]').should('be.visible');
        cy.get('[data-testid="submitButton"]').should('be.disabled');
      });
    });
  });

  describe('decimal points', () => {
    [{ test_id: 'quoteSourceAmount', value: 20.25, buttonResult: 'not.be.disabled' },
      { test_id: 'quoteSourceAmount', value: 25.255, buttonResult: 'be.disabled' },
      { test_id: 'quoteTargetAmount', value: 26.25, buttonResult: 'not.be.disabled' },
      { test_id: 'quoteTargetAmount', value: 25.255, buttonResult: 'be.disabled' },
    ]
      .forEach(({
        test_id, value, buttonResult,
      }) => {
        it(`check decimal points ${value}`, () => {
          cy.fixture('post_quotes_success.json').then((quotes) => {
            quotes.source_amount = value.toString();
            quotes.target_amount = value.toString();
            cy.intercept('POST', '**/quotes', { body: quotes }).as('mockedPostQuotes');
          });

          cy.get(`[data-testid="${test_id}"]`).should('be.visible');
          cy.get(`[data-testid="${test_id}"]`).clear().type(value.toString());

          cy.get(`[data-testid="${test_id}"]`).should('have.value', value);
          cy.get('[data-testid="submitButton"]').should(buttonResult);
        });
      });
  });

  it('fees are correctly rendered', () => {
    cy.get('[data-testid="NetworkFee"]').contains('1.13 USD');
    cy.get('[data-testid="C14Fee"]').contains('2.83 USD');
    cy.get('[data-testid="TotalFee"]').contains('3.96 USD');
  });

  it('currency change request a new quote', () => {
    cy.intercept('POST', '**/quotes', cy.spy().as('spyGetQuotes'));
    cy.get('[data-testid="quoteTargetAmountCurrencySelect"]').click();
    cy.contains('USDC (on HARMONY)').click();
    cy.get('@spyGetQuotes').should('have.been.calledOnce');
  });

  it('submit click moves to the phone verification step', () => {
    cy.get('[data-testid="submitButton"]').click();
    cy.get('[data-testid="WidgetHeadTitle"]').should('have.text', 'Verify Your Phone Number');
  });
});

export {};
