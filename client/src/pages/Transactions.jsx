import API from "../api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Transactions({ transactions, fetchTransactions }) {

  const navigate = useNavigate(); // 🔥 เพิ่ม

  const handleDelete = async (id) => {
    try {
      await API.delete(`/transactions/${id}`);

      toast.success("Deleted successfully");

      await fetchTransactions();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Transactions</h1>

      {transactions.length === 0 ? (
        <p className="text-gray-400">No transactions</p>
      ) : (
        <ul className="space-y-3">
          {transactions.map((t) => (
            <li
              key={t._id}
              className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{t.category || "General"}</p>
                <p className="text-sm text-gray-500">{t.detail}</p>
              </div>

              <div className="flex items-center gap-4">
                <p
                  className={`font-bold ${
                    t.type === "income"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {t.type === "income" ? "+" : "-"}฿ {t.amount}
                </p>

                {/* 🔥 EDIT */}
                <button
                  onClick={() => navigate(`/edit/${t._id}`)}
                  className="text-blue-500"
                >
                  Edit
                </button>

                {/* DELETE */}
                <button
                  onClick={() => handleDelete(t._id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Transactions;