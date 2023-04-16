import { Page } from '@playwright/test';
import BasicPage from './BasicPage';

export default class CheckoutCompletePage extends BasicPage {
    private thankYouPageTitle = 'Thank you for your order!';
    private thankYouPageDescription = 'Your order has been dispatched, and will arrive just as fast as the pony can get there!';

    constructor(public page: Page) {
        super(page);
        this.pageUrl = 'https://www.saucedemo.com/checkout-complete.html';
        this.locators = {
            completeHeader: page.locator('.complete-header'),
            completeText: page.locator('.complete-text'),
        };
    }

    async verifyIfCheckoutIsCompleted() {
        return (
            ((await this.locators.completeHeader.textContent()) || '').includes(this.thankYouPageTitle) &&
            ((await this.locators.completeText.textContent()) || '').includes(this.thankYouPageDescription)
        );
    }
}
