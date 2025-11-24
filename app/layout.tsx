import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "몸으로 재단하기",
  description: "Mobile web application for body measurements",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
