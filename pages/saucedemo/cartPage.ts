import { assert } from "console";
import { Locator } from "playwright";

const { I } = inject();

class CartPagePage {
  checkoutBtn: string
  itemNames: string

  constructor() {
    //insert your locators
    // this.button = '#button'

    //#region buttons
    this.checkoutBtn = `//button[@id='checkout']`
    //#endregion

    //#region labels
    this.itemNames = `//div[@class='inventory_item_name']`
    //#endregion
  }
  async removeNthItemFromCart(nth: number) {
    await I.click(`(//div[@class='inventory_item_name'])[${nth}]/../following-sibling::div[@class='item_pricebar']//button`)
  }

  async getPriceOfItemInCartByName(itemName: string) {
    return Number((await I.grabTextFrom(`//div[@class='inventory_item_name'][text()='${itemName}']/../following-sibling::div[@class='item_pricebar']/*[@class='inventory_item_price']`)).replace('$', ''));
  }
  async getItemsTotalValue() {
    return (Number((await I.grabTextFrom(`//*[@class='summary_subtotal_label']`)).replace('Item total: $', '')))
  }
  async getTaxValue() {
    return Number((await I.grabTextFrom(`//*[@class='summary_tax_label']`)).replace('Tax: $', ''));
  }
  async getItemsTotalWithTaxValue() {
    return Number((await I.grabTextFrom(`//*[contains(@class,'summary_total_label')][contains(text(),'Total:')]`)).replace('Total: $', ''));
  }
  async validateItemsNamesInCart(initialListOfItems: string[] = [], nthItemToBeRemoved: number = -1) {
    let success = false;
    let itemsInCartList = initialListOfItems;
    let itemsListWithoutNth = initialListOfItems;
    try {
      //#region make sure cart has correct items
      if (nthItemToBeRemoved >= 0) {
        itemsListWithoutNth = await itemsInCartList.splice(nthItemToBeRemoved, 1);
      }
      for (let i = 0; i < await itemsListWithoutNth.length; i++) {
        const element = await itemsListWithoutNth[i];
        await I.seeElement(`//div[@class='inventory_item_name'][text()='${await element}']/../following-sibling::div[@class='item_pricebar']//button`)
      }
      //#endregion
      success = true;
    } catch (error) {
      return success = false;
    }
    return success
  }
  async getExpectedCartValueFromItems(initialListOfItems: string[] = [], nthItemToBeRemoved: number = -1) {
    let itemsInCartList = initialListOfItems;
    let itemsListWithoutNth = initialListOfItems;
    let expectedCartTotalValue: number = 0;
    //#region make sure cart has correct items
    if (nthItemToBeRemoved >= 0) {
      itemsInCartList.splice(nthItemToBeRemoved - 1, 1);
    }
    for (let i = 0; i < itemsInCartList.length; i++) {
      const element = itemsInCartList[i];
      expectedCartTotalValue = expectedCartTotalValue + await this.getPriceOfItemInCartByName(element)
    }
    //#endregion
    return expectedCartTotalValue
  }
}
// For inheritance
module.exports = new CartPagePage();
export = CartPagePage;