"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import Marquee from "@/components/Marquee";

const ProfileUpdatePage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in");
    } else if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session, isPending, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await authClient.updateUser({
        name: name,
      });

      if (error) {
        toast.error(error.message || "আপডেট করতে সমস্যা হয়েছে।");
      } else {
        toast.success("প্রোফাইল সফলভাবে আপডেট হয়েছে!");
        router.push("/profile");
        router.refresh();
      }
    } catch (err) {
      toast.error("কিছু ভুল হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-[85vh] bg-[#F7F8F6] flex flex-col">
        <Marquee />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-gray-500 font-medium">লোডিং...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] bg-[#F7F8F6] flex flex-col justify-between pb-8">
      <Marquee />

      <div className="flex flex-1 flex-col items-center justify-center p-4 py-8">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-black text-gray-900">
              প্রোফাইল আপডেট করুন
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              আপনার নাম পরিবর্তন করতে নিচের ফর্মটি ব্যবহার করুন।
            </p>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                নাম
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="আপনার নাম লিখুন"
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-[#047C37] focus:outline-none focus:ring-1 focus:ring-[#047C37]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#047C37] text-white py-3 font-bold text-sm hover:bg-[#03632C] transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {loading ? "আপডেট হচ্ছে..." : "তথ্য আপডেট করুন"}
            </button>
          </form>

          <div className="text-center text-xs text-gray-600 pt-2">
            <Link
              href="/profile"
              className="text-gray-500 hover:text-[#047C37] font-medium"
            >
              ← প্রোফাইলে ফিরে যান
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdatePage;
