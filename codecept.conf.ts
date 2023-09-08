import {
  setHeadlessWhen,
  setCommonPlugins
} from '@codeceptjs/configure';
// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

export const config: CodeceptJS.MainConfig = {
  tests: './*_test.ts',
  output: './output',
  helpers: {
    Playwright: {
      browser: 'chromium',
      url: 'https://www.saucedemo.com/',
      show: true
    }
  },
  include: {
    I: './steps_file',
    loginPage: "./pages/login.ts",
    productsPage: "./pages/products.ts",
    cartPage: "./pages/cart.ts",
    checkoutPage: "./pages/checkout.ts",
    itemViewPage: "./pages/itemView.ts",
    headerPage: "./pages/headerPage.ts",
  },
  name: 'codeceptJS'
}