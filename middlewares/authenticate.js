const jwt = require("jsonwebtoken");
const { httpError } = require("../helpers");
const { User } = require("../models/user");
const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  // проверяет, есть ли приставка Bearer и сам токен, валидный ли токен.

  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(httpError(401, "Not authorized")); // некст перерывает функцию
  }
  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) {
      next(httpError(401, "Not authorized"));
    }
    req.user = user; // записываем в обьект req нужного юзера
    next();
  } catch (error) {
    next(httpError(401, "Not authorized"));
  }
};
module.exports = authenticate;
