const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      unique: true,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId, // особенный тип данных, означает что тут будет лежать айди генерируемый MongoDB из коллекции users
      ref: "user", // название коллекции (в единственном числе), в которой хранятся пользователи.
    },
  },
  { versionKey: false }
);

contactSchema.post("save", handleMongooseError);

const Contact = model("contact", contactSchema); // Contact это клас который будет работать с коллекицей contacts

const addSchema = Joi.object({
  name: Joi.string().required().error(new Error("missing required name field")),
  email: Joi.string()
    .required()
    .error(new Error("missing required email field")),
  phone: Joi.string()
    .required()
    .error(new Error("missing required phone field")),
});

const updateSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().optional(),
  phone: Joi.string().optional(),
})
  .required()
  .min(1)
  .error(new Error("missing fields"));

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required().error(new Error("missing field favorite")),
});
const schemas = {
  addSchema,
  updateSchema,
  updateFavoriteSchema,
};
module.exports = {
  Contact,
  schemas,
};
