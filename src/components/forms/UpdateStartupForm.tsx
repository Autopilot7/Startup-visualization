"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { useForm, Controller } from "react-hook-form";
import { StartupCardProps } from '@/components/dashboard/StartupCard';
interface Member {
  id: string;
  name: string;
  role: string;
  active: boolean;
}

interface UpdateStartupFormProps {
  startupId: string;
  onClose: () => void;
}

interface Advisor {
  id: string;
  name: string;
  areaOfExpertise: string;
}

const schema = z.object({
  startupName: z.string(),
    advisors: z.array(
      z.object({
        id: z.string(),
      })
    ).optional(),
  phases: z.array(z.string()).optional(), // Changed from single enum to array of IDs
  status: z.string().optional(), // Changed from enum to single ID
  priority: z.string().optional(), // Changed from enum to single ID
  batch: z.string().optional(), // Changed from enum to single ID
  category: z.string(),
  customCategory: z.string().optional(),
  phone: z.string(),
  email: z.string().email({ message: "Invalid email address!" }),
  description: z.string(),
  shortdescription: z.string(),
  logo: z.any().optional(),
  pitchdeck: z.any().optional(),
  location: z.string(), // Added location field
  revenue: z.string(),  // Added revenue field
  facebookUrl: z.string().url({ message: "Invalid Facebook URL" }).optional(),
  linkedinUrl: z.string().url({ message: "Invalid LinkedIn URL" }).optional(),
});

type Inputs = z.infer<typeof schema>;

const UpdateStartupForm: React.FC<UpdateStartupFormProps> = ({ startupId, onClose }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });
  const [startupData, setStartupData] = useState<Inputs | null>(null);
  const [loading, setLoading] = useState(true);
  const [availableMembers, setAvailableMembers] = useState<Array<{ id: string; name: string }>>([]);
  const [members, setMembers] = useState<Member[]>([]);
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const [selectedMemberOptions, setSelectedMemberOptions] = useState<Array<{ value: string; label: string }>>([]);
    const [mounted, setMounted] = useState(false);
    const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [pitchdeckFileName, setPitchdeckFileName] = useState<string | null>(null);
    const [isCustomCategory, setIsCustomCategory] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [advisors, setAdvisors] = useState<Advisor[]>([]);
    const [availableAdvisors, setAvailableAdvisors] = useState<Advisor[]>([]);
    const [selectedAdvisorOptions, setSelectedAdvisorOptions] = useState<Array<{ value: string; label: string }>>([]);
    const [isAdvisorModalOpen, setIsAdvisorModalOpen] = useState(false);
    const [phases, setPhases] = useState<Array<{ id: string; name: string }>>([]);
    const [statuses, setStatuses] = useState<Array<{ id: string; name: string }>>([]);
    const [priorities, setPriorities] = useState<Array<{ id: string; name: string }>>([]);
    const [batches, setBatches] = useState<Array<{ id: string; name: string }>>([]);
    const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
    const [selectedPhases, setSelectedPhases] = useState<string[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [selectedBatch, setSelectedBatch] = useState<string>('');
    const [selectedPriority, setSelectedPriority] = useState<string>('');

    useEffect(() => {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          if (!token) {
            throw new Error("No authentication token found");
          }
  
          const [phasesResponse, statusesResponse, prioritiesResponse, batchesResponse] = await Promise.all([
            axios.get(endpoints.phases, { headers: { Authorization: `Bearer ${token}` } }),
            axios.get(endpoints.statuses, { headers: { Authorization: `Bearer ${token}` } }),
            axios.get(endpoints.priorities, { headers: { Authorization: `Bearer ${token}` } }),
            axios.get(endpoints.batches, { headers: { Authorization: `Bearer ${token}` } }),
          ]);
  
          setPhases(phasesResponse.data);
          setStatuses(statusesResponse.data);
          setPriorities(prioritiesResponse.data);
          setBatches(batchesResponse.data);
        } catch (error) {
          console.error("Error fetching data:", error);
          toast.error("Failed to load data");
        }
      };
  
      fetchData();
    }, []);
    
  useEffect(() => {
    const fetchStartupData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("No authentication token found. Please log in.");
        }

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(
          `https://startupilot.cloud.strixthekiet.me/api/startups/${startupId}`, // Adjust the endpoint as needed
          { headers }
        );

        console.log("Startup Data:", response.data);

        if (response.status === 200) {
          const data = response.data;
  
          // Map response data to form inputs
          const startupData: Inputs = {
            startupName: data.name || '',
            shortdescription: data.short_description || '',
            description: data.description || '',
            email: data.email || '',
            linkedinUrl: data.linkedin_url || '',
            facebookUrl: data.facebook_url || '',
            category: data.category || '',
            phone: data.phone || '',
            location: data.location || '',
            revenue: data.revenue || '',
            // Map other fields as needed
          };
  
          // Reset the form with the fetched data
          reset(startupData);
  
          setSelectedMembers(data.memberships.map((member: any) => ({
            id: member.member.id,
            name: member.member.name,
            role: member.roles || '',
            active: member.status,
          })));
  
          setSelectedPhases(data.phases || []);
          setSelectedStatus(data.status || '');
          setSelectedBatch(data.batch || '');
          setSelectedPriority(data.priority || '');
  
        } else {
          throw new Error("Failed to fetch startup data.");
        }
      } catch (error: any) {
        console.error("Error fetching startup data:", error);
        toast.error("Failed to fetch startup data.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchStartupData();
  }, [startupId]);

  

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
      { ...member, role: "", active: true },
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

  const handleRemoveMember = (memberId: string) => {
    setMembers((prevMembers) => prevMembers.filter((member) => member.id !== memberId));
  };
  const handleMemberStatusChange = (memberId: string, status: string) => {
    setMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.id === memberId ? { ...member, active: status === "active" } : member
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

  const onSubmit = handleSubmit(async (data) => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          toast.error("No authentication token found. Please log in.");
          return;
        }
    
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
    
        // **Upload Logo (Avatar)**
        let logoUrl = "";
        if (data.logo && data.logo.length > 0) {
          const logoFile = data.logo[0];
          const formData = new FormData();
          formData.append("file", logoFile);
          formData.append("type", "avatar");
    
          const uploadLogoResponse = await axios.post(
            endpoints.uploadavatar,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          );
    
          logoUrl = uploadLogoResponse.data.file_url;
          if (!logoUrl) {
            throw new Error("Failed to upload logo.");
          }
        }
    
        // **Upload Pitch Deck**
        let pitchDeckUrl = "";
        if (data.pitchdeck && data.pitchdeck.length > 0) {
          const pitchDeckFile = data.pitchdeck[0];
          const formData = new FormData();
          formData.append("file", pitchDeckFile);
          formData.append("type", "pitch_deck");
    
          const uploadPitchDeckResponse = await axios.post(
            endpoints.uploadavatar,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          );
    
          pitchDeckUrl = uploadPitchDeckResponse.data.file_url;
          if (!pitchDeckUrl) {
            throw new Error("Failed to upload pitch deck.");
          }
        }
    
        // **Prepare Startup Data**
        const startupData = {
          name: data.startupName,
          short_description: data.shortdescription,
          description: data.description,
          contact_email: data.email,
          linkedin_url: data.linkedinUrl || undefined,
          facebook_url: data.facebookUrl || undefined,
          pitch_deck: pitchDeckUrl || undefined,
          avatar: logoUrl || undefined,
          phases: data.phases || [],
          category: data.category !== "custom" ? data.category : undefined,
          custom_category_name:
            data.category === "custom" ? data.customCategory : undefined,
          status: data.status || undefined,
          priority: data.priority || undefined,
          batch: data.batch || undefined,
          // **Memberships**
          memberships: members.map((member) => ({
            id: member.id,
            role: member.role,
            status: member.active,
          })),
          // **Mentorships**
          mentorships: advisors.map((advisor) => advisor.id),
        };
    
        console.log("Startup Data:", startupData);
    
        // **Submit Startup Data**
        const response = await axios.put(
          `https://startupilot.cloud.strixthekiet.me/api/startups/${startupId}/`,
          startupData,
          { headers }
        );
    
        if (response.status === 201) {
          toast.success("Startup updated successfully!");
          // Optionally, redirect or reset form here
        } else {
          throw new Error("Failed to update startup.");
        }
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          console.error("Error creating startup:", error.response?.data);
          toast.error(
            error.response?.data?.message || "Failed to create startup."
          );
        } else {
          console.error("Unexpected error:", error);
          toast.error("An unexpected error occurred.");
        }
      }
    });

  if (!mounted) {
    // Avoid rendering differences during hydration
    return null;
  }

  if (loading) {
    return <div>Loading...</div>;
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
            register={register}
            error={errors?.startupName}
          />
          {/* Ô nhập Description với textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Short description</label>
            <textarea
                {...register("shortdescription")}
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
                  active: true,
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
                    <div key={member.id} className="flex items-center space-x-2">
                      <span className="font-medium">{member.name}</span>
                      <input
                        type="text"
                        placeholder="Role"
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.id, e.target.value)}
                        className="p-2 border border-gray-300 rounded-md "
                      />
                      <select
                        value={member.active ? "active" : "inactive"}
                        onChange={(e) => handleMemberStatusChange(member.id, e.target.value)}
                        className="p-2 border border-gray-300 rounded-md w-40"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      <button onClick={() => handleRemoveMember(member.id)} className="text-red-500">
                        Remove
                      </button>
                    </div>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Location"
              name="location"
              register={register}
              error={errors.location}
            />
            <InputField
              label="Revenue"
              name="revenue"
              register={register}
              error={errors.revenue}
            />
          </div>
          {/* Relationships: Phases, Status, Priority, Batch */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Phases: Multi-Select */}
              <Controller
                name="phases"
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phases</label>
                    <Select
                      {...field}
                      options={phases.map((phase) => ({
                        value: phase.id,
                        label: phase.name,
                      }))}
                      isMulti
                      className="mt-1"
                      placeholder="Select phases..."
                      onChange={(selectedOptions) => {
                        field.onChange(selectedOptions ? selectedOptions.map(option => option.value) : []);
                      }}
                      value={phases
                        .filter(phase => field.value?.includes(phase.id))
                        .map(phase => ({ value: phase.id, label: phase.name }))}
                    />
                    {errors.phases && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.phases.message?.toString()}
                      </p>
                    )}
                  </div>
                )}
              />

              
              {/* Status: Single Select */}
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <Select
                      {...field}
                      options={statuses.map((status) => ({
                        value: status.id,
                        label: status.name,
                      }))}
                      isClearable
                      className="mt-1"
                      placeholder="Select status..."
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption ? selectedOption.value : "");
                      }}
                      value={
                        statuses
                          .filter(status => status.id === field.value)
                          .map(status => ({ value: status.id, label: status.name }))[0] || null
                      }
                    />
                    {errors.status && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.status.message?.toString()}
                      </p>
                    )}
                  </div>
                )}
              />

              
              {/* Priority: Single Select */}
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Priority</label>
                    <Select
                      {...field}
                      options={priorities.map((priority) => ({
                        value: priority.id,
                        label: priority.name,
                      }))}
                      isClearable
                      className="mt-1"
                      placeholder="Select priority..."
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption ? selectedOption.value : "");
                      }}
                      value={
                        priorities
                          .filter(priority => priority.id === field.value)
                          .map(priority => ({ value: priority.id, label: priority.name }))[0] || null
                      }
                    />
                    {errors.priority && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.priority.message?.toString()}
                      </p>
                    )}
                  </div>
                )}
              />

              
              {/* Batch: Single Select */}
              <Controller
                name="batch"
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Batch</label>
                    <Select
                      {...field}
                      options={batches.map((batch) => ({
                        value: batch.id,
                        label: batch.name,
                      }))}
                      isClearable
                      className="mt-1"
                      placeholder="Select batch..."
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption ? selectedOption.value : "");
                      }}
                      value={
                        batches
                          .filter(batch => batch.id === field.value)
                          .map(batch => ({ value: batch.id, label: batch.name }))[0] || null
                      }
                    />
                    {errors.batch && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.batch.message?.toString()}
                      </p>
                    )}
                  </div>
                )}
              />

          </div>

          <div className="grid grid-cols-1 gap-4">
            <select
              className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              {...register("category")}
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
              register={register}
              error={errors.phone}
            />
            <InputField
              label="Email"
              name="email"
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

export default UpdateStartupForm;
