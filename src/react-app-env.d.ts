/// <reference types="react-scripts" />

type Trulioo = {
  publicKey: string,
  accessTokenURL: any,
  handleResponse: any,
  onInitialRenderComplete: any,
}

interface TruliooConstructor {
  new (Trulioo): Trulioo;
}

declare global {
  interface Window {
    TruliooClient: TruliooConstructor
  }
}

export {};
