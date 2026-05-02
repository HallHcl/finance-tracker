const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const auth = require("../middleware/authMiddleware");

// 🔐 GET (เฉพาะของ user)
router.get("/", auth, async (req, res) => {
  const transactions = await Transaction.find({
    user: req.user.id,
  });

  res.json(transactions);
});


// 🔐 POST
router.post("/", auth, async (req, res) => {
  const newTransaction = new Transaction({
    ...req.body,
    user: req.user.id,
  });

  await newTransaction.save();

  res.json(newTransaction);
});


// 🔐 DELETE
router.delete("/:id", auth, async (req, res) => {
  await Transaction.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });

  res.json({ message: "Deleted" });
});

// 🔐 GET ONE (เอาไป pre-fill)
router.get("/:id", auth, async (req, res) => {
  const transaction = await Transaction.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!transaction) {
    return res.status(404).json({ message: "Not found" });
  }

  res.json(transaction);
});


// 🔐 UPDATE
router.put("/:id", auth, async (req, res) => {
  const updated = await Transaction.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user.id,
    },
    req.body,
    { new: true }
  );

  if (!updated) {
    return res.status(404).json({ message: "Not found" });
  }

  res.json(updated);
});

module.exports = router;