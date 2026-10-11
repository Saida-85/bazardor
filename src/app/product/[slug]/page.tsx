"use client";

import { useEffect, useState, use, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import Marquee from "@/components/Marquee";

interface MarketPrice {
  market: string;
  division: string;
  min: number;
  max: number;
  avg: number;
}

interface Product {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon?: string;
  unit: string;
  image?: string;
  today: number;
  yesterday: number;
  change: {
    dir: "up" | "down" | "flat" | string;
    pct: number;
  };
  minPrice?: number;
  maxPrice?: number;
  avgPrice?: number;
  markets?: MarketPrice[];
}

const toBn = (n: number | string) => {
  if (n === undefined || n === null) return "০";
  const str = typeof n === "number" ? n.toString() : n;
  const numbers: Record<string, string> = {
    "0": "০",
    "1": "১",
    "2": "২",
    "3": "৩",
    "4": "৪",
    "5": "৫",
    "6": "৬",
    "7": "৭",
    "8": "৮",
    "9": "৯",
  };
  return str.replace(/[0-9]/g, (s) => numbers[s] || s);
};

const getBanglaUnit = (unit?: string) => {
  if (unit === "kg") return "কেজি";
  if (unit === "litre") return "লিটার";
  if (unit === "piece") return "পিস";
  if (unit === "dozen") return "ডজন";
  return unit || "কেজি";
};

// Fallback markets list if API doesn't include market arrays directly
const fallbackMarkets: MarketPrice[] = [
  { market: "মাঠ বাজার", division: "ময়মনসিংহ", min: 59, max: 65, avg: 62 },
  { market: "সদর বাজার", division: "রাজশাহী", min: 60, max: 66, avg: 63 },
  { market: "বাজারহাট", division: "খুলনা", min: 60, max: 67, avg: 63.5 },
  { market: "বাসারহাট বাজার", division: "রাজশাহী", min: 60, max: 68, avg: 64 },
  { market: "চৌর বাজার", division: "ময়মনসিংহ", min: 60, max: 69, avg: 64.5 },
  { market: "আমতলী বাজার", division: "চট্টগ্রাম", min: 61, max: 69, avg: 65 },
  { market: "ডবলগেট বাজার", division: "খুলনা", min: 62, max: 69, avg: 65.5 },
  { market: "চৌরাস্তা বাজার", division: "সিলেট", min: 63, max: 76, avg: 67 },
  {
    market: "গ্রীন মার্কেট, মিরপুর",
    division: "ঢাকা",
    min: 64,
    max: 76,
    avg: 67.5,
  },
  {
    market: "চৌদ্দগ্রাম বাজার",
    division: "চট্টগ্রাম",
    min: 63,
    max: 73,
    avg: 68,
  },
  { market: "আমবাজার", division: "সিলেট", min: 64, max: 73, avg: 68.5 },
  { market: "কারওয়ান বাজার", division: "ঢাকা", min: 65, max: 73, avg: 69 },
];

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Ref to prevent duplicate toast triggers on re-renders
  const toastShownRef = useRef(false);

  // Protected route check
  useEffect(() => {
    if (!sessionPending && !session?.user && !toastShownRef.current) {
      toastShownRef.current = true;
      toast.error("দয়া করে প্রথমে সাইন ইন করুন!");
      router.push("/sign-in");
    }
  }, [session, sessionPending, router]);

  useEffect(() => {
    async function fetchProduct() {
      if (!session?.user) return;
      setLoading(true);
      try {
        const res = await fetch(
          "https://openapi.programming-hero.com/api/bazardor/products",
        );
        if (res.ok) {
          const json = await res.json();
          const list: Product[] = Array.isArray(json)
            ? json
            : (json.products ?? json.data ?? []);

          const found = list.find((p) => p.slug === slug);
          if (found) {
            setProduct(found);
          }
        }
      } catch (err) {
        console.error("Failed to fetch product detail:", err);
      } finally {
        setLoading(false);
      }
    }

    if (session?.user && slug) {
      fetchProduct();
    }
  }, [slug, session]);

  if (sessionPending || (session?.user && loading)) {
    return (
      <div className="min-h-screen bg-[#F0F5F0] flex flex-col">
        <Marquee />
        <main className="mx-auto max-w-5xl px-4 py-8 space-y-6 flex-1 w-full">
          <div className="h-40 bg-white border border-gray-200 rounded-3xl animate-pulse p-6" />
          <div className="h-32 bg-white border border-gray-200 rounded-2xl animate-pulse" />
          <div className="h-64 bg-white border border-gray-200 rounded-2xl animate-pulse" />
        </main>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  // 404 / Invalid Product State
  if (!product) {
    return (
      <div className="min-h-screen bg-[#F0F5F0] flex flex-col">
        <Marquee />
        <main className="mx-auto max-w-5xl px-4 py-20 flex-1 w-full text-center">
          <div className="py-16 space-y-4 bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
            <div className="text-5xl">🔍</div>
            <h2 className="text-2xl font-bold text-gray-800">
              পণ্যটি পাওয়া যায়নি
            </h2>
            <p className="text-sm text-gray-500">
              আপনার অনুসন্ধানকৃত পণ্যটি বিদ্যমান নেই বা সরিয়ে ফেলা হয়েছে।
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-2.5 bg-[#047C37] text-white font-semibold rounded-xl hover:bg-[#03632C] transition-colors"
            >
              হোম পেজে ফিরে যান
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";
  const pct = Math.abs(product.change?.pct ?? 0);
  const diffAmount = Math.abs(product.today - product.yesterday);
  const diffText = isUp
    ? `বেড়েছে · ${toBn(diffAmount)} টাকা`
    : isDown
      ? `কমেছে · ${toBn(diffAmount)} টাকা`
      : "পরিবর্তন হয়নি";

  const marketsList =
    product.markets && product.markets.length > 0
      ? product.markets
      : fallbackMarkets;

  return (
    <div className="min-h-screen bg-[#F0F5F0] flex flex-col">
      <Marquee />

      <main className="mx-auto max-w-5xl px-4 py-6 space-y-6 flex-1 w-full">
        {/* Breadcrumbs */}
        <nav className="text-xs text-gray-500 flex items-center gap-2">
          <Link href="/" className="hover:text-[#047C37]">
            হোম
          </Link>
          <span>›</span>
          <Link
            href={`/category/${product.category}`}
            className="hover:text-[#047C37]"
          >
            {product.categoryNameBn || product.category}
          </Link>
          <span>›</span>
          <span className="text-gray-800 font-semibold">{product.nameBn}</span>
        </nav>

        {/* Top Header Card */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 md:h-20 md:w-20 shrink-0 items-center justify-center rounded-2xl bg-gray-50 text-4xl border border-gray-100 shadow-sm">
              {product.image || product.categoryIcon || "🍚"}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                {product.nameBn}
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                প্রতি {getBanglaUnit(product.unit)} ·{" "}
                {product.categoryNameBn || product.category}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                গতকালের তুলনায় আজ দাম{" "}
                <span
                  className={
                    isUp
                      ? "text-red-600 font-semibold"
                      : isDown
                        ? "text-green-600 font-semibold"
                        : "text-gray-600"
                  }
                >
                  {diffText}
                </span>
              </p>
            </div>
          </div>

          {/* Right Price Badge Card */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50/80 px-6 py-3.5 text-center shadow-inner min-w-[140px]">
            <span className="text-[10px] text-gray-500 block uppercase font-medium">
              আজকের দাম
            </span>
            <span className="text-2xl font-black text-gray-900">
              {toBn(product.today)}
            </span>
            <span className="text-xs text-gray-600 block mt-0.5">
              টাকা / {getBanglaUnit(product.unit)}
            </span>
            <div
              className={`mt-1.5 inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                isUp
                  ? "bg-red-50 text-red-600"
                  : isDown
                    ? "bg-green-50 text-green-600"
                    : "bg-gray-100 text-gray-600"
              }`}
            >
              <span>{isUp ? "▲" : isDown ? "▼" : "•"}</span>
              <span>{toBn(pct)}%</span>
            </div>
          </div>
        </div>

        {/* Section 2: Price Summary Cards (দামের সারসংক্ষেপ) */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900">দামের সারসংক্ষেপ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-1">
              <span className="text-xs text-gray-400 font-medium">
                সর্বনিম্ন দাম
              </span>
              <div className="text-xl font-extrabold text-[#047C37]">
                {toBn(product.minPrice || Math.round(product.today * 0.95))}{" "}
                <span className="text-xs font-normal text-gray-600">টাকা</span>
              </div>
              <span className="text-[11px] text-gray-500 block">
                সর্বনিম্ন দামের বাজার
              </span>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-1">
              <span className="text-xs text-gray-400 font-medium">
                সর্বাধিক দাম
              </span>
              <div className="text-xl font-extrabold text-red-600">
                {toBn(product.maxPrice || Math.round(product.today * 1.08))}{" "}
                <span className="text-xs font-normal text-gray-600">টাকা</span>
              </div>
              <span className="text-[11px] text-gray-500 block">
                সর্বাধিক দামের বাজার
              </span>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-1">
              <span className="text-xs text-gray-400 font-medium">গড় দাম</span>
              <div className="text-xl font-extrabold text-gray-900">
                {toBn(product.avgPrice || product.today)}{" "}
                <span className="text-xs font-normal text-gray-600">টাকা</span>
              </div>
              <span className="text-[11px] text-gray-500 block">
                প্রতি কেজি-এর হিসাবে
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Market-wise Price Table (বাজারভিত্তিক আজকের দাম) */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900">
            বাজারভিত্তিক আজকের দাম
          </h2>
          <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-xs font-bold text-gray-600">
                    <th className="py-3.5 px-6">বাজার</th>
                    <th className="py-3.5 px-6">বিভাগ</th>
                    <th className="py-3.5 px-6">সর্বনিম্ন</th>
                    <th className="py-3.5 px-6">সর্বাধিক</th>
                    <th className="py-3.5 px-6">গড়</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {marketsList.map((m, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      <td className="py-3.5 px-6 font-semibold text-gray-900">
                        {m.market}
                      </td>
                      <td className="py-3.5 px-6 text-gray-600">
                        {m.division}
                      </td>
                      <td className="py-3.5 px-6 text-gray-800">
                        {toBn(m.min)} টাকা
                      </td>
                      <td className="py-3.5 px-6 text-gray-800">
                        {toBn(m.max)} টাকা
                      </td>
                      <td className="py-3.5 px-6 font-bold text-gray-900">
                        {toBn(m.avg)} টাকা
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#047C37] hover:underline"
          >
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </main>
    </div>
  );
}
