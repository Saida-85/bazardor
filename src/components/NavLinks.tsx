import Link from "next/link";

interface Category {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

const NavLinks = async () => {
  const res = await fetch(
    "https://api.api-store.workers.dev/api/bazardor/categories",
  );
  const data: Category[] = await res.json();

  return (
    <div className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-2.5">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-1">
          {data.map((n) => (
            <Link
              key={n.id}
              href={`/category/${n.slug}`}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-gray-700 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
            >
              <span>{n.icon}</span>
              <span>{n.nameBn}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavLinks;
