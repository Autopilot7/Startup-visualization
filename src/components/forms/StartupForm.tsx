"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import InputField from "../InputField";
import { Button } from "../ui/button";
import Link from 'next/link';




const schema = z.object({
  startupName: z.string(),
  phase: z.enum(["Ideation", "Incubation", "Acceleration"], {
    message: "Phase is required!",
  }),
  status: z.enum(["Active", "Inactive"], { message: "Status is required!" }),
  batch: z.string(),
  category: z.string(),
  customCategory: z.string().optional(),
  phone: z.string(),
  email: z.string().email({ message: "Invalid email address!" }),
  description: z.string(),
  priority: z.enum(["P1", "P2", "P3"], { message: "Priority is required" }),
  logo: z.any().optional(),
  pitchdeck: z.any().optional(),
});

type Inputs = z.infer<typeof schema>;

const StartupForm = ({ type, data }: { type: "create" | "update"; data?: any }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [pitchdeckFileName, setPitchdeckFileName] = useState<string | null>(null);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [members, setMembers] = useState<string[]>([]); // Danh sách member đã được thêm

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <div className="max-w-7xl mx-auto p-8">
      <form
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        onSubmit={onSubmit}
      >
        {/* Cột thông tin startup */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <h1 className="text-2xl font-semibold mb-4">Add a new startup</h1>
          <InputField
            label="Startup Name"
            name="startupName"
            defaultValue={data?.startupName}
            register={register}
            error={errors?.startupName}
          />
          {/* Nút tạo member */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Members</h2>
            <Link href="/create-member">
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Create Member
              </button>
            </Link>
            {/* Danh sách member đã được thêm */}
            <ul className="mt-4">
              {members.length > 0 ? (
                members.map((member, index) => (
                  <li key={index} className="p-2 border rounded-md mb-2">
                    {member}
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No members added yet.</p>
              )}
            </ul>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              {...register("phase")}
              defaultValue={data?.phase || ""}
            >
              <option value="">Phase*</option>
              <option value="Peer mentor">Ideation</option>
              <option value="Incubator">Incubation</option>
              <option value="Post incubator">Acceleration</option>
            </select>
            <select
              className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              {...register("status")}
              defaultValue={data?.status || ""}
            >
              <option value="">Status*</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              {...register("priority")}
              defaultValue={data?.priority || ""}
            >
              <option value="">Priority*</option>
              <option value="P1">P1</option>
              <option value="P2">P2</option>
              <option value="P3">P3</option>
            </select>
            <select
              className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              {...register("batch")}
              defaultValue={data?.batch || ""}
            >
              <option value="">Batch*</option>
              <option value="AY 2021">AY 2021</option>
              <option value="AY 2022">AY 2022</option>
              <option value="AY 2023">AY 2023</option>
              <option value="AY 2024">AY 2024</option>
            </select>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <select
              className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              {...register("category")}
              defaultValue={data?.category || ""}
              onChange={(e) => setIsCustomCategory(e.target.value === "Others")}
            >
              <option value="">Category*</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="Education">Education</option>
              <option value="Others">Others</option>
            </select>
            {isCustomCategory && (
              <InputField
                label="Custom Category"
                name="customCategory"
                register={register}
                error={errors?.customCategory}
              />
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Phone"
              name="phone"
              defaultValue={data?.phone}
              register={register}
              error={errors.phone}
            />
            <InputField
              label="Email"
              name="email"
              defaultValue={data?.email}
              register={register}
              error={errors.email}
            />
          </div>
          {/* Ô nhập Description với textarea */}
            <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
                {...register("description")}
                defaultValue={data?.description || ""}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 resize-none h-32"
                placeholder="Enter a description..."
            ></textarea>
            {errors.description && (
                <p className="text-xs text-red-500 mt-1">
                {errors.description.message?.toString()}
                </p>
            )}
            </div>
        </div>

        {/* Cột upload */}
        <div className="flex flex-col items-center gap-6">
          {/* Upload Logo */}
          <div className="w-full max-w-xs">
            <h2 className="text-lg font-semibold mb-2 text-center">Upload Logo</h2>
            <div className="border border-gray-300 rounded-lg p-6 text-center">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Uploaded logo"
                  className="w-20 h-20 mx-auto mb-4 object-cover rounded-full"
                />
              ) : (
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">No Logo</span>
                </div>
              )}
              <input
                type="file"
                id="logo-upload"
                className="hidden"
                accept="image/*" 
                {...register("logo")}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setLogoPreview(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  } else {
                    setLogoPreview(null);
                  }
                }}
              />
              <label
                htmlFor="logo-upload"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer"
              >
                Upload Logo
              </label>
            </div>
          </div>

          {/* Upload Pitchdeck */}
          <div className="w-full max-w-xs">
            <h2 className="text-lg font-semibold mb-2 text-center">Upload Pitchdeck</h2>
            <div className="border border-gray-300 rounded-lg p-6 text-center">
              <p className="text-gray-500 mb-2">
                {pitchdeckFileName || "No file selected"}
              </p>
              <input
                type="file"
                id="pitchdeck-upload"
                className="hidden"
                accept=".pdf,.ppt,.pptx" 
                {...register("pitchdeck")}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setPitchdeckFileName(file.name);
                  } else {
                    setPitchdeckFileName(null);
                  }
                }}
              />
              <label
                htmlFor="pitchdeck-upload"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer"
              >
                Upload Pitchdeck
              </label>
            </div>
          </div>
        </div>

        {/* Nút lưu */}
        <div className="lg:col-span-3 flex justify-center gap-4 mt-6">
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600"
          >
            Save
          </button>
          <Link href="/">
            <button
              type="button"
              className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600"
            >
              Discard
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default StartupForm;
