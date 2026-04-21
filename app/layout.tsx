import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/toaster";
import { PWARegister } from "@/components/pwa-register";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f4ec" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "HB Notes",
  description: "A production-ready notes workspace built with Next.js, MongoDB, and Cloudinary.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "HB Notes",
  },
  icons: {
    icon: "/icons/logo.png",
    apple: "/icons/logo.png",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
          <PWARegister />
        </ThemeProvider>
      </body>
    </html>
  );
}
