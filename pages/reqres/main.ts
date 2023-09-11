const { I } = inject();

class MainPage {
    getListUsersBtn: string;
    getSingleUserBtn: string;
    responseCode: string;
    responseBody: string;
    constructor() {
        //insert your locators
        // this.button = '#button'
        //#region buttons
        this.getListUsersBtn = `//*[@data-key='endpoint'][@data-id='users'][@data-http='get']/a`
        this.getSingleUserBtn = `//*[@data-key='endpoint'][@data-id='users'][@data-http='get']/a`
        //#endregion
        //#region response
        this.responseCode = `//*[@data-key='response-code']`
        this.responseBody = `//*[@data-key='output-response']`
        //#endregion
    }
    // insert your methods here

}

// For inheritance
module.exports = new MainPage();
export = MainPage;