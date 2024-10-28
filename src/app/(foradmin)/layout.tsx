import NavBar from "@/components/Navbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return(
    <div className="h-screen flex">
      <div className = "w-[100%] md:w-[100%] lg:w-[100%] xl:w-[100%] bg-[#F7F8FA] overflow-scroll">
        <NavBar/>
        {children}
      </div>
    </div>
  );
}
