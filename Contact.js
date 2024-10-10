// models/Contact.js
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true },
  contactName: { type: String, required: true },
  email: { type: String, required: false },
  address: { type: String, required: false },
});

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;
