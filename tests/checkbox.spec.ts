import {test, expect} from '@playwright/test';

test('verify checkbox', async({page}) =>{
    await page.goto('https://the-internet.herokuapp.com/checkboxes')
    await page.getByText('checkbox 1')
});