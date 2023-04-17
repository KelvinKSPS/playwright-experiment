import { Page } from '@playwright/test';
import BasicPage from './basic.page';

export default class CheckoutFirstPage extends BasicPage {
    constructor(public page: Page) {
        super(page);
        this.pageUrl = 'https://www.saucedemo.com/checkout-step-one.html';
        this.locators = {
            firstNameField: page.locator('#first-name'),
            lastNameField: page.locator('#last-name'),
            postalCodeField: page.locator('#postal-code'),
            continueButton: page.locator('#continue'),
        };
    }

    private async fillFirstName(firstName: string) {
        await this.locators.firstNameField.type(firstName);
    }

    private async fillLastName(lastName: string) {
        await this.locators.lastNameField.type(lastName);
    }

    private async fillPostalCode(postalCode: string) {
        await this.locators.postalCodeField.type(postalCode);
    }

    async fillAddressInfo({ firstName, lastName, postalCode }) {
        await this.fillFirstName(firstName);
        await this.fillLastName(lastName);
        await this.fillPostalCode(postalCode);
    }

    async clickContinueButton() {
        await this.locators.continueButton.click();
    }
}
