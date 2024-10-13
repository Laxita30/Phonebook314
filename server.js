const express = require('express');
const app = express();
const port = 5000;

// Middleware to parse JSON request bodies
app.use(express.json());

// ContactNode and ContactBST (same classes as the frontend)
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

// Initialize contact BST
const contactBST = new ContactBST();

// Routes

// Add a new contact
app.post('/addContact', (req, res) => {
    const { phoneNumber, contactName, email, address } = req.body;
    
    if (phoneNumber && contactName && email && address) {
        contactBST.insert(phoneNumber, contactName, email, address);
        res.json({ message: 'Contact added successfully.' });
    } else {
        res.status(400).json({ message: 'Please provide all required fields.' });
    }
});

// Search for a contact
app.get('/searchContact/:phoneNumber', (req, res) => {
    const phoneNumber = req.params.phoneNumber;
    const contact = contactBST.search(phoneNumber);

    if (contact) {
        res.json(contact);
    } else {
        res.status(404).json({ message: 'Contact not found.' });
    }
});

// Update an existing contact
app.put('/updateContact/:phoneNumber', (req, res) => {
    const phoneNumber = req.params.phoneNumber;
    const { contactName, email, address } = req.body;

    const isUpdated = contactBST.update(phoneNumber, contactName, email, address);

    if (isUpdated) {
        res.json({ message: 'Contact updated successfully.' });
    } else {
        res.status(404).json({ message: 'Contact not found.' });
    }
});

// Delete a contact
app.delete('/deleteContact/:phoneNumber', (req, res) => {
    const phoneNumber = req.params.phoneNumber;

    contactBST.delete(phoneNumber);
    res.json({ message: 'Contact deleted successfully.' });
});

// View all contacts
app.get('/viewAllContacts', (req, res) => {
    const contacts = contactBST.viewAllContacts();

    if (contacts.length > 0) {
        res.json(contacts);
    } else {
        res.json({ message: 'No contacts available.' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
