const { Builder, By, Key, until } = require('selenium-webdriver');

(async function phonebookTest() {
    // Create a new instance of the Chrome driver
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // Navigate to the phonebook application
        await driver.get('http://localhost:3000'); // Change to your URL

        // Add a contact
        await driver.findElement(By.id('contactName')).sendKeys('John Doe');
        await driver.findElement(By.id('phoneNumber')).sendKeys('1234567890');
        await driver.findElement(By.id('email')).sendKeys('john@example.com');
        await driver.findElement(By.id('address')).sendKeys('123 Elm Street');
        await driver.findElement(By.id('addContactBtn')).click(); // Change to your button ID

        // Wait for the success message
        await driver.wait(until.elementLocated(By.id('successMessage')), 3000);

        // Search for the contact
        await driver.findElement(By.id('searchInput')).sendKeys('1234567890', Key.RETURN); // Change to your search input ID

        // Wait for the contact to appear
        await driver.wait(until.elementLocated(By.id('contactResult')), 3000); // Change to your result element ID

        // Update the contact
        await driver.findElement(By.id('updateContactBtn')).click(); // Change to your update button ID
        await driver.findElement(By.id('contactName')).clear();
        await driver.findElement(By.id('contactName')).sendKeys('John Smith');
        await driver.findElement(By.id('updateBtn')).click(); // Change to your update button ID

        // Delete the contact
        await driver.findElement(By.id('deleteContactBtn')).click(); // Change to your delete button ID

    } catch (error) {
        console.error('Error during the test:', error);
    } finally {
        // Close the browser
        await driver.quit();
    }
})();
