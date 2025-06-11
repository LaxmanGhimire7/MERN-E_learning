const {createContact, getAllContacts, deleteContact} = require("../Controller/contactController");
const express = require("express");
const router = express.Router();

router.post("/createContact", createContact);
router.get("/getAllContacts", getAllContacts);
router.delete("/deleteContact/:id", deleteContact);

module.exports = router;