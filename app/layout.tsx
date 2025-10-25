import "../styles/globals.css";
import type { Metadata } from "next";
import { TopBar } from "@/src/components/layout/TopBar";

export const metadata: Metadata = {
  title: "AI Tools Dashboard",
  description: "Unified dashboard for multiple AI tools",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <body className="aurora-bg text-white">
        <TopBar />
        <main className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
