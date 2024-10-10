const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize the app and configure middleware
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/contactsDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

// Define the Contact schema
const contactSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true, unique: true },
    contactName: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true }
});

// Create the Contact model
const Contact = mongoose.model('Contact', contactSchema);

// Routes

// Add a new contact
app.post('/addContact', async (req, res) => {
    try {
        const { phoneNumber, contactName, email, address } = req.body;
        const newContact = new Contact({ phoneNumber, contactName, email, address });
        await newContact.save();
        res.json({ message: 'Contact added successfully!' });
    } catch (error) {
        if (error.code === 11000) { // Duplicate phone number
            res.status(400).json({ message: 'Phone number already exists.' });
        } else {
            res.status(500).json({ message: 'Server error: Unable to add contact.' });
        }
    }
});

// Search for a contact by phone number
app.get('/searchContact/:phoneNumber', async (req, res) => {
    try {
        const contact = await Contact.findOne({ phoneNumber: req.params.phoneNumber });
        if (contact) {
            res.json(contact);
        } else {
            res.json({ message: 'Contact not found.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error: Unable to search contact.' });
    }
});

// Update an existing contact
app.put('/updateContact/:phoneNumber', async (req, res) => {
    try {
        const { contactName, email, address } = req.body;
        const updatedContact = await Contact.findOneAndUpdate(
            { phoneNumber: req.params.phoneNumber },
            { contactName, email, address },
            { new: true }
        );
        if (updatedContact) {
            res.json({ message: 'Contact updated successfully!' });
        } else {
            res.json({ message: 'Contact not found.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error: Unable to update contact.' });
    }
});

// Delete a contact by phone number
app.delete('/deleteContact/:phoneNumber', async (req, res) => {
    try {
        const deletedContact = await Contact.findOneAndDelete({ phoneNumber: req.params.phoneNumber });
        if (deletedContact) {
            res.json({ message: 'Contact deleted successfully!' });
        } else {
            res.json({ message: 'Contact not found.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error: Unable to delete contact.' });
    }
});

// View all contacts
app.get('/viewAllContacts', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Server error: Unable to retrieve contacts.' });
    }
});
// Start the server
const PORT = process.env.PORT || 5000; // Change to 3000 as per your output
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
