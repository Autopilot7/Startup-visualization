"use client";
import Link from "next/link";
import Image from "next/image";
import { House, ChartNoAxesCombined, LogIn, LogOut } from 'lucide-react';
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { montserrat } from "@/components/ui/fonts";
import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";

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
        icon: <LogIn size={30} />, 
        label: "Sign In",
        href: "/login", 
        visible: ["admin", "visitor"], // Always visible
        isAuthButton: true, // Custom property to identify this as a special button
      },
    ],
  },
];

export default function NavBar() {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <div className="flex flex-col w-auto my-1 shadow-sm">
      <div className="flex items-center justify-items-start max-lg:justify-around gap-20 h-full">
        <Link href="/" className="max-lg:hidden max-lg:fixed flex items-center justify-center align-middle p-2 gap-4">
          <Image
            src="/vinuni.png"
            alt="Vinuni Logo"
            width={150}
            height={150}
            className="max-md:hidden w-auto h-auto"
          />
        </Link>

        <div className="text-xl flex gap-8 items-center">
          {menuItems.map((i) => (
            <div className="flex items-center gap-32" key={i.title}>
              {i.items.map((item) =>
                (item.isAuthButton && isAuthenticated) ? (
                  <div
                    key={item.label}
                    className={clsx(
                      "flex items-center gap-2 py-2 hover:text-blue-600 cursor-pointer",
                    )}
                    onClick={() => logout()} // Handle Sign Out
                  >
                    {<LogOut size={30} />}
                    <span className={`${montserrat.className} hidden md:block font-medium`}>
                      Sign Out
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
