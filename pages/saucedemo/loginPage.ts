const { I } = inject();

class LoginPagePage {
  userName: string
  password: string
  login: string

  constructor() {

    // insert your locators and methods here
    //#region fields
    this.userName = `//input[@id='user-name']`
    this.password = `//input[@id='password']`
    //#endregion

    //#region buttons
    this.login = `//input[@id="login-button"]`
    //#endregion
  }
  async loginAs(userName, password = 'secret_sauce') {
    let success = false;
    try {
      await I.amOnPage('https://www.saucedemo.com/')
      await I.fillField(this.userName, userName)
      await I.fillField(this.password, password)
      await I.click(this.login)
      await I.see('Swag Labs', `//div[@class="app_logo"]`)
      success = true
    } catch (error) {
      success = false
    }
    return success
  }

}
// For inheritance
module.exports = new LoginPagePage();
export = LoginPagePage;