const Transaction = require("../models/Transaction");
const { Parser } = require("json2csv");

// =========================
// 🔥 HELPERS
// =========================
const getNextRun = (date, frequency) => {
  const next = new Date(date);

  switch (frequency) {
    case "daily":
      next.setDate(next.getDate() + 1);
      break;
    case "weekly":
      next.setDate(next.getDate() + 7);
      break;
    case "monthly":
      next.setMonth(next.getMonth() + 1);
      break;
    case "yearly":
      next.setFullYear(next.getFullYear() + 1);
      break;
  }

  return next;
};

// =========================
// 🔥 SUMMARY
// =========================
exports.getSummary = async (req, res) => {
  try {
    const data = await Transaction.find({ user: req.user.id });

    let income = 0;
    let expense = 0;
    let categoryMap = {};

    data.forEach((t) => {
      const amount = Number(t.amount) || 0;

      if (t.type === "income") {
        income += amount;
      } else {
        expense += amount;
        categoryMap[t.category] =
          (categoryMap[t.category] || 0) + amount;
      }
    });

    res.json({
      income,
      expense,
      net: income - expense,
      byCategory: Object.entries(categoryMap).map(([category, total]) => ({
        category,
        total,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: "Summary error" });
  }
};

// =========================
// 🔥 PAGINATION (MAIN LIST)
// =========================
exports.getTransactions = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;

    const filter = { user: req.user.id };

    const [data, total] = await Promise.all([
      Transaction.find(filter)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit),

      Transaction.countDocuments(filter),
    ]);

    res.json({
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: "Pagination error" });
  }
};

// =========================
// 🔥 GET ONE
// =========================
exports.getTransaction = async (req, res) => {
  try {
    const data = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!data) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Get error" });
  }
};

// =========================
// 🔥 CREATE
// =========================
exports.createTransaction = async (req, res) => {
  try {
    const body = {
      ...req.body,
      user: req.user.id,
    };

    // recurring support
    if (body.isRecurring && body.frequency) {
      body.nextRun = getNextRun(body.date, body.frequency);
      body.isActive = true;
    }

    const newData = new Transaction(body);
    await newData.save();

    res.json(newData);
  } catch (err) {
    res.status(500).json({ message: "Create error" });
  }
};

// =========================
// 🔥 UPDATE
// =========================
exports.updateTransaction = async (req, res) => {
  try {
    const updated = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update error" });
  }
};

// =========================
// 🔥 DELETE
// =========================
exports.deleteTransaction = async (req, res) => {
  try {
    await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete error" });
  }
};

// =========================
// 🔥 SKIP RECURRING
// =========================
exports.skipRecurring = async (req, res) => {
  try {
    const t = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!t || !t.isRecurring) {
      return res.status(404).json({ message: "Not recurring" });
    }

    t.nextRun = getNextRun(t.nextRun, t.frequency);
    await t.save();

    res.json({ message: "Skipped", nextRun: t.nextRun });
  } catch (err) {
    res.status(500).json({ message: "Skip error" });
  }
};

// =========================
// 🔥 STOP RECURRING
// =========================
exports.stopRecurring = async (req, res) => {
  try {
    const t = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!t || !t.isRecurring) {
      return res.status(404).json({ message: "Not recurring" });
    }

    t.isActive = false;
    await t.save();

    res.json({ message: "Stopped" });
  } catch (err) {
    res.status(500).json({ message: "Stop error" });
  }
};

// =========================
// 🔥 EXPORT CSV (SUMMARY)
// =========================
exports.exportSummary = async (req, res) => {
  try {
    const data = await Transaction.aggregate([
      { $match: { user: req.user.id, type: "expense" } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);

    const csvData = data.map((d) => ({
      category: d._id,
      total: d.total,
    }));

    const parser = new Parser({
      fields: ["category", "total"],
    });

    const csv = parser.parse(csvData);

    res.header("Content-Type", "text/csv");
    res.attachment("summary.csv");
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: "Export error" });
  }
};