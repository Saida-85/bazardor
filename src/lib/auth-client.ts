import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // NEXT_PUBLIC_ makes this variable accessible in client-side React code
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "https://bazardor-blue.vercel.app",
});

// Destructure from the SAME authClient instance!
export const { signIn, signUp, useSession } = authClient;