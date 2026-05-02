import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import TransactionForm from "../components/TransactionForm";

function EditTransaction({ fetchTransactions }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchOne = async () => {
      try {
        const res = await API.get(`/transactions/${id}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOne();
  }, [id]);

  // ⛔ กัน render ก่อนข้อมูลมา
  if (!data) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Edit Transaction</h1>

      <TransactionForm
        fetchTransactions={fetchTransactions}
        editData={data}          // 🔥 ส่งข้อมูลเข้า form
        editId={id}              // 🔥 บอกว่าเป็น edit
        onSuccess={() => {
          navigate("/transactions");
        }}
      />
    </div>
  );
}

export default EditTransaction;