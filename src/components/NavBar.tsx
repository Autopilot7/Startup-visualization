"use client";
import Link from "next/link";
import Image from "next/image";
import { House, ChartNoAxesCombined, MessageCircle } from 'lucide-react';
import { Montserrat } from "next/font/google";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "700"] });

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: <House size={30} />, // Set the desired size here
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
      }
    ],
  },
];

export default function NavBar() {
    const pathname = usePathname();
    return (
      <div className="flex flex-col w-auto my-1 shadow-sm">
        <div className='flex items-center justify-items-start max-lg:justify-around gap-20 h-full'>
            <Link href="/" className="max-lg:hidden max-lg:fixed flex items-center justify-center align-middle p-2 gap-4 ">
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
                        {i.items.map((item) => (
                            <Link 
                                href={item.href} 
                                key={item.label}
                                className={clsx(
                                  "flex grow items-center gap-2 py-2  hover:text-blue-600",
                                  {
                                    "text-blue-600": pathname === item.href,
                                  }
                                )}
                            >
                                {item.icon}
                                <span className={`${montserrat.className} hidden md:block font-medium`}>{item.label}</span>
                            </Link>
                        ))}
                    </div>
                ))}
            </div>
        </div>
        <hr className="w-full border-t-2 border-gray-300" />
      </div>
    )
}
