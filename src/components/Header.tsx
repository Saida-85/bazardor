import Marquee from "./Marquee";
import NavLinks from "./NavLinks";

const Header = () => {
  const date = new Date().toLocaleDateString("bn-BD", {
    dateStyle: "full",
  });

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo and website name */}
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#05893E] text-lg">
            🛒
          </div>

          <div>
            <div className="text-2xl font-semibold leading-tight">বাজার দর</div>
            <div className="text-xs text-gray-500">{date}</div>
          </div>
        </div>

        {/* Authentication buttons */}
        <div className="flex items-center gap-2">
          <button className="btn border-transparent bg-transparent hover:bg-[#dee2de] hover:border-[#C5CCC7]">
            সাইন ইন
          </button>

          <button className="btn border-[#047C37] bg-[#047C37] text-white hover:border-[#03632C] hover:bg-[#03632C]">
            সাইন আপ
          </button>
        </div>
      </div>

      <NavLinks />
      <Marquee />
    </header>
  );
};

export default Header;
