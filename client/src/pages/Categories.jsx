import { useEffect, useState } from "react";
import API from "../api";

function Categories() {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/categories/${id}`);
      fetchCategories(); // 🔥 reload
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Categories</h1>

      {categories.length === 0 ? (
        <p className="text-gray-400">No categories</p>
      ) : (
        <ul className="space-y-3">
          {categories.map((c) => (
            <li
              key={c._id}
              className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-sm text-gray-500">{c.type}</p>
              </div>

              <button
                onClick={() => handleDelete(c._id)}
                className="text-red-500"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Categories;