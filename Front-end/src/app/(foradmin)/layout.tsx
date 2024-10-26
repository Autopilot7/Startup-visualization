import FormModal from "@/components/FormModal";
import Navbar from "../../components/Navbar";
import Image from "next/image"
import Link from "next/link"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return(
    <div className="h-screen flex">
      <div className = "w-[100%] md:w-[100%] lg:w-[100%] xl:w-[100%] bg-[#F7F8FA] overflow-scroll">
        <Navbar/>
        <FormModal table="startup" type="create"/>
        <FormModal table="startup" type="update"/>
        <FormModal table="startup" type="delete"/>
        {children}
      </div>
    </div>
  );
}
