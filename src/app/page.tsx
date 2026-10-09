import Marquee from "@/components/Marquee";
import Banner from "@/components/Banner";
import TrendingProducts from "@/components/TrendingProducts";

export default function Home() {
  return (
    <main className="flex-1 bg-[#F0F5F0]">
      {/* 1. Price Ticker Marquee */}
      <Marquee />

      {/* 2. Hero / Banner Section */}
      <Banner />

      {/* 3. Product Trends Sections (Risers & Fallers) */}
      <TrendingProducts />
    </main>
  );
}
