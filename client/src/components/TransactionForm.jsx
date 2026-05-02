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
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.amount) return;

    try {
      if (editId) {
        // 🔥 UPDATE
        await API.put(`/transactions/${editId}`, form);
        toast.success("Updated successfully");
      } else {
        // 🔥 CREATE
        await API.post("/transactions", form);
        toast.success("Added successfully");
      }

      await fetchTransactions();

      if (onSuccess) onSuccess();

    } catch (err) {
      console.error(err);

      if (editId) {
        toast.error("Update failed");
      } else {
        toast.error("Add failed");
      }
    }

    // reset form (เฉพาะ add)
    if (!editId) {
      setForm({
        type: "expense",
        amount: "",
        category: "",
        detail: "",
        date: "",
        account: "",
        note: "",
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