const { I } = inject();

class HeaderPagePage {
  shoppingCart: string
  title: string
  constructor() {
    //insert your locators
    // this.button = '#button'
    //#region buttons
    this.shoppingCart = `//*[@class='shopping_cart_link']`
    //#endregion
    //#region labels
    this.title = `//*[@class='title']`
    //#endregion
  }
  // insert your methods here
}

// For inheritance
module.exports = new HeaderPagePage();
export = HeaderPagePage;