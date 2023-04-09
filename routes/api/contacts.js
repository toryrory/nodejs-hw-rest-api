const express = require('express');

const ctrl = require('../../controllers/contacts');
const { validateBody, isValidId} = require('../../middlewares');
const {schemas} = require("../../models/contact");

const router = express.Router()

router.get('/', ctrl.getContactList)

router.get("/:contactId", isValidId, ctrl.getContactById);

router.post("/",validateBody(schemas.addSchema), ctrl.addContact);

router.delete("/:contactId", isValidId, ctrl.deleteContact);

router.put(
  "/:contactId",
  isValidId,
  validateBody(schemas.updateSchema),
  ctrl.updateContact
);
router.patch(
  "/:contactId/favorite",
  isValidId,
  validateBody(schemas.updateFavoriteSchema),
  ctrl.updateFavorite
);

module.exports = router
