import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CMS | College Management System",
  description: "A professional educational repository and management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className="antialiased bg-background text-foreground">
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
