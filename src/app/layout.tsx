import type { Metadata } from "next";
import { Lora, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Dear Me — Letters to the person I am becoming",
    template: "%s | Dear Me",
  },
  description: "A private, personal daily journal with an intentional publishing space.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lora.variable} ${jakarta.variable}`}>
      <body className="min-h-screen bg-journal-bg text-journal-text antialiased selection:bg-journal-accent/20">
        {children}
      </body>
    </html>
  );
}
