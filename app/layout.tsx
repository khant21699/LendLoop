import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { TopBar } from "@/components/top-bar";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const clerkAppearance = {
  variables: {
    colorPrimary: "var(--color-primary)",
    colorBackground: "var(--color-surface)",
    colorText: "var(--color-text)",
    colorTextSecondary: "var(--color-muted)",
    colorInputBackground: "var(--color-surface)",
    colorInputText: "var(--color-text)",
    colorNeutral: "var(--color-text)",
    borderRadius: "0.5rem",
  },
  elements: {
    card: "border border-border shadow-sm",
    formButtonPrimary: "bg-primary hover:bg-primary-hover",
    footerActionLink: "text-accent hover:text-accent",
  },
};

export const metadata: Metadata = {
  title: "Lend | A platform for lending and borrowing",
  description: "A platform for lending and borrowing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider appearance={clerkAppearance}>
          <TopBar />
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
