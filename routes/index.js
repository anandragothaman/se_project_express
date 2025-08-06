const router = require("express").Router();

const { NOT_FOUND } = require("../utils/errors");

const usersRouter = require("./users");

const clothingItemsRouter = require("./clothingItems");

router.use("/items", clothingItemsRouter);
router.use("/users", usersRouter);
router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});
module.exports = router;
