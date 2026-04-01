import type { Metadata, Viewport } from "next";
import "./globals.css";

// Browser tab aur SEO ke liye metadata
export const metadata: Metadata = {
  title: "CMS | College Management System",
  description: "A professional educational repository and management platform",
  icons: {
    icon: "/favicon.ico", // Agar aapke paas icon ho toh
  },
};

// Mobile responsiveness ko lock karne ke liye
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground selection:bg-blue-100">
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
