const router = require("express").Router();
const { NOT_FOUND } = require("../utils/errors");
const { getUsers, createUser, getUser } = require("../controllers/users");

router.get("/", getUsers);
router.get("/:userId", getUser);
router.post("/", createUser);
router.use((req, res, next) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});
module.exports = router;
