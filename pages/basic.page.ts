import { Locators } from '../interfaces/locators.interface';
import { Page } from '@playwright/test';

export default class BasicPage {
    locators: Locators;
    pageUrl: string;
    constructor(public page: Page) {}

    /**
     * Validate if the page belonged to the page object was loaded properly
     */
    async validatePageUrl() {
        return this.page.url().includes(this.pageUrl);
    }
}
