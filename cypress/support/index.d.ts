declare namespace Cypress {
  interface Chainable<Subject = any> {

    mockRest(): Chainable<Element>;
    mockedVisitHome(): Chainable<Element>;
    mockedVisitPhoneInputStep(): Chainable<Element>;
    mockedVisitSmsConfirmationStep(): Chainable<Element>;
    mockedVisitDocumentVerificationStep(): Chainable<Element>;
    mockedVisitPersonalInformationStep(): Chainable<Element>;
    mockedVisitEmailConfirmationStep(): Chainable<Element>;
    mockedVisitAddCardStep(): Chainable<Element>;
    mockedVisitPaymentSelectStep(): Chainable<Element>;
    mockedVisitOrderReview(): Chainable<Element>;
    mockedVisitCompleteStep(): Chainable<Element>;
  }
}

declare namespace Cypress {
  interface Chainable<Subject = any> {
    spyRest(): Chainable<Element>;
    generateQuote(sourceAmount: number, targetCurrency: string): Chainable<Element>;
    login(countryCode: string, phoneNumber: string, verificationCode: string): Chainable<Element>;
    clickSubmitButton(): Chainable<Element>;
    clickConfirmTransaction(): Chainable<Element>;

    checkSubmitButtonState(buttonState: string): Chainable<Element>;
    checkStepTitle(title: string): Chainable<Element>;
    checkGeneralErrorHasText(text: string): Chainable<Element>;

  }
}
