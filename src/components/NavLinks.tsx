"use client";

import Link from "next/link";

interface Category {
  id: string;
  slug?: string;
  nameBn: string;
  icon: string;
}

const categories: Category[] = [
  { id: "1", slug: "rice", nameBn: "চাল", icon: "🍚" },
  { id: "2", slug: "dal", nameBn: "ডাল", icon: "🫘" },
  { id: "3", slug: "oil", nameBn: "তেল", icon: "🛢️" },
  { id: "4", slug: "vegetables", nameBn: "সবজি", icon: "🥬" },
  { id: "5", slug: "fish", nameBn: "মাছ", icon: "🐟" },
  { id: "6", slug: "meat", nameBn: "মাংস", icon: "🥩" },
  { id: "7", slug: "dairy", nameBn: "ডিম-দুধ", icon: "🥛" },
  { id: "8", slug: "spices", nameBn: "মসলা", icon: "🌶️" },
];

const NavLinks = () => {
  return (
    <div className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-2.5">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-1">
          {categories.map((n) => {
            const categorySlug = n.slug || n.id;

            return (
              <Link
                key={n.id}
                href={`/category/${categorySlug}`}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-gray-700 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
              >
                <span>{n.icon}</span>
                <span>{n.nameBn}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NavLinks;
