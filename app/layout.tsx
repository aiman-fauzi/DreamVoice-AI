import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DreamVoice AI",
  description: "Personalized bedtime stories with optional narration for parents and children.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
