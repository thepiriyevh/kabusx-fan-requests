import "./globals.css";
import type { Metadata } from "next";
import { Header, Footer } from "@/components/Shell";
export const metadata: Metadata = {
  title: "KABUS X — Fan Requests",
  description: "Növbəti Lyrics Video hansı mahnı olsun? Sevdiyin mahnıları seç.",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az" style={{ ["--font-display" as string]: 'ui-sans-serif, "Segoe UI", system-ui, sans-serif' }}>
      <body className="font-sans">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
