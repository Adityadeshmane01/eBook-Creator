import { BookOpen } from "lucide-react";
import { FaGithub, FaLinkedinIn, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-violet-100 bg-linear-to-br from-white via-white to-violet-50 text-gray-900">
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-14 pb-7 sm:pt-16 lg:px-8 lg:pt-20">
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-12 lg:grid-cols-[1.8fr_1fr_1fr_1fr] lg:gap-8">
          <div className="min-w-0 sm:col-span-2 lg:col-span-1">
            <a href="/" className="group inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20 transition-all duration-300 group-hover:scale-105">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold tracking-tight text-gray-900">AI eBook Creator</span>
            </a>

            <p className="mt-5 mb-6 max-w-md text-[15px] leading-7 text-gray-600 sm:mt-6 sm:mb-7">
              Create, design, and publish stunning ebooks with the power of AI.
            </p>

            <div className="flex items-center gap-2.5">
              <a
                href="https://twitter.com"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:bg-violet-600 hover:text-white"
                aria-label="Twitter"
              >
                <FaTwitter className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:bg-violet-600 hover:text-white"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn className="h-4 w-4" />
              </a>
              <a
                href="https://github.com"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:bg-violet-600 hover:text-white"
                aria-label="GitHub"
              >
                <FaGithub className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="min-w-0">
            <h3 className="mb-4 text-[15px] font-semibold text-gray-900">Product</h3>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="text-[15px] text-gray-600 transition-colors hover:text-violet-600">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-[15px] text-gray-600 transition-colors hover:text-violet-600">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#templates" className="text-[15px] text-gray-600 transition-colors hover:text-violet-600">
                  Templates
                </a>
              </li>
            </ul>
          </div>

          <div className="min-w-0">
            <h3 className="mb-4 text-[15px] font-semibold text-gray-900">Company</h3>
            <ul className="space-y-3">
              <li>
                <a href="#about" className="text-[15px] text-gray-600 transition-colors hover:text-violet-600">
                  About
                </a>
              </li>
              <li>
                <a href="#contact" className="text-[15px] text-gray-600 transition-colors hover:text-violet-600">
                  Contact
                </a>
              </li>
              <li>
                <a href="#blog" className="text-[15px] text-gray-600 transition-colors hover:text-violet-600">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div className="min-w-0">
            <h3 className="mb-4 text-[15px] font-semibold text-gray-900">Legal</h3>
            <ul className="space-y-3">
              <li>
                <a href="#privacy" className="text-[15px] text-gray-600 transition-colors hover:text-violet-600">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#terms" className="text-[15px] text-gray-600 transition-colors hover:text-violet-600">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-6 sm:mt-14 sm:pt-7">
          <div className="flex flex-col items-center justify-between gap-3 text-center sm:gap-4 sm:text-left md:flex-row">
            <p className="text-xs text-gray-500 sm:text-sm">
              © {new Date().getFullYear()} eBook Creator. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 sm:text-sm">
              Made with <span className="text-lg text-violet-500">♥</span> by Aditya
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
