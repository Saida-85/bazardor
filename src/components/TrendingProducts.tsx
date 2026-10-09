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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.api-store.workers.dev/api/bazardor/products")
      .then((res) => res.json())
      .then((data) => {
        const list: Product[] = Array.isArray(data)
          ? data
          : (data.products ?? data.data ?? []);

        // Top 6 Risers (দাম বেড়েছে)
        const topRisers = list
          .filter((p) => p.change?.dir === "up")
          .sort((a, b) => b.change.pct - a.change.pct)
          .slice(0, 6);

        // Top 6 Fallers (দাম কমেছে)
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

  if (loading) {
    return <div className="py-10 text-center text-gray-400">লোড হচ্ছে...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-10">
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
    </div>
  );
}
