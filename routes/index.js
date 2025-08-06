const router = require("express").Router();

const { INTERNAL_SERVER_ERROR } = require("../utils/errors");

const usersRouter = require("./users");

const clothingItemsRouter = require("./clothingItems");

router.use("/items", clothingItemsRouter);
router.use("/users", usersRouter);
router.use((req, res) => {
  res
    .status(INTERNAL_SERVER_ERROR)
    .send({ message: "Requested resource not found" });
});
module.exports = router;
