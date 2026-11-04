import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { ThemeProvider } from "@/components/theme-provider";
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
    // "!" (important) is needed because Clerk's CSS is unlayered and would
    // otherwise beat Tailwind v4's layered utilities.
    card: "border! border-border! shadow-sm!",
    formButtonPrimary:
      "bg-primary! hover:bg-primary-hover! text-primary-foreground!",
    footerActionLink: "text-link! hover:text-link!",
  },
};

export const metadata: Metadata = {
  title: "LendLoop | Borrow what you need. Lend what you don't.",
  description: "A neighborhood tool-lending board.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <ClerkProvider appearance={clerkAppearance}>
            <TopBar />
            <ConvexClientProvider>{children}</ConvexClientProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
