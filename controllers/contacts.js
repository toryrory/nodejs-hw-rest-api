const { Contact } = require("../models/contact");

const { httpError, ctrlWrapper } = require("../helpers/index");

const getContactList = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10, favorite } = req.query; // req.query возвращает параметры запроса, которые идут после "?", например для пагинации
  const skip = (page - 1) * limit;
  const findFilter = favorite ? { owner, favorite } : { owner };
  const result = await Contact.find(findFilter, "", {
    skip,
    limit,
  }).populate("owner", "email subscription"); // что бы вернуть поля обьекта из другой коллекции
  res.json(result);
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findById(contactId);
  if (!result) {
    throw httpError(404, "Not found");
  }
  res.json(result);
};

const addContact = async (req, res) => {
  const { _id: owner } = req.user; // переименовывем айди в овнер
  console.log(req.body);
  const result = await Contact.create({ ...req.body, owner});
  res.status(201).json(result);
};

const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndDelete(contactId);
  if (!result) {
    throw httpError(404, "Not found");
  }
  res.json({ message: "contact deleted" });
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  }); // что бы в Postman показывало обновленный обьект
  if (!result) {
    throw httpError(404, "Not found");
  }
  res.json(result);
};
const updateFavorite = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
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
  updateFavorite: ctrlWrapper(updateFavorite),
};
