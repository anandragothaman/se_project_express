const router = require("express").Router();

const auth = require("../middlewares/auth");

const {
  getUsers,
  getCurrentUser,
  updateProfile,
} = require("../controllers/users");

router.get("/", getUsers);
router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateProfile);

module.exports = router;
