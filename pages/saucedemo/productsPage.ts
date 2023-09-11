import { assert } from "console";
import { Locator } from "playwright";

const { I } = inject();

class ProductsPagePage {
  shoppingCart: string
  addToCartOrRemoveButtons: string
  addToCartButtons: string
  filterPicklist: string
  title: string
  productsNames: string
  constructor() {
    //insert your locators
    // this.button = '#button'

    //#region buttons
    this.shoppingCart = `//*[@class='shopping_cart_link']`;
    this.addToCartOrRemoveButtons = `//div[@class='pricebar']//button`;
    this.addToCartButtons = `//div[@class='pricebar']//button[contains(@id, 'add-to-cart')]`;
    //#endregion

    //#region picklists
    this.filterPicklist = `//select[@data-test='product_sort_container']`
    //#endregion

    //#region labels
    this.title = `//*[@class='title']`;
    this.productsNames = `//*[@id='inventory_container']//*[@class='inventory_item_name']`;
    //#endregion
  }
  // insert your methods here
  async getVisibleListOfProducts() {
    let productsList = I.grabTextFromAll(`//*[@id='inventory_container']//*[@class='inventory_item_name']`)
    return productsList;
  }
  async getVisibleListOfPrices() {
    let pricesList: any[] = await I.grabTextFromAll(`//*[@id='inventory_container']//*[@class='pricebar']//*[@class='inventory_item_price']`);
    for (let i = 0; i < await pricesList.length; i++) {
      pricesList[i] = await pricesList[i].replace('$', '');
      pricesList[i] = await Number(pricesList[i])
    }
    return await pricesList;
  }

  async validateSortingOrder(expectedListOrder: any[] = [], actualListOrder: any[] = []) {
    let success = false;
    try {
      for (let i = 0; i < expectedListOrder.length; i++) {
        assert(expectedListOrder[i] === actualListOrder[i])
        success = true;
      }
    } catch (error) {
      return success = false
    }
    return success;
  }

  async compareTwoLists(listA, listB) {
    let success = false;
    for (let i = 0; i < listA.length; i++) {
      try {
        assert(listA[i], listB[i]);
        success = true;
      } catch (error) {
        return success = false;
      }
    }
    return success;
  }

  /**
   * 
   * @param productName case sensitive name of product
   * @param nth number starting with 1 as first
   * @returns boolean: true if product is visible as nth on the products list page
   */
  async isProductNthByName(productName: string, nth: number) {
    let success = false;
    try {
      await I.seeElement(`(//*[@id='inventory_container']//*[@class='inventory_item_name'][text()='${productName}'])[${nth}]`)
      success = true;
    } catch (error) {
      success = false;
    }
    return success
  }

  async addAllProductsToCart() {
    //#region count products
    let numberOfItemsToAddToCart = await I.grabNumberOfVisibleElements(this.addToCartButtons)
    //#endregion

    //#region  add all items to cart
    for (let i = 0; i < await numberOfItemsToAddToCart; i++) {
      await I.click(`//div[@class='pricebar']//button[contains(@id, 'add-to-cart')]`);
    }
    //#endregion
    return numberOfItemsToAddToCart
  }

  async getNamesOfNItems(numberOfItems) {
    let itemName: string;
    let numberOfNamesRetrieved = 0;
    //#region count products
    let numberOfItemsToAddToCart = await I.grabNumberOfVisibleElements(this.addToCartButtons)
    //#endregion
    let itemsInCartList: string[] = [];

    //#region get names of added items
    for (let i = 1; i < numberOfItemsToAddToCart + 1; i++) {
      I.seeElement(`(//div[@class='inventory_item_name'])[${i}]`);
      itemName = await I?.grabTextFrom(`(//div[@class='inventory_item_name'])[${i}]`);
      numberOfNamesRetrieved++;
      itemsInCartList.push(await itemName);
    }
    //#endregion
    return itemsInCartList
  }
}

// For inheritance
module.exports = new ProductsPagePage();
export = ProductsPagePage;
