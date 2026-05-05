import type { ReactNode } from "react";
import type { Metadata } from "next";
import "../src/index.css";

export const metadata: Metadata = {
  title: "Real Chat",
  description: "Real-time chat client",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
