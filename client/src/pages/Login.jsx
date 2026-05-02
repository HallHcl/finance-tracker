import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login({ setIsLoggedIn }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("เข้าสู่ระบบสำเร็จ");

      setIsLoggedIn(true);

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      // 🔥 แยก error (รองรับ backend ในอนาคต)
      if (err.response?.data?.message === "User not found") {
        toast.error("อีเมลไม่พบในระบบ");
      } else if (err.response?.data?.message === "Invalid password") {
        toast.error("รหัสผ่านไม่ถูกต้อง");
      } else {
        toast.error("เข้าสู่ระบบไม่สำเร็จ");
      }
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Login</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="email"
          placeholder="Email"
          className="w-full p-2 border"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-2 border"
          onChange={handleChange}
        />

        <button className="bg-blue-500 text-white px-4 py-2 w-full">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;