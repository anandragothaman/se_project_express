const router = require("express").Router();

const auth = require("../middlewares/auth");

const {
  validateItemId,
  validateCreateItem,
} = require("../middlewares/validation");

const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  unlikeClothingItem,
} = require("../controllers/clothingItems");

router.get("/", getClothingItems);
router.post("/", auth, validateCreateItem, createClothingItem);
router.delete("/:itemId", auth, validateItemId, deleteClothingItem);
router.put("/:itemId/likes", auth, validateItemId, likeClothingItem);
router.delete("/:itemId/likes", auth, validateItemId, unlikeClothingItem);

module.exports = router;
