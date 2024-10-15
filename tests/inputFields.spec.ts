import { test, expect } from '@playwright/test';


test.describe('Input fields', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Pet Types' }).click();
    await expect(page.getByRole('heading', { name: 'Pet Types' })).toHaveText('Pet Types');
  })

  test('Update pet type', async ({ page }) => {
    const firstTableRow = page.locator('tbody tr').first()
    await firstTableRow.getByRole('button', { name: 'Edit' }).click()
    await expect(page.getByRole('heading')).toHaveText('Edit Pet Type');
    const nameInputField = page.locator('#name')
    await nameInputField.click();
    await nameInputField.clear()
    await nameInputField.fill('rabbit')
    const updateButton = page.getByRole('button', { name: 'Update' })
    await updateButton.click()
    await expect(firstTableRow.locator('[id="0"]')).toHaveValue('rabbit')
    await firstTableRow.getByRole('button', { name: 'Edit' }).first().click()
    await nameInputField.click();
    await nameInputField.clear()
    await nameInputField.fill('cat')
    await updateButton.click()
    await expect(firstTableRow.locator('[id="0"]')).toHaveValue('cat')

  });

  test('Cancel pet type update', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit' }).nth(1).click()
    const nameInputField = page.locator('#name')
    await nameInputField.click()
    await nameInputField.clear()
    await nameInputField.fill('moose')
    await expect(nameInputField).toHaveValue('moose')
    await page.getByRole('button', { name: 'Cancel' }).click()
    const tableRow = page.locator('tbody tr')
    await expect(page.locator('[id="1"]')).toHaveValue('dog')

  });

  test('Pet type name is required validation', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit' }).nth(2).click()
    const nameInputField = page.locator('#name')
    await nameInputField.click()
    await nameInputField.clear()
    await expect(page.locator('.help-block')).toHaveText('Name is required');

  });


})