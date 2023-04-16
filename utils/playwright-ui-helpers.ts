import { Page, TestInfo } from '@playwright/test';
import crypto from 'crypto';

export async function screenshotOnFailure({ page }: { page: Page }, testInfo: TestInfo) {
    if (testInfo.status !== testInfo.expectedStatus) {
        const screenshotPath = testInfo.outputPath(`failure_${crypto.randomUUID()}.png`);
        testInfo.attachments.push({ name: 'screenshot', path: screenshotPath, contentType: 'image/png' });
        await page.screenshot({ path: screenshotPath, timeout: 5000 });
    }
}
