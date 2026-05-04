import { useState, useMemo } from "react";
import SummaryCard from "../components/SummaryCard";
import TransactionList from "../components/TransactionList";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

function Dashboard({ transactions = [] }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [budget, setBudget] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  const safeTransactions = Array.isArray(transactions)
    ? transactions
    : transactions?.data || [];

  const filtered = useMemo(() => {
    if (!selectedMonth) return safeTransactions;

    return safeTransactions.filter((t) => {
      const d = new Date(t.date);
      const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      return m === selectedMonth;
    });
  }, [safeTransactions, selectedMonth]);

  const summary = useMemo(() => {
    let income = 0;
    let expense = 0;

    filtered.forEach((t) => {
      const amt = Number(t.amount) || 0;
      if (t.type === "income") income += amt;
      else expense += amt;
    });

    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [filtered]);

  const topCategories = useMemo(() => {
    const map = {};

    filtered.forEach((t) => {
      if (t.type !== "expense") return;
      map[t.category] = (map[t.category] || 0) + (Number(t.amount) || 0);
    });

    return Object.entries(map)
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [filtered]);

  const chartData = useMemo(() => {
    const map = {};

    filtered.forEach((t) => {
      const month = new Date(t.date).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      if (!map[month]) map[month] = { income: 0, expense: 0 };
      const amt = Number(t.amount) || 0;

      if (t.type === "income") map[month].income += amt;
      else map[month].expense += amt;
    });

    return Object.entries(map).map(([month, v]) => ({
      month,
      ...v,
    }));
  }, [filtered]);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">👋 Welcome {user?.firstName}</h1>
          <p className="text-sm text-gray-500">Review your latest financial overview.</p>
        </div>

        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard title="Balance" amount={summary.balance} color="text-green-600" />
        <SummaryCard title="Income" amount={summary.income} color="text-blue-600" />
        <SummaryCard title="Expense" amount={summary.expense} color="text-red-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow">
          <h2 className="font-bold mb-3">Monthly Overview</h2>

          <ResponsiveContainer width="100%" height={250}>
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

        <div className="bg-white p-5 rounded-2xl shadow">
          <h2 className="font-bold mb-3">Trend</h2>

          <ResponsiveContainer width="100%" height={250}>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow">
          <h2 className="font-bold mb-3">🔥 Top Expenses</h2>
          {topCategories.length === 0 ? (
            <p className="text-gray-400">No data</p>
          ) : (
            <ul className="space-y-2">
              {topCategories.map((c, i) => (
                <li key={i} className="flex justify-between">
                  <span>{c.category}</span>
                  <span className="text-red-500 font-bold">฿ {c.total}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white p-5 rounded-2xl shadow">
          <h2 className="font-bold mb-3">📌 Quick Insight</h2>
          <p>Income: ฿{summary.income}</p>
          <p>Expense: ฿{summary.expense}</p>
          <p className="font-bold">Net: ฿{summary.balance}</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow">
        <TransactionList transactions={filtered} />
      </div>
    </div>
  );
}

export default Dashboard;
