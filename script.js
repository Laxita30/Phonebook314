const API_URL = 'http://localhost:5000';

// Add a new contact
function addContact() {
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const contactName = document.getElementById('contactName').value.trim();
    const email = document.getElementById('email').value.trim();
    const address = document.getElementById('address').value.trim();

    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^\S+@\S+\.\S+$/;

    // Validate phone number and email
    if (!phoneRegex.test(phoneNumber)) {
        document.getElementById('result').innerText = 'Phone number must be exactly 10 digits.';
        return;
    }
    if (!emailRegex.test(email)) {
        document.getElementById('result').innerText = 'Please enter a valid email address.';
        return;
    }

    if (phoneNumber && contactName && email && address) {
        fetch(`${API_URL}/addContact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phoneNumber, contactName, email, address })
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('result').innerText = data.message;
            document.getElementById('addContactForm').reset();
        })
        .catch(error => console.error('Error:', error));
    } else {
        document.getElementById('result').innerText = 'Please fill in all fields.';
    }
}

// Search for a contact
function searchContact() {
    const phoneNumber = document.getElementById('searchPhoneNumber').value.trim();
    const phoneRegex = /^\d{10}$/;
     // Validate phone number
     if (!phoneRegex.test(phoneNumber)) {
        document.getElementById('result').innerText = 'Phone number must be exactly 10 digits.';
        return;
    }

    if (phoneNumber) {
        fetch(`${API_URL}/searchContact/${phoneNumber}`)
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                document.getElementById('result').innerText = data.message;
            } else {
                document.getElementById('result').innerText = `Name: ${data.contactName}, Email: ${data.email}, Address: ${data.address}`;
            }
        })
        .catch(error => console.error('Error:', error));
    } else {
        document.getElementById('result').innerText = 'Please enter a phone number to search.';
    }
}

// Update an existing contact
function updateContact() {
    const phoneNumber = document.getElementById('updatePhoneNumber').value.trim();
    const contactName = document.getElementById('newContactName').value.trim();
    const email = document.getElementById('newEmail').value.trim();
    const address = document.getElementById('newAddress').value.trim();

    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^\S+@\S+\.\S+$/;

    // Validate phone number and email
    if (!phoneRegex.test(phoneNumber)) {
        document.getElementById('result').innerText = 'Phone number must be exactly 10 digits.';
        return;
    }
    if (!emailRegex.test(email)) {
        document.getElementById('result').innerText = 'Please enter a valid email address.';
        return;
    }

    if (phoneNumber && contactName && email && address) {
        fetch(`${API_URL}/updateContact/${phoneNumber}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ contactName, email, address })
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('result').innerText = data.message;
            document.getElementById('updateContactForm').reset();
        })
        .catch(error => console.error('Error:', error));
    } else {
        document.getElementById('result').innerText = 'Please fill in all fields.';
    }
}

// Delete a contact
function deleteContact() {
    const phoneNumber = document.getElementById('deletePhoneNumber').value.trim();
    if (phoneNumber) {
        fetch(`${API_URL}/deleteContact/${phoneNumber}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('result').innerText = data.message;
            document.getElementById('deleteContactForm').reset();
        })
        .catch(error => console.error('Error:', error));
    } else {
        document.getElementById('result').innerText = 'Please enter a phone number to delete.';
    }
}
// View all contacts
function viewAllContacts() {
    fetch(`${API_URL}/viewAllContacts`)
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            document.getElementById('result').innerText = data.message;
        } else {
            // Update the field names to match the actual structure
            const contactsList = data.map(contact => 
                `Phone: ${contact.phoneNumber}, Name: ${contact.contactName}, Email: ${contact.email}, Address: ${contact.address}`
            ).join('\n');
            document.getElementById('result').innerText = contactsList;
        }
    })
    .catch(error => console.error('Error:', error));
}

