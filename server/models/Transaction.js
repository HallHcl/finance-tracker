const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  type: {
    type: String,
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  category: String,
  detail: String,

  date: {
    type: Date,
    default: Date.now,
  },

  account: String,
  note: String,

  // 🔥 RECURRING SYSTEM
  isRecurring: {
    type: Boolean,
    default: false,
  },

  frequency: {
    type: String,
    enum: ["daily", "weekly", "monthly", "yearly"],
  },

  nextRun: {
    type: Date,
  },

  // 🔥 คุมเปิด/ปิด recurring
  isActive: {
    type: Boolean,
    default: true,
  },

}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);