import { Page, expect } from '@playwright/test';
import BasicPage from './basic.page';

export default class CartPage extends BasicPage {
    constructor(public page: Page) {
        super(page);
        this.pageUrl = 'https://www.saucedemo.com/cart.html';
        this.locators = {
            checkoutButon: page.locator('#checkout'),
        };
    }

    async removeItemByName(name) {
        const foundLocator = this.page.locator(`[name=remove-${name}]`);
        await foundLocator.click();
        // check if remove button disappeared
        expect(await foundLocator.isVisible()).toBeFalsy();
    }

    async clickCheckoutButton() {
        await this.locators.checkoutButon.click();
    }
}
