const { User } = require("../models/user");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_KEY, BASE_URL } = process.env;
const { httpError, ctrlWrapper, sendEmail } = require("../helpers");
const gravatar = require("gravatar"); // пакет который генерирует шаблонную аватарку
const Jimp = require("jimp");
const path = require("path");
const fs = require("fs/promises");
const { uid } = require("uid");

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw httpError(409, "Email in use");
  }
  const createHashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = uid();

  const newUser = await User.create({
    ...req.body,
    password: createHashPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "test verify email2",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click to verify</a>`, // у каждого юзера должен быть уникальный адрес для верификации.  BASE_URL что бы при деплое, когда вместо локалхост подставится другой адресс ничего не полетело, и скорее всего нужно будет допавить его в переменные окружения
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const verification = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw httpError(404, "User not found");
  }

  await User.findByIdAndUpdate(user._id, { verificationToken: null, verify: true });

  res.json({ message: "Verification successful" });
}

const repeatVerify = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw httpError(400, "missing required field email");
  }
  if (user.verify) {
    throw httpError(400, "Verification has already been passed");
  }
   const verifyEmail = {
     to: email,
     subject: "test verify email2 repeaet",
     html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click to verify</a>`, // у каждого юзера должен быть уникальный адрес для верификации.  BASE_URL что бы при деплое, когда вместо локалхост подставится другой адресс ничего не полетело, и скорее всего нужно будет допавить его в переменные окружения
   };

  await sendEmail(verifyEmail);
  
  res.json({ message: "Verification email sent" });
}

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw httpError(401, "Email or password is wrong");
  }
  if (!user.verify) {
    throw httpError(403, "Email not verified"); // 401?
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw httpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token: token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};
const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};
const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).json();
};
const updateSubscription = async (req, res) => {
  const { _id } = req.user;
  const result = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  }).select("subscription");
  res.json(result);
};
const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempPath, originalname } = req.file; // путь к временной папке
  const fileName = `xs_${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, fileName); // путь к постоянной папке

  await fs.rename(tempPath, resultUpload); // перезаписываем место хранения файла на постоянное
  const avatarURL = path.join("public", "avatars", fileName);

  const image = await Jimp.read(avatarURL);
  image.resize(250, 250).write(avatarURL);

  await User.findByIdAndUpdate(_id, { avatarURL }); // записываем путь к фалу в БД

  res.json({
    avatarURL,
  });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
  verification: ctrlWrapper(verification),
  repeatVerify: ctrlWrapper(repeatVerify),
};
