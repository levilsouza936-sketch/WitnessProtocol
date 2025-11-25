import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WITNESS",
  description: "Digital Horror / ARG Experience",
  icons: {
    icon: '/favicon.ico', // Ensure you have a favicon or use a data URI if needed
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <div className="scanlines"></div>
        <div className="noise"></div>
        <main className="relative z-10 min-h-screen p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
