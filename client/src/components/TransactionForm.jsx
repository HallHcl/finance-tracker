import { useState, useEffect } from "react";
import API from "../api";

function TransactionForm({ fetchTransactions }) {
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
      await API.post("/transactions", form);
      await fetchTransactions(); // refresh data จาก DB
    } catch (err) {
      console.error(err);
    }

    // 🔥 reset form (ต้องมี field ใหม่ด้วย)
    setForm({
      type: "expense",
      amount: "",
      category: "",
      detail: "",
      date: "",
      account: "",
      note: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-5 rounded-2xl shadow mt-6"
    >
      <h2 className="text-lg font-bold mb-4">Add Transaction</h2>

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

      {/* 🔥 Date */}
      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
      />

      {/* 🔥 Account */}
      <input
        type="text"
        name="account"
        placeholder="Account (e.g. Cash / Bank)"
        value={form.account}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
      />

      {/* 🔥 Note */}
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
        Add
      </button>
    </form>
  );
}

export default TransactionForm;