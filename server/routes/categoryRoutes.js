const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const auth = require("../middleware/authMiddleware");

// 🔐 GET categories ของ user
router.get("/", auth, async (req, res) => {
  const categories = await Category.find({
    user: req.user.id,
  });

  res.json(categories);
});

// 🔐 CREATE category
router.post("/", auth, async (req, res) => {
  const newCategory = new Category({
    ...req.body,
    user: req.user.id,
  });

  await newCategory.save();

  res.json(newCategory);
});

// 🔐 DELETE category
router.delete("/:id", auth, async (req, res) => {
  await Category.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id, // 🔥 กันลบของคนอื่น
  });

  res.json({ message: "Category deleted" });
});

module.exports = router;