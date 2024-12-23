"use client";

import Badge from "@/components/dashboard/Badge";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { MemberManagement } from "./memberform";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

interface Membership {
  id: string;
  startup: {
    id: string;
    name: string;
  };
  role: string;
  status: boolean;
}

interface Note {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface MemberCardProps {
  id: string;
  name: string;
  email?: string;
  shorthand?: string;
  phone?: string;
  linkedin_url?: string;
  facebook_url?: string;
  memberships?: Membership[];
  avatar?: string;
  notes?: Note[];
}

export default function Memberinfo({
  id,
  name,
  email,
  phone,
  linkedin_url,
  facebook_url,
  memberships = [],
  avatar,
  notes = [],
}: MemberCardProps) {
  // Only show memberships that have status = true
  const activeMemberships = memberships.filter((m) => m.status);
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div
      className="
        max-w-auto
        min-h-auto
        bg-gradient-to-r from-white to-gray-50
        border
        border-slate-300
        rounded-2xl
        p-4
        shadow-lg
        hover:shadow-xl
        hover:bg-opacity-90
        transition
        duration-300
        transform
        hover:scale-[1.01]
      "
    >
      {/* Top Section: Avatar + Basic Info + Socials */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Avatar */}
        <div className="relative">
          <Image
            src={avatar || "https://via.placeholder.com/100"}
            width={100}
            height={100}
            className="h-24 w-24 object-cover rounded-full ring-2 ring-blue-200 ring-offset-2"
            alt={`${name} Avatar`}
          />
        </div>

        {/* Main Info */}
        <div className="flex-1 space-y-2 min-w-0">
          {/* Name */}
          <p className="text-2xl md:text-3xl font-bold text-gray-800">
            {name} 
          </p>
          {isAuthenticated && (
            <div className="flex items-center justify-center bg-green-300 text-white font-bold rounded w-10 p-2">
              <MemberManagement id={id} />
            </div>

        )}
          

          {/* Email & Phone */}
          <div className="text-sm md:text-base text-gray-700 leading-tight">
            {email && (
              <p className="truncate">
                <strong>Email:</strong> {email}
              </p>
            )}
            {phone && (
              <p className="truncate">
                <strong>Phone:</strong> {phone}
              </p>
            )}
          </div>

          {/* Memberships */}
          {activeMemberships.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {activeMemberships.map((membership) => (
                <span
                  key={membership.id}
                  className={`text-sm px-2 py-0.5 rounded font-bold text-white ${
                    membership.role.toLowerCase() === "founder"
                      ? "bg-red-500"
                      : "bg-green-600"
                  }`}
                >
                  {membership.role} @ {membership.startup.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Social Icons */}
        <div className="flex flex-col items-center gap-3">
          {linkedin_url && (
            <a
              href={linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-500 transition-colors"
            >
              <FaLinkedin size={36} />
            </a>
          )}
          {facebook_url && (
            <a
              href={facebook_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-800 hover:text-blue-600 transition-colors"
            >
              <FaFacebook size={36} />
            </a>
          )}
        
        </div>
      </div>

      {/* Introduction (Notes) */}
      <div className="mt-4 p-4 bg-white bg-opacity-80 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">
          Introduction
        </h2>
        {notes.length > 0 ? (
          notes.map((note) => (
            <p key={note.id} className="text-gray-700 mb-2">
              {note.content}
            </p>
          ))
        ) : (
          <p className="text-gray-700">No introduction available.</p>
        )}
      </div>
    </div>
  );
}
