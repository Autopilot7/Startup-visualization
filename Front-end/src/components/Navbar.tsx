import Link from "next/link";
import Image from "next/image";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/homepage.png",
        label: "Home",
        href: "/",
        visible: ["admin", "visitor"],
      },
      {
        icon: "/visualization.png",
        label: "Visualization",
        href: "/",
        visible: ["admin", "visitor"],
      },
      {
        icon: "/message.png",
        label: "Message",
        href: "/",
        visible: ["admin", "visitor"],
      }

    ],
  },
];

const Navbar = () => {
    return (
        <div className='flex items-center justify-between p-4 bg-gray-200'>
            <Link href="/" className="flex items-center justify-center lg:justify-start gap-4 ">
                <Image src="/vinuni.png" alt="Vinuni Logo" width={32} height={32} />
                <span className="text-[20px] hidden lg:block font-bold">Startupilot</span>
            </Link>

            <div className="mt-4 text-sm flex gap-8 items-center">
                {menuItems.map((i) => (
                    <div className="flex items-center gap-32" key={i.title}>
                        {i.items.map((item) => (
                            <Link 
                                href={item.href} 
                                key={item.label}
                                className="flex items-center gap-4 py-2"  
                            >
                                <Image src={item.icon} alt="" width={25} height={25} />
                                <span className="hidden lg:block lg:block font-bold">{item.label}</span>
                            </Link>
                        ))}
                    </div>
                ))}
            </div>

            {/* Icon and User */}
            <div className='flex items-center gap-6 justify-end'>
                <div className='flex flex-col'>
                    <span className='text-[20px] leading-3 font-medium'>Elab</span>
                    <span className="text-[16px] text-gray-500 text-right">Ha Noi, Viet Nam</span>
                </div>
                <Image src="/vinuni.png" alt="" width={36} height={36} />
            </div>
        </div>
    )
}

export default Navbar;
