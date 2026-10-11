"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import Marquee from "@/components/Marquee";

import {
  Button,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";

const SignIn = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};

    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    setLoading(true);

    try {
      const res = await signIn.email({
        email: data.email,
        password: data.password,
        rememberMe: true,
      });

      if (res.error) {
        toast.error(res.error.message || "লগইন ব্যর্থ হয়েছে");
        setLoading(false);
      } else {
        toast.success("সফলভাবে লগইন হয়েছে!");

        // Force a full browser redirect to instantly recognize the session cookie
        window.location.href = "/";
      }
    } catch (err) {
      toast.error("কিছু ভুল হয়েছে।");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err) {
      toast.error("গুগল দিয়ে লগইন করতে সমস্যা হয়েছে।");
    }
  };

  const handleGithubSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
      });
    } catch (err) {
      toast.error("গিটহব দিয়ে লগইন করতে সমস্যা হয়েছে।");
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#F7F8F6] flex flex-col justify-between pb-8">
      {/* Marquee Ticker at the top */}
      <Marquee />

      <div className="flex flex-1 flex-col items-center justify-center p-4 py-8">
        <div className="flex w-full max-w-md flex-col gap-4 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-200">
          <Form className="flex flex-col gap-4" onSubmit={onSubmit}>
            <h1 className="text-xl font-bold text-gray-900">সাইন ইন করুন</h1>

            <TextField
              isRequired
              name="email"
              type="email"
              validate={(value) => {
                if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                  return "Please enter a valid email address";
                }
                return null;
              }}
            >
              <Label>Email</Label>
              <Input placeholder="john@example.com" />
              <FieldError />
            </TextField>

            <TextField
              isRequired
              minLength={8}
              name="password"
              type="password"
              validate={(value) => {
                if (value.length < 8) {
                  return "Password must be at least 8 characters";
                }
                if (!/[A-Z]/.test(value)) {
                  return "Password must contain at least one uppercase letter";
                }
                if (!/[0-9]/.test(value)) {
                  return "Password must contain at least one number";
                }
                return null;
              }}
            >
              <Label>Password</Label>
              <Input placeholder="Enter your password" />
              <Description>
                Must be at least 8 characters with 1 uppercase and 1 number
              </Description>
              <FieldError />
            </TextField>

            <div className="flex gap-2 mt-2">
              <Button type="submit" isDisabled={loading}>
                {loading ? "লগইন হচ্ছে..." : "Submit"}
              </Button>
              <Button type="reset" variant="secondary">
                Reset
              </Button>
            </div>
          </Form>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-3 text-xs text-gray-400 font-medium">
              অথবা
            </span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Social Logins Side-by-Side Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer shadow-xs"
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

            {/* GitHub Sign In Button */}
            <button
              type="button"
              onClick={handleGithubSignIn}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer shadow-xs"
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

          <p className="text-sm text-center text-gray-600 mt-1">
            একাউন্ট নেই?{" "}
            <Link
              href="/sign-up"
              className="text-[#047C37] font-semibold hover:underline"
            >
              সাইন আপ করুন
            </Link>
          </p>
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

export default SignIn;
