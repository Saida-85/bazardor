"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp, authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import Marquee from "@/components/Marquee";

const SignUp = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("পাসওয়ার্ড মিলছে না!");
      return;
    }

    setLoading(true);
    try {
      const res = await signUp.email({
        name,
        email,
        password,
        image: "https://example.com/image.png",
      });

      if (res.error) {
        toast.error(res.error.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে");
      } else {
        toast.success("✅ একাউন্ট সফলভাবে তৈরি হয়েছে!");

        // Force a full browser reload redirect to immediately recognize the session cookie
        window.location.href = "/";
      }
    } catch (err) {
      toast.error("কিছু ভুল হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });
    } catch (err) {
      toast.error("সোশ্যাল লগইন করতে সমস্যা হয়েছে।");
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#F7F8F6] flex flex-col justify-between pb-8">
      {/* Marquee Ticker at the top */}
      <Marquee />

      <div className="flex flex-1 flex-col items-center justify-center p-4 py-8">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-6">
          {/* Title Header */}
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-black text-gray-900">
              একাউন্ট তৈরি করুন
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              বিনামূল্যে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
            </p>
          </div>

          {/* Signup Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                নাম
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: রহিম উদ্দিন"
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-[#047C37] focus:outline-none focus:ring-1 focus:ring-[#047C37]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                ইমেইল
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-[#047C37] focus:outline-none focus:ring-1 focus:ring-[#047C37]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                পাসওয়ার্ড
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="কমপক্ষে ৮ অক্ষর"
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-[#047C37] focus:outline-none focus:ring-1 focus:ring-[#047C37]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                পাসওয়ার্ড নিশ্চিত করুন
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="আবার লিখুন"
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-[#047C37] focus:outline-none focus:ring-1 focus:ring-[#047C37]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#047C37] text-white py-3 font-bold text-sm hover:bg-[#03632C] transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {loading ? "তৈরি হচ্ছে..." : "একাউন্ট তৈরি করুন"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-xs text-gray-400 font-medium">
              অথবা
            </span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialLogin("google")}
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer shadow-xs"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google দিয়ে চালিয়ে যান</span>
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin("github")}
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer shadow-xs"
            >
              <svg
                className="w-4 h-4 shrink-0 fill-current text-gray-900"
                viewBox="0 0 24 24"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub দিয়ে চালিয়ে যান</span>
            </button>
          </div>

          {/* Switch to Sign In */}
          <div className="text-center text-xs text-gray-600 pt-2">
            একাউন্ট আছে?{" "}
            <Link
              href="/sign-in"
              className="text-[#047C37] font-bold hover:underline"
            >
              সাইন ইন করুন
            </Link>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs font-medium text-gray-500 hover:text-[#047C37] transition-colors"
          >
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
