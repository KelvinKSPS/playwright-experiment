import { Page } from '@playwright/test';
import BasicPage from './basic.page';

export default class HomePage extends BasicPage {
    constructor(public page: Page) {
        super(page);
        this.locators = {
            usernameField: page.locator('#user-name'),
            passwordField: page.locator('#password'),
            submitButton: page.locator('#login-button'),
        };
    }

    private async typeUsername(username: string) {
        await this.locators.usernameField.type(username);
    }

    private async typePassword(password: string) {
        await this.locators.passwordField.type(password);
    }

    async fillCredentials({ username, password }) {
        await this.typeUsername(username);
        await this.typePassword(password);
    }

    async clickOnLogin() {
        await this.locators.submitButton.click();
    }
}
