import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#F0F5F0] via-[#E8F2E8] to-[#F0F5F0] flex items-center justify-center p-4 overflow-hidden">
      {/* Subtle Background Glow Spheres */}
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#047C37]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#05893E]/10 blur-3xl pointer-events-none" />

      {/* Main Glassmorphism Card */}
      <div className="relative w-full max-w-lg rounded-3xl border border-white/60 bg-white/80 backdrop-blur-xl p-8 sm:p-10 text-center shadow-2xl shadow-[#047C37]/5 space-y-6">
        {/* Animated Icon Badge */}
        <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#047C37]/15 animate-ping opacity-75" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#047C37] to-[#05A049] text-4xl shadow-lg shadow-[#047C37]/25 text-white">
            🧭
          </div>
        </div>

        {/* 404 Badge & Text Header */}
        <div className="space-y-2">
          <span className="inline-block px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#047C37] bg-[#047C37]/10 rounded-full">
            ৪০৪ - পেজটি খুঁজে পাওয়া যায়নি
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            ভুল পথ বেছে নিয়েছেন?
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-sm mx-auto font-medium leading-relaxed">
            আপনি যে পেজটি খুঁজছেন তা বিদ্যমান নেই, সরিয়ে ফেলা হয়েছে অথবা
            লিংকটি ভুল।
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="group relative flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-[#047C37] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#047C37]/20 transition-all hover:bg-[#03632C] hover:shadow-xl hover:shadow-[#047C37]/30 hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>হোম পেজে ফিরে যান</span>
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
