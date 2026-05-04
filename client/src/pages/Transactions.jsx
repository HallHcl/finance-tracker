import API from "../api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Transactions() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);

  // =========================
  // 🔥 PAGINATION STATE
  // =========================
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    search: "",
  });

  // =========================
  // 🔥 FETCH DATA
  // =========================
  const fetchTransactions = async (pageNumber = 1) => {
    try {
      const res = await API.get(
        `/transactions?page=${pageNumber}&limit=${limit}`
      );

      setTransactions(res.data.data);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      toast.error("Load failed");
    }
  };

  useEffect(() => {
    fetchTransactions(1);
  }, []);

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id) => {
    try {
      await API.delete(`/transactions/${id}`);
      toast.success("Deleted successfully");
      fetchTransactions(page);
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // =========================
  // SKIP
  // =========================
  const handleSkip = async (id) => {
    try {
      await API.post(`/transactions/${id}/skip`);
      toast.success("Skipped");
      fetchTransactions(page);
    } catch (err) {
      toast.error("Skip failed");
    }
  };

  // =========================
  // STOP
  // =========================
  const handleStop = async (id) => {
    try {
      await API.post(`/transactions/${id}/stop`);
      toast.success("Recurring stopped");
      fetchTransactions(page);
    } catch (err) {
      toast.error("Stop failed");
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Transactions</h1>

      {/* FILTER */}
      <div className="mb-4 flex gap-2 flex-wrap">
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) =>
            setFilters({ ...filters, startDate: e.target.value })
          }
          className="border p-2 rounded"
        />

        <input
          type="date"
          value={filters.endDate}
          onChange={(e) =>
            setFilters({ ...filters, endDate: e.target.value })
          }
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Search..."
          value={filters.search}
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value })
          }
          className="border p-2 rounded"
        />

        <button
          onClick={() => fetchTransactions(1)}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Filter
        </button>

        <button
          onClick={() => {
            setFilters({ startDate: "", endDate: "", search: "" });
            fetchTransactions(1);
          }}
          className="bg-gray-300 px-4 rounded"
        >
          Reset
        </button>
      </div>

      {/* LIST */}
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
                <div className="flex items-center gap-2">
                  <p className="font-semibold">
                    {t.category || "General"}
                  </p>

                  {t.isRecurring && (
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                      Recurring
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-500">{t.detail}</p>

                <p className="text-xs text-gray-400">
                  {new Date(t.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
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

                {t.isRecurring && (
                  <button
                    onClick={() => handleSkip(t._id)}
                    className="text-yellow-500"
                  >
                    Skip
                  </button>
                )}

                {t.isRecurring && (
                  <button
                    onClick={() => handleStop(t._id)}
                    className="text-gray-500"
                  >
                    Stop
                  </button>
                )}

                <button
                  onClick={() => navigate(`/edit/${t._id}`)}
                  className="text-blue-500"
                >
                  Edit
                </button>

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

      {/* =========================
          PAGINATION UI
      ========================= */}
      <div className="flex justify-center items-center gap-2 mt-6">

        {/* Prev */}
        <button
          disabled={page === 1}
          onClick={() => fetchTransactions(page - 1)}
          className={`px-3 py-1 rounded ${
            page === 1
              ? "bg-gray-200 text-gray-400"
              : "bg-blue-500 text-white"
          }`}
        >
          Prev
        </button>

        {/* Page numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => fetchTransactions(num)}
            className={`px-3 py-1 rounded ${
              page === num
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {num}
          </button>
        ))}

        {/* Next */}
        <button
          disabled={page === totalPages}
          onClick={() => fetchTransactions(page + 1)}
          className={`px-3 py-1 rounded ${
            page === totalPages
              ? "bg-gray-200 text-gray-400"
              : "bg-blue-500 text-white"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Transactions;