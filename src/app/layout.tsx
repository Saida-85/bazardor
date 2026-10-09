import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const hindSiliguri = Hind_Siliguri({
  subsets: ["latin", "bengali"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
});

export const metadata: Metadata = {
  title: "Bazardor",
  description: "Bazardor website",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn" className={`${hindSiliguri.variable} h-full antialiased`}>
      {" "}
      <body className="min-h-full flex flex-col font-siliguri">
        {" "}
        <Header />
        {children} <div>Footer</div>{" "}
      </body>{" "}
    </html>
  );
}
