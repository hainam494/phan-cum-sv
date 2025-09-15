import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const base_url = process.env.BASE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Cụm 2 - 63HTTT2",
  description: "Website phân nhóm của cụm 2 lớp 63HTTT2",
  metadataBase: new URL(base_url),
  openGraph:{
    title: "Cụm 2 - 63HTTT2",
    description: "Website phân nhóm của cụm 2 lớp 63HTTT2",
    type: "website",
    images: [
      {
        url: "/tlu.svg"
      },
    ],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased select-none`}
      >
        {children}
      </body>
    </html>
  );
}
