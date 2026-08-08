import type { Metadata } from "next";
import { geist, inter, jetbrainsMono } from "@/lib/fonts";
import { StoreProvider } from "@/store/StoreProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "ForgeIQ",
  description:
    "Technical mastery platform — diagnostics, gap-driven challenges, structured debriefs.",
  icons: {
    icon: [{ url: "/favicon-logo.png", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geist.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased font-[family-name:var(--font-inter)]`}
      >
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
          rel="stylesheet"
        />
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
