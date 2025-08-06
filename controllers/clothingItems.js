const ClothingItem = require("../models/clothingItem");

const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((clothingItems) => {
      res.status(200).send(clothingItems);
    })
    .catch((err) => {
      console.log("Error occurred:", err);
      res.status(500).send({ message: err.message });
    });
};
const createClothingItem = (req, res) => {
  const { name, weather, imageUrl, owner } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((clothingItem) => {
      res.status(201).send(clothingItem);
    })
    .catch((err) => {
      console.log("Error occurred:", err);
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};
const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      console.log("Error occurred:", err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};
module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
};
