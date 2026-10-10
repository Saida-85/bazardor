"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

interface Product {
  id: number;
  slug: string;
  nameBn: string;
  image?: string;
  categoryIcon?: string;
  unit?: string;
  today: number;
  change: {
    dir: "up" | "down" | "flat" | string;
    pct: number;
  };
}

export default function TrendingProducts() {
  const [risers, setRisers] = useState<Product[]>([]);
  const [fallers, setFallers] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [sortedProducts, setSortedProducts] = useState<Product[]>([]);
  const [sortOrder, setSortOrder] = useState<
    "default" | "low-to-high" | "high-to-low"
  >("default");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.api-store.workers.dev/api/bazardor/products")
      .then((res) => res.json())
      .then((data) => {
        const list: Product[] = Array.isArray(data)
          ? data
          : (data.products ?? data.data ?? []);

        setAllProducts(list);
        setSortedProducts(list);

        // Top 6 Risers (আজ দাম বেড়েছে)
        const topRisers = list
          .filter((p) => p.change?.dir === "up")
          .sort((a, b) => b.change.pct - a.change.pct)
          .slice(0, 6);

        // Top 6 Fallers (আজ দাম কমেছে)
        const topFallers = list
          .filter((p) => p.change?.dir === "down")
          .sort((a, b) => b.change.pct - a.change.pct)
          .slice(0, 6);

        setRisers(topRisers);
        setFallers(topFallers);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      });
  }, []);

  // Handle sorting logic for Section C
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "default" | "low-to-high" | "high-to-low";
    setSortOrder(value);

    let currentList = [...allProducts];

    if (value === "low-to-high") {
      currentList.sort((a, b) => a.today - b.today);
    } else if (value === "high-to-low") {
      currentList.sort((a, b) => b.today - a.today);
    } else {
      // default order from API
      currentList = [...allProducts];
    }

    setSortedProducts(currentList);
  };

  if (loading) {
    return <div className="py-10 text-center text-gray-400">লোড হচ্ছে...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-12">
      {/* Section A — আজ দাম বেড়েছে */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <span className="text-red-600 text-lg">▲</span>
          <h2 className="text-xl font-bold text-gray-900">আজ দাম বেড়েছে</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {risers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Section B — আজ দাম কমেছে */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <span className="text-green-600 text-lg">▼</span>
          <h2 className="text-xl font-bold text-gray-900">আজ দাম কমেছে</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {fallers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Section C — সব পণ্য & Sort Filter */}
      <div id="সব-পণ্য" className="pt-4 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">সব পণ্য</h2>
            <p className="text-sm text-gray-500 mt-1">
              বাজারের সকল পণ্যের বর্তমান মূল্য তালিকা ও দামের পরিবর্তন এক নজরে
              দেখুন।
            </p>
          </div>

          {/* Sort Dropdown Filter */}
          <div className="flex items-center gap-2 self-start sm:self-auto bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm">
            <span className="text-xs text-gray-500 font-medium">সাজান :</span>
            <select
              value={sortOrder}
              onChange={handleSortChange}
              className="bg-transparent text-sm font-semibold text-gray-800 outline-none cursor-pointer"
            >
              <option value="default">ডিফল্ট</option>
              <option value="low-to-high">দাম: কম থেকে বেশি</option>
              <option value="high-to-low">দাম: বেশি থেকে কম</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
