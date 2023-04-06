const express = require('express')

const contacts = require('../../models/contacts')

const {httpError} = require('../../helpers')

const schemas = require('../../schemas/contacts')

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const result = await contacts.listContacts();
    res.json(result);
  } catch (error) {
    next(error);
  }
})

router.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contacts.getContactById(contactId);
    if (!result) {
      throw httpError(404, "Not found");
    }
    res.json(result)
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { error } = schemas.addSchema.validate(req.body);
    if (error) {
      throw httpError(400, error.message);
    }
    const result = await contacts.addContact(req.body) // schemas
    res.status(201).json(result)
  } catch (error) {
    next(error);
  }
})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contacts.removeContact(contactId);
    if (!result) {
      throw httpError(404, "Not found");
    }
     res.json({ message: "contact deleted" });
   } catch (error) {
     next(error);
   }
})

router.put('/:contactId', async (req, res, next) => {
  try {
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
 } catch (error) {
  next(error);
 }
})

module.exports = router
