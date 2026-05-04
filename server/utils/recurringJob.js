const Transaction = require("../models/Transaction");

async function runRecurring() {
  try {
    const now = new Date();

    // 🔥 เอาเฉพาะที่ถึงเวลา + ยัง active
    const dueTransactions = await Transaction.find({
      isRecurring: true,
      isActive: true,
      nextRun: { $lte: now },
    });

    for (let t of dueTransactions) {

      // 🔥 สร้าง transaction ใหม่ (รายการที่เกิดขึ้นจริง)
      const newTransaction = new Transaction({
        user: t.user,
        type: t.type,
        amount: t.amount,
        category: t.category,
        detail: t.detail,
        date: t.nextRun,
        account: t.account,
        note: t.note,

        // ❗ สำคัญ: ไม่ต้องให้ตัวใหม่เป็น recurring
        isRecurring: false,
      });

      await newTransaction.save();

      // 🔥 คำนวณรอบถัดไป
      let next = new Date(t.nextRun);

      if (t.frequency === "daily") {
        next.setDate(next.getDate() + 1);
      } else if (t.frequency === "weekly") {
        next.setDate(next.getDate() + 7);
      } else if (t.frequency === "monthly") {
        next.setMonth(next.getMonth() + 1);
      } else if (t.frequency === "yearly") {
        next.setFullYear(next.getFullYear() + 1);
      }

      // 🔥 update รอบถัดไป
      t.nextRun = next;
      await t.save();
    }

    if (dueTransactions.length > 0) {
      console.log(`🔁 Ran recurring: ${dueTransactions.length} items`);
    }

  } catch (err) {
    console.error("Recurring job error:", err);
  }
}

module.exports = runRecurring;