"use client";
import Link from "next/link";
import Image from "next/image";
import { House, ChartNoAxesCombined, MessageCircle, LogIn, LogOut } from 'lucide-react';
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { montserrat } from "@/components/ui/fonts";
import { useSession, signIn, signOut } from "next-auth/react";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: <House size={30} />,
        label: "Dashboard",
        href: "/",
        visible: ["admin", "visitor"],
      },
      {
        icon: <ChartNoAxesCombined size={30} />,
        label: "Visualization",
        href: "/visualization",
        visible: ["admin", "visitor"],
      },
      {
        icon: <MessageCircle size={30} />,
        label: "Messages",
        href: "/messages",
        visible: ["admin", "visitor"],
      },
      // Add Sign In/Sign Out as a menu item
      {
        icon: null, // Icon will be dynamic
        label: "Sign In/Sign Out",
        href: "/login", // No navigation; use onClick instead
        visible: ["admin", "visitor"], // Always visible
        isAuthButton: true, // Custom property to identify this as a special button
      },
    ],
  },
];

export default function NavBar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Don't render NavBar on login page
  if (pathname.includes('login')) {
    return null;
  }

  return (
    <div className="flex flex-col w-auto my-1 shadow-sm">
      <div className="flex items-center justify-items-start max-lg:justify-around gap-20 h-full">
        <Link href="/" className="max-lg:hidden max-lg:fixed flex items-center justify-center align-middle p-2 gap-4">
          <Image
            src="/vinuni.png"
            alt="Vinuni Logo"
            width={200}
            height={200}
            className="max-md:hidden w-auto h-auto"
          />
        </Link>

        <div className="text-xl flex gap-8 items-center">
          {menuItems.map((i) => (
            <div className="flex items-center gap-32" key={i.title}>
              {i.items.map((item) =>
                item.isAuthButton ? (
                  <div
                    key={item.label}
                    className={clsx(
                      "flex items-center gap-2 py-2 hover:text-blue-600 cursor-pointer",
                    )}
                    onClick={() => (session ? signOut() : signIn())} // Handle Sign In/Sign Out
                  >
                    {session ? <LogOut size={30} /> : <LogIn size={30} />}
                    <span className={`${montserrat.className} hidden md:block font-medium`}>
                      {session ? "Sign Out" : "Sign In"}
                    </span>
                  </div>
                ) : (
                  <Link
                    href={item.href || "#"} // Use # if no href is provided
                    key={item.label}
                    className={clsx(
                      "flex items-center gap-2 py-2 hover:text-blue-600",
                      {
                        "text-blue-600": pathname === item.href,
                      }
                    )}
                  >
                    {item.icon}
                    <span className={`${montserrat.className} hidden md:block font-medium`}>
                      {item.label}
                    </span>
                  </Link>
                )
              )}
            </div>
          ))}
        </div>
      </div>
      <hr className="w-full border-t-2 border-gray-300" />
    </div>
  );
}
