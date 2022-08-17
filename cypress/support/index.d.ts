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

    login(): Chainable<Element>;
    clickSubmitButton(): Chainable<Element>;
    clickConfirmTransaction(): Chainable<Element>;

    checkSubmitButtonState(buttonState: string): Chainable<Element>;
    checkStepTitle(title: string): Chainable<Element>;
    checkGeneralErrorHasText(text: string): Chainable<Element>;

  }
}
