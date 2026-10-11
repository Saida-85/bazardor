"use client";

import Link from "next/link";
import NavLinks from "./NavLinks";
import { authClient } from "@/lib/auth-client";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const date = new Date().toLocaleDateString("bn-BD", {
    dateStyle: "full",
  });

  // Include isPending from useSession
  const { data: session, isPending } = authClient.useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("সফলভাবে সাইন আউট হয়েছে!");
          setDropdownOpen(false);
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  const userInitial = session?.user?.name
    ? session.user.name.charAt(0).toUpperCase()
    : "U";

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Clickable Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group cursor-pointer select-none"
        >
          <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-[#05893E] text-xl transition-transform group-hover:scale-105 shadow-sm">
            🛒
          </div>

          <div>
            <div className="text-xl sm:text-2xl font-bold leading-tight text-gray-900 group-hover:text-[#047C37] transition-colors">
              বাজার দর
            </div>
            <div className="text-[11px] sm:text-xs text-gray-500">{date}</div>
          </div>
        </Link>

        {/* Authentication buttons / User Profile Dropdown */}
        <div className="flex items-center gap-1.5 sm:gap-2 relative">
          {isPending ? (
            <div className="h-8 w-24 bg-gray-100 rounded-lg animate-pulse" />
          ) : session?.user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer select-none"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#047C37] text-white font-semibold text-sm shadow-sm">
                  {userInitial}
                </div>
                <span className="text-sm font-semibold text-gray-800 hidden sm:inline">
                  {session.user.name}
                </span>
                <span className="text-xs text-gray-500">▼</span>
              </button>

              {/* Dropdown Menu Box */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-gray-200 bg-white shadow-lg py-3 px-2 z-50">
                  <div className="px-3 pb-3 border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-900">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {session.user.email}
                    </p>
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-base">👤</span>
                      <span>আমার প্রোফাইল</span>
                    </Link>

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors text-left cursor-pointer"
                    >
                      <span className="text-base">↪</span>
                      <span>সাইন আউট</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                সাইন ইন
              </Link>

              <Link
                href="/sign-up"
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-[#047C37] rounded-lg hover:bg-[#03632C] transition-colors shadow-sm"
              >
                সাইন আপ
              </Link>
            </>
          )}
        </div>
      </div>

      <NavLinks />
    </header>
  );
};

export default Header;
