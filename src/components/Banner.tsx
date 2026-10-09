import Image from "next/image";

const Banner = () => {
  const date = new Date().toLocaleDateString("bn-BD", {
    dateStyle: "full",
  });

  return (
    <div className="bg-[#F0F5F0]">
      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Main Card Container */}
        <div className="rounded-3xl border border-gray-200 bg-white p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left Text Section */}
          <div className="flex flex-col items-start text-left max-w-lg space-y-4">
            {/* Date Badge */}
            <span className="inline-block bg-[#E1F0E7] text-[#05893E] text-xs font-medium px-3 py-1 rounded-full">
              {date}
            </span>

            {/* Heading */}
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
              আজকের বাজারের দাম এক নজরে
            </h1>

            {/* Description */}
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক
              বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
            </p>

            {/* Action Button */}
            <div className="pt-2">
              <button className="rounded-xl bg-[#047C37] text-white px-5 py-2.5 text-sm font-semibold shadow hover:bg-[#03632C] transition-colors">
                সব পণ্য দেখুন
              </button>
            </div>
          </div>

          {/* Right Image Section */}
          <div className="flex justify-center shrink-0">
            <Image
              className="object-contain w-64 md:w-80 h-auto"
              priority
              height={320}
              width={320}
              src={"/bazar-hero.png"}
              alt="Bazar Hero Banner"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
