import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import toast from "react-hot-toast";

import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";
import { useAuth } from "../context/useAuth";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = ({ target }) => {
    setFormData((current) => ({ ...current, [target.name]: target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const { data: registerResponse } = await axiosInstance.post(
        API_PATHS.AUTH.REGISTER,
        {
          ...formData,
          email: formData.email.trim().toLowerCase(),
        },
      );
      const { token } = registerResponse;

      const { data: profileResponse } = await axiosInstance.get(
        API_PATHS.AUTH.GET_PROFILE,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      login(profileResponse, token);
      toast.success("Account created successfully!");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      toast.error(
        error.response?.data?.message ||
          "Signup failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-violet-50 via-white to-purple-50 px-6 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-12 lg:grid-cols-[1fr_0.85fr]">
        <section className="hidden lg:block">
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
              <BookOpen className="h-5 w-5 text-white" />
            </span>
            <span className="text-xl font-semibold tracking-tight text-gray-900">AI eBook Creator</span>
          </Link>
          <h1 className="mt-12 max-w-xl text-5xl font-bold leading-tight tracking-tight text-gray-900">
            Your next great ebook starts here.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-gray-600">
            Build a focused writing workspace, shape your ideas with AI, and publish with confidence.
          </p>
        </section>

        <section className="mx-auto w-full max-w-md rounded-3xl border border-gray-100 bg-white p-7 shadow-xl shadow-violet-100/50 sm:p-9">
          <div className="mb-8 lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-purple-600">
                <BookOpen className="h-5 w-5 text-white" />
              </span>
              <span className="text-lg font-semibold text-gray-900">AI eBook Creator</span>
            </Link>
          </div>

          <div>
            <p className="text-sm font-semibold text-violet-600">Get started today</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">Create your account</h2>
            <p className="mt-3 text-sm leading-6 text-gray-500">Start turning your ideas into polished ebooks.</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <InputField
              label="Full name"
              name="name"
              type="text"
              placeholder="John Doe"
              icon={User}
              value={formData.name}
              onChange={handleChange}
              required
            />

            <InputField
              label="Email address"
              name="email"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              required
            />

            <InputField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Minimum 6 characters"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="-mt-3 ml-auto flex items-center gap-1 rounded-md p-1 text-xs text-gray-500 hover:text-gray-800"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showPassword ? "Hide password" : "Show password"}
            </button>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="mt-7 text-center text-sm text-gray-500">
            Already have an account? <Link to="/login" className="font-semibold text-violet-600 hover:text-violet-700">Sign in</Link>
          </p>
        </section>
      </div>
    </main>
  );
};

export default SignupPage;