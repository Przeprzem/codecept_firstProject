const { I } = inject();

class ItemViewPage {
  addItemToCart: string
  constructor() {
    this.addItemToCart = `//button[contains(@id, 'add-to-cart')]`
  }
}

// For inheritance
module.exports = new ItemViewPage();
export = ItemViewPage;
