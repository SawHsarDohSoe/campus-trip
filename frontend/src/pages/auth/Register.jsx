import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, UserRound } from "lucide-react";
import Button from "../../components/ui/Button";
import { registerUser } from "../../api/authApi";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const data = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // Save authentication information
      localStorage.setItem("campusTripToken", data.token);

      localStorage.setItem(
        "campusTripCurrentUser",
        JSON.stringify(data.user)
      );

      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-10">

      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl border border-gray-100 p-10">

        {/* Logo */}
        <div className="flex justify-center mb-6">

          <div className="w-16 h-16 rounded-2xl bg-[#1E3A8A] flex items-center justify-center shadow-lg">
            <span className="text-3xl text-white">
              🧳
            </span>
          </div>

        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-center text-[#1E3A8A]">
          Create Account
        </h1>

        <p className="text-center text-gray-500 mt-3">
          Start planning your next campus trip.
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-5"
        >

          {/* Error */}
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {/* Name */}
          <div>

            <label className="block mb-2 font-medium text-gray-700">
              Full Name
            </label>

            <div className="relative">

              <UserRound
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none transition duration-300 focus:border-[#1E3A8A] focus:ring-4 focus:ring-blue-100"
              />

            </div>

          </div>

          {/* Email */}
          <div>

            <label className="block mb-2 font-medium text-gray-700">
              Email
            </label>

            <div className="relative">

              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none transition duration-300 focus:border-[#1E3A8A] focus:ring-4 focus:ring-blue-100"
              />

            </div>

          </div>

          {/* Password */}
          <div>

            <label className="block mb-2 font-medium text-gray-700">
              Password
            </label>

            <div className="relative">

              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-12 outline-none transition duration-300 focus:border-[#1E3A8A] focus:ring-4 focus:ring-blue-100"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1E3A8A]"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>

          </div>

          {/* Confirm Password */}
          <div>

            <label className="block mb-2 font-medium text-gray-700">
              Confirm Password
            </label>

            <div className="relative">

              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your password"
                className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-12 outline-none transition duration-300 focus:border-[#1E3A8A] focus:ring-4 focus:ring-blue-100"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1E3A8A]"
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>

          </div>

          {/* Register Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>

        </form>

        {/* Login */}
        <p className="mt-8 text-center text-gray-600">

          Already have an account?

          <Link
            to="/login"
            className="ml-2 font-semibold text-[#1E3A8A] hover:underline"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Register;