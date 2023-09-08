/// <reference types='codeceptjs' />
type steps_file = typeof import('./steps_file');
type loginPage = typeof import('./pages/login');
type productsPage = typeof import('./pages/products');
type cartPage = typeof import('./pages/cart');
type checkoutPage = typeof import('./pages/checkout');
type itemViewPage = typeof import('./pages/itemView');
type headerPage = typeof import('./pages/header');

declare namespace CodeceptJS {
  interface SupportObject { I: I, current: any, loginPage: loginPage, productsPage: productsPage, cartPage: cartPage, checkoutPage: checkoutPage, itemViewPage: itemViewPage, headerPage: headerPage }
  interface Methods extends Playwright { }
  interface I extends ReturnType<steps_file> { }
  namespace Translation {
    interface Actions { }
  }
}
