const Contact = require("../Model/contactModel");

const createContact = async (req, res) => {
  const { fullName, email, course, message } = req.body;

  if (!fullName || !email || !course || !message) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  try {
    let response = await new Contact({ fullName, email, course, message });
    response = await response.save();
    console.log(response);
    res.status(201).json({
      msg: "Contact message submitted successfully",
      contact: response,
    });
  } catch (error) {
    console.error("Create Contact Error:", error);
    res.status(500).json({ msg: "Server error. Could not submit contact." });
  }
};

// Get All Contacts (optional for admin)
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ contacts });
  } catch (err) {
    console.error("Get Contacts Error:", err);
    res.status(500).json({ msg: "Failed to fetch contact messages" });
  }
};

const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({ msg: "Contact message not found" });
    }

    res.status(200).json({ msg: "Contact message deleted successfully", contact });
  } catch (error) {
    console.error("Delete Contact Error:", error);
    res.status(500).json({ msg: "Something went wrong while deleting" });
  }
};




module.exports = {createContact, getAllContacts, deleteContact};