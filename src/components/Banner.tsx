"use client";

import Image from "next/image";

const Banner = () => {
  const date = new Date().toLocaleDateString("bn-BD", {
    dateStyle: "full",
  });

  const scrollToProducts = () => {
    // Target the unique ID for Section C specifically
    const section = document.getElementById("section-all-products");
    if (section) {
      const elementPosition = section.getBoundingClientRect().top;
      // 160px offset accounts for your sticky header and nav bars
      const offsetPosition = elementPosition + window.pageYOffset - 160;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-[#F0F5F0]">
      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Main Card Container */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 md:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          {/* Left Text Section */}
          <div className="flex flex-col items-center md:items-start max-w-lg space-y-4">
            {/* Date Badge */}
            <span className="inline-block bg-[#E1F0E7] text-[#05893E] text-xs font-medium px-3 py-1 rounded-full">
              {date}
            </span>

            {/* Heading */}
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
              আজকের বাজারের দাম এক নজরে
            </h1>

            {/* Description */}
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক
              বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
            </p>

            {/* Action Button */}
            <div className="pt-2">
              <button
                onClick={scrollToProducts}
                className="inline-block rounded-xl bg-[#047C37] text-white px-6 py-3 text-sm font-semibold shadow hover:bg-[#03632C] transition-colors cursor-pointer"
              >
                সব পণ্য দেখুন
              </button>
            </div>
          </div>

          {/* Right Image Section */}
          <div className="flex justify-center shrink-0 w-full md:w-auto">
            <Image
              className="object-contain w-56 md:w-80 h-auto"
              priority
              quality={100}
              width={960}
              height={960}
              sizes="(min-width: 768px) 320px, 224px"
              src="/bazar-hero.png"
              alt="Bazar Hero Banner"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
