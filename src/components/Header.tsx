import Link from "next/link";
import NavLinks from "./NavLinks";

const Header = () => {
  const date = new Date().toLocaleDateString("bn-BD", {
    dateStyle: "full",
  });

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Clickable Logo and Website Name -> Navigates to Home ("/") */}
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

        {/* Authentication buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            সাইন ইন
          </button>

          <button className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-[#047C37] rounded-lg hover:bg-[#03632C] transition-colors shadow-sm">
            সাইন আপ
          </button>
        </div>
      </div>

      <NavLinks />
    </header>
  );
};

export default Header;
