"use client";

import { useState } from "react";
import { AdvisorEditForm } from "./Advisoreditform";

interface MemberManagementProps {
  id: string; // Define the id as a prop
}

export const AdvisorManagement: React.FC<MemberManagementProps> = ({ id }) => {
  const [showForm, setShowForm] = useState(false);

  const handleButtonClick = () => {
    setShowForm((prev) => !prev); // Toggle form visibility
  };

  return (
    <div>
      <button onClick={handleButtonClick}>
        {showForm ? "Hide Edit Form" : "Edit"}
      </button>
      {showForm && <AdvisorEditForm id={id} />}
    </div>
  );
};




