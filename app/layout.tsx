import "../styles/globals.css";
import type { Metadata } from "next";

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
      <body className="min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
