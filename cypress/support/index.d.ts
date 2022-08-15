/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {


    visitHome(): Chainable<Element>;
    visitPhoneInputStep(): Chainable<Element>;
    visitSmsConfirmationStep(): Chainable<Element>;
    visitDocumentVerificationStep(): Chainable<Element>;
    visitPersonalInformationStep(): Chainable<Element>;
    visitEmailConfirmationStep(): Chainable<Element>;
    visitAddCardStep(): Chainable<Element>;

    login(): Chainable<Element>;


    mockRest(): Chainable<Element>;

    clickSubmitButton(): Chainable<Element>;

    checkSubmitButtonState(buttonState: string): Chainable<Element>;
    checkStepTitle(title: string): Chainable<Element>;
    checkGeneralErrorHasText(text: string): Chainable<Element>;

  }
}
