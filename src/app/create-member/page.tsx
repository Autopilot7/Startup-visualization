"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";
import { z } from "zod";
import InputField from "../../components/InputField";
import axios from 'axios';
import { endpoints } from '@/app/utils/apis';

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().regex(/^\d{10,15}$/, "Invalid phone number"),
  email: z.string().email("Invalid email address!"),
  linkedin: z.string().url("Invalid LinkedIn URL").optional(),
  facebook: z.string().url("Invalid Facebook URL").optional(),
  photo: z
    .any()
    .refine((file) => file && file.length === 1, { message: "Photo is required" })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/gif"].includes(file[0]?.type),
      { message: "Only JPEG, PNG, and GIF files are allowed" }
    ),
  status: z.enum(["active", "inactive"], { message: "Status is required!" }),
  description: z.string().optional(),
});

type Inputs = z.infer<typeof schema>;

interface CreateMemberFormProps {
  onClose: () => void;
  onAddMember: (member: { id: string; name: string }) => void; // Ensure this is defined
}


const CreateMemberForm: React.FC<CreateMemberFormProps> = ({ onClose, onAddMember }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const onSubmit = handleSubmit(async (data) => {
      console.log('Form data:', data);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Authentication token not found.");
        return;

      }
      // Validate photo existence
      if (!data.photo || data.photo.length === 0) {
        toast.error("Please upload a photo.");
        return;
      }
      // Upload Photo
      const photoFile = data.photo[0];
    
        const formData = new FormData();
        formData.append("file", photoFile);
        formData.append("type", "avatar");

        const uploadResponse = await axios.post(endpoints.uploadavatar, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

      const avatarUrl = uploadResponse.data.file_url;
      console.log('Avatar URL:', avatarUrl);
      if (!avatarUrl) {
        throw new Error("Failed to upload photo.");
      }
      // Check backend response
      if (uploadResponse.status !== 200) {
        throw new Error("Failed to upload photo. Please try again.");
      }

      // Submit Member Data
      const memberData: any = {
        name: data.name,
        phone: data.phone,
        email: data.email,
        avatar_url: avatarUrl,
        status: data.status,
        description: data.description,
      };
      
      if (data.linkedin) memberData.linkedin_url = data.linkedin;
      if (data.facebook) memberData.facebook_url = data.facebook;

      const memberResponse = await axios.post(endpoints.createmembers, memberData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // After successful creation
      onAddMember({ id: memberResponse.data.id, name: memberResponse.data.name });
      toast.success("Member created successfully!");
      reset();
      setPhotoPreview(null);
      onClose();
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error("Error creating member:", error.response?.data);
        toast.error(error.response?.data?.message || "Failed to create member.");
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred.");
      }
    }
    });
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    } else {
      setPhotoPreview(null);
    }
  };


  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={onSubmit}>
    {/* Bên trái: Thông tin thành viên */}
    <div className="flex flex-col gap-6">
      <InputField
        label="Name"
        name="name"
        register={register}
        error={errors?.name}
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
        label="Facebook"
        name="facebook"
        register={register}
        error={errors?.facebook}
      />
      <InputField
        label="Description"
        name="description"
        register={register}
        error={errors?.description}
      />
      {/* Trạng thái */}
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
    </div>
  
    {/* Bên phải: Upload Avatar */}
    <div className="flex flex-col items-center">
      <label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
      {photoPreview ? (
        <img
          src={photoPreview}
          alt="Avatar Preview"
          className="w-48 h-48 object-cover rounded-full mb-4"
        />
      ) : (
        <div className="w-48 h-48 flex items-center justify-center bg-gray-200 rounded-full mb-4">
          <p className="text-gray-500">No Avatar</p>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        {...register("photo")}
        onChange={(e) => {
          register("photo").onChange(e);
          handlePhotoChange(e);
        }}
        className="mt-1"
      />
      {errors.photo && (
        <p className="text-xs text-red-500 mt-1">{errors.photo.message}</p>
      )}
    </div>
  
    {/* Nút Submit */}
    <div className="md:col-span-2 flex justify-end">
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mt-4"
      >
        Save Member
      </button>
    </div>
  </form>
  );
};

export default CreateMemberForm;
