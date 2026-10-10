"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Marquee from "@/components/Marquee";

interface MarketPrice {
  market: string;
  division: string;
  min: number;
  max: number;
}

interface Product {
  id: number;
  slug: string;
  nameBn: string;
  categoryNameBn: string;
  unit: string;
  image?: string;
  categoryIcon?: string;
  today: number;
  yesterday: number;
  change: {
    dir: "up" | "down" | "flat" | string;
    pct: number;
  };
  markets: MarketPrice[];
}

const toBn = (n: number) => n.toLocaleString("bn-BD");

const getBanglaUnit = (unit?: string) => {
  if (unit === "kg") return "কেজি";
  if (unit === "litre") return "লিটার";
  if (unit === "piece") return "পিস";
  if (unit === "dozen") return "ডজন";
  return unit || "কেজি";
};

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProductData() {
      try {
        let res = await fetch(
          `https://api.api-store.workers.dev/api/bazardor/products/${slug}`,
        );

        if (res.ok) {
          const data = await res.json();
          const singleData = data.product ?? data.data ?? data;
          if (singleData && singleData.slug) {
            setProduct(singleData);
            setLoading(false);
            return;
          }
        }

        res = await fetch(
          "https://api.api-store.workers.dev/api/bazardor/products",
        );
        if (res.ok) {
          const data = await res.json();
          const list: Product[] = Array.isArray(data)
            ? data
            : (data.products ?? data.data ?? []);

          const found = list.find(
            (p) => p.slug === slug || p.id.toString() === slug,
          );
          setProduct(found || null);
        }
      } catch (err) {
        console.error("Failed to fetch product details:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProductData();
  }, [slug]);

  if (loading) {
    return <div className="py-20 text-center text-gray-400">লোড হচ্ছে...</div>;
  }

  if (!product) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">
          পণ্যটি পাওয়া যায়নি
        </h2>
        <Link
          href="/"
          className="inline-block text-[#047C37] font-semibold underline"
        >
          হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  const allMins = product.markets?.map((m) => m.min) || [product.today];
  const allMaxs = product.markets?.map((m) => m.max) || [product.today];
  const minPrice = Math.min(...allMins);
  const maxPrice = Math.max(...allMaxs);

  const avgPrice = Math.round(
    product.markets?.reduce((acc, m) => acc + (m.min + m.max) / 2, 0) /
      (product.markets?.length || 1),
  );

  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";
  const diffAmount = Math.abs((product.today || 0) - (product.yesterday || 0));

  return (
    <div className="min-h-screen bg-[#F0F5F0] flex flex-col">
      {/* Marquee component rendered at the top of detail page */}
      <Marquee />

      {/* Main Page Content */}
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-6 flex-1 w-full">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 flex items-center gap-2">
          <Link href="/" className="hover:underline">
            হোম
          </Link>
          <span>/</span>
          <span>{product.categoryNameBn || "ক্যাটাগরি"}</span>
          <span>/</span>
          <span className="text-gray-800 font-medium">{product.nameBn}</span>
        </div>

        {/* Top Summary Card */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 md:h-20 md:w-20 shrink-0 items-center justify-center rounded-2xl bg-gray-50 text-4xl border border-gray-100">
              {product.image || product.categoryIcon || "🍚"}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                {product.nameBn}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                প্রতি {getBanglaUnit(product.unit)} - {product.categoryNameBn}
              </p>
              <p className="text-xs text-gray-600 mt-2 font-medium">
                গতকালের তুলনায় আজ দাম{" "}
                <span
                  className={
                    isUp ? "text-red-600 font-bold" : "text-green-600 font-bold"
                  }
                >
                  {isUp ? "বেড়েছে" : isDown ? "কমেছে" : "অপরিবর্তিত"}
                </span>{" "}
                • {toBn(diffAmount)} টাকা
              </p>
            </div>
          </div>

          {/* Today's Price Box */}
          <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 text-center min-w-[140px] self-stretch md:self-auto flex flex-col justify-center">
            <span className="text-xs text-gray-500">আজকের দাম</span>
            <div className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-0.5">
              {toBn(product.today)}
            </div>
            <span className="text-xs text-gray-500 mt-0.5">
              টাকা / {getBanglaUnit(product.unit)}
            </span>
            <div
              className={`mt-2 inline-flex items-center justify-center gap-1 text-xs font-bold ${isUp ? "text-red-600" : "text-green-600"}`}
            >
              {isUp ? "▲" : "▼"} {toBn(product.change?.pct ?? 0)}%
            </div>
          </div>
        </div>

        {/* Price Summary Cards (Min, Max, Avg) */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900">দামের সারসংক্ষেপ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <span className="text-xs text-gray-500 block">সর্বনিম্ন দাম</span>
              <div className="text-xl font-bold text-emerald-700 mt-1">
                {toBn(minPrice)} টাকা
              </div>
              <span className="text-xs text-gray-400 mt-1 block">
                সবচেয়ে কম দামের বাজার
              </span>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <span className="text-xs text-gray-500 block">সর্বাধিক দাম</span>
              <div className="text-xl font-bold text-red-600 mt-1">
                {toBn(maxPrice)} টাকা
              </div>
              <span className="text-xs text-gray-400 mt-1 block">
                সবচেয়ে বেশি দামের বাজার
              </span>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <span className="text-xs text-gray-500 block">গড় দাম</span>
              <div className="text-xl font-bold text-gray-900 mt-1">
                {toBn(avgPrice)} টাকা
              </div>
              <span className="text-xs text-gray-400 mt-1 block">
                প্রতি {getBanglaUnit(product.unit)}-এর হিসাবে
              </span>
            </div>
          </div>
        </div>

        {/* Market-wise Prices Table */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900">
            বাজারভিত্তিক আজকের দাম
          </h2>
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 font-semibold">
                    <th className="p-4">বাজার</th>
                    <th className="p-4">বিভাগ</th>
                    <th className="p-4">সর্বনিম্ন</th>
                    <th className="p-4">সর্বাধিক</th>
                    <th className="p-4">গড়</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {product.markets?.map((m, index) => {
                    const mAvg = ((m.min + m.max) / 2).toFixed(1);
                    return (
                      <tr
                        key={index}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="p-4 font-medium text-gray-900">
                          {m.market}
                        </td>
                        <td className="p-4 text-gray-500">{m.division}</td>
                        <td className="p-4 font-semibold text-emerald-700">
                          {toBn(m.min)} টাকা
                        </td>
                        <td className="p-4 font-semibold text-red-600">
                          {toBn(m.max)} টাকা
                        </td>
                        <td className="p-4 font-semibold text-gray-800">
                          {toBn(Number(mAvg))} টাকা
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
