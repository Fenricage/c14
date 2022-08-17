import { PHONE_VERIFICATION_CODE, USER1_COUNTRY_CODE, USER1_PHONE_NUMBER } from './constants';

describe('Update personal information (Real E2E test)', () => {
  beforeEach(() => {
    cy.spyRest();
    cy.visit('/?targetAddress=0xe86776a73F27E3b66Bcb66F7CdBB37E0401b1b82');
  });

  it('success', () => {
    cy.clickSubmitButton();
    cy.login(USER1_COUNTRY_CODE, USER1_PHONE_NUMBER, PHONE_VERIFICATION_CODE);
    cy.get('[data-testid="modify-personal-information"]').click();

    const randomStr = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
    cy.get('[data-testid="building"]').clear().type(randomStr);
    cy.get('[data-testid="unitNumber"]').clear().type(randomStr);
    cy.get('[data-testid="city"]').clear().type(randomStr);
    cy.get('[data-testid="streetName"]').clear().type(randomStr);

    cy.intercept('PUT', '**/user-details', cy.spy().as('spyPutUserDetailsCall')).as('spyPutUserDetails');
    cy.clickSubmitButton();

    cy.get('@spyPutUserDetailsCall').should('have.been.calledOnce', {
      city: randomStr,
      email: 'daniil+312@bitlabs.team',
      building: randomStr,
      postal_code: '000000',
      state_code: 'Colorado',
      street_name: randomStr,
      unit_number: randomStr,
    });

    cy.wait('@spyPutUserDetails').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });
  });
});

export {};
