const ClothingItem = require("../models/clothingItem");
const { BAD_REQUEST, OK, FORBIDDEN, CREATED } = require("../utils/errors");
const NotFoundError = require("../errors/not-found-error");
const BadRequestError = require("../errors/bad-request-error");

const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((clothingItems) => {
      res.send(clothingItems);
    })
    .catch((err) => {
      next(err);
    });
};
const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((clothingItem) => {
      res.status(CREATED).send(clothingItem);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
      }
      next(err);
    });
};
const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;
  if (!itemId) {
    throw new NotFoundError("Item ID is required");
  }
  return ClothingItem.findById(itemId)
    .orFail()
    .then((clothingItem) => {
      if (clothingItem.owner.toString() !== req.user._id) {
        return res
          .status(FORBIDDEN)
          .send({ message: "You do not have permission to delete this item" });
      }
      return clothingItem;
    })
    .then(() => ClothingItem.findByIdAndDelete(itemId))
    .then(() => res.status(OK).send({}))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Data not found"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid data"));
      }
      next(err);
    });
};

const likeClothingItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((clothingItem) => res.status(OK).send(clothingItem))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Data not found"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid data"));
      }
      next(err);
    });
};

const unlikeClothingItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((clothingItem) => res.status(OK).send(clothingItem))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Data not found"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid data"));
      }
      next(err);
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  unlikeClothingItem,
};
