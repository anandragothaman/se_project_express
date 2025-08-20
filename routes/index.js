const router = require("express").Router();

const { NOT_FOUND } = require("../utils/errors");

const usersRouter = require("./users");

const clothingItemsRouter = require("./clothingItems");

const { login, createUser } = require("../controllers/users");

router.use("/items", clothingItemsRouter);
router.use("/users", usersRouter);
router.post("/signin", login);
router.post("/signup", createUser);
router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});
module.exports = router;
