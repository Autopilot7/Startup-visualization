"use client";

import Image from "next/image";
import { JSX, useState } from "react";
import StartupForm from "./forms/StartupForm";


const forms: {
  [key: string]: (type: "create" | "update", data?: any) => JSX.Element;
} = {
  startup: (type, data) => <StartupForm type={type} data={data} />,
};

const FormModal = ({table,type,data,id}:{
    table: |"startup";
    type: "create" | "update" | "delete";
    data?: any;
    id?: number;
}) => {
    const size = type === "create" ? "w-8 h-8" : "h-7 w-7";
    const bgColor = 
        type === "create" 
        ? "bg-Yellow" :
        type === "update" 
        ? "bg-Sky" 
        : "bg-Purple";

    const [open, setOpen] = useState(false);

const Form = () => {
        return type === "delete" && id ? (
          <form action="" className="p-4 flex flex-col gap-4">
            <span className="text-center font-medium">
              All data will be lost. Are you sure you want to delete this {table}?
            </span>
            <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
              Delete
            </button>
          </form>
        ) : type === "create" || type === "update" ? (
          forms[table](type, data)
   
        ) : (
          "Form not found!"
        );
};

return (
        <>
          <button
            className="flex items-center justify-center border rounded-lg px-6 py-2 text-black bg-green-100"
            onClick={() => setOpen(true)}
          >
            <Image src={`/${type}.png`} alt="Create Icon" width={10} height={10} className="mr-2" />
            <span className="font-bold">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
          </button>

          {open && (
            <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
              <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[90%] lg:w-[80%] xl:w-[80%] 2xl:w-[80%]">
                <Form />
                <div
                  className="absolute top-4 right-4 cursor-pointer"
                  onClick={() => setOpen(false)}
                >
                  <Image src="/close.png" alt="" width={14} height={14} />
                </div>
              </div>
            </div>
          )}
        </>
      );
    };
    
export default FormModal;