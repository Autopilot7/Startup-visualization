import { inter } from "@/components/ui/fonts";
import "./globals.css";
import { Toaster } from "sonner";
import NavBar from "@/components/NavBar";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <NavBar />
          <Toaster richColors position="top-center" duration={1000}/>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
} 