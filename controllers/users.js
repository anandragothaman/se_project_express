const User = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  OK,
  CREATED,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

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
        message: `Error from getUsers: An error has occurred on the server.`,
      });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => {
      res.status(CREATED).send(user);
    })
    .catch((err) => {
      console.error(
        `Error ${err.name} with the message ${err.message} has occurred while executing the code`
      );
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: `Error from createUser: ${err.message}` });
      } else {
        return res.status(INTERNAL_SERVER_ERROR).send({
          message: `Error from createUser: An error has occurred on the server.`,
        });
      }
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
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
        return res
          .status(NOT_FOUND)
          .send({ message: `Error from getUser: ${err.message}` });
      } else if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: `Error from getUser: ${err.message}` });
      } else {
        return res.status(INTERNAL_SERVER_ERROR).send({
          message: `Error from getUser: An error has occurred on the server.`,
        });
      }
    });
};
module.exports = { getUsers, createUser, getUser };
