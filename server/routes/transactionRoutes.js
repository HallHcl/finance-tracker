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

module.exports = router;