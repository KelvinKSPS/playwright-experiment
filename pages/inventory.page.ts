import { Page, expect } from '@playwright/test';
import BasicPage from './basic.page';

export default class InventoryPage extends BasicPage {
    constructor(public page: Page) {
        super(page);
        this.pageUrl = 'https://www.saucedemo.com/inventory.html';
        this.locators = {
            shoppingCartButton: page.locator('.shopping_cart_link'),
            productSortButton: page.locator('.product_sort_container'),
            inventoryItemName: page.locator('.inventory_item_name'),
            inventoryItemPrice: page.locator('.inventory_item_price'),
        };
    }

    async addItemByName(name: string) {
        const foundLocator = this.page.locator(`[name=add-to-cart-${name}]`);
        await foundLocator.click();
        // check if the add button disappeared
        expect(await foundLocator.isVisible()).toBeFalsy();
    }

    async clickShoppingCartButton() {
        await this.locators.shoppingCartButton.click();
    }

    async selectToSortByNameAscending() {
        await this.locators.productSortButton.selectOption('az');
    }

    async selectToSortByNameDescending() {
        await this.locators.productSortButton.selectOption('za');
    }

    async selectToSortByPriceAscending() {
        await this.locators.productSortButton.selectOption('lohi');
    }

    async selectToSortByPriceDescending() {
        await this.locators.productSortButton.selectOption('hilo');
    }

    private async extractProductNamesInOrder(allElements) {
        const allTitles: string[] = [];
        for (const element of allElements) {
            allTitles.push((await element.textContent()) || '');
        }
        return allTitles;
    }

    // Works for name
    private async sortNameVerifier(reverse = false, allItems) {
        const sortedList = JSON.parse(JSON.stringify(allItems)).sort();
        let result = true;
        for (let i = 0; i < allItems.length; i++) {
            /* check if the list is like the sorted one
                if it is sorted: same elements at the same positions on both lists
                if it is reversed: elements at the inverse positions on each list
             */
            result = result && allItems[i] === sortedList[reverse ? allItems.length - 1 - i : i];
        }
        return result;
    }

    async verifyIfSortNameIsAscending() {
        const allItemsByNameInOrder = await this.extractProductNamesInOrder(await this.locators.inventoryItemName.elementHandles());
        return this.sortNameVerifier(false, allItemsByNameInOrder);
    }

    async verifyIfSortNameIsDescending() {
        const allItemsByNameInOrder = await this.extractProductNamesInOrder(await this.locators.inventoryItemName.elementHandles());
        return this.sortNameVerifier(true, allItemsByNameInOrder);
    }

    private async extractProductPricesInOrder(allElements) {
        const allTitles: number[] = [];
        const regExp = /\$(.*)/;
        for (const element of allElements) {
            const parsedElement = await element.textContent();
            allTitles.push(parseFloat(parsedElement.match(regExp)[1]));
        }
        return allTitles;
    }

    // Works for price
    private async sortNumberVerifier(reverse = false, allItems) {
        let currentValue = reverse ? Infinity : 0;
        let result = true;
        for (const value of allItems) {
            // if the list should be sorted, each value is less or equal than the next
            // if the list should be reversed, each value is higher or equal than the next
            result = result && (reverse ? currentValue >= value : currentValue <= value);
            currentValue = value;
        }
        return result;
    }

    async verifyIfSortPriceIsAscending() {
        const allItemsByPriceInOrder = await this.extractProductPricesInOrder(await this.locators.inventoryItemPrice.elementHandles());
        return this.sortNumberVerifier(false, allItemsByPriceInOrder);
    }

    async verifyIfSortPriceIsDescending() {
        const allItemsByPriceInOrder = await this.extractProductPricesInOrder(await this.locators.inventoryItemPrice.elementHandles());
        return this.sortNumberVerifier(true, allItemsByPriceInOrder);
    }
}
