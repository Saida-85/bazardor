"use client";

import { useEffect, useState } from "react";

const API_URL = "https://api.api-store.workers.dev/api/bazardor/products";

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  change: {
    dir: "up" | "down" | "flat" | string;
    pct: number;
  };
};

const toBn = (n: number) => n.toLocaleString("bn-BD");

const getBanglaUnit = (unit: string) => {
  if (unit === "kg") return "কেজি";
  if (unit === "litre") return "লিটার";
  if (unit === "piece") return "পিস";
  if (unit === "dozen") return "ডজন";
  return unit;
};

export default function Marquee() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        const list: Product[] = Array.isArray(data)
          ? data
          : (data.products ?? data.data ?? []);
        setProducts(list);
      })
      .catch((err) => console.error("Price ticker fetch failed:", err));
  }, []);

  if (products.length === 0) {
    return (
      <div className="w-full bg-white border-y border-gray-200 py-3 px-4 text-center text-xs text-gray-400">
        বাজারের লাইভ দর লোড হচ্ছে...
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden bg-white border-y border-gray-200 py-3 relative flex items-center">
      <div className="flex animate-marquee whitespace-nowrap gap-8 hover:[animation-play-state:paused]">
        {[...products, ...products].map((p, idx) => {
          const isUp = p.change?.dir === "up";
          const isDown = p.change?.dir === "down";
          const arrow = isUp ? "▲" : isDown ? "▼" : "•";
          const color = isUp
            ? "text-red-600"
            : isDown
              ? "text-green-600"
              : "text-gray-500";

          return (
            <div
              key={`${p.id}-${idx}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-800"
            >
              <span className="text-base">
                {p.image || p.categoryIcon || "📦"}
              </span>
              <span>{p.nameBn}</span>
              <span className="text-gray-600 font-semibold">
                {toBn(p.today)} টাকা/{getBanglaUnit(p.unit)}
              </span>
              <span
                className={`inline-flex items-center gap-0.5 text-xs font-bold ${color}`}
              >
                {arrow} {toBn(Math.abs(p.change?.pct ?? 0))}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
