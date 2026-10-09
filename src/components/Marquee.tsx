"use client";

import { useEffect, useState } from "react";
import MarqueeText from "react-marquee-text";
import "react-marquee-text/dist/styles.css";

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
  lastWeek: number;
  lastMonth: number;
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
    let cancelled = false;

    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        const list: Product[] = Array.isArray(data)
          ? data
          : (data.products ?? data.data ?? []);

        if (!cancelled) {
          setProducts(list);
        }
      })
      .catch((err) => console.error("Price ticker fetch failed:", err));

    return () => {
      cancelled = true;
    };
  }, []);

  if (products.length === 0) return null;

  return (
    <div className="w-full overflow-hidden bg-white border-y border-gray-200 py-3">
      <MarqueeText duration={10} direction="right" pauseOnHover>
        {products.map((p) => {
          const isUp = p.change?.dir === "up";
          const isDown = p.change?.dir === "down";

          const arrow = isUp ? "▲" : isDown ? "▼" : "•";

          const color = isUp
            ? "text-red-600"
            : isDown
              ? "text-green-600"
              : "text-gray-500";

          return (
            <span
              key={p.id}
              className="mx-6 inline-flex items-center gap-1 whitespace-nowrap text-sm font-medium text-gray-800"
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
            </span>
          );
        })}
      </MarqueeText>
    </div>
  );
}
