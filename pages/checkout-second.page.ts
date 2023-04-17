import { Locator, Page } from '@playwright/test';
import BasicPage from './basic.page';

export default class CheckoutSecondPage extends BasicPage {
    constructor(public page: Page) {
        super(page);
        this.pageUrl = 'https://www.saucedemo.com/checkout-step-two.html';
        this.locators = {
            inventoryTitle: page.locator('.inventory_item_name'),
            subTotalLabel: page.locator('.summary_subtotal_label'),
            taxLabel: page.locator('.summary_tax_label'),
            totalLabel: page.locator('.summary_info_label.summary_total_label'),
            finishButton: page.locator('#finish'),
        };
    }

    async checkIfProductIsAvailable(title: string) {
        return this.locators.inventoryTitle.getByText(title).isVisible();
    }

    private async extractPrice(locator: Locator) {
        const regExp = /\$.*/gm;
        const stringInsideLocator = (await locator.textContent()) || '';
        return stringInsideLocator.match(regExp)?.[0];
    }

    async extractSubTotalPrice() {
        return this.extractPrice(this.locators.subTotalLabel);
    }

    async extractTaxPrice() {
        return this.extractPrice(this.locators.taxLabel);
    }

    async extractTotalPrice() {
        return this.extractPrice(this.locators.totalLabel);
    }

    async clickFinishButton() {
        await this.locators.finishButton.click();
    }
}
