const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const User = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  CONFLICT,
  OK,
  CREATED,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(OK).send(users);
    })
    .catch((err) => {
      console.error(
        `Error ${err.name} with the message ${err.message} has occurred while executing the code`
      );
      res.status(INTERNAL_SERVER_ERROR).send({
        message: `An error has occurred on the server.`,
      });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  if (!name || !avatar || !email || !password) {
    return res.status(BAD_REQUEST).send({ message: "All fields are required" });
  }
  if (
    typeof name !== "string" ||
    typeof avatar !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return res.status(BAD_REQUEST).send({ message: "Invalid data type" });
  }
  if (name.length < 2 || name.length > 30) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Name must be between 2 and 30 characters" });
  }
  if (!validator.isURL(avatar)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid avatar URL" });
  }
  if (!validator.isEmail(email)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid email format" });
  }
  if (password.length < 8) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Password must be at least 8 characters long" });
  }
  return bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({ name, avatar, email, password: hash }).then((user) => {
        res.status(CREATED).send(user);
      })
    )
    .catch((err) => {
      console.error(
        `Error ${err.name} with the message ${err.message} has occurred while executing the code`
      );
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }
      if (err.name === "MongoServerError" && err.code === 11000) {
        return res.status(CONFLICT).send({ message: "Email already exists" });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: `An error has occurred on the server.`,
      });
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.status(OK).send(user);
    })
    .catch((err) => {
      console.error(
        `Error ${err.name} with the message ${err.message} has occurred while executing the code`
      );
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Data not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: `An error has occurred on the server.`,
      });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password are required" });
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(OK).send({ token });
    })
    .catch((err) => {
      console.error(
        `Error ${err.name} with the message ${err.message} has occurred while executing the code`
      );
      if (err.name === "UnauthorizedError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid credentials" });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: `An error has occurred on the server.`,
      });
    });
};

const updateProfile = (req, res) => {
  const { name, avatar } = req.body;
  if (!name || !avatar) {
    return res.status(BAD_REQUEST).send({ message: "All fields are required" });
  }
  if (typeof name !== "string" || typeof avatar !== "string") {
    return res.status(BAD_REQUEST).send({ message: "Invalid data type" });
  }
  if (name.length < 2 || name.length > 30) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Name must be between 2 and 30 characters" });
  }
  if (!validator.isURL(avatar)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid avatar URL" });
  }
  return User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => {
      res.status(OK).send(user);
    })
    .catch((err) => {
      console.error(
        `Error ${err.name} with the message ${err.message} has occurred while executing the code`
      );
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Data not found" });
      }
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: `An error has occurred on the server.`,
      });
    });
};
module.exports = { getUsers, createUser, getCurrentUser, login, updateProfile };
