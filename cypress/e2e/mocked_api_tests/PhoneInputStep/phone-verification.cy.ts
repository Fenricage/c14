describe('Phone verification', () => {
  beforeEach(() => {
    cy.mockRest();
    cy.mockedVisitPhoneInputStep();
  });

  describe('validate number', () => {
    [{ country: 'United Kingdom +44', number: '7946491070', buttonResult: 'not.be.disabled' },
      { country: 'United Kingdom +44', number: '79464910701', buttonResult: 'be.disabled' },
      { country: 'United States +1', number: '2342355678', buttonResult: 'not.be.disabled' },
      { country: 'United States +1', number: '23423556781', buttonResult: 'be.disabled' },
    ]
      .forEach(({
        country, number, buttonResult,
      }) => {
        it(`${country}${number} should ${buttonResult}"]`, () => {
          cy.get('[data-testid="CountrySelect"]').select(country);
          cy.get('[data-testid="PhoneInput"]').type(number);
          cy.get('[data-testid="submitButton"]').should(buttonResult);
        });
      });
  });

  it('empty phone number required', () => {
    cy.get('[data-testid="CountrySelect"]').select('United Kingdom +44');
    cy.get('[data-testid="PhoneInput"]').type('1').clear().blur();
    cy.get('[data-testid="ErrorMessage-phone"]').should('be.visible');
    cy.get('[data-testid="submitButton"]').should('be.disabled');
  });
});

export {};
