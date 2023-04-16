import { test, expect } from '@playwright/test';
import HomePage from '../pages/HomePage';
import InventoryPage from '../pages/InventoryPage';
import solveResources from '../utils/solve-resources';
import CartPage from '../pages/CartPage';
import CheckoutFirstPage from '../pages/CheckoutFirstPage';
import CheckoutSecondPage from '../pages/CheckoutSecondPage';
import CheckoutCompletePage from '../pages/CheckoutCompletePage';
import { screenshotOnFailure } from '../utils/playwright-ui-helpers';

const data = solveResources();

test.describe('web-automation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(data.store_url);
    });

    // Add capabilities to your program so it can create reports with screenshots when something fails
    test.afterEach(screenshotOnFailure);

    test('Validation 1: Login, find and remove item, and checkout', async ({ page }) => {
        const homePage = new HomePage(page);
        const inventoryPage = new InventoryPage(page);
        const cartPage = new CartPage(page);
        const checkoutFirstPage = new CheckoutFirstPage(page);
        const checkoutSecondPage = new CheckoutSecondPage(page);
        const checkoutCompletePage = new CheckoutCompletePage(page);

        // Log in as a standard user
        await homePage.fillCredentials({ ...data.valid_credentials });
        await homePage.clickOnLogin();
        expect(await inventoryPage.validatePageUrl()).toBeTruthy();

        // Find an item by name, then add it to the cart
        await inventoryPage.addItemByName(data.first_item.find_item_by_name);

        // Find a second item by name, and add it to the cart as well
        await inventoryPage.addItemByName(data.second_item.find_item_by_name);

        // Go to the cart
        await inventoryPage.clickShoppingCartButton();
        expect(await cartPage.validatePageUrl()).toBeTruthy();

        // Find an item by name, then remove it from the cart
        await cartPage.removeItemByName(data.second_item.find_item_by_name);

        // Validate in the Checkout Overview (go to checkout page)
        await cartPage.clickCheckoutButton();
        expect(await checkoutFirstPage.validatePageUrl()).toBeTruthy();
        const { first_name: firstName, last_name: lastName, postal_code: postalCode } = data.valid_address;
        await checkoutFirstPage.fillAddressInfo({ firstName, lastName, postalCode });
        await checkoutFirstPage.clickContinueButton();
        expect(await checkoutSecondPage.validatePageUrl()).toBeTruthy();

        // - It only contains the items that you want to purchase
        expect(await checkoutSecondPage.checkIfProductIsAvailable(data.first_item.item_title)).toBeTruthy();
        expect(await checkoutSecondPage.checkIfProductIsAvailable(data.second_item.item_title)).toBeFalsy();

        // - The Item Total is right
        const subTotalPrice = await checkoutSecondPage.extractSubTotalPrice();
        const taxPrice = await checkoutSecondPage.extractTaxPrice();
        const totalPrice = await checkoutSecondPage.extractTotalPrice();
        const expectedTaxPriceInFloat = parseFloat(data.first_item.price) * 0.08;
        const expectedTotalPriceInFloat = expectedTaxPriceInFloat + parseFloat(data.first_item.price);
        expect(subTotalPrice).toEqual(`$${data.first_item.price}`);
        expect(taxPrice).toEqual(`$${expectedTaxPriceInFloat.toFixed(2)}`);
        expect(totalPrice).toEqual(`$${expectedTotalPriceInFloat.toFixed(2)}`);

        // Finish the purchase
        await checkoutSecondPage.clickFinishButton();

        // Validate that the website confirms the order
        expect(await checkoutCompletePage.validatePageUrl()).toBeTruthy();
        expect(await checkoutCompletePage.verifyIfCheckoutIsCompleted()).toBeTruthy();
    });

    test('Validation 2: Login, and validate the name sorting feature is working', async ({ page }) => {
        const homePage = new HomePage(page);
        const inventoryPage = new InventoryPage(page);

        // Log in as a `standard user`
        await homePage.fillCredentials({ ...data.valid_credentials });
        await homePage.clickOnLogin();
        expect(await inventoryPage.validatePageUrl()).toBeTruthy();

        // Sort products by name
        // Validate that the sorting is right
        await inventoryPage.selectToSortByNameAscending();
        expect(await inventoryPage.verifyIfSortNameIsAscending()).toBeTruthy();
        expect(await inventoryPage.verifyIfSortNameIsDescending()).toBeFalsy(); // just as a double-check to proof that the function validates the list properly
        // Also validates the reverse list
        await inventoryPage.selectToSortByNameDescending();
        expect(await inventoryPage.verifyIfSortNameIsDescending()).toBeTruthy();
        expect(await inventoryPage.verifyIfSortNameIsAscending()).toBeFalsy(); // just as a double-check to proof that the function validates the list properly
    });

    test('Validation 3: Login, and validate the price sorting feature is working', async ({ page }) => {
        const homePage = new HomePage(page);
        const inventoryPage = new InventoryPage(page);

        // Log in as a `standard user`
        await homePage.fillCredentials({ ...data.valid_credentials });
        await homePage.clickOnLogin();
        expect(await inventoryPage.validatePageUrl()).toBeTruthy();

        // Sort products by price
        // Validate that the sorting is right
        await inventoryPage.selectToSortByPriceAscending();
        expect(await inventoryPage.verifyIfSortPriceIsAscending()).toBeTruthy();
        expect(await inventoryPage.verifyIfSortPriceIsDescending()).toBeFalsy(); // just as a double-check to proof that the function validates the list properly
        // Also validates the reverse list
        await inventoryPage.selectToSortByPriceDescending();
        expect(await inventoryPage.verifyIfSortPriceIsDescending()).toBeTruthy();
        expect(await inventoryPage.verifyIfSortPriceIsAscending()).toBeFalsy(); // just as a double-check to proof that the function validates the list properly
    });

    test('Validation 4: Login, and validate the capability of reporting screenshots on failures', async ({ page }) => {
        const homePage = new HomePage(page);
        const inventoryPage = new InventoryPage(page);

        // Log in as a `locked_out_user`
        await homePage.fillCredentials({ ...data.error_credentials });
        await homePage.clickOnLogin();
        // The validation should fail
        expect(await inventoryPage.validatePageUrl()).toBeTruthy();
        // Add capabilities to your program so it can create reports with screenshots when something fails:
        // Check afterEach hook
    });
});
