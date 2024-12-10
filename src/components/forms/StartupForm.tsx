"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import InputField from "../InputField";
import { Button } from "../ui/button";
import Link from 'next/link';
import { toast } from 'sonner';
import Modal from "../Modal"; // Assuming you have a Modal component
import CreateMemberForm from '@/app/create-member/page';
import CreateAdvisorForm from '@/app/create-advisor/page';
import { useEffect } from "react";
import axios from 'axios';
import { endpoints } from '@/app/utils/apis';
import Select from "react-select"; 

interface Member {
  id: string;
  name: string;
  role: string;
}

interface Advisor {
  id: string;
  name: string;
  areaOfExpertise: string;
}

const schema = z.object({
  startupName: z.string(),
  phase: z.enum(["Ideation", "Incubation", "Acceleration"], {
    message: "Phase is required!",
  }),
    advisors: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        areaOfExpertise: z.string().optional(),
      })
    ).optional(),
  status: z.enum(["Active", "Inactive"], { message: "Status is required!" }),
  batch: z.string(),
  category: z.string(),
  customCategory: z.string().optional(),
  phone: z.string(),
  email: z.string().email({ message: "Invalid email address!" }),
  description: z.string(),
  shortdescription: z.string(),
  priority: z.enum(["P1", "P2", "P3"], { message: "Priority is required" }),
  logo: z.any().optional(),
  pitchdeck: z.any().optional(),
  location: z.string(), // Added location field
  revenue: z.string(),  // Added revenue field
  facebookUrl: z.string().url({ message: "Invalid Facebook URL" }).optional(),
  linkedinUrl: z.string().url({ message: "Invalid LinkedIn URL" }).optional(),
});

type Inputs = z.infer<typeof schema>;

const StartupForm = ({ type, data }: { type: "create" | "update"; data?: any }) => {
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  // Initialize from localStorage
  const [availableMembers, setAvailableMembers] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedMemberOptions, setSelectedMemberOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [members, setMembers] = useState<Array<{ id: string; name: string; role: string }>>([]);
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [pitchdeckFileName, setPitchdeckFileName] = useState<string | null>(null);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal for Back functionality
  const [modalContent, setModalContent] = useState(''); // Declare modalContent state
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [availableAdvisors, setAvailableAdvisors] = useState<Advisor[]>([]);
  const [selectedAdvisorOptions, setSelectedAdvisorOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [isAdvisorModalOpen, setIsAdvisorModalOpen] = useState(false);

  // Update localStorage whenever members change
  // Load members from localStorage on mount
  useEffect(() => {
    const storedMembers = localStorage.getItem('members');
    if (storedMembers) {
      try {
        const parsedMembers: Array<Member> = JSON.parse(storedMembers);
        // Validate that each member has an id
        const validMembers = parsedMembers.filter(member => member.id && member.name);
        setMembers(validMembers);
      } catch (error) {
        console.error('Error parsing stored members:', error);
        localStorage.removeItem('members'); // Clear invalid data
      }
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchAdvisors = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("No authentication token found");
        }
  
        const response = await axios.get(endpoints.advisors, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setAvailableAdvisors(response.data);
      } catch (error) {
        console.error("Error fetching advisors:", error);
        toast.error("Failed to load advisors");
      }
    };
  
    fetchAdvisors();
  }, []);

  useEffect(() => {
    const storedMembers = localStorage.getItem('members');
    if (storedMembers) {
      try {
        const parsedMembers = JSON.parse(storedMembers);
        setMembers(parsedMembers);
      } catch (error) {
        console.error('Error parsing stored members:', error);
        localStorage.removeItem('members'); // Clear invalid data
      }
    }
    setMounted(true);
  }, []);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(data);
    toast.success('Startup saved successfully!');
    // Handle form submission
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });
  
  useEffect(() => {
    const fetchCategoriesAndMembers = async () => {
      try {
        const token = localStorage.getItem("accessToken");
  
        // Fetch categories
        const categoriesResponse = await axios.get(endpoints.categories, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(categoriesResponse.data);
  
        // Fetch members
        const membersResponse = await axios.get(endpoints.members, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAvailableMembers(membersResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load categories or members");
      }
    };
  
    fetchCategoriesAndMembers();
  }, []);

  const handleBackClick = () => {
    setModalContent('Are you sure you want to go back without saving?');
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalContent('');
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    // Perform the discard action or any other functionality
  };

  const handleAddMember = (member: { id: string; name: string }) => {
    setMembers((prevMembers) => [
      ...prevMembers,
      { id: member.id, name: member.name, role: '' },
    ]);
  };
  
  // Pass handleAddMember to CreateMemberForm
  <CreateMemberForm
    onClose={() => setIsMemberModalOpen(false)}
    onAddMember={handleAddMember} // Ensure this prop is passed
  />
  // Handler to update member's role
  const handleRoleChange = (memberId: string, role: string) => {
    setMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.id === memberId ? { ...member, role } : member
      )
    );
  };

    // Inside the StartupForm component

  const handleAddAdvisor = (advisor: { id: string; name: string }) => {
    setAdvisors((prevAdvisors) => [
      ...prevAdvisors,
      {
        id: advisor.id,
        name: advisor.name,
        areaOfExpertise: '',
      },
    ]);
  };

 

  if (!mounted) {
    // Avoid rendering differences during hydration
    return null;
  }
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
          {/* Ô nhập Description với textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Short description</label>
            <textarea
                {...register("shortdescription")}
                defaultValue={data?.shortdescription || ""}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 resize-none h-32"
                placeholder="Enter a short description..."
            ></textarea>
            {errors.description && (
                <p className="text-xs text-red-500 mt-1">
                {errors.description.message?.toString()}
                </p>
            )}
            </div>
            {/*list add member*/}
            <div className="my-4">
            <label className="block text-sm font-medium text-gray-700">
              Add Existing Members
            </label>
            <Select
              options={availableMembers.map((member) => ({
                value: member.id,
                label: member.name,
              }))}
              isMulti
              value={selectedMemberOptions}
              onChange={(newSelectedOptions) => {
                setSelectedMemberOptions(newSelectedOptions as { value: string; label: string }[] || []);
                const selectedMembers = newSelectedOptions?.map((option) => ({
                  id: option.value,
                  name: option.label,
                  role: "",
                })) || [];

                setMembers((prevMembers) => {
                  const newMembers = selectedMembers.filter(
                    (newMember) => !prevMembers.some((member) => member.id === newMember.id)
                  );
                  return [...prevMembers, ...newMembers];
                });
              }}
              className="mt-1"
              placeholder="Select members..."
            />
          </div>
          {/* Members Section */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Members</h2>
            <button
              type="button"
              onClick={() => setIsMemberModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Create Member
            </button>
            
            <div className="mt-6">
              {members.length === 0 ? (
                <p className="text-gray-500">No members added yet.</p>
              ) : (
                <ul className="space-y-4">
                  {members.map((member) => (
                    <li key={member.id} className="flex items-center space-x-4">
                      <span className="font-medium">{member.name}</span>
                      <input
                        type="text"
                        placeholder="Enter role"
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.id, e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </li>
                  ))}
                </ul>
              )}
</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Location"
              name="location"
              defaultValue={data?.location}
              register={register}
              error={errors.location}
            />
            <InputField
              label="Revenue"
              name="revenue"
              defaultValue={data?.revenue}
              register={register}
              error={errors.revenue}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              {...register("phase")}
              defaultValue={data?.phase || ""}
            >
              <option value="">Phase*</option>
              <option value="Ideation">Ideation</option>
              <option value="Incubation">Incubation</option>
              <option value="Acceleration">Acceleration</option>
            </select>
            <select
              className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              {...register("status")}
              defaultValue={data?.status || ""}
            >
              <option value="">Status*</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
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
              <option value="">Select Category*</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
              <option value="Others">Others</option>
            </select>
            {errors.category && (
              <p className="text-xs text-red-500 mt-1">
                {errors.category.message?.toString()}
              </p>
            )}
            {isCustomCategory && (
              <InputField
                label="Custom Category"
                name="customCategory"
                register={register}
                error={errors?.customCategory}
              />
            )}
          </div>
          <div className="lg:col-span-3">
          <h2 className="text-lg font-semibold mb-4">Social Media</h2>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <InputField
                label="Facebook URL"
                name="facebookUrl"
                register={register}
                error={errors.facebookUrl}
              />
            </div>
            <div className="flex-1">
              <InputField
                label="LinkedIn URL"
                name="linkedinUrl"
                register={register}
                error={errors.linkedinUrl}
              />
            </div>
          </div>
        </div>
        <div className="lg:col-span-3">
        <h2 className="text-lg font-semibold mb-4">Contact</h2>
        <div className="flex flex-col lg:flex-row gap-4">
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
          </div>

      {/* Advisors Section */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Advisors</h2>
        <button
          type="button"
          onClick={() => setIsAdvisorModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Create Advisor
        </button>

        {/* Advisor Selection */}
        <div className="my-4">
          <label className="block text-sm font-medium text-gray-700">
            Add Existing Advisors
          </label>
          <Select
            options={availableAdvisors.map((advisor) => ({
              value: advisor.id,
              label: advisor.name,
            }))}
            isMulti
            value={selectedAdvisorOptions}
            onChange={(newSelectedOptions) => {
              setSelectedAdvisorOptions(newSelectedOptions ? [...newSelectedOptions] : []);
              // Update advisors state with selected advisors
              const selectedAdvisors = newSelectedOptions?.map((option) => ({
                id: option.value,
                name: option.label,
                areaOfExpertise: "",
              })) || [];

              setAdvisors((prevAdvisors) => {
                const newAdvisors = selectedAdvisors.filter(
                  (newAdvisor) => !prevAdvisors.some((advisor) => advisor.id === newAdvisor.id)
                );
                return [...prevAdvisors, ...newAdvisors];
              });
            }}
            className="mt-1"
            placeholder="Select advisors..."
          />
        </div>

        {/* Display Selected Advisors */}
        <div className="mt-6">
          {advisors.length === 0 ? (
            <p className="text-gray-500">No advisors added yet.</p>
          ) : (
            <ul className="space-y-4">
              {advisors.map((advisor) => (
                <li key={advisor.id} className="flex items-center space-x-4">
                  <span className="font-medium">{advisor.name}</span>
                  <span className="text-gray-700">{advisor.areaOfExpertise}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
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

        <div className="lg:col-span-3 flex justify-center gap-4 mt-6">
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={handleBackClick}
            className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600"
          >
            Back
          </button>
        </div>
        
      </form>
      <Modal isOpen={isModalOpen} onClose={handleModalClose} title="Confirmation">
        <p>{modalContent}</p>
        <div className="flex justify-end gap-4 mt-4">
          <Button
            type="button"
            onClick={handleModalConfirm}
            className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
          >
            Save
          </Button>
          <Button
            type="button"
            onClick={handleModalClose}
            className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600"
          >
            Discard
          </Button>
        </div>
      </Modal>
      <Modal
      isOpen={isMemberModalOpen}
      onClose={() => setIsMemberModalOpen(false)}
      title="Create Member"
      maxWidth="max-w-4xl" // Increase the max-width
    >
      <CreateMemberForm onClose={() => setIsMemberModalOpen(false)} onAddMember={handleAddMember} />
    </Modal>
    <Modal
    isOpen={isAdvisorModalOpen}
    onClose={() => setIsAdvisorModalOpen(false)}
    title="Create Advisor"
    maxWidth="max-w-4xl" // Adjust as needed
  >
    <CreateAdvisorForm
      onClose={() => setIsAdvisorModalOpen(false)}
      onAddAdvisor={handleAddAdvisor}
    />
  </Modal>
    </div>
  );
};

export default StartupForm;

