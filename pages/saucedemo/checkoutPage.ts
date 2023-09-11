import { assert } from "console";
import { Locator } from "playwright";

const { I } = inject();

class CheckoutPagePage {
  firstName: string
  lastName: string
  postalCode: string
  continueBtn: string
  backToProductsBtn: string
  finishBtn: string
  completeHeader: string
  completeMessage: string
  completeTitle: string

  constructor() {
    //insert your locators
    // this.button = '#button'

    //#region fields
    this.firstName = `//input[@id='first-name']`
    this.lastName = `//input[@id='last-name']`
    this.postalCode = `//input[@id='postal-code']`
    //#endregion

    //#region buttons
    this.continueBtn = `//input[@id='continue']`
    this.finishBtn = `//button[@id='finish']`
    this.backToProductsBtn = `//*[@id='back-to-products']`
    //#endregion

    this.completeHeader = `//*[@class="complete-header"]`
    this.completeMessage = `//*[@class="complete-text"]`
    this.completeTitle = `//*[@class='title']`
  }
}
// For inheritance
module.exports = new CheckoutPagePage();
export = CheckoutPagePage;