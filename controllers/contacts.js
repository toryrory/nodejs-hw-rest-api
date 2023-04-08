const contacts = require("../models/contacts");

const { httpError, ctrlWrapper } = require("../helpers/index");

const schemas = require("../schemas/contacts");

const getContactList = async (req, res) => {
  const result = await contacts.listContacts();
  res.json(result);
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const result = await contacts.getContactById(contactId);
  if (!result) {
    throw httpError(404, "Not found");
  }
  res.json(result);
};

const addContact = async (req, res) => {
  const { error } = schemas.addSchema.validate(req.body);
  if (error) {
    throw httpError(400, error.message);
  }
  const result = await contacts.addContact(req.body); // schemas
  res.status(201).json(result);
};

const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await contacts.removeContact(contactId);
  if (!result) {
    throw httpError(404, "Not found");
  }
  res.json({ message: "contact deleted" });
};

const updateContact = async (req, res) => {
  const { error } = schemas.updateSchema.validate(req.body);
  if (error) {
    throw httpError(400, error.message);
  }
  const { contactId } = req.params;
  const result = await contacts.updateContact(contactId, req.body); // schema
  if (!result) {
    throw httpError(404, "Not found");
  }
  res.json(result);
};

module.exports = {
  getContactList: ctrlWrapper(getContactList),
  getContactById: ctrlWrapper(getContactById),
  addContact: ctrlWrapper(addContact),
  deleteContact: ctrlWrapper(deleteContact),
  updateContact: ctrlWrapper(updateContact),
};
