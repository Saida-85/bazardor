import Link from "next/link";

interface ProductCardProps {
  product: {
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
  };
}

const toBn = (n: number) => n.toLocaleString("bn-BD");

const getBanglaUnit = (unit?: string) => {
  if (unit === "kg") return "কেজি";
  if (unit === "litre") return "লিটার";
  if (unit === "piece") return "পিস";
  if (unit === "dozen") return "ডজন";
  return unit || "কেজি";
};

export default function ProductCard({ product }: ProductCardProps) {
  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";
  const isFlat = (!isUp && !isDown) || product.change?.dir === "flat";

  const arrow = isUp ? "▲" : isDown ? "▼" : "—";

  const badgeColor = isUp
    ? "text-red-600 bg-red-50"
    : isDown
      ? "text-green-600 bg-green-50"
      : "text-gray-500 bg-gray-50";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
    >
      {/* Top Section: Emoji on left, Name & Unit on right */}
      <div className="flex items-center gap-3.5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-2xl border border-gray-100">
          {product.image || product.categoryIcon || "📦"}
        </div>
        <div>
          <h3 className="font-bold text-gray-900 group-hover:text-[#047C37] transition-colors">
            {product.nameBn}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            প্রতি {getBanglaUnit(product.unit)}
          </p>
        </div>
      </div>

      {/* Bottom Section: Price & Percentage Change */}
      <div className="mt-4 flex items-end justify-between border-t border-gray-100 pt-3">
        <div>
          <span className="text-xs text-gray-400 block">আজকের দাম</span>
          <span className="text-lg font-bold text-gray-900">
            {toBn(product.today)} টাকা
          </span>
        </div>

        <span
          className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-bold ${badgeColor}`}
        >
          {arrow} {toBn(Math.abs(product.change?.pct ?? 0))}%
        </span>
      </div>
    </Link>
  );
}
