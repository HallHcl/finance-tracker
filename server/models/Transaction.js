const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  type: String,
  amount: Number,
  category: String,
  detail: String,

  // 🔥 เพิ่มใหม่
  date: {
    type: Date,
    default: Date.now,
  },
  account: String,
  note: String,
});

module.exports = mongoose.model("Transaction", transactionSchema);