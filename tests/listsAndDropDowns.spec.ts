import { test, expect } from '@playwright/test';

test.describe('Lists and Drop Downs', () => {
    //declare variables
    let petTypeInputField
    let petNameInputField

    test.beforeEach(async ({ page }) => {
        await page.goto('/')
        await page.getByRole('button', { name: 'Owners' }).click()
        await page.getByRole('link', { name: 'Search' }).click()
        const ownersButton = page.getByRole('button', { name: 'Owners' })
        await expect(ownersButton).toContainText('Owners')
        //initilize reusable locators
        petTypeInputField = page.locator('#type')
        petNameInputField = page.locator('#name')
    })

    test('Test Case 1: Validate selected pet types from the list', async ({ page }) => {
        await page.getByRole('link', { name: 'George Franklin' }).click()
        await expect(page.locator('.ownerFullName')).toHaveText('George Franklin')
        await page.getByRole('button', { name: 'Edit Pet' }).click()
        await expect(petNameInputField).toHaveValue('Leo')
        await expect(page.locator('#owner_name')).toHaveValue('George Franklin')
        await expect(petTypeInputField).toHaveValue('cat')
        const dropdownMenu = petTypeInputField
        await dropdownMenu.click()
        const typesOfPets = ['cat', 'dog', 'lizard', 'snake', 'bird', 'hamster']

        for (const pet of typesOfPets) {
            await dropdownMenu.selectOption(pet)
            await expect(dropdownMenu).toHaveValue(pet)
            await expect(petTypeInputField).toHaveValue(pet)
            await dropdownMenu.click()
        }
    })

    test('Test Case 2: Validate the pet type update', async ({ page }) => {
        await page.getByRole('link', { name: 'Eduardo Rodriquez' }).click()
        const EditButton = page.locator('.dl-horizontal', { hasText: "Rosy" }).getByRole('button', { name: 'Edit Pet' })
        await EditButton.click()
        await expect(petNameInputField).toHaveValue('Rosy')
        await expect(petTypeInputField).toHaveValue('dog')
        await petTypeInputField.click()
        await petTypeInputField.selectOption('bird')
        await expect(petTypeInputField).toHaveValue('bird')
        const updateButton = page.getByRole('button', { name: 'Update Pet' })
        await updateButton.click()
        await expect(petNameInputField).toHaveValue('Rosy')
        await expect(petTypeInputField).toHaveValue('bird')
        await EditButton.click()
        await petTypeInputField.selectOption('dog')
        await expect(petTypeInputField).toHaveValue('dog');
        await updateButton.click()
        await expect(petNameInputField).toHaveValue('Rosy')
        await expect(petTypeInputField).toHaveValue('dog')

    })

})