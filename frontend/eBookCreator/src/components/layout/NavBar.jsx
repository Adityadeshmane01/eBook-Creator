import { useState, useEffect } from "react";
import { useAuth } from "../../context/useAuth";
import ProfileDropdown from "./ProfileDropdown";
import { Menu, X, BookOpen, LogOut } from "lucide-react";

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();

    const [isOpen, setIsOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    const navLinks = [
        { name: "Features", href: "#features" },
        { name: "Testimonials", href: "#testimonials" },
    ];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            if (profileDropdownOpen) {
                setProfileDropdownOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [profileDropdownOpen]);

    return (
        <header>
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <a
                        href="/"
                        className="flex items-center space-x-2.5 group"
                    >
                        <div className="w-9 h-9 bg-linear-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>

                        <span className="text-xl font-semibold text-gray-900 tracking-tight">
                            AI eBook Creator
                        </span>
                    </a>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
                    </nav>

                    {/* Auth Buttons & Profile */}
                    <div className="hidden lg:flex items-center space-x-4">
                        {isAuthenticated ? (
                            <ProfileDropdown
                                isOpen={profileDropdownOpen}
                                onToggle={(e) => {
                                    e.stopPropagation();
                                    setProfileDropdownOpen(
                                        !profileDropdownOpen
                                    );
                                }}
                                avatar={user?.avatar}
                                name={user?.name}
                                email={user?.email}
                                onLogout={logout}
                            />
                        ) : (
                            <>
                                <a
                                    href="/login"
                                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Login
                                </a>

                                <a
                                    href="/signup"
                                    className="px-5 py-2 text-sm font-medium text-white bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-lg transition-all"
                                >
                                    Get Started
                                </a>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    >
                        {isOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="lg:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top duration-200">
                        <nav className="px-4 py-4 space-y-1">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}
                        </nav>

                        <div className="px-4 pb-4">
                            {isAuthenticated ? (
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-3 px-4 py-3">
                                        <div className="w-10 h-10 rounded-full bg-linear-to-r from-violet-500 to-purple-500 flex items-center justify-center text-white font-medium">
                                            {user?.name
                                                ?.charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div>
                                            <div className="font-medium">
                                                {user?.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {user?.email}
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        className="w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg flex items-center space-x-2"
                                        onClick={() => logout()}
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Sign out</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <a
                                        href="/login"
                                        className="block text-center px-4 py-2.5 text-sm font-medium text-gray-700"
                                    >
                                        Login
                                    </a>

                                    <a
                                        href="/signup"
                                        className="block text-center px-4 py-2.5 text-sm font-medium text-white bg-linear-to-r from-violet-600 to-purple-600 rounded-lg"
                                    >
                                        Get Started
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;