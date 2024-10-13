class ContactNode {
    constructor(phoneNumber, contactName, email, address) {
        this.phoneNumber = phoneNumber;
        this.contactName = contactName;
        this.email = email;
        this.address = address;
        this.left = null;
        this.right = null;
    }
}

class ContactBST {
    constructor() {
        this.root = null;
    }

    // Insert a new contact
    insert(phoneNumber, contactName, email, address) {
        const newNode = new ContactNode(phoneNumber, contactName, email, address);
        if (this.root === null) {
            this.root = newNode;
        } else {
            this.root = this.insertNode(this.root, newNode);
        }
    }

    insertNode(node, newNode) {
        if (newNode.phoneNumber < node.phoneNumber) {
            if (node.left === null) {
                node.left = newNode;
            } else {
                node.left = this.insertNode(node.left, newNode);
            }
        } else if (newNode.phoneNumber > node.phoneNumber) {
            if (node.right === null) {
                node.right = newNode;
            } else {
                node.right = this.insertNode(node.right, newNode);
            }
        }
        return node;
    }

    // Search for a contact by phone number
    search(phoneNumber) {
        return this.searchNode(this.root, phoneNumber);
    }

    searchNode(node, phoneNumber) {
        if (node === null) {
            return null;
        }
        if (phoneNumber < node.phoneNumber) {
            return this.searchNode(node.left, phoneNumber);
        } else if (phoneNumber > node.phoneNumber) {
            return this.searchNode(node.right, phoneNumber);
        } else {
            return node; // Contact found
        }
    }

    // Update an existing contact
    update(phoneNumber, newContactName, newEmail, newAddress) {
        const contactNode = this.search(phoneNumber);
        if (contactNode) {
            contactNode.contactName = newContactName;
            contactNode.email = newEmail;
            contactNode.address = newAddress;
            return true;
        }
        return false;
    }

    // Delete a contact
    delete(phoneNumber) {
        this.root = this.deleteNode(this.root, phoneNumber);
    }

    deleteNode(node, phoneNumber) {
        if (node === null) {
            return null;
        }

        if (phoneNumber < node.phoneNumber) {
            node.left = this.deleteNode(node.left, phoneNumber);
        } else if (phoneNumber > node.phoneNumber) {
            node.right = this.deleteNode(node.right, phoneNumber);
        } else {
            // Node found, now delete it
            if (node.left === null && node.right === null) {
                node = null;
            } else if (node.left === null) {
                node = node.right;
            } else if (node.right === null) {
                node = node.left;
            } else {
                const minNode = this.findMinNode(node.right);
                node.phoneNumber = minNode.phoneNumber;
                node.contactName = minNode.contactName;
                node.email = minNode.email;
                node.address = minNode.address;
                node.right = this.deleteNode(node.right, minNode.phoneNumber);
            }
        }
        return node;
    }

    findMinNode(node) {
        while (node.left !== null) {
            node = node.left;
        }
        return node;
    }

    // View all contacts (inorder traversal)
    viewAllContacts() {
        const contacts = [];
        this.inOrderTraversal(this.root, contacts);
        return contacts;
    }

    inOrderTraversal(node, contacts) {
        if (node !== null) {
            this.inOrderTraversal(node.left, contacts);
            contacts.push({
                phoneNumber: node.phoneNumber,
                contactName: node.contactName,
                email: node.email,
                address: node.address
            });
            this.inOrderTraversal(node.right, contacts);
        }
    }
}

const contactBST = new ContactBST();

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
        contactBST.insert(phoneNumber, contactName, email, address);
        document.getElementById('result').innerText = 'Contact added successfully.';
        document.getElementById('addContactForm').reset();
    } else {
        document.getElementById('result').innerText = 'Please fill in all fields.';
    }
}

// Search for a contact
function searchContact() {
    const phoneNumber = document.getElementById('searchPhoneNumber').value.trim();
    const phoneRegex = /^\d{10}$/;

    if (!phoneRegex.test(phoneNumber)) {
        document.getElementById('result').innerText = 'Phone number must be exactly 10 digits.';
        return;
    }

    const contact = contactBST.search(phoneNumber);
    if (contact) {
        document.getElementById('result').innerText = `Name: ${contact.contactName}, Email: ${contact.email}, Address: ${contact.address}`;
    } else {
        document.getElementById('result').innerText = 'Contact not found.';
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

    if (!phoneRegex.test(phoneNumber)) {
        document.getElementById('result').innerText = 'Phone number must be exactly 10 digits.';
        return;
    }
    if (!emailRegex.test(email)) {
        document.getElementById('result').innerText = 'Please enter a valid email address.';
        return;
    }

    const isUpdated = contactBST.update(phoneNumber, contactName, email, address);
    if (isUpdated) {
        document.getElementById('result').innerText = 'Contact updated successfully.';
        document.getElementById('updateContactForm').reset();
    } else {
        document.getElementById('result').innerText = 'Contact not found.';
    }
}

// Delete a contact
function deleteContact() {
    const phoneNumber = document.getElementById('deletePhoneNumber').value.trim();
    
    if (phoneNumber) {
        contactBST.delete(phoneNumber);
        document.getElementById('result').innerText = 'Contact deleted successfully.';
        document.getElementById('deleteContactForm').reset();
    } else {
        document.getElementById('result').innerText = 'Please enter a phone number to delete.';
    }
}

// View all contacts
function viewAllContacts() {
    const contacts = contactBST.viewAllContacts();
    if (contacts.length > 0) {
        const contactsList = contacts.map(contact => 
            `Phone: ${contact.phoneNumber}, Name: ${contact.contactName}, Email: ${contact.email}, Address: ${contact.address}`
        ).join('\n');
        document.getElementById('result').innerText = contactsList;
    } else {
        document.getElementById('result').innerText = 'No contacts available.';
    }
}
