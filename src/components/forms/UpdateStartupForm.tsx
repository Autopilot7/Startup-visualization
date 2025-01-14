"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { z } from "zod";
import InputField from "../InputField";
import { Button } from "../ui/button";
import Link from "next/link";
import { toast } from "sonner";
import Modal from "../Modal"; // Assuming you have a Modal component
import CreateMemberForm from "@/app/create-member/page";
import AdvisorForm from "@/components/forms/AdvisorForm";
import axios from "axios";
import { endpoints } from "@/app/utils/apis";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import MemberForm from "@/components/forms/MemberForm";

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
  startupName: z.string().nonempty("Name is required"),
  advisors: z
    .array(
      z.object({
        id: z.string(),
      })
    )
    .optional(),
  phases: z.array(z.string()).nonempty("At least one phase is required"),
  status: z.string().nonempty("Status is required"),
  priority: z.string().nonempty("Priority is required"),
  batch: z.string().nonempty("Batch is required"),
  category: z.string().nonempty("Category is required"),
  customCategory: z.string().optional(),
  phone: z.string(),
  email: z.string().optional(),
  shortdescription: z.string().nonempty("Short description is required"),
  description: z.string().nonempty("Long description is required"),
  logo: z
    .any()
    .optional()
    .refine((file) => {
      // If no file is provided, it's valid since it's optional
      if (!file || file.length === 0) return true;
      // If a file is provided, ensure only one file is uploaded
      return file.length === 1;
    }, { message: "Only one photo can be uploaded." })
    .refine((file) => {
      // If no file is provided, skip the type check
      if (!file || file.length === 0) return true;
      // Validate the file type
      return ["image/jpeg", "image/png", "image/gif"].includes(file[0]?.type);
    }, { message: "Only JPEG, PNG, and GIF files are allowed." }),
  pitchdeck: z.any().optional(),
  location: z.string(),
  facebookUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
});

type Inputs = z.infer<typeof schema>;

const UpdateStartupForm: React.FC<UpdateStartupFormProps> = ({
  startupId,
  onClose,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const [initialMembers, setInitialMembers] = useState<Member[]>([]);
  const [initialAdvisors, setInitialAdvisors] = useState<Advisor[]>([]);
  const [startupData, setStartupData] = useState<Inputs | null>(null);
  const [loading, setLoading] = useState(true);
  const [availableMembers, setAvailableMembers] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [selectedMemberOptions, setSelectedMemberOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [pitchdeckFileName, setPitchdeckFileName] = useState<string | null>(null);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [availableAdvisors, setAvailableAdvisors] = useState<Advisor[]>([]);
  const [selectedAdvisorOptions, setSelectedAdvisorOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [isAdvisorModalOpen, setIsAdvisorModalOpen] = useState(false);
  const [phases, setPhases] = useState<Array<{ id: string; name: string }>>([]);
  const [statuses, setStatuses] = useState<Array<{ id: string; name: string }>>([]);
  const [priorities, setPriorities] = useState<Array<{ id: string; name: string }>>([]);
  const [batches, setBatches] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
  const [selectedPhases, setSelectedPhases] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<string>("");

  // 1. Fetch basic data: phases, statuses, priorities, batches.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const [phasesResponse, statusesResponse, prioritiesResponse, batchesResponse] =
          await Promise.all([
            axios.get(endpoints.phases, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(endpoints.statuses, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(endpoints.priorities, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(endpoints.batches, {
              headers: { Authorization: `Bearer ${token}` },
            }),
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

  // 2. Fetch all existing advisors for selection
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

  // 3. Load members from localStorage
  useEffect(() => {
    const storedMembers = localStorage.getItem("members");
    if (storedMembers) {
      try {
        const parsedMembers = JSON.parse(storedMembers);
        setMembers(parsedMembers);
      } catch (error) {
        console.error("Error parsing stored members:", error);
        localStorage.removeItem("members"); // Clear invalid data
      }
    }
    setMounted(true);
  }, []);

  // 4. Fetch categories and members
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

  // 5. Fetch existing startup data to populate form
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

        const [
          phasesRes,
          statusesRes,
          prioritiesRes,
          batchesRes,
          categoriesRes,
        ] = await Promise.all([
          axios.get(endpoints.phases, { headers }),
          axios.get(endpoints.statuses, { headers }),
          axios.get(endpoints.priorities, { headers }),
          axios.get(endpoints.batches, { headers }),
          axios.get(endpoints.categories, { headers }),
        ]);

        setPhases(phasesRes.data);
        setStatuses(statusesRes.data);
        setPriorities(prioritiesRes.data);
        setBatches(batchesRes.data);
        setCategories(categoriesRes.data);

        const response = await axios.get(
          `https://startupilot.cloud.strixthekiet.me/api/startups/${startupId}`,
          { headers }
        );

        console.log("Startup Data GET:", response.data);

        if (response.status === 200) {
          const data = response.data;

          // Match foreign keys for status, priority, batch, category
          const matchedStatus = statusesRes.data.find(
            (s: any) => s.name === data.status
          )?.id;
          const matchedPriority = prioritiesRes.data.find(
            (p: any) => p.name === data.priority
          )?.id;
          const matchedBatch = batchesRes.data.find(
            (b: any) => b.name === data.batch
          )?.id;
          const matchedCategory = categoriesRes.data.find(
            (c: any) => c.name === data.category
          )?.id;

          // Match phases
          const matchedPhases = data.phases.map((phaseName: string) => {
            const matchedPhase = phasesRes.data.find(
              (p: any) => p.name === phaseName
            );
            return matchedPhase?.id;
          });

          // Construct startupData for form
          const startupFormData: Inputs = {
            startupName: data.name || "",
            shortdescription: data.short_description || "",
            description: data.description || "",
            email: data.email || "",
            linkedinUrl: data.linkedin_url || "",
            facebookUrl: data.facebook_url || "",
            phone: data.phone || "",
            location: data.location || "",
            phases: matchedPhases || [],
            status: matchedStatus || "",
            priority: matchedPriority || "",
            batch: matchedBatch || "",
            category: matchedCategory || "",
            customCategory: data.custom_category_name || "",
            logo: undefined,
            pitchdeck: undefined,
          };

          // Reset the form with fetched data
          reset(startupFormData);

          // Preselect members
          setSelectedMembers(
            data.memberships.map((member: any) => ({
              id: member.member.id,
              name: member.member.name,
              role: member.roles || "",
              active: member.status,
            }))
          );

          setSelectedStatus(matchedStatus || "");
          setSelectedPriority(matchedPriority || "");
          setSelectedBatch(matchedBatch || "");
          setSelectedPhases(matchedPhases || []);
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
  }, [startupId, reset]);

  // Handlers for modals
  const handleBackClick = () => {
    setModalContent("Are you sure you want to go back without saving?");
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalContent("");
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    // Perform the discard action or any other functionality
  };

  // Handlers for members
  const handleAddMember = (member: { id: string; name: string }) => {
    setMembers((prevMembers) => [
      ...prevMembers,
      { ...member, role: "", active: true },
    ]);
  };

  const handleRoleChange = (memberId: string, role: string) => {
    setMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.id === memberId ? { ...member, role } : member
      )
    );
  };

  const handleRemoveMember = (memberId: string) => {
    setMembers((prevMembers) =>
      prevMembers.filter((member) => member.id !== memberId)
    );
  };

  const handleMemberStatusChange = (memberId: string, status: string) => {
    setMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.id === memberId
          ? { ...member, active: status === "active" }
          : member
      )
    );
  };

  // Handlers for advisors
  const handleAddAdvisor = (advisor: { id: string; name: string }) => {
    setAdvisors((prevAdvisors) => [
      ...prevAdvisors,
      {
        id: advisor.id,
        name: advisor.name,
        areaOfExpertise: "",
      },
    ]);
  };

  // Handlers for file changes
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    } else {
      setLogoPreview(null);
    }
  };

  const handlePitchDeckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPitchdeckFileName(file.name);
      console.log("Pitch Deck File:", file);
    }
  };

  // 6. Handle form submission (Update Startup)
  const onSubmit = handleSubmit(async (data) => {
    // This prevents the default form submission reload.
    // (handleSubmit from react-hook-form already does it under the hood.)

    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("No authentication token found. Please log in.");
      return;
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    let fetchedData;
    try {
      const response = await axios.get(
        `https://startupilot.cloud.strixthekiet.me/api/startups/${startupId}`,
        { headers }
      );
      fetchedData = response.data;
    } catch (error) {
      console.error("Error fetching startup data:", error);
      toast.error("Failed to fetch startup data.");
      return;
    }

    try {
      let logoUrl = fetchedData.avatar;
      let pitchDeckUrl = fetchedData.pitch_deck;

      // Upload new logo if provided
      if (data.logo && data.logo.length > 0) {
        const logoFile = data.logo[0];
        const formData = new FormData();
        formData.append("file", logoFile);
        formData.append("type", "avatar");

        const uploadLogoResponse = await axios.post(endpoints.uploadavatar, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        logoUrl = uploadLogoResponse.data.file_url;
        if (!logoUrl) {
          throw new Error("Failed to upload logo.");
        }
      }

      // Upload new pitch deck if provided
      if (data.pitchdeck && data.pitchdeck.length > 0) {
        const pitchDeckFile = data.pitchdeck[0];
        const formData = new FormData();
        formData.append("file", pitchDeckFile);
        formData.append("type", "pitchdeck");

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

      // Prepare Startup Data
      const startupData = {
        name: data.startupName || fetchedData.name,
        short_description: data.shortdescription || fetchedData.short_description,
        description: data.description || fetchedData.description,
        contact_email: data.email || fetchedData.contact_email,
        linkedin_url: data.linkedinUrl || fetchedData.linkedin_url,
        facebook_url: data.facebookUrl || fetchedData.facebook_url,
        pitch_deck: pitchDeckUrl,
        avatar: logoUrl,
        phases: data.phases?.length ? data.phases : fetchedData.phases,
        category: data.category || fetchedData.category,
        custom_category_name:
          data.customCategory || fetchedData.custom_category_name,
        status: data.status || fetchedData.status,
        priority: data.priority || fetchedData.priority,
        batch: data.batch || fetchedData.batch,
        location: data.location || fetchedData.location,

        // Memberships
        memberships: members.length
          ? members.map((m: any) => ({
              id: m.id, // membership ID
              role: m.role,
              status: m.active,
            }))
          : fetchedData.memberships.map((m: any) => ({
              id: m.member.id,
              role: m.roles || "",
              status: m.status,
            })),

        // Mentorships
        mentorships: advisors.length
          ? advisors.map((adv) => adv.id)
          : fetchedData.advisors.map((adv: any) => adv.id),
      };

      console.log("Startup Data Send:", startupData);
      console.log("Startup ID:", startupId);

      // Submit Startup Data
      const response = await axios.put(
        `https://startupilot.cloud.strixthekiet.me/api/startups/${startupId}`,
        startupData,
        { headers }
      );
      console.log("Update Startup Response:", response);

      if (response.status === 200) {
        toast.success("Startup updated successfully!");
        // Optionally, redirect or reset form here
      } else {
        throw new Error("Failed to update startup.");
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error("Error update startup:", error.response?.data);
        toast.error("Failed to update startup.");
      } else {
        console.error("Unexpected error:", error);
        toast.error("Unexpected error occurred.");
      }
    }
  });

  // 7. Handle startup deletion
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this startup?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.delete(
        `https://startupilot.cloud.strixthekiet.me/api/startups/${startupId}`,
        { headers }
      );

      if (response.status === 204 || response.status === 200) {
        toast.success("Startup deleted successfully!");
        // Optionally redirect or close modal, etc.
        // e.g. onClose() or a router.push('/somewhere')
      } else {
        toast.error("Failed to delete startup.");
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error("Error deleting startup:", error.response?.data);
        toast.error("Failed to delete startup.");
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred.");
      }
    }
  };

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
        // IMPORTANT: Use `onSubmit={handleSubmit(onSubmit)}` from react-hook-form
        // This will prevent the default page reload, as `handleSubmit` does it internally.
        onSubmit={onSubmit}
      >
        {/* ---------- Column 1 & 2: Startup Info ---------- */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <InputField
            label="Startup Name"
            name="startupName"
            register={register}
            error={errors?.startupName}
          />

          {/* Short Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Short description
            </label>
            <textarea
              {...register("shortdescription")}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 resize-none h-20"
              placeholder="Enter a short description..."
            ></textarea>
            {errors.shortdescription && (
              <p className="text-xs text-red-500 mt-1">
                {errors.shortdescription.message?.toString()}
              </p>
            )}
          </div>

          {/* Long Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
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

          {/* Add Existing Members */}
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
                setSelectedMemberOptions(
                  (newSelectedOptions as { value: string; label: string }[]) ||
                    []
                );
                const selectedMembers =
                  newSelectedOptions?.map((option) => ({
                    id: option.value,
                    name: option.label,
                    role: "",
                    active: true,
                  })) || [];

                setMembers((prevMembers) => {
                  const newMembers = selectedMembers.filter(
                    (newMember) =>
                      !prevMembers.some((member) => member.id === newMember.id)
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
                        onChange={(e) =>
                          handleRoleChange(member.id, e.target.value)
                        }
                        className="p-2 border border-gray-300 rounded-md "
                      />
                      <select
                        value={member.active ? "active" : "inactive"}
                        onChange={(e) =>
                          handleMemberStatusChange(member.id, e.target.value)
                        }
                        className="p-2 border border-gray-300 rounded-md w-40"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <InputField
              label="Location"
              name="location"
              register={register}
              error={errors.location}
            />
          </div>

          {/* Phases, Status, Priority, Batch */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Phases: Multi-Select */}
            <Controller
              name="phases"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phases
                  </label>
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
                      field.onChange(
                        selectedOptions
                          ? selectedOptions.map((option) => option.value)
                          : []
                      );
                    }}
                    value={phases
                      .filter((phase) => field.value?.includes(phase.id))
                      .map((phase) => ({
                        value: phase.id,
                        label: phase.name,
                      }))}
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
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
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
                        .filter((status) => status.id === field.value)
                        .map((status) => ({
                          value: status.id,
                          label: status.name,
                        }))[0] || null
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
                  <label className="block text-sm font-medium text-gray-700">
                    Priority
                  </label>
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
                        .filter((priority) => priority.id === field.value)
                        .map((priority) => ({
                          value: priority.id,
                          label: priority.name,
                        }))[0] || null
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
                  <label className="block text-sm font-medium text-gray-700">
                    Batch
                  </label>
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
                        .filter((batch) => batch.id === field.value)
                        .map((batch) => ({
                          value: batch.id,
                          label: batch.name,
                        }))[0] || null
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

          {/* Category & Custom Category */}
          <div className="grid grid-cols-1 gap-4">
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              {...register("category")}
              onChange={(e) => setIsCustomCategory(e.target.value === "Others")}
            >
              {/* You can add a default <option> if needed */}
              {/* <option value="">Select a category</option> */}
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
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

          {/* Social Media */}
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

          {/* Contact */}
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
                  setSelectedAdvisorOptions(
                    newSelectedOptions ? [...newSelectedOptions] : []
                  );
                  const selectedAdvisors =
                    newSelectedOptions?.map((option) => ({
                      id: option.value,
                      name: option.label,
                      areaOfExpertise: "",
                    })) || [];

                  setAdvisors((prevAdvisors) => {
                    const newAdvisors = selectedAdvisors.filter(
                      (newAdvisor) =>
                        !prevAdvisors.some(
                          (advisor) => advisor.id === newAdvisor.id
                        )
                    );
                    return [...prevAdvisors, ...newAdvisors];
                  });
                }}
                className="mt-1"
                placeholder="Select advisors..."
              />
            </div>

            <div className="mt-6">
              {advisors.length === 0 ? (
                <p className="text-gray-500">No advisors added yet.</p>
              ) : (
                <ul className="space-y-4">
                  {advisors.map((advisor) => (
                    <li key={advisor.id} className="flex items-center space-x-4">
                      <span className="font-medium">{advisor.name}</span>
                      <span className="text-gray-700">
                        {advisor.areaOfExpertise}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* ---------- Column 3: Uploads (Logo + Pitch Deck) ---------- */}
        <div className="flex flex-col items-center gap-6">
          {/* Upload Logo */}
          <h2 className="text-lg font-semibold mb-2 text-center">Logo</h2>
          <div className="border border-gray-300 rounded-lg p-6 text-center">
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Logo Preview"
                className="w-48 h-48 object-cover rounded-full mb-4"
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center bg-gray-200 rounded-full mb-4">
                <p className="text-gray-500">No Logo</p>
              </div>
            )}
            <div className="flex flex-col items-center">
              <input
                type="file"
                accept="image/*"
                {...register("logo")}
                onChange={(e) => {
                  register("logo").onChange(e);
                  handleLogoChange(e);
                }}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600"
              >
                Upload Logo
              </label>
              {errors.logo && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.logo.message?.toString()}
                </p>
              )}
            </div>
          </div>

          {/* Upload Pitchdeck */}
          <div className="flex flex-col items-center gap-6">
            <h2 className="text-lg font-semibold mb-2 text-center">
              Pitch Deck
            </h2>
            <div className="border border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".pdf,.ppt,.pptx"
                {...register("pitchdeck")}
                onChange={(e) => {
                  register("pitchdeck").onChange(e);
                  handlePitchDeckChange(e);
                }}
                className="hidden"
                id="pitchdeck-upload"
              />
              <label
                htmlFor="pitchdeck-upload"
                className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600"
              >
                Upload Pitch Deck
              </label>
              {pitchdeckFileName && (
                <p className="text-sm text-gray-700 mt-2">
                  {pitchdeckFileName}
                </p>
              )}
              {errors.pitchdeck && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.pitchdeck.message?.toString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ---------- Action Buttons (Submit + Delete) ---------- */}
        <div className="lg:col-span-3 flex justify-center gap-4 mt-6">
            <button
            type="submit"
            onClick={async () => {
              await onSubmit();
              window.location.href = `../../startupinfo/${startupId}`;
            }}
            className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600"
            >
            Submit
            </button>

          {/* NEW: DELETE BUTTON */}
            <button
            type="button"
            onClick={async () => {
              await handleDelete();
              window.location.href = '../../';
            }}
            className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600"
            >
            Delete
            </button>
        </div>
      </form>

      {/* ---------- Confirm Modal ---------- */}
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

      {/* ---------- Create Member Modal ---------- */}
      <Modal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        title="Create Member"
        maxWidth="max-w-4xl"
      >
        <MemberForm
          onClose={() => setIsMemberModalOpen(false)}
          onAddMember={handleAddMember}
        />
      </Modal>

      {/* ---------- Create Advisor Modal ---------- */}
      <Modal
        isOpen={isAdvisorModalOpen}
        onClose={() => setIsAdvisorModalOpen(false)}
        title="Create Advisor"
        maxWidth="max-w-4xl"
      >
        <AdvisorForm
          onClose={() => setIsAdvisorModalOpen(false)}
          onAddAdvisor={handleAddAdvisor}
        />
      </Modal>
    </div>
  );
};

export default UpdateStartupForm;
