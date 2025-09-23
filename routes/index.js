const router = require("express").Router();

const usersRouter = require("./users");

const clothingItemsRouter = require("./clothingItems");

const { login, createUser } = require("../controllers/users");

const { validateSignin, validateSignup } = require("../middlewares/validation");
const NotFoundError = require("../errors/not-found-error");

router.use("/items", clothingItemsRouter);
router.use("/users", usersRouter);
router.post("/signin", validateSignin, login);
router.post("/signup", validateSignup, createUser);
router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});
module.exports = router;
