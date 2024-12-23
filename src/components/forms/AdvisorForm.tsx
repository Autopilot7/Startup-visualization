"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";
import { z } from "zod";
import InputField from "../InputField";
import axios from 'axios';
import { endpoints } from '@/app/utils/apis';

// Move all the form-related code here
export interface CreateAdvisorFormProps {
  onClose: () => void;
  onAddAdvisor: (advisor: { id: string; name: string }) => void;
}

// Move the schema and form component here
const schema = z.object({
  // ... existing schema ...
});

export function AdvisorForm({ onClose, onAddAdvisor }: CreateAdvisorFormProps): JSX.Element {
  // ... existing form component code ...
  return (
    <form>
      {/* Your existing form JSX */}
    </form>
  );
} 