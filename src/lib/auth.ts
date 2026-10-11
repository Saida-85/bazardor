import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.BETTER_AUTH_MONGODB_URI as string);
const db = client.db("bazardor");

export const auth = betterAuth({
  // 1. Set the baseURL dynamically from process.env
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

  // 2. Specify allowed origins to resolve the "Invalid origin" error
  trustedOrigins: [
    "http://localhost:3000",
    "https://bazardor-blue.vercel.app",
  ],

  emailAndPassword: { 
    enabled: true, 
  }, 
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string
    }
  },
  database: mongodbAdapter(db, {
    client,
  }),
});