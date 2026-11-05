import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/components/providers/convex-client-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { MobileTabBar } from "@/components/layout/main-nav";
import { SheetFooter } from "@/components/layout/sheet-footer";
import { TopBar } from "@/components/layout/top-bar";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
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
    borderRadius: "0.125rem",
    fontFamily: "var(--font-geist-sans)",
  },
  elements: {
    // "!" (important) is needed because Clerk's CSS is unlayered and would
    // otherwise beat Tailwind v4's layered utilities.
    card: "border! border-border! shadow-none! rounded-sm!",
    formButtonPrimary:
      "bg-primary! hover:bg-primary-hover! text-primary-foreground! rounded-sm!",
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
      className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <ClerkProvider appearance={clerkAppearance}>
            <ConvexClientProvider>
              <TopBar />
              {children}
              <SheetFooter />
              <MobileTabBar />
            </ConvexClientProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
