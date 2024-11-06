import test, { expect } from "@playwright/test"


test.describe('Web Tables', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/")
    })

    test('Test Case 1: Validate the pet name city of the owner', async ({ page }) => {
        await page.getByRole('button', { name: 'Owners' }).click()
        await page.getByRole('link', { name: 'Search' }).click()
        await page.getByRole('link', { name: 'Jeff Black' }).click()
        await expect(page.locator('.ownerFullName')).toHaveText('Jeff Black')
        const petLuckySection = page.locator('.dl-horizontal', { hasText: "Lucky" })
        await expect(petLuckySection).toContainText('Lucky')
        await expect(page.locator('td', { hasText: 'Monona' })).toHaveText('Monona')
    })

    test('Test Case 2: Validate owners count of the Madison city', async ({ page }) => {
        await page.getByRole('button', { name: 'Owners' }).click()
        await page.getByRole('link', { name: 'Search' }).click()
        await expect(page.getByRole('row', { name: 'Madison' })).toHaveCount(4)
    })



    test('Test Case 3: Validate search by Last Name', async ({ page }) => {
        await page.getByRole('button', { name: 'Owners' }).click()
        await page.getByRole('link', { name: 'Search' }).click()
        await page.locator('#lastName').fill('Black')
        await page.getByRole('button', { name: 'Find Owner' }).click()
        await expect(page.locator('tbody').getByRole('cell', { name: 'Jeff Black' })).toContainText('Black')
        await page.locator('#lastName').clear()
        await page.locator('#lastName').fill('Davis')
        await expect(page.locator('tbody').getByRole('cell', { name: 'Betty Davis' })).toContainText('Davis')
        const lastNames = ["Es", "Playwright"]

        for (const lastName of lastNames) {
            await page.getByRole('textbox').fill(lastName)
            await page.getByText('Find Owner').click()


            const rows = await page.locator('.ownerFullName').all()
            for (const row of rows) {
                if (lastName !== 'Playwright') {
                    await expect(row).toContainText(lastName)
                }
                else {
                    await expect(page.locator('div.container.xd-container div').last()).toHaveText('No owners with LastName starting with \"Playwright\"')
                }
            }
        }
    })

    test('Test Case 4: Validate phone number and pet name on the Owner Information page ', async ({ page }) => {
        await page.getByRole('button', { name: 'Owners' }).click()
        await page.getByRole('link', { name: 'Search' }).click()
        const targetRow = page.getByRole('row', { name: '6085552765' })
        const petName = await targetRow.locator('td').nth(4).textContent()
        await targetRow.getByRole('link', { name: 'Peter McTavish' }).click()
        await expect(page.getByRole('cell', { name: '6085552765' })).toContainText('6085552765')
        await expect(page.locator('div.container.xd-container').locator('dd').first()).toContainText(petName!)
    })

    test('Test Case 5: Validate pets of the Madison city ', async ({ page }) => {
        await page.getByRole('button', { name: 'Owners' }).click()
        await page.getByRole('link', { name: 'Search' }).click()
        await page.waitForSelector('table')

        const expectedPetsList = [' Freddy ', ' George ', ' Leo ', ' Mulligan ']
        let actualPetsList: string[] = []
        const rowsOfMadison = page.getByRole('row', { name: 'Madison' })

        for (const row of await rowsOfMadison.all()) {
            const petsValue = await row.locator('td').nth(4).textContent() || ''
            actualPetsList.push(petsValue)
        }
        expect(actualPetsList.sort()).toEqual(expectedPetsList.sort())
    })

    test('Test Case 6: Validate specialty update ', async ({ page }) => {
        await page.getByRole('button', { name: 'VETERINARIANS ' }).click()
        await page.getByRole('link', { name: 'All' }).click()
        await expect(page.getByRole('row', { name: 'Rafael Ortega' }).getByRole('cell').nth(1)).toHaveText('surgery')
        await page.getByRole('link', { name: 'Specialties' }).click()
        await expect(page.getByRole('heading')).toHaveText('Specialties')
        await page.waitForSelector('tbody')
        const allRows = await page.locator('tbody tr').all()
        for (let row of allRows) {
            if (await row.locator('input').inputValue() === 'surgery') {
                await row.getByRole('button', { name: 'Edit' }).click()
                break
            }
        }
        await expect(page.locator('h2')).toHaveText('Edit Specialty')
        const specialtyInput = page.locator('#name')
        await expect(specialtyInput).toHaveValue('surgery')
        await specialtyInput.fill('dermatology')
        await page.getByText('Update').click()
        await page.getByText("Veterinarians").click()
        await page.getByText("All").click()
        await expect(page.getByRole('row', { name: 'Rafael Ortega' }).getByRole('cell').nth(1)).toHaveText('dermatology')
        await page.getByRole('link', { name: 'Specialties' }).click()
        for (let row of allRows) {
            if (await row.locator('input').inputValue() === 'dermatology') {
                await row.getByRole('button', { name: 'Edit' }).click()
                break;
            }
        }
        await expect(specialtyInput).toHaveValue('dermatology')
        await specialtyInput.fill('surgery')
        await page.getByText('Update').click()


    })

    test('Test Case 7: validate specialty lists', async ({ page }) => {
        await page.getByRole('link', { name: 'Specialties ' }).click()
        await page.getByRole('button', { name: 'Add' }).click()
        await page.locator('#name').fill('oncology')
        await page.getByText('Save').click()
        await expect(page.locator('tbody tr').last().getByRole('textbox')).toHaveValue('oncology')
        const allSpecialtyInputs = await page.locator('tbody tr').getByRole('textbox').all()
        const allSpecialties: string[] = []
        for (const input of allSpecialtyInputs) {
            allSpecialties.push(await input.inputValue())
        }

        await page.getByRole('button', { name: 'VETERINARIANS ' }).click()
        await page.getByRole('link', { name: 'All' }).click()
        await page.getByRole('row', { name: 'Sharon Jenkins' }).getByText('Edit Vet').click()
        await page.locator('.dropdown-display').click()
        const allValuesFromDropDownMenu = await page.locator(".dropdown-content label").allTextContents()
        expect(allSpecialties).toEqual(allValuesFromDropDownMenu)
        await page.getByRole('checkbox', { name: 'oncology' }).check()
        await page.locator('.dropdown-display').click()
        await page.getByText('Save Vet').click()
        await expect(page.getByRole('row', { name: 'Sharon Jenkins' }).getByRole('cell').nth(1)).toHaveText('oncology')
        await page.getByRole('link', { name: 'Specialties' }).click()
        await page.locator('tbody tr').last().getByRole('button', { name: "Delete" }).click()
        await page.getByRole('button', { name: 'VETERINARIANS ' }).click()
        await page.getByRole('link', { name: 'All' }).click()
        await expect(page.getByRole('row', { name: 'Sharon Jenkins' }).getByRole('cell').nth(1)).toBeEmpty()
    })

})
