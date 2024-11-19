'use client';

import { inter } from "@/components/ui/fonts";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import NavBar from "@/components/NavBar";

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <NavBar />
          <Toaster richColors position="top-center" duration={5000}/>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
} 