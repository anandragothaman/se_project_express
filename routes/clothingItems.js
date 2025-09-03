const router = require("express").Router();

const auth = require("../middlewares/auth");

const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  unlikeClothingItem,
} = require("../controllers/clothingItems");

router.get("/", getClothingItems);
router.post("/", auth, createClothingItem);
router.delete("/:itemId", auth, deleteClothingItem);
router.put("/likes/:itemId", auth, likeClothingItem);
router.delete("/likes/:itemId", auth, unlikeClothingItem);

module.exports = router;
