function SummaryCard({ title, amount, color }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow">
      <h2 className="text-gray-500">{title}</h2>
      <p className={`text-2xl font-bold ${color}`}>
        ฿ {amount}
      </p>
    </div>
  );
}

export default SummaryCard;