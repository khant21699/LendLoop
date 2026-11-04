import type { Metadata } from "next";
import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
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
          <header className="flex justify-end items-center p-4 gap-4 h-16">
            <Suspense>
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className="text-text hover:text-primary font-medium text-sm sm:text-base cursor-pointer">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-primary hover:bg-primary-hover text-white transition-colors rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                    Sign Up
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </Suspense>
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
