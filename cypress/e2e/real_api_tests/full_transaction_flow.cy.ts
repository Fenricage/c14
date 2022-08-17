describe('Full transaction flow', () => {
  it('success', () => {
    cy.visit('/?targetAddress=0xe86776a73F27E3b66Bcb66F7CdBB37E0401b1b82');
    cy.clickSubmitButton();
  });
});

export {};
