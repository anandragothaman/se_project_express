const router = require("express").Router();

const auth = require("../middlewares/auth");

const { getCurrentUser, updateProfile } = require("../controllers/users");

const { validateUpdateProfile } = require("../middlewares/validation");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, validateUpdateProfile, updateProfile);

module.exports = router;
