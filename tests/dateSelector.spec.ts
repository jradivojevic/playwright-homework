import test, { expect } from "@playwright/test"


test.describe('Date Selector', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("/")
    })


    test('Test Case 1: Select the desired date in the calendar', async ({ page }) => {
        await page.getByRole('button', { name: 'Owners' }).click()
        await page.getByRole('link', { name: 'Search' }).click()
        await page.getByRole('link', { name: 'Harold Davis' }).click()
        await page.getByRole('button', { name: 'Add New Pet' }).click()
        const icon = page.locator('#name + .form-control-feedback')
        await page.locator('#name').fill('Tom')
        await expect(icon).toHaveClass(/glyphicon-ok/)
        await page.getByLabel('Open calendar').click()
        const birthYear = '2014';
        const birthMonth = '05';
        const birthDay = '02';
        const dateToAssert = `${birthYear}/${birthMonth}/${birthDay}`
        await page.getByLabel('Choose month and year').click()
        await page.getByLabel('Previous 24 years').click()
        await page.getByRole('button', { name: birthYear }).click()
        await page.getByLabel(`${birthMonth} ${birthYear}`).click()
        await page.getByLabel(dateToAssert).click()
        await expect(page.locator('[name="birthDate"]')).toHaveValue(dateToAssert)
        await page.locator('#type').selectOption('dog')
        await page.getByRole('button', { name: 'Save Pet' }).click()
        const tomPetDetailsSection = page.locator('td', { hasText: 'Tom' })
        await expect(tomPetDetailsSection.locator('dd').nth(0)).toHaveText('Tom')
        await expect(tomPetDetailsSection.locator('dd').nth(1)).toHaveText(`${birthYear}-${birthMonth}-${birthDay}`)
        await expect(tomPetDetailsSection.locator('dd').nth(2)).toHaveText('dog')
        await tomPetDetailsSection.getByRole('button', { name: 'Delete Pet' }).last().click()
        await expect(tomPetDetailsSection).not.toBeVisible()
    });

    test('Test Case 2: Select the dates of visits and validate dates order', async ({ page }) => {
        await page.getByRole('button', { name: 'Owners' }).click()
        await page.getByRole('link', { name: 'Search' }).click()
        await page.getByRole('link', { name: 'Jean Coleman' }).click()
        const petsAndVisitsRowSamatha = page.locator('app-pet-list', { hasText: 'Samantha' })
        await petsAndVisitsRowSamatha.getByText('Add Visit').click()
        await expect(page.getByRole("heading")).toHaveText("New Visit")
        await expect(page.locator('tr', { hasText: 'Samantha' })).toContainText('Jean Coleman')
        await page.getByLabel('Open calendar').click()
        await page.locator('span.mat-calendar-body-today').click()
        const date = new Date()
        const year = date.getFullYear();
        const month = date.toLocaleString('en-US', { month: '2-digit' })
        const day = date.toLocaleString('en-US', { day: '2-digit' })
        const expectedDermatologyAppointmentDate = `${year}-${month}-${day}`
        await expect(page.locator('.mat-datepicker-input')).toHaveValue(`${year}/${month}/${day}`)
        await page.locator('#description').fill('dermatology visit')
        await page.getByRole('button', { name: 'Add Visit' }).click()
        await expect(petsAndVisitsRowSamatha.locator('app-visit-list tr td').first()).toHaveText(expectedDermatologyAppointmentDate)
        await petsAndVisitsRowSamatha.getByText('Add Visit').click()
        await page.getByLabel('Open calendar').click()
        date.setDate(date.getDate() - 45)
        const previousAppointmentYear = date.getFullYear();
        const previousAppointmentMonth = date.toLocaleString('en-US', { month: '2-digit' })
        const previousAppointmentDayNumeric = date.toLocaleString('en-US', { day: 'numeric' })
        const previousAppointmentDay2Digit = date.toLocaleString('en-US', { day: '2-digit' })
        const expectedMassageAppointmentDate = `${previousAppointmentYear}-${previousAppointmentMonth}-${previousAppointmentDay2Digit}`;
        let calendarMonthAndYear = await page.locator('.mat-calendar-period-button').textContent()
        while (!calendarMonthAndYear?.includes(`${previousAppointmentMonth} ${previousAppointmentYear}`)) {
            await page.locator('.mat-calendar-previous-button').click()
            calendarMonthAndYear = await page.locator('.mat-calendar-period-button').textContent()
        }
        await page.getByText(previousAppointmentDayNumeric, { exact: true }).click()
        await page.locator('#description').fill('massage therapy')
        await page.getByText('Add Visit').click()
        const petAllAppointments = petsAndVisitsRowSamatha.locator('app-visit-list tr')
        const laterAppointmentDateforSamathasPet = await petAllAppointments.nth(1).locator('td').first().textContent()
        const currentAppointmentDateforSamathasPet = await petAllAppointments.nth(2).locator('td').first().textContent()
        expect(Date.parse(currentAppointmentDateforSamathasPet!) < Date.parse(laterAppointmentDateforSamathasPet!)).toBeTruthy()
        await petAllAppointments.filter({ hasText: expectedDermatologyAppointmentDate }).getByText('Delete Visit').click()
        await petAllAppointments.filter({ hasText: expectedMassageAppointmentDate }).getByText('Delete Visit').click()
        await page.waitForResponse("https://petclinic-api.bondaracademy.com/petclinic/api/visits/*")
        const samanthaVisitDates = await petAllAppointments.allTextContents()
        expect(samanthaVisitDates).not.toContain(expectedDermatologyAppointmentDate)
        expect(samanthaVisitDates).not.toContain(expectedMassageAppointmentDate)

    });

})