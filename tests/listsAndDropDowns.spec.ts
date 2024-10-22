import { test, expect } from '@playwright/test';

test.describe('Lists and Drop Downs', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
        await page.getByRole('button', { name: 'Owners' }).click()
        await page.getByRole('link', { name: 'Search' }).click()
        await expect(page.getByRole('button', { name: 'Owners' })).toHaveText('Owners');
    })

    test('Test Case 1: Validate selected pet types from the list', async ({ page }) => {
        await page.getByRole('link', { name: 'George Franklin' }).click()
        await expect(page.locator('.ownerFullName')).toHaveText('George Franklin')
        await page.getByRole('button', { name: 'Edit Pet' }).click()
        await expect(page.locator('#name')).toHaveValue('Leo')
        await expect(page.locator('#owner_name')).toHaveValue('George Franklin')
        await expect(page.locator('#type')).toHaveValue('cat')
        const dropdownMenu = page.locator('#type')
        await dropdownMenu.click()
        const typesOfPets = ['cat', 'dog', 'lizard', 'snake', 'bird', 'hamster']

        for (const pet of typesOfPets) {
            await dropdownMenu.selectOption(pet)
            await expect(dropdownMenu).toHaveValue(pet)
            await expect(page.locator('#type')).toHaveValue(pet)
            await dropdownMenu.click()
        }
    })

    test('Test Case 2: Validate the pet type update', async ({ page }) => {
        await page.getByRole('link', { name: 'Eduardo Rodriquez' }).click()
        await page.getByRole('button', { name: 'Edit Pet' }).nth(1).click()
        const typeOfPet = page.locator('#type')
        const nameOfPet = page.locator('#name')
        await expect(nameOfPet).toHaveValue('Rosy')
        await expect(typeOfPet).toHaveValue('dog')
        const dropdownMenu = page.locator('#type')
        await dropdownMenu.click()
        const typesOfPets = ['cat', 'dog', 'lizard', 'snake', 'bird', 'hamster']
        const updateButton = page.getByRole('button', { name: 'Update Pet' })
        for (const pet of typesOfPets) {
            if (pet === 'bird') {
                await dropdownMenu.selectOption(pet);
                await dropdownMenu.click();
                break
            }
        }
        await expect(dropdownMenu).toHaveValue('bird');
        await expect(typeOfPet).toHaveValue('bird');
        await updateButton.click()
        await expect(nameOfPet).toHaveValue('Rosy')
        await expect(typeOfPet).toHaveValue('bird')
        await page.getByRole('button', { name: 'Edit Pet' }).nth(1).click()
        for (const pet of typesOfPets) {
            if (pet === 'dog') {

                await dropdownMenu.selectOption(pet);
                await dropdownMenu.click();
                break
            }
        }
        await expect(dropdownMenu).toHaveValue('dog');
        await expect(typeOfPet).toHaveValue('dog');
        await updateButton.click()
        await expect(nameOfPet).toHaveValue('Rosy')
        await expect(typeOfPet).toHaveValue('dog')

    })

})