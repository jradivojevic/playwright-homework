import { test, expect } from '@playwright/test';

test.describe('Input fields', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
        await page.getByRole('button', { name: 'Veterinarians' }).click()
        await page.getByRole('link', { name: 'All' }).click()
    })

    test('Test Case 1: Validate selected specialties', async ({ page }) => {
        await expect(page.getByRole('button', { name: 'Veterinarians' })).toHaveText('Veterinarians');
        await page.getByRole('row', { name: "Helen Leary" }).getByRole('button', { name: "Edit Vet" }).click()
        await expect(page.locator(".selected-specialties")).toHaveText('radiology')
        await page.locator('.dropdown-arrow').click()
        const checkBoxRadiology = page.getByRole('checkbox', { name: "radiology" })
        const checkBoxSurgery = page.getByRole('checkbox', { name: "surgery" })
        const checkBoxDentistry = page.getByRole('checkbox', { name: "dentistry" })
        expect(await checkBoxRadiology.isChecked()).toBeTruthy()
        expect(await checkBoxSurgery.isChecked()).toBeFalsy()
        expect(await checkBoxDentistry.isChecked()).toBeFalsy()
        await checkBoxSurgery.check()
        await checkBoxRadiology.uncheck()
        await expect(page.locator(".selected-specialties")).toHaveText('surgery')
        await checkBoxDentistry.check()
        await expect(page.locator(".selected-specialties")).toHaveText('surgery, dentistry')
    });

    test('Test Case 2: Select all specialties', async ({ page }) => {
        await page.getByRole('row', { name: "Rafael Ortega" }).getByRole('button', { name: "Edit Vet" }).click()
        await expect(page.locator(".selected-specialties")).toHaveText('surgery')
        await page.locator('.dropdown-arrow').click()
        const allCheckboxes = page.getByRole('checkbox')
        for (const box of await allCheckboxes.all()) {
            await box.check()

        }
        await expect(page.locator(".selected-specialties")).toHaveText('surgery, radiology, dentistry')
    });

    test('Test Case 3: Unselect all specialties', async ({ page }) => {
        await page.getByRole('row', { name: "Linda Douglas" }).getByRole('button', { name: "Edit Vet" }).click()
        await expect(page.locator(".selected-specialties")).toHaveText('dentistry, surgery')
        await page.locator('.dropdown-arrow').click()
        const allCheckboxes = page.getByRole('checkbox')
        for (const box of await allCheckboxes.all()) {
            await box.uncheck()

        }
        await expect(page.locator(".selected-specialties")).toBeEmpty()
    });

})
