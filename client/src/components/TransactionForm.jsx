import { useState, useEffect } from "react";
import API from "../api";
import { toast } from "react-toastify";

function TransactionForm({ fetchTransactions, editData, editId, onSuccess }) {
  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "",
    detail: "",
    date: "",
    account: "",
    note: "",

    // 🔥 NEW (STEP 5)
    isRecurring: false,
    frequency: "monthly",
  });

  const [categories, setCategories] = useState([]);

  // 🔥 โหลด categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get("/categories");
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  // 🔥 preload data (EDIT)
  useEffect(() => {
    if (editData) {
      setForm({
        type: editData.type || "expense",
        amount: editData.amount || "",
        category: editData.category || "",
        detail: editData.detail || "",
        date: editData.date ? editData.date.split("T")[0] : "",
        account: editData.account || "",
        note: editData.note || "",

        // 🔥 IMPORTANT (fix recurring edit)
        isRecurring: editData.isRecurring || false,
        frequency: editData.frequency || "monthly",
      });
    }
  }, [editData]);

  // 🔥 FIX: รองรับ checkbox
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.amount) return;

    try {
      if (editId) {
        await API.put(`/transactions/${editId}`, form);
        toast.success("Updated successfully");
      } else {
        await API.post("/transactions", form);
        toast.success("Added successfully");
      }

      await fetchTransactions();

      if (onSuccess) onSuccess();

    } catch (err) {
      console.error(err);

      toast.error(editId ? "Update failed" : "Add failed");
    }

    // 🔥 reset form (ต้อง reset recurring ด้วย)
    if (!editId) {
      setForm({
        type: "expense",
        amount: "",
        category: "",
        detail: "",
        date: "",
        account: "",
        note: "",
        isRecurring: false,
        frequency: "monthly",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-5 rounded-2xl shadow mt-6"
    >
      <h2 className="text-lg font-bold mb-4">
        {editId ? "Edit Transaction" : "Add Transaction"}
      </h2>

      {/* Type */}
      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
      >
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      {/* Amount */}
      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={form.amount}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
      />

      {/* Category */}
      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
      >
        <option value="">Select category</option>

        {categories
          .filter((c) => c.type === form.type)
          .map((c) => (
            <option key={c._id} value={c.name}>
              {c.name}
            </option>
          ))}
      </select>

      {/* Detail */}
      <input
        type="text"
        name="detail"
        placeholder="Detail"
        value={form.detail}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
      />

      {/* Date */}
      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
      />

      {/* Account */}
      <input
        type="text"
        name="account"
        placeholder="Account (e.g. Cash / Bank)"
        value={form.account}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
      />

      {/* Note */}
      <input
        type="text"
        name="note"
        placeholder="Note"
        value={form.note}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
      />

      {/* 🔥 STEP 5: RECURRING */}
      <div className="flex items-center gap-2 mb-2">
        <input
          type="checkbox"
          name="isRecurring"
          checked={form.isRecurring}
          onChange={handleChange}
        />
        <label>Recurring</label>
      </div>

      {form.isRecurring && (
        <select
          name="frequency"
          value={form.frequency}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        >
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
          <option value="yearly">Yearly</option>
        </select>
      )}

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        {editId ? "Update" : "Add"}
      </button>
    </form>
  );
}

export default TransactionForm;