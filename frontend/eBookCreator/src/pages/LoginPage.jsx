import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, Eye, EyeOff, Lock, Mail } from "lucide-react";
import toast from "react-hot-toast";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";
import { useAuth } from "../context/useAuth";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = ({ target }) => {
    setFormData((current) => ({ ...current, [target.name]: target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const { data: loginResponse } = await axiosInstance.post(
        API_PATHS.AUTH.LOGIN,
        formData,
      );
      const { token } = loginResponse;

      const { data: profileResponse } = await axiosInstance.get(
        API_PATHS.AUTH.GET_PROFILE,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      login(profileResponse, token);
      toast.success("Welcome back!");
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      toast.error(error.response?.data?.message || "Unable to sign in. Please try again.");
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
            Turn your ideas into books people remember.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-gray-600">
            Continue creating, designing, and publishing your next ebook with a workspace built around your ideas.
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
            <p className="text-sm font-semibold text-violet-600">Welcome back</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
            <p className="mt-3 text-sm leading-6 text-gray-500">Pick up where you left off and keep creating.</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <InputField
              label="Email address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              icon={Mail}
              autoComplete="email"
              required
            />
            <div className="relative">
              <InputField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                icon={Lock}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-9 rounded-md p-1 text-gray-400 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="mt-7 text-center text-sm text-gray-500">
            Don&apos;t have an account? <Link to="/signup" className="font-semibold text-violet-600 hover:text-violet-700">Sign up</Link>
          </p>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
