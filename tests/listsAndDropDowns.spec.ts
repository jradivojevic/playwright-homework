import { test, expect } from '@playwright/test';

test.describe('Lists and Drop Downs', () => {
    //declare variables
    let petTypeInputField
    let petNameInputField

    test.beforeEach(async ({ page }) => {
        await page.goto('/')
        await page.getByRole('button', { name: 'Owners' }).click()
        await page.getByRole('link', { name: 'Search' }).click()
        const ownersButton = page.locator('.dropdown', {hasText: "Search"})
        await expect(ownersButton).toContainText('Owners')
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
        await petTypeInputField.click()
        const typesOfPets = ['cat', 'dog', 'lizard', 'snake', 'bird', 'hamster']

        for (const pet of typesOfPets) {
            await petTypeInputField.selectOption(pet)
            await expect(petTypeInputField).toHaveValue(pet)
            await petTypeInputField.click()
        }
    })

    test('Test Case 2: Validate the pet type update', async ({ page }) => {
        await page.getByRole('link', { name: 'Eduardo Rodriquez' }).click()
        const editButton = page.locator('.dl-horizontal', { hasText: "Rosy" }).getByRole('button', { name: 'Edit Pet' })
        await editButton.click()
        await expect(petNameInputField).toHaveValue('Rosy')
        await expect(petTypeInputField).toHaveValue('dog')
        await petTypeInputField.click()
        await petTypeInputField.selectOption('bird')
        await expect(petTypeInputField).toHaveValue('bird')
        const updateButton = page.getByRole('button', { name: 'Update Pet' })
        await updateButton.click()
        await expect(petNameInputField).toHaveValue('Rosy')
        await expect(petTypeInputField).toHaveValue('bird')
        await editButton.click()
        await petTypeInputField.selectOption('dog')
        await expect(petTypeInputField).toHaveValue('dog');
        await updateButton.click()
        await expect(petNameInputField).toHaveValue('Rosy')
        await expect(petTypeInputField).toHaveValue('dog')

    })

})