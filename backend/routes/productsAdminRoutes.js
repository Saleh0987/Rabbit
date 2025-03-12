const express = require("express");
const Product = require("../models/Product");
const {protect, admin} = require("../middleware/authMiddleware");
const router = express.Router();


// get all products
router.get("/", protect, admin, async (req, res) => {
 try {
  const products = await Product.find({});
  res.status(200).json(products);
 } catch (error) {
  console.error(error);
  res.status(404).json({ message: "No products found" });
 }
});

module.exports = router;
