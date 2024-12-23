import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import { toast } from "sonner";
import { endpoints } from "@/app/utils/apis";

interface Mentorship {
  startup: {
    id: string;
    name: string;
  };
}

interface Advisor {
  id: string;
  name: string;
  email: string;
  phone: string;
  linkedin_url: string;
  facebook_url: string;
  shorthand: string;
  area_of_expertise: string;
  avatar: string;
  mentorships: Mentorship[];
}

interface AdvisorEditFormProps {
  id: string; // Advisor ID passed as a prop
}

export const AdvisorEditForm: React.FC<AdvisorEditFormProps> = ({ id }) => {
  const [advisor, setAdvisor] = useState<Advisor | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [uploading, setUploading] = useState(false); // For file upload status
  const token = localStorage.getItem("accessToken");

  // Fetch advisor data by ID
  useEffect(() => {
    const fetchAdvisor = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get<Advisor>(
          `${endpoints.advisors}${id}`
        );
        setAdvisor(response.data);
      } catch (error) {
        setError("Failed to fetch advisor data");
      } finally {
        setLoading(false);
      }
    };

    fetchAdvisor();
  }, [id]);

  // Handle file upload for avatar
  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "avatar");

    try {
      if (!token) {
        toast.error("Authentication token not found.");
        return;
      }

      setUploading(true);
      const uploadResponse = await axios.post(endpoints.uploadavatar, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const avatarUrl = uploadResponse.data.file_url;

      if (advisor) {
        setAdvisor({ ...advisor, avatar: avatarUrl });
        setSuccessMessage("Avatar uploaded successfully.");
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Failed to upload avatar. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  // Handle main advisor field changes locally
  const handleInputChange = (field: keyof Advisor, value: string) => {
    if (advisor) {
      setAdvisor({ ...advisor, [field]: value });
    }
  };

  // Push updated advisor data to the API
  const updateAdvisor = async () => {
    if (!advisor) return;

    setError(null);
    setSuccessMessage("");

    try {
      await axios.put(
        `${endpoints.advisors}${advisor.id}`,
        advisor
      );
      setSuccessMessage("Changes saved successfully.");
    } catch (error) {
      setError("Failed to save advisor data.");
    }
  };

  // Submit all changes and reload the page
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateAdvisor();
    window.location.reload(); // Reload the page after submission
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            maxWidth: "600px",
            margin: "auto",
            borderRadius: "10px",
            padding: "20px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            position: "relative",
            top: "10%",
            bottom: "auto",
            height: "80%",
            overflowY: "auto", // Scrollable content
          },
        }}
        ariaHideApp={false}
      >
        {/* Exit Button */}
        <button
          onClick={closeModal}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "transparent",
            border: "none",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          ✖
        </button>

        <h2 style={{ textAlign: "center" }}>Edit Advisor</h2>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {advisor && (
          <form onSubmit={handleSubmit}>
            <div
              style={{
                marginBottom: "20px",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
              }}
            >
              <label>
                Name:
                <input
                  type="text"
                  value={advisor.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  style={{ width: "100%", marginBottom: "8px" }}
                />
              </label>

              <label>
                Email:
                <input
                  type="email"
                  value={advisor.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  style={{ width: "100%", marginBottom: "8px" }}
                />
              </label>

              <label>
                Phone:
                <input
                  type="tel"
                  value={advisor.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  style={{ width: "100%", marginBottom: "8px" }}
                />
              </label>

              <label>
                LinkedIn URL:
                <input
                  type="url"
                  value={advisor.linkedin_url || ""}
                  onChange={(e) =>
                    handleInputChange("linkedin_url", e.target.value)
                  }
                  style={{ width: "100%", marginBottom: "8px" }}
                />
              </label>

              <label>
                Facebook URL:
                <input
                  type="url"
                  value={advisor.facebook_url || ""}
                  onChange={(e) =>
                    handleInputChange("facebook_url", e.target.value)
                  }
                  style={{ width: "100%", marginBottom: "8px" }}
                />
              </label>

              <label>
                Avatar:
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                  style={{ width: "100%", marginBottom: "8px" }}
                  disabled={uploading}
                />
                {uploading && <p>Uploading...</p>}
                {advisor.avatar && (
                  <p>
                    <strong>Current Avatar:</strong>{" "}
                    <a
                      href={advisor.avatar}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Avatar
                    </a>
                  </p>
                )}
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                display: "block",
                margin: "20px auto",
                background: "#28a745",
                color: "#fff",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Save Changes and Reload
            </button>
          </form>
        )}

        {/* Success Message */}
        {successMessage && (
          <p
            style={{
              color: "green",
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            {successMessage}
          </p>
        )}
      </Modal>
    </div>
  );
};
