"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import InputField from "../../components/InputField";

const schema = z.object({
  position: z.string(),
  phone: z.string(),
  email: z.string().email({ message: "Invalid email address!" }),
  linkedin: z.string().optional(),
  photo: z.any().optional(),
  status: z.enum(["active", "inactive"], { message: "Status is required!" }),
  description: z.string().optional(),
});

type Inputs = z.infer<typeof schema>;

const CreateMemberForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const router = useRouter();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const onSubmit = handleSubmit((data) => {
    // Lưu thông tin member vào localStorage hoặc API
    localStorage.setItem("newMember", JSON.stringify(data));
    router.push("/addstartup"); // Điều hướng trở lại trang Create Startup
  });

  return (
    <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Phần bên trái: Form thông tin */}
      <form className="lg:col-span-2 flex flex-col gap-6" onSubmit={onSubmit}>
        <h1 className="text-2xl font-semibold mb-4">Create Member</h1>
        <InputField
          label="Position"
          name="position"
          register={register}
          error={errors?.position}
        />
        <InputField
          label="Phone"
          name="phone"
          register={register}
          error={errors?.phone}
        />
        <InputField
          label="Email"
          name="email"
          register={register}
          error={errors?.email}
        />
        <InputField
          label="LinkedIn"
          name="linkedin"
          register={register}
          error={errors?.linkedin}
        />
        <InputField
          label="Description"
          name="description"
          register={register}
          error={errors?.description}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            {...register("status")}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          {errors.status && (
            <p className="text-xs text-red-500 mt-1">
              {errors.status.message?.toString()}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Save Member
        </button>
      </form>

      {/* Phần bên phải: Upload ảnh */}
      <div className="flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-2 text-center">Upload Photo</h2>
        <div className="border border-gray-300 rounded-lg p-6 text-center w-full max-w-xs">
          {photoPreview ? (
            <img
              src={photoPreview}
              alt="Uploaded member"
              className="w-32 h-32 mx-auto mb-4 object-cover rounded-full"
            />
          ) : (
            <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No Photo</span>
            </div>
          )}
          <input
            type="file"
            id="photo-upload"
            className="hidden"
            accept="image/*"
            {...register("photo")}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setPhotoPreview(reader.result as string);
                };
                reader.readAsDataURL(file);
              } else {
                setPhotoPreview(null);
              }
            }}
          />
          <label
            htmlFor="photo-upload"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer"
          >
            Upload Photo
          </label>
        </div>
      </div>
    </div>
  );
};

export default CreateMemberForm;
