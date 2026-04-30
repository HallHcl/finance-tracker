function TransactionList({ transactions }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow mt-6">
      <h2 className="text-lg font-bold mb-4">Transactions</h2>

      {transactions.length === 0 ? (
        <p className="text-gray-400">No transactions yet</p>
      ) : (
        <ul className="space-y-3">
          {transactions.map((t, index) => (
            <li
              key={index}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <p className="font-semibold">{t.category || "General"}</p>
                <p className="text-sm text-gray-500">{t.detail}</p>
              </div>

              <p
                className={`font-bold ${
                  t.type === "income"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {t.type === "income" ? "+" : "-"}฿ {t.amount}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TransactionList;