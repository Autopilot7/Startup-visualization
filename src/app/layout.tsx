import type { Metadata } from "next";
import { inter } from "@/components/ui/fonts";
import "./globals.css";
import NavBar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "VinUniversity Startup Visualization", 
  description: "A visualization of the startup ecosystem at VinUniversity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavBar/>
        {children}
      </body>
    </html>
  );
} 