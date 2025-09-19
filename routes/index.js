const router = require("express").Router();

const { NOT_FOUND } = require("../utils/errors");

const usersRouter = require("./users");

const clothingItemsRouter = require("./clothingItems");

const { login, createUser } = require("../controllers/users");

const { validateSignin, validateSignup } = require("../middlewares/validation");

router.use("/items", clothingItemsRouter);
router.use("/users", usersRouter);
router.post("/signin", validateSignin, login);
router.post("/signup", validateSignup, createUser);
router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});
module.exports = router;
