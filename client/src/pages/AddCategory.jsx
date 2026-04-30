import { useState } from "react";
import API from "../api";

function AddCategory() {
  const [form, setForm] = useState({
    name: "",
    type: "expense",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/categories", form);

      alert("Category added");

      setForm({
        name: "",
        type: "expense",
      });
    } catch (err) {
      console.error(err);
      alert("Error");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Add Category</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="name"
          placeholder="Category name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <button className="bg-blue-500 text-white px-4 py-2 w-full rounded">
          Add Category
        </button>
      </form>
    </div>
  );
}

export default AddCategory;