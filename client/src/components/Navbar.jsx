import { Link, useNavigate } from "react-router-dom";

function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate(); // 🔥 เพิ่ม

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login"); // 🔥 smooth
  };

  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">
      <Link to="/" className="cursor-pointer">
        <h1 className="text-xl font-bold text-blue-600">
          Finance Tracker
        </h1>
      </Link>

      <div className="flex gap-3 items-center">
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="bg-blue-500 text-white px-4 py-1 rounded-lg">
              Login
            </Link>

            <Link to="/register" className="bg-gray-200 px-4 py-1 rounded-lg">
              Register
            </Link>
          </>
        ) : (
          <>
            <Link to="/add" className="bg-green-500 text-white px-4 py-1 rounded-lg">
              + Add
            </Link>

            <Link to="/transactions" className="bg-gray-300 px-4 py-1 rounded-lg">
              Transactions
            </Link>

            <Link to="/add-category" className="bg-purple-500 text-white px-4 py-1 rounded-lg">
              Add Category
            </Link>

            <Link to="/categories" className="bg-gray-300 px-4 py-1 rounded-lg">
              Categories
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-1 rounded-lg"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;