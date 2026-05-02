import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [showSuggest, setShowSuggest] = useState(false);

  const navigate = useNavigate();

  const domains = ["gmail.com", "hotmail.com", "yahoo.com"];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    // 🔥 email suggest trigger
    if (name === "email") {
      if (value.includes("@") && !value.includes(".")) {
        setShowSuggest(true);
      } else {
        setShowSuggest(false);
      }
    }
  };

  const handleSelectDomain = (domain) => {
    const name = form.email.split("@")[0];
    setForm({
      ...form,
      email: `${name}@${domain}`,
    });
    setShowSuggest(false);
  };

  // ✅ password validation
  const validatePassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.(com|net|org|co|th)$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.firstName || !form.lastName) {
      return toast.error("Please enter your first and last name.");
    }

    if (!validateEmail(form.email)) {
      return toast.error("Invalid email format.");
    }

    if (!validatePassword(form.password)) {
      return toast.error(
        "Password must be at least 8 characters long and contain uppercase letters, lowercase letters, and numbers."
      );
    }

    try {
      await API.post("/auth/register", form);

      toast.success("Registration successful.");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      toast.error("Registration failed, or email already in use.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Register</h1>

      <form onSubmit={handleSubmit} className="space-y-3 relative">
        <input
          name="firstName"
          placeholder="First Name"
          className="w-full p-2 border"
          onChange={handleChange}
        />

        <input
          name="lastName"
          placeholder="Last Name"
          className="w-full p-2 border"
          onChange={handleChange}
        />

        {/* EMAIL */}
        <div className="relative">
          <input
            name="email"
            placeholder="Email"
            className="w-full p-2 border"
            value={form.email}
            onChange={handleChange}
          />

          {showSuggest && (
            <div className="absolute bg-white border w-full mt-1 shadow rounded">
              {domains.map((d) => (
                <div
                  key={d}
                  onClick={() => handleSelectDomain(d)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {form.email.split("@")[0]}@{d}
                </div>
              ))}
            </div>
          )}
        </div>

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-2 border"
          onChange={handleChange}
        />

        <button className="bg-green-500 text-white px-4 py-2 w-full">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;