export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white py-6">
      <div className="mx-auto max-w-6xl px-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs md:text-sm text-gray-600">
        {/* Left Side */}
        <p className="font-medium text-gray-700">
          <span className="font-bold text-gray-900">বাজার দর</span> —
          প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </p>

        {/* Right Side */}
        <p className="text-gray-500 text-center md:text-right">
          সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </p>
      </div>
    </footer>
  );
}
