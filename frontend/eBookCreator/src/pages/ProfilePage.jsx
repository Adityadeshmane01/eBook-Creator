import { useEffect, useState } from "react";
import { ArrowLeft, Check, Mail, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../components/layout/DashboardLayout";
import Button from "../components/ui/Button";
import InputField from "../components/ui/InputField";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { useAuth } from "../context/useAuth";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        setFormData({ name: data.name || "", email: data.email || "" });
      } catch (error) {
        setFormData({ name: user?.name || "", email: user?.email || "" });
        toast.error(error.response?.data?.message || "Failed to load your profile.");
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) fetchProfile();
  }, [authLoading, user?.email, user?.name]);

  const handleChange = ({ target }) => {
    setFormData((current) => ({ ...current, [target.name]: target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const name = formData.name.trim();
    if (!name) {
      toast.error("Please enter your name.");
      return;
    }

    setIsSaving(true);
    try {
      const { data } = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, { name });
      updateUser({ ...data, email: formData.email });
      setFormData((current) => ({ ...current, name: data.name || name }));
      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update your profile.");
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || isLoading) {
    return <DashboardLayout><div className="flex min-h-[70vh] items-center justify-center text-sm text-gray-500">Loading your profile...</div></DashboardLayout>;
  }

  const initials = (formData.name || "User").trim().charAt(0).toUpperCase();
  const isPro = user?.isPro;

  return (
    <DashboardLayout>
      <div className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.12),transparent_32%),#f8f8ff] px-4 py-8 sm:px-8 lg:py-12">
        <div className="mx-auto max-w-5xl">
          <button type="button" onClick={() => navigate("/dashboard")} className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-violet-700"><ArrowLeft className="h-4 w-4" />Back to dashboard</button>
          <div className="mb-8"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-600">Account settings</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">Make your profile yours.</h1><p className="mt-2 max-w-xl text-sm leading-6 text-gray-600">Keep your author identity current across every eBook you create.</p></div>

          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <aside className="overflow-hidden rounded-2xl border border-violet-100 bg-linear-to-br from-violet-700 via-violet-600 to-indigo-700 p-6 text-white shadow-xl shadow-violet-200/50 sm:p-8">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 text-3xl font-bold ring-1 ring-white/30">{initials}</div>
              <h2 className="mt-6 text-2xl font-bold">{formData.name || "Your name"}</h2>
              <p className="mt-1 truncate text-sm text-violet-100">{formData.email || "No email available"}</p>
              <div className="mt-8 border-t border-white/20 pt-5"><div className="flex items-center gap-2 text-sm font-semibold"><ShieldCheck className="h-4 w-4" />Verified account</div><p className="mt-2 text-xs leading-5 text-violet-100">Your profile is protected and ready for your next story.</p></div>
              <div className="mt-6 rounded-xl bg-white/10 p-4"><div className="flex items-center gap-2 text-sm font-semibold"><Sparkles className="h-4 w-4" />{isPro ? "Pro creator" : "Creator plan"}</div><p className="mt-1 text-xs text-violet-100">{isPro ? "Enjoy your full creative workspace." : "Create and refine your eBooks in one place."}</p></div>
            </aside>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"><div className="flex items-start gap-3 border-b border-gray-100 pb-6"><div className="rounded-xl bg-violet-100 p-3 text-violet-700"><UserRound className="h-5 w-5" /></div><div><h2 className="text-xl font-bold text-gray-950">Personal details</h2><p className="mt-1 text-sm text-gray-500">This information appears on your account and book workspace.</p></div></div><form onSubmit={handleSubmit} className="mt-6 space-y-5"><InputField label="Full name" name="name" value={formData.name} onChange={handleChange} icon={UserRound} placeholder="Enter your full name" required /><InputField label="Email address" name="email" type="email" value={formData.email} icon={Mail} disabled /><p className="-mt-2 text-xs text-gray-400">Email changes are managed through account support.</p><div className="flex justify-end border-t border-gray-100 pt-6"><Button type="submit" icon={Check} isLoading={isSaving}>{isSaving ? "Saving..." : "Save changes"}</Button></div></form></section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
