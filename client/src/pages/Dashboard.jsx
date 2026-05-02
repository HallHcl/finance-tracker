import { useState, useEffect } from "react";
import API from "../api";
import { toast } from "react-toastify";
import SummaryCard from "../components/SummaryCard";
import TransactionList from "../components/TransactionList";

// 🔥 import chart
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend
} from "recharts";

function Dashboard({ transactions }) {

  const user = JSON.parse(localStorage.getItem("user"));

  // 🔥 budget
  const [budget, setBudget] = useState("");

  // 🔥 debounce
  const [debounceTimer, setDebounceTimer] = useState(null);

  // 🔥 โหลด budget
  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const res = await API.get("/auth/budget");
        setBudget(res.data.budget ? String(res.data.budget) : "");
      } catch (err) {
        console.error("Fetch budget error:", err);
      }
    };

    fetchBudget();
  }, []);

  // 🔥 debounce update
  const updateBudget = (value) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(async () => {
      try {
        await API.put("/auth/budget", {
          budget: Number(value),
        });

        toast.success("Budget saved");
      } catch (err) {
        console.error("Update budget error:", err);
        toast.error("Failed to save budget");
      }
    }, 800);

    setDebounceTimer(timer);
  };

  const income = transactions
    .filter(t => t.type === "income")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const expense = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const balance = income - expense;

  const percent =
    Number(budget) > 0 ? (expense / Number(budget)) * 100 : 0;

  const monthly = {};

  transactions.forEach(t => {
    const month = new Date(t.date).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

    if (!monthly[month]) {
      monthly[month] = { income: 0, expense: 0 };
    }

    if (t.type === "income") {
      monthly[month].income += Number(t.amount);
    } else {
      monthly[month].expense += Number(t.amount);
    }
  });

  const chartData = Object.entries(monthly).map(([month, data]) => ({
    month,
    income: data.income,
    expense: data.expense,
  }));

  const exportCSV = () => {
    const headers = [
      "Date",
      "Type",
      "Category",
      "Detail",
      "Amount",
      "Account",
      "Note",
    ];

    const rows = transactions.map((t) => [
      new Date(t.date).toLocaleDateString(),
      t.type,
      t.category,
      t.detail,
      t.amount,
      t.account,
      t.note,
    ]);

    const csvContent =
      [headers, ...rows]
        .map((e) => e.join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
  };

  return (
    <div className="p-6 space-y-6">

      {/* Greeting */}
      {user && (
        <h1 className="text-2xl font-bold">
          Hello, {user.firstName} {user.lastName}
        </h1>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard title="Balance" amount={balance} color="text-green-500" />
        <SummaryCard title="Income" amount={income} color="text-blue-500" />
        <SummaryCard title="Expense" amount={expense} color="text-red-500" />
      </div>

      {/* Budget */}
      <div className="bg-white p-4 rounded-xl shadow space-y-3">
        <h2 className="font-bold">Monthly Budget</h2>

        <input
          type="number"
          placeholder="Enter budget"
          value={budget}
          onChange={(e) => {
            setBudget(e.target.value);
            updateBudget(e.target.value);
          }}
          className="w-full p-2 border rounded"
        />

        {Number(budget) > 0 && (
          <>
            <div className="w-full bg-gray-200 rounded h-4 overflow-hidden">
              <div
                className={`h-4 ${
                  percent < 80
                    ? "bg-green-500"
                    : percent < 100
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${Math.min(percent, 100)}%` }}
              />
            </div>

            <p className="text-sm">
              {expense} / {budget} ({percent.toFixed(1)}%)
            </p>

            {percent >= 80 && percent < 100 && (
              <p className="text-yellow-600">⚠️ Approaching budget limit</p>
            )}

            {percent >= 100 && (
              <p className="text-red-600">❌ Budget exceeded</p>
            )}
          </>
        )}
      </div>

      {/* Export */}
      <button
        onClick={exportCSV}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Export CSV
      </button>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-bold mb-3">Monthly Overview</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#22c55e" />
              <Bar dataKey="expense" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-bold mb-3">Trend</h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#22c55e" />
              <Line type="monotone" dataKey="expense" stroke="#ef4444" />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      <TransactionList transactions={transactions} />

    </div>
  );
}

export default Dashboard;