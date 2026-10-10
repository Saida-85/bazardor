"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Marquee from "@/components/Marquee";

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
}

interface CategoryDetail {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
  description?: string;
}

const toBn = (n: number) => n?.toLocaleString("bn-BD") || "০";

const getBanglaUnit = (unit?: string) => {
  if (unit === "kg") return "কেজি";
  if (unit === "litre") return "লিটার";
  if (unit === "piece") return "পিস";
  if (unit === "dozen") return "ডজন";
  return unit || "কেজি";
};

export default function CategoryPage({
  params,
}: {
  params: Promise<{ categoryid: string }>;
}) {
  const { categoryid } = use(params);

  const [categoryData, setCategoryData] = useState<CategoryDetail | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<
    "default" | "low-to-high" | "high-to-low"
  >("default");

  useEffect(() => {
    async function fetchCategoryData() {
      setLoading(true);
      try {
        // 1. Fetch single category detail API
        const catRes = await fetch(
          `https://api.api-store.workers.dev/api/bazardor/categories/${categoryid}`,
        );

        let fetchedProducts: Product[] = [];
        let categoryInfo: CategoryDetail | null = null;

        if (catRes.ok) {
          const data = await resJson(catRes);
          categoryInfo = data.category ?? data.data ?? data;

          // Extract products array from category endpoint
          if (Array.isArray(data.products)) {
            fetchedProducts = data.products;
          } else if (Array.isArray(data)) {
            fetchedProducts = data;
          } else if (
            categoryInfo &&
            Array.isArray((categoryInfo as any).products)
          ) {
            fetchedProducts = (categoryInfo as any).products;
          }
        }

        // 2. Fallback: If products array is empty, fetch all products and filter by category slug/id
        if (fetchedProducts.length === 0) {
          const allProductsRes = await fetch(
            "https://api.api-store.workers.dev/api/bazardor/products",
          );
          if (allProductsRes.ok) {
            const allData = await resJson(allProductsRes);
            const allList: Product[] = Array.isArray(allData)
              ? allData
              : (allData.products ?? allData.data ?? []);

            fetchedProducts = allList.filter(
              (p) =>
                p.category?.toLowerCase() === categoryid?.toLowerCase() ||
                p.categoryNameBn === categoryInfo?.nameBn,
            );
          }
        }

        setCategoryData(categoryInfo);
        setProducts(fetchedProducts);
      } catch (err) {
        console.error("Failed to fetch category data:", err);
      } finally {
        setLoading(false);
      }
    }

    if (categoryid) {
      fetchCategoryData();
    }
  }, [categoryid]);

  async function resJson(res: Response) {
    try {
      return await res.json();
    } catch {
      return {};
    }
  }

  // Sorting Logic
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === "low-to-high") return a.today - b.today;
    if (sortOrder === "high-to-low") return b.today - a.today;
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#F0F5F0] flex flex-col">
      <Marquee />

      <main className="mx-auto max-w-6xl px-4 py-8 space-y-6 flex-1 w-full">
        {loading ? (
          <div className="space-y-6">
            <div className="h-28 bg-white border border-gray-200 rounded-3xl animate-pulse p-6" />
            <div className="h-16 bg-white border border-gray-200 rounded-2xl animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-36 bg-white border border-gray-200 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          </div>
        ) : !categoryData && sortedProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
            <div className="text-5xl">🔍</div>
            <h2 className="text-2xl font-bold text-gray-800">
              কোন ক্যাটাগরি পাওয়া যায়নি
            </h2>
            <p className="text-sm text-gray-500">
              আপনার অনুসন্ধানকৃত ক্যাটাগরিটি বিদ্যমান নেই বা সরিয়ে ফেলা হয়েছে।
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-2.5 bg-[#047C37] text-white font-semibold rounded-xl hover:bg-[#03632C] transition-colors"
            >
              হোম পেজে ফিরে যান
            </Link>
          </div>
        ) : (
          <>
            {/* Header / Category Title Card */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm flex items-center gap-5">
              <div className="flex h-16 w-16 md:h-20 md:w-20 shrink-0 items-center justify-center rounded-2xl bg-gray-50 text-4xl border border-gray-100">
                {categoryData?.icon || "📦"}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                  {categoryData?.nameBn || categoryid}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {toBn(sortedProducts.length)}টি পণ্যের আজকের দাম ও পরিবর্তন
                </p>
              </div>
            </div>

            {/* Sort Control Toolbar */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm flex items-center justify-between gap-4">
              <span className="text-xs text-gray-500 font-medium">
                মোট {toBn(sortedProducts.length)}টি পণ্য দেখানো হচ্ছে
              </span>

              <div className="flex items-center gap-2">
                <label
                  htmlFor="sort"
                  className="text-sm text-gray-600 font-medium whitespace-nowrap"
                >
                  সাজান:
                </label>
                <select
                  id="sort"
                  value={sortOrder}
                  onChange={(e) =>
                    setSortOrder(
                      e.target.value as
                        | "default"
                        | "low-to-high"
                        | "high-to-low",
                    )
                  }
                  aria-label="পণ্য সাজান"
                  className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#047C37]"
                >
                  <option value="default">ডিফল্ট</option>
                  <option value="low-to-high">দাম: কম থেকে বেশি</option>
                  <option value="high-to-low">দাম: বেশি থেকে কম</option>
                </select>
              </div>
            </div>

            {/* Product Cards List */}
            {sortedProducts.length === 0 ? (
              <div className="py-16 text-center space-y-4 bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
                <p className="text-gray-500 font-medium">
                  এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য পাওয়া যায়নি।
                </p>
                <Link
                  href="/"
                  className="inline-block text-[#047C37] font-semibold underline"
                >
                  হোম পেজে ফিরে যান
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedProducts.map((p) => {
                  const isUp = p.change?.dir === "up";
                  const isDown = p.change?.dir === "down";
                  const pct = Math.abs(p.change?.pct ?? 0);

                  return (
                    <Link
                      key={p.id}
                      href={`/product/${p.slug}`}
                      className="group block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:border-[#047C37] hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gray-50 text-3xl border border-gray-100 group-hover:scale-105 transition-transform">
                          {p.image ||
                            p.categoryIcon ||
                            categoryData?.icon ||
                            "📦"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 group-hover:text-[#047C37] transition-colors truncate">
                            {p.nameBn}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            প্রতি {getBanglaUnit(p.unit)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-end justify-between border-t border-gray-100 pt-3">
                        <div>
                          <span className="text-[10px] text-gray-400 block uppercase font-medium">
                            আজকের দাম
                          </span>
                          <span className="text-xl font-extrabold text-gray-900">
                            {toBn(p.today)}{" "}
                            <span className="text-xs font-normal text-gray-600">
                              টাকা
                            </span>
                          </span>
                        </div>

                        <div
                          className={`inline-flex items-center gap-0.5 px-2.5 py-1 rounded-full text-xs font-bold ${
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
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
