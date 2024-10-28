import test, { expect } from "@playwright/test"


test.describe('Dialog boxes', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/")
    })

    test('Test Case: Add and delete pet type', async ({ page }) => {
        await page.getByRole('link', { name: 'Pet Types' }).click()
        await expect(page.getByRole('heading')).toHaveText('Pet Types')
        await page.getByRole('button', { name: "Add" }).click()
        await expect(page.locator('app-pettype-add h2')).toHaveText('New Pet Type')
        await expect(page.locator('label')).toHaveText("Name")
        await expect(page.locator('#name')).toBeVisible()
        await page.locator('#name').fill('pig')
        await page.getByRole('button', { name: 'Save' }).click()
        await expect(page.locator('table input').last()).toHaveValue('pig')
        page.on('dialog', dialog => {
            expect(dialog.message()).toEqual('Delete the pet type?')
            dialog.accept()
        })
        await page.getByRole('button', { name: 'Delete' }).last().click()
        await expect(page.getByRole('textbox').last()).not.toHaveValue('pig')
    })
})
