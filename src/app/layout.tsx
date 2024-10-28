import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "../components/Navbar"; // Adjust the path as necessary

const inter = Inter({ subsets: ["latin"] });

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
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <div className="h-screen flex">
        <div className="w-[100%] md:w-[100%] lg:w-[100%] xl:w-[100%] bg-[#F7F8FA] overflow-scroll">
          <NavBar />
          {children}
        </div>
      </div> 
      </body>
    </html>
    
  );
}