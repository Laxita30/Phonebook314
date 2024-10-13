const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

async function testContactManager() {
    // Initialize WebDriver (Chrome in this case)
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // Go to your web application
        await driver.get('http://localhost:3000');

        // Add a new contact
        await driver.findElement(By.id('phoneNumber')).sendKeys('1234567890');
        await driver.findElement(By.id('contactName')).sendKeys('John Doe');
        await driver.findElement(By.id('email')).sendKeys('john.doe@example.com');
        await driver.findElement(By.id('address')).sendKeys('123 Elm Street');
        await driver.findElement(By.id('addContactButton')).click();

        // Wait for the result message and validate the response
        let resultMessage = await driver.wait(until.elementLocated(By.id('result')), 3000).getText();
        assert.strictEqual(resultMessage, 'Contact added successfully.');

        // Search for the added contact
        await driver.findElement(By.id('searchPhoneNumber')).sendKeys('1234567890');
        await driver.findElement(By.id('searchContactButton')).click();

        // Validate search result
        let searchResult = await driver.wait(until.elementLocated(By.id('result')), 3000).getText();
        assert.ok(searchResult.includes('John Doe'));

        // Update the contact
        await driver.findElement(By.id('updatePhoneNumber')).sendKeys('1234567890');
        await driver.findElement(By.id('newContactName')).sendKeys('John Updated');
        await driver.findElement(By.id('newEmail')).sendKeys('john.updated@example.com');
        await driver.findElement(By.id('newAddress')).sendKeys('456 Oak Avenue');
        await driver.findElement(By.id('updateContactButton')).click();

        // Wait for the update confirmation
        resultMessage = await driver.wait(until.elementLocated(By.id('result')), 3000).getText();
        assert.strictEqual(resultMessage, 'Contact updated successfully.');

        // Delete the contact
        await driver.findElement(By.id('deletePhoneNumber')).sendKeys('1234567890');
        await driver.findElement(By.id('deleteContactButton')).click();

        // Validate deletion
        resultMessage = await driver.wait(until.elementLocated(By.id('result')), 3000).getText();
        assert.strictEqual(resultMessage, 'Contact deleted successfully.');
    } catch (err) {
        console.error('Test failed', err);
    } finally {
        // Close the browser
        await driver.quit();
    }
}

testContactManager();
