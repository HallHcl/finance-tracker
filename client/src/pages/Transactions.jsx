import API from "../api";

function Transactions({ transactions, fetchTransactions }) {
  const handleDelete = async (id) => {
    try {
      await API.delete(`/transactions/${id}`);
      fetchTransactions(); // refresh จาก DB
    } catch (err) {
      console.error(err);
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