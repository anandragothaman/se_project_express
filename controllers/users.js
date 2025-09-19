const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { OK, CREATED } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");
const NotFoundError = require("../errors/not-found-error");
const BadRequestError = require("../errors/bad-request-error");
const ConflictError = require("../errors/conflict-error");
const UnauthorizedError = require("../errors/unauthrized-error");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  return bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({ name, avatar, email, password: hash }).then((user) => {
        res.status(CREATED).send({
          name: user.name,
          avatar: user.avatar,
          email: user.email,
          _id: user._id,
        });
      })
    )
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
      }
      if (err.name === "MongoServerError" && err.code === 11000) {
        next(new ConflictError("Email already exists"));
      }
      next(err);
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
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Data not found"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid data"));
      }
      next(err);
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(OK).send({ token });
    })
    .catch((err) => {
      if (err.name === "UnauthorizedError") {
        next(new UnauthorizedError("Invalid credentials"));
      }
      next(err);
    });
};

const updateProfile = (req, res) => {
  const { name, avatar } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => {
      if (!user) {
        throw new NotFoundError("No user with matching ID found");
      }
      res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Data not found"));
      }
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid data"));
      }
      next(err);
    });
};
module.exports = { createUser, getCurrentUser, login, updateProfile };
