"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Marquee from "@/components/Marquee";
import Link from "next/link";

const ProfilePage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in");
    }
  }, [session, isPending, router]);

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

  if (!session?.user) {
    return null;
  }

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("সফলভাবে সাইন আউট হয়েছে!");
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  const userInitial = session.user.name
    ? session.user.name.charAt(0).toUpperCase()
    : "U";

  const userImage = session.user.image;

  return (
    <div className="min-h-[85vh] bg-[#F7F8F6] flex flex-col justify-between pb-8">
      <Marquee />

      <div className="flex flex-1 flex-col items-center justify-center p-4 py-8">
        <div className="w-full max-w-2xl space-y-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900">আমার প্রোফাইল</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
            </p>
          </div>

          {/* User Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              {userImage && !imgError ? (
                <img
                  src={userImage}
                  alt={session.user.name || "Avatar"}
                  onError={() => setImgError(true)}
                  className="h-14 w-14 rounded-full object-cover border border-gray-100 shadow-xs"
                />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#047C37] text-white font-bold text-xl shadow-xs">
                  {userInitial}
                </div>
              )}

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {session.user.name}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 truncate max-w-[200px] sm:max-w-xs">
                  {session.user.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Link
                href="/profile/update"
                className="flex-1 sm:flex-none text-center px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#047C37] rounded-xl hover:bg-[#03632C] transition-colors shadow-xs"
              >
                প্রোফাইল আপডেট করুন
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors cursor-pointer shadow-xs"
              >
                <span>↪</span>
                <span>সাইন আউট</span>
              </button>
            </div>
          </div>

          <div className="pt-2 text-center">
            <Link
              href="/"
              className="text-xs font-medium text-gray-500 hover:text-[#047C37] transition-colors"
            >
              ← হোম পেজে ফিরে যান
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
