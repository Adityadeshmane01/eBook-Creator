import { useEffect, useRef, useState } from "react";
import { Album } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import ProfileDropdown from "./ProfileDropdown";

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!profileContainerRef.current?.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setProfileDropdownOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link to="/dashboard" className="group flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-violet-500 to-purple-500 transition-transform group-hover:scale-105">
              <Album className="h-5 w-5 text-white" />
            </span>
            <span className="text-xl font-semibold tracking-tight text-gray-900">AI eBook Creator</span>
          </Link>

          <div ref={profileContainerRef}>
            <ProfileDropdown
              isOpen={profileDropdownOpen}
              onToggle={() => setProfileDropdownOpen((current) => !current)}
              avatar={user?.avatar}
              name={user?.name || "User"}
              email={user?.email}
              onLogout={logout}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto min-w-0 max-w-7xl">{children}</main>
    </div>
  );
};

export default DashboardLayout
