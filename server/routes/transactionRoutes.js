const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/transactionController");

// =========================
// SUMMARY
// =========================
router.get("/summary", auth, controller.getSummary);

// =========================
// EXPORT CSV
// =========================
router.get("/export/summary", auth, controller.exportSummary);

// =========================
// PAGINATION (MAIN)
// =========================
router.get("/", auth, controller.getTransactions);

// =========================
// CRUD
// =========================
router.post("/", auth, controller.createTransaction);
router.get("/:id", auth, controller.getTransaction);
router.put("/:id", auth, controller.updateTransaction);
router.delete("/:id", auth, controller.deleteTransaction);

// =========================
// RECURRING
// =========================
router.post("/:id/skip", auth, controller.skipRecurring);
router.post("/:id/stop", auth, controller.stopRecurring);

module.exports = router;