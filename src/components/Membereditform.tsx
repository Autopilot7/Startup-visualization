import React, { useState, useEffect, useContext } from "react";
import Modal from "react-modal";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "sonner";
import { endpoints } from "@/app/utils/apis";


interface Note {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface Member {
  id: string;
  name: string;
  email: string;
  shorthand: string;
  phone: string;
  linkedin_url: string;
  facebook_url: string;
  avatar: string;
  notes: Note[];
}

interface MemberEditFormProps {
  id: string; // Member ID passed as a prop
}

export const MemberEditForm: React.FC<MemberEditFormProps> = ({ id }) => {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [uploading, setUploading] = useState(false); // For file upload statu
  const token = localStorage.getItem("accessToken");

  // Fetch member data by ID
  useEffect(() => {
    const fetchMember = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get<Member>(
          `${endpoints.members}${id}`
        );
        setMember(response.data);
      } catch (error) {
        setError("Failed to fetch member data");
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  // Handle file upload for avatar
  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "avatar");

    try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          toast.error("Authentication token not found.");
          return;
  
        }
      let avatarUrl = "";

      const uploadResponse = await axios.post(endpoints.uploadavatar, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      avatarUrl = uploadResponse.data.file_url;
      console.log('Avatar URL:', avatarUrl);
      
      if (member) {
        setMember({ ...member, avatar: avatarUrl });
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

  // Push updated note to the API
  const updateNote = async (noteId: string, content: string) => {
    try {
      await axios.put(
        `${endpoints.notes}/${noteId}`,
        { content }
      );
    } catch (error) {
      setError("Failed to update note.");
    }
  };

  // Handle note changes locally and update on the server
  const handleNoteChange = (noteId: string, value: string) => {
    if (member) {
      const updatedNotes = member.notes.map((note) =>
        note.id === noteId ? { ...note, content: value } : note
      );
      setMember({ ...member, notes: updatedNotes });
      updateNote(noteId, value); // Update note immediately
    }
  };

  // Handle main member field changes locally
  const handleInputChange = (field: keyof Member, value: string) => {
    if (member) {
      setMember({ ...member, [field]: value });
    }
  };

  // Push updated member data to the API
  const updateMember = async () => {
    if (!member) return;

    setError(null);
    setSuccessMessage("");

    try {
      await axios.put(
        `${endpoints.members}${member.id}`,
        member
      );
      setSuccessMessage("Changes saved successfully.");
    } catch (error) {
      setError("Failed to save member data.");
    }
  };

  // Submit all changes and reload the page
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateMember();
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

        <h2 style={{ textAlign: "center" }}>Edit Member</h2>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {member && (
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
                  value={member.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  style={{ width: "100%", marginBottom: "8px" }}
                />
              </label>

              <label>
                Email:
                <input
                  type="email"
                  value={member.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  style={{ width: "100%", marginBottom: "8px" }}
                />
              </label>

              <label>
                Phone:
                <input
                  type="tel"
                  value={member.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  style={{ width: "100%", marginBottom: "8px" }}
                />
              </label>

              <label>
                LinkedIn URL:
                <input
                  type="url"
                  value={member.linkedin_url || ""}
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
                  value={member.facebook_url || ""}
                  onChange={(e) =>
                    handleInputChange("facebook_url", e.target.value)
                  }
                  style={{ width: "100%", marginBottom: "8px" }}
                />
              </label>

              <label>
                Introduction:
                <ul>
                  {member.notes.map((note) => (
                    <li key={note.id}>
                      <textarea
                        value={note.content}
                        onChange={(e) => handleNoteChange(note.id, e.target.value)}
                        style={{ width: "100%", marginBottom: "8px" }}
                      />
                    </li>
                  ))}
                </ul>
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
                {member.avatar && (
                  <p>
                    <strong>Current Avatar:</strong>{" "}
                    <a
                      href={member.avatar}
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
