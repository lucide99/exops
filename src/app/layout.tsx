import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { getExhibitions, getAllLeads } from "@/lib/supabase/queries";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EXOPS — Exhibition Ops System",
  description: "해외 전시 운영 관리 시스템",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [exhibitions, leads] = await Promise.all([getExhibitions(), getAllLeads()]);
  const slaCount = leads.filter((l) => l.slaOverdue).length;

  return (
    <html lang="ko" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen">
          <Sidebar exhibitions={exhibitions} slaCount={slaCount} />
          <main className="flex-1 p-7 overflow-y-auto max-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
