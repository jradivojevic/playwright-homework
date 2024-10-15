import { test, expect } from '@playwright/test';


test.describe('Input fields', () => {  
test.beforeEach( async({page}) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Pet Types' }).click();
  await page.getByRole('heading', { name: 'Pet Types' }).click()
})

test('Update pet type', async ({page}) => {
const tableRow = page.locator('tbody tr')
await tableRow.getByRole('button', {name: 'Edit'}).first().click()
await expect(page.getByRole('heading')).toContainText('Edit Pet Type');
const nameInputField = page.locator('#name')
await nameInputField.click();
await nameInputField.clear()
await nameInputField.fill('rabbit')
const updateButton = page.getByRole('button', {name: 'Update'})
await updateButton.click()
await expect(tableRow.locator('td input[id="0"]')).toHaveValue('rabbit')
await tableRow.getByRole('button', {name: 'Edit'}).first().click()
await nameInputField.click();
await nameInputField.clear()
await nameInputField.fill('cat')
await updateButton.click()
await expect(tableRow.locator('td input[id="0"]')).toHaveValue('cat')

});

test('Cancel pet type update', async ({ page }) => {
  const editDogRow = page.getByRole('button', { name: 'Edit'}).nth(1);
  await editDogRow.click()
  const inputFieldDog = page.locator('#name')
  await inputFieldDog.click()
  await inputFieldDog.clear()
  await inputFieldDog.fill('moose')
  await expect(inputFieldDog).toHaveValue('moose')
  const cancelButton = page.getByRole('button', {name: 'Cancel'})
  await cancelButton.click()
  const tableRow = page.locator('tbody tr')
  await expect(tableRow.locator('td input[id="1"]')).toHaveValue('dog')
  
});

test('Pet type name is required validation', async ({ page }) => {
  const editLizardRow = page.getByRole('button', { name: 'Edit'}).nth(2);
  await editLizardRow.click()
  const inputLizardRow = page.locator('#name')
  await inputLizardRow.click()
  await inputLizardRow.clear()
  const ErrorMessage = page.locator('span.help-block')
  await expect(ErrorMessage).toHaveText('Name is required');
  
});


})