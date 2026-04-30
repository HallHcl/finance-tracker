import TransactionForm from "../components/TransactionForm";

function AddTransaction({ fetchTransactions }) {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Add Transaction</h1>

      <TransactionForm fetchTransactions={fetchTransactions} />
    </div>
  );
}

export default AddTransaction;