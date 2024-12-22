"use client";

import { useState } from "react";
import { MemberEditForm } from "./Membereditform";

interface MemberManagementProps {
  id: string; // Define the id as a prop
}

export const MemberManagement: React.FC<MemberManagementProps> = ({ id }) => {
  const [showForm, setShowForm] = useState(false);

  const handleButtonClick = () => {
    setShowForm((prev) => !prev); // Toggle form visibility
  };

  return (
    <div>
      <button onClick={handleButtonClick}>
        {showForm ? "Hide Edit Form" : "Edit"}
      </button>
      {showForm && <MemberEditForm id={id} />}
    </div>
  );
};
