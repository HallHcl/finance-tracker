require("dotenv").config();
const mongoose = require("mongoose");
const Transaction = require("./models/Transaction");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected");

    // 🔥 ใส่ userId ของคุณ (จากที่ส่งมา)
    const userId = new mongoose.Types.ObjectId("69f2395db064a6e6e667e98e");

    await Transaction.deleteMany({ user: userId });

    await Transaction.insertMany([
      {
        user: userId,
        type: "income",
        amount: 50000,
        category: "Salary",
        detail: "Monthly salary",
        date: new Date("2026-03-01"),
        account: "Bank",
        note: "March salary",
      },
      {
        user: userId,
        type: "expense",
        amount: 3000,
        category: "Transport",
        detail: "Gas",
        date: new Date("2026-03-02"),
        account: "Cash",
        note: "",
      },
      {
        user: userId,
        type: "expense",
        amount: 2500,
        category: "Food",
        detail: "Eating out",
        date: new Date("2026-03-05"),
        account: "Bank",
        note: "",
      },
      {
        user: userId,
        type: "income",
        amount: 50000,
        category: "Salary",
        detail: "Monthly salary",
        date: new Date("2026-04-01"),
        account: "Bank",
        note: "April salary",
      },
      {
        user: userId,
        type: "expense",
        amount: 4000,
        category: "Transport",
        detail: "Gas",
        date: new Date("2026-04-03"),
        account: "Cash",
        note: "",
      }
    ]);

    console.log("🔥 Seed success");
    process.exit();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

seed();