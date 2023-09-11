import assert, { fail } from "assert";
import { UserNames } from './enums/users.dicts'
import { FilterProductsBy } from './enums/picklistsOptions.dicts'
import ProductsPagePage from "./pages/saucedemo/productsPage";
import HeaderPagePage from "./pages/saucedemo/headerPage";
import axios, { AxiosResponse } from 'axios';
import CheckoutPagePage from "./pages/saucedemo/checkoutPage";
import CartPagePage from "./pages/saucedemo/cartPage";
import LoginPagePage from "./pages/saucedemo/loginPage";
import ItemViewPage from "./pages/saucedemo/itemViewPage";
import Tools from "./tools/tools";
import { SortType } from "./enums/tools.dicts";
import moment from 'moment'

Feature('saucedemo_n_reqres');

//#region UI tests
Scenario('Validation1_1', async ({ I }) => {
    //TEST PASSED

    // Validation 1:
    // 1.	Log in as a`standard user`
    // 2.	Add all item to the cart
    // 3.	Go to the cart
    // 4.	Find third item by name, then remove it from the cart
    // 5.	Validate in the Checkout Overview that:
    // 5.1.It only contains the items that you want to purchase
    // 5.2.The Item Total is right
    // 6.	Finish the purchase
    // 7.	Validate that the website confirms the order

    let numberOfItemsToAddToCart;
    let itemName: string;
    let itemsInCartList: string[] = [];
    let numberOfItemsInCart = 0;
    let expectedCartTotalValue: number = 0;
    let itemsTotalValue = 0;
    let loginPagePage = new LoginPagePage();
    let productsPagePage = new ProductsPagePage();
    let cartPagePage = new CartPagePage();
    let checkoutPagePage = new CheckoutPagePage();
    let initialItemsInCartList: string[] = []

    await loginPagePage.loginAs(UserNames.standard_user)
    await I.see('Products', productsPagePage.title)
    await I.seeElement(productsPagePage.shoppingCart)
    await I.seeElement(productsPagePage.addToCartOrRemoveButtons)

    //#region count products
    numberOfItemsToAddToCart = await I.grabNumberOfVisibleElements(productsPagePage.addToCartButtons)
    //#endregion

    //#region  add all items to cart
    await productsPagePage.addAllProductsToCart();
    //#endregion
    await I.click(productsPagePage.shoppingCart)

    //#region get names of added items
    initialItemsInCartList = await I.grabTextFromAll(cartPagePage.itemNames);
    itemsInCartList = await I.grabTextFromAll(cartPagePage.itemNames);
    //#endregion

    //#region get name of third item in cart
    let thirdItemInCartName = await I.grabTextFrom(`(//div[@class='inventory_item_name'])[${3}]`);
    //#endregion 

    //#region remove third item
    await I.seeElement(`(//div[@class='inventory_item_name'])[3]`);
    await cartPagePage.removeNthItemFromCart(3);
    await I.dontSeeElement(`//div[@class='inventory_item_name'][text()='${await thirdItemInCartName}']/../following-sibling::div[@class='item_pricebar']//button`)
    //#endregion

    //#region make sure number of items in cart got decreased by 1
    numberOfItemsInCart = await I.grabNumberOfVisibleElements(cartPagePage.itemNames)
    assert(numberOfItemsToAddToCart = 1 + await numberOfItemsInCart)
    //#endregion

    //#region make sure cart has correct items
    assert(await cartPagePage.validateItemsNamesInCart(await itemsInCartList, 3) === true);
    expectedCartTotalValue = await cartPagePage.getExpectedCartValueFromItems(await initialItemsInCartList, 3);

    //#endregion

    //#region complete purchase
    await I.click(cartPagePage.checkoutBtn);
    await I.fillField(checkoutPagePage.firstName, 'Przem');
    await I.fillField(checkoutPagePage.lastName, 'Wojtusik');
    await I.fillField(checkoutPagePage.postalCode, '12345');
    await I.click(checkoutPagePage.continueBtn);
    //#endregion
    //#region verify total values
    itemsTotalValue = await cartPagePage.getItemsTotalValue();
    let taxValue = await cartPagePage.getTaxValue();
    assert(await expectedCartTotalValue === await itemsTotalValue)

    let itemsWithTaxValue = await cartPagePage.getItemsTotalWithTaxValue();
    assert(await itemsWithTaxValue === await itemsTotalValue + await taxValue)
    //#endregion
    //#region finish
    await I.click(checkoutPagePage.finishBtn)
    await I.see('Thank you for your order!', checkoutPagePage.completeHeader)
    await I.see('Your order has been dispatched, and will arrive just as fast as the pony can get there!', checkoutPagePage.completeMessage)
    await I.see('Checkout: Complete!', checkoutPagePage.completeTitle)
    await I.click(checkoutPagePage.backToProductsBtn)
    //#endregion
})

Scenario('Validation1_2', async ({ I }) => {
    //TEST CANNOT PASS => TEST FOUND A BUG

    //Validation 2:
    // 1.	Log in as a`problem_user`
    // 2.	Find one item by name, click on the item
    // 3.	Add it to the cart from item page
    // 4.	Go to the cart
    // 5.	Validate that item was added
    let loginPagePage = new LoginPagePage();
    let headerPagePage = new HeaderPagePage();
    let itemViewPage = new ItemViewPage();
    let nameToFind = `Sauce Labs Backpack`;

    await loginPagePage.loginAs(UserNames.problem_user);
    await I.seeElement(`//*[@class='inventory_item_label']//*[text()='${nameToFind}']`);
    await I.click(`//*[@class='inventory_item_label']//*[text()='${nameToFind}']`);
    await I.click(itemViewPage.addItemToCart);
    await I.click(headerPagePage.shoppingCart);
    await I.seeElement(`//div[@class='inventory_item_name'][text()='${nameToFind}']/../following-sibling::div[@class='item_pricebar']//button`)

})

Scenario('Validation1_3', async ({ I }) => {
    //TEST PASSED

    // Validation 3:
    //     1.	Log in as a`standard user`
    //     2.	Sort products by name
    //     3.	Validate that the sorting is right

    let loginPagePage = new LoginPagePage();
    let productsPagePage = new ProductsPagePage();
    let expectedListOrder: string[] = []
    let actualListOfProducts: string[] = []
    let sortedList: string[] = []

    await loginPagePage.loginAs(UserNames.standard_user);
    await I.seeElement(productsPagePage.filterPicklist);

    sortedList = (await productsPagePage.getVisibleListOfProducts())
    await I.selectOption(productsPagePage.filterPicklist, FilterProductsBy.nameAsc)

    expectedListOrder = sortedList.sort();
    actualListOfProducts = (await productsPagePage.getVisibleListOfProducts())

    assert(await productsPagePage.compareTwoLists(await expectedListOrder, await actualListOfProducts) === true)
})
Scenario('Validation1_4', async ({ I }) => {
    // TEST PASSED

    // Validation 4:
    // 1.	Log in as a`standard user`
    // 2.	Sort products by price
    // 3.	Validate that the sorting is right
    let loginPagePage = new LoginPagePage();
    let productsPagePage = new ProductsPagePage();
    let tools = new Tools();
    let expectedListOrder: number[] = [];
    let actualListOrder: number[] = [];

    await loginPagePage.loginAs(UserNames.standard_user);
    await I.seeElement(productsPagePage.filterPicklist);
    //#region get list of products with initial order
    const listToBeAscending: number[] = (await productsPagePage.getVisibleListOfPrices())
    const listToBeDescending: number[] = (await productsPagePage.getVisibleListOfPrices())
    //#endregion
    //#region validate sort ascending by price
    await I.selectOption(productsPagePage.filterPicklist, FilterProductsBy.priceAsc)
    expectedListOrder = await tools._sortTable(await listToBeAscending, SortType.asc)
    actualListOrder = (await productsPagePage.getVisibleListOfPrices())
    assert(await productsPagePage.validateSortingOrder(await expectedListOrder, await actualListOrder) === true)
    //#endregion
    //#region validate sort descending by price
    await I.selectOption(productsPagePage.filterPicklist, FilterProductsBy.priceDesc)
    expectedListOrder = await tools._sortTable(await listToBeDescending, SortType.desc)
    actualListOrder = (await productsPagePage.getVisibleListOfPrices())
    assert(await productsPagePage.validateSortingOrder(await expectedListOrder, await actualListOrder) === true)
    //#endregion
})
Scenario('Validation1_5', async ({ I }) => {
    // TEST CANNOT PASS -> SCREENSHOTS IN OUTPUT FOLDER

    // Validation 5:
    // 1.	Log in as a`locked_out_user`
    // 2.	The validation should fail
    // 3.	Add capabilities to your program so it can create reports with screenshots when something fails
    let loginPagePage = new LoginPagePage();
    assert(await loginPagePage.loginAs(UserNames.locked_out_user) === true)
})
Scenario('Validation1_6', async ({ I }) => {
    //TEST CANNOT PASS -> GLITCH USER IS NOT WORKING PROPERLY BUG FOUND BY TEST, would work for standard user

    // Validation 6:
    //     1.	Log in as a`performance_glitch_user`
    //     2.	Add all item to the cart
    //     3.	Go to the cart
    //     4.	Find third item by name, then remove it from the cart
    //     5.	Validate in the Checkout Overview that:
    //     5.1.It only contains the items that you want to purchase
    //     5.2.The Item Total is right
    //     6.	Finish the purchase
    //     7.	Validate that the website confirms the order

    let loginPagePage = new LoginPagePage();
    let productsPagePage = new ProductsPagePage();
    let checkoutPagePage = new CheckoutPagePage();
    let cartPagePage = new CartPagePage();

    let numberOfItemsToAddToCart;
    let itemsInCartList: string[] = [];
    let numberOfItemsInCart = 0;
    let expectedCartTotalValue: number = 0;
    let itemsTotalValue = 0;
    let taxValue;
    let thirdItemInCartName;
    let itemsWithTaxValue;


    await loginPagePage.loginAs(UserNames.performance_glitch_user)
    await I.see('Products', productsPagePage.title)
    await I.seeElement(productsPagePage.shoppingCart)
    await I.seeElement(productsPagePage.addToCartOrRemoveButtons)

    numberOfItemsToAddToCart = await productsPagePage.addAllProductsToCart();

    await I.click(productsPagePage.shoppingCart);

    itemsInCartList = await I.grabTextFromAll(cartPagePage.itemNames);
    numberOfItemsInCart = await itemsInCartList.length;

    //#region get name of third item in cart
    thirdItemInCartName = await I.grabTextFrom(`(//div[@class='inventory_item_name'])[${3}]`);
    //#endregion 

    //#region remove third item
    await I.seeElement(`(//div[@class='inventory_item_name'])[3]`);
    await cartPagePage.removeNthItemFromCart(3);
    await I.dontSeeElement(`//div[@class='inventory_item_name'][text()='${await thirdItemInCartName}']/../following-sibling::div[@class='item_pricebar']//button`)
    //#endregion

    //#region make sure number of items in cart got decreased by 1
    numberOfItemsInCart = await I.grabNumberOfVisibleElements(cartPagePage.itemNames)
    assert(numberOfItemsToAddToCart = 1 + await numberOfItemsInCart)
    //#endregion

    //#region make sure cart has correct items
    await itemsInCartList.splice(await itemsInCartList.indexOf(await thirdItemInCartName), 1);
    assert(await cartPagePage.validateItemsNamesInCart(itemsInCartList) === true)
    expectedCartTotalValue = await cartPagePage.getExpectedCartValueFromItems(itemsInCartList);
    //#endregion

    //#region complete purchase
    await I.click(cartPagePage.checkoutBtn);
    await I.fillField(checkoutPagePage.firstName, 'Przem');
    await I.fillField(checkoutPagePage.lastName, 'Wojtusik');
    await I.fillField(checkoutPagePage.postalCode, '12345');
    await I.click(checkoutPagePage.continueBtn)
    //#endregion

    //#region verify total values
    itemsTotalValue = await cartPagePage.getItemsTotalValue();
    taxValue = await cartPagePage.getTaxValue();
    assert(await expectedCartTotalValue === await itemsTotalValue)
    itemsWithTaxValue = await cartPagePage.getItemsTotalWithTaxValue();
    assert(await itemsWithTaxValue === await itemsTotalValue + await taxValue)
    //#endregion

    //#region finish
    await I.click(checkoutPagePage.finishBtn)
    await I.see('Thank you for your order!', checkoutPagePage.completeHeader)
    await I.see('Your order has been dispatched, and will arrive just as fast as the pony can get there!', checkoutPagePage.completeMessage)
    await I.see('Checkout: Complete!', checkoutPagePage.completeTitle)
    await I.click(checkoutPagePage.backToProductsBtn)
    //#endregion
})

//#endregion

//#region API tests
Feature('api');
const apiBaseUrl = `https://reqres.in/api`

Scenario('Validation2_1', async ({ I }) => {
    //TEST PASSED

    // Validation 1:
    //     1.	Get a list of users
    //     2.	Validate that the response code is`200`
    //     3.	Print all users with odd ID numbers

    let total_pages = null;
    let endpointUrl = `/users`
    let getAll = (await axios.get(apiBaseUrl + endpointUrl))
    total_pages = getAll.data.total_pages;
    let endUrl;
    let getAllUsers = [];
    let users;
    let usersJSON;
    let usersWithOddId;

    for (let i = 1; i <= total_pages; i++) {
        endUrl = `?page=${i}`;
        users = ((await axios.get(apiBaseUrl + endpointUrl + endUrl)))

        usersJSON = JSON.parse(JSON.stringify(users.data))
        usersWithOddId = usersJSON.data.filter(element => element.id % 2 !== 0)
        getAllUsers.push(usersWithOddId);
        assert(await users.status === 200)
    }
})
Scenario('Validation2_2', async ({ I }) => {
    //TEST PASSED

    // Validation 2:
    //     1.	Get single user 13
    //     2.	Validate that the user not found
    //     3.	Validate that the response code is`404`

    let response = null;
    try {
        response = (await axios.get(apiBaseUrl + `/users/13`))
    } catch (error) {
        response = error.response;

        assert(await response.statusText === 'Not Found')
        assert(await response.status === 404)
    }
})

Scenario('Validation2_3', async ({ I }) => {
    //TEST PASSED

    // Validation 3:
    //     1.	Create a new user
    //     2.	Validate that the response code is`201`
    //     3.	Validate that the creation date is today

    let requestBody = {
        "name": "przem",
        "job": "wincyj"
    }
    let response = (await axios.post(apiBaseUrl + `/users`, requestBody));
    assert(response.status === 201)

    //validate date is today
    let createdDate = await response.data.createdAt.toString().slice(0, 10)
    let today = moment().format('yyyy-MM-DD')
    assert(today === createdDate)
})

Scenario('Validation2_4', async ({ I }) => {
    // Validation 4:
    //     1.	Update a user
    //     2.	Validate that the response code is`200`
    //     3.	Validate that the response body matches the request body where applicable.Do a recursive comparison if possible
})

Scenario('Validation2_5', async ({ I }) => {
    // 	Validation 5:
    //     1.	Write a parameterized validation with the values `0` and`3`
    //     2.	Get a list of users passing a delay query parameter with the provided value for the validation
    // 3.	Validate that the response time is no longer than `1` second
})

Scenario('Validation2_6', async ({ I }) => {
    // Validation 6:
    //     1.	Use whatever asynchronous technique you prefer to get `10` single users
    //     2.	Validate, asynchronously as well, that all response codes are`200s`
})

Scenario('Validation2_7', async ({ I }) => {
    //TEST CANNOT PASS -> BUG FOUND; error code is 400 not 404

    // Validation 7:
    //     1.	Login user without password
    //     2.	Validate that the user could not login
    //     3.	Validate that the response code is`404`
    //     4.	Validate that the error message is` Missing password`

    let response = null;
    let requestBody = {
        "email": "peter@klaven"
    }
    try {
        response = (await axios.post(apiBaseUrl + `/login`, requestBody))
    } catch (error) {
        response = error.response;
        let errorMessage = response.data.error
        assert(errorMessage === 'Missing password')
        assert(await response.status === 404)
    }
})

//#endregion