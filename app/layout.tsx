import type { Metadata } from "next";
import { Cairo, Tajawal } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  weight: ["300", "400", "600", "700", "800"],
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "الريس للتسوق العقاري",
  description: "أرقى المشاريع العقارية",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`dark ${cairo.variable} ${tajawal.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col font-[family-name:var(--font-cairo)] overflow-y-auto" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}