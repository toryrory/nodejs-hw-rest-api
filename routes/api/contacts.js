const express = require('express');

const ctrl = require('../../controllers/contacts');
const { validateBody } = require('../../middlewares');
const schemas = require("../../schemas/contacts");

const router = express.Router()

router.get('/', ctrl.getContactList)

router.get("/:contactId", ctrl.getContactById);

router.post("/",validateBody(schemas.addSchema), ctrl.addContact);

router.delete("/:contactId", ctrl.deleteContact);

router.put("/:contactId",validateBody(schemas.updateSchema), ctrl.updateContact);

module.exports = router
