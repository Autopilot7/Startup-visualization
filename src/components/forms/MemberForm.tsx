"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";
import { z } from "zod";
import InputField from "../InputField";
import axios from 'axios';
import { endpoints } from '@/app/utils/apis';

export interface CreateMemberFormProps {
  onClose: () => void;
  onAddMember: (member: { id: string; name: string }) => void;
}

// Move your existing schema and form logic here
export function MemberForm({ onClose, onAddMember }: CreateMemberFormProps): JSX.Element {
  // Move your existing form component code here
  return (
    <form>
      {/* Your existing form JSX */}
    </form>
  );
} 