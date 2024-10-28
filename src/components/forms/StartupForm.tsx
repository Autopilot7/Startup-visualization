"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";

const schema = z.object({
    startupName: z.string(),
    founderName: z.string(),
    phase: z.enum(["Peer mentor", "Incubator","Post incubator","Venture"], { message: "phase is required!" }),
    status: z.enum(["active", "inactive"], { message: "Status is required!" }),
    batch: z.string(),
    category: z.string(),
    phone: z.string(),
    email: z.string().email({ message: "Invalid email address!" }),
    description: z.string(),
    priority: z.enum(["P1", "P2","P3"], { message: "Priority is required" }),
    pitchdeck: z.instanceof(File, { message: "Pitchdeck is required" }),
    logo: z.instanceof(File, { message: "Logo is required" }),
  });

type Inputs = z.infer<typeof schema>;

const StartupForm = ({type,data}:{type: "create" | "update"; data?:any}) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<Inputs>({
        resolver: zodResolver(schema),
      });

    const onSubmit = handleSubmit((data) => {
        console.log(data);
    });
    
    return <form className="flex flex-col gap-8" onSubmit={onSubmit}>
        <h1 text-xl font-semibold> Add a new startup</h1>
        <InputField
          label="Startup Name"
          name="startupName"
          defaultValue={data?.startupName}
          register={register}
          error={errors?.startupName}
        />
        <InputField
          label="Founder Name"
          name="founderName"
          defaultValue={data?.founderName}
          register={register}
          error={errors?.founderName}
        />
        <div className="flex justify-between flex-wrap gap-4">
            <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="text-xs text-gray-500">Phase</label>
            <select
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                {...register("phase")}
                defaultValue={data?.phase}
            >
                <option value="Peer mentor">Peer mentor</option>
                <option value="Incubator">Incubator</option>
                <option value="Post incubator">Post incubator</option>
                <option value="Venture">Venture</option>
            </select>
            {errors.phase?.message && (
                <p className="text-xs text-red-400">
                {errors.phase.message.toString()}
                </p>
            )}
            </div>
            <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="text-xs text-gray-500">Status</label>
            <select
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                {...register("status")}
                defaultValue={data?.status}
            >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
            </select>
            {errors.status?.message && (
                <p className="text-xs text-red-400">
                {errors.status.message.toString()}
                </p>
            )}
            </div>
            <div className="flex flex-col gap-2 w-full md:w-1/4">
                <label className="text-xs text-gray-500">Priority</label>
                <select
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                {...register("priority")}
                defaultValue={data?.priority}
                >
                <option value="P0">P0</option>
                <option value="P1">P1</option>
                <option value="P2">P2</option>
                </select>
                {errors.priority?.message && (
                <p className="text-xs text-red-400">
                    {errors.priority.message.toString()}
                </p>
                )}
            </div>
        </div>
        <div className="flex justify-between flex-wrap gap-4">
            <InputField
            label="Batch"
            name="batch"
            defaultValue={data?.batch}
            register={register}
            error={errors?.batch}
            className="flex flex-col gap-2 w-full md:w-2/5"
            />
            <InputField
            label="Category"
            name="category"
            defaultValue={data?.category}
            register={register}
            error={errors?.category}
            className="flex flex-col gap-2 w-full md:w-2/5"
            />
        </div>
        <div className="flex justify-between flex-wrap gap-4">
            <InputField
            label="Phone"
            name="phone"
            defaultValue={data?.phone}
            register={register}
            error={errors?.phone}
            className="flex flex-col gap-2 w-full md:w-2/5"
            />
            <InputField
            label="Email"
            name="email"
            defaultValue={data?.email}
            register={register}
            error={errors?.email}
            className="flex flex-col gap-2 w-full md:w-2/5"
            />
        </div>

        <InputField
          label="Description"
          name="description"
          defaultValue={data?.description}
          register={register}
          error={errors?.description}
        />
        <div className="flex justify-between flex-wrap gap-4">
            <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
                    <label
                        className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
                        htmlFor="img"
                    >
                        <Image src="/upload.png" alt="" width={28} height={28} />
                        <span>Upload a logo</span>
                    </label>
                    <input type="file" id="img" {...register("logo")} className="hidden" />
                    {errors.logo?.message && (
                        <p className="text-xs text-red-400">
                        {errors.logo.message.toString()}
                        </p>
                    )}
            </div>
            <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
                    <label
                        className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
                        htmlFor="pitchdeck"
                    >
                        <Image src="/upload.png" alt="" width={28} height={28} />
                        <span>Upload a pitchdeck (PDF or PowerPoint)</span>
                    </label>
                    <input 
                        type="file" 
                        accept=".pdf,.ppt,.pptx" 
                        id="pitchdeck"
                        {...register("pitchdeck")} 
                        className="hidden" 
                    />
                    {errors.pitchdeck?.message && (
                        <p className="text-xs text-red-400">
                        {errors.pitchdeck.message.toString()}
                        </p>
                    )}
            </div>
        </div>     
        <button className="bg-blue-400 text-white p-2 rounded-md">
            {type === "create" ? "Create" : "Update"}
        </button>
    </form>
}

export default StartupForm