const router = require("express").Router();
const usersRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");
router.use("/items", clothingItemsRouter);
router.use("/users", usersRouter);
module.exports = router;
