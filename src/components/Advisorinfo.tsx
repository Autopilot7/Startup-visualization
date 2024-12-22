"use client";

import Image from "next/image";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

export interface Mentorship {
  startup: {
    id: string;
    name: string;
  };
}

export interface Advisors {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  area_of_expertise?: string;
  avatar?: string;
  mentorship?: Mentorship[];
}

export default function Advisorinfo({
  id,
  name,
  email,
  phone,
  linkedin_url,
  facebook_url,
  instagram_url,
  area_of_expertise,
  avatar,
  mentorship = [],
}: Advisors) {
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
            {/* Area of Expertise */}
            {area_of_expertise && (
              <p className="truncate">
                <strong>Expertise:</strong> {area_of_expertise}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {mentorship.length > 0 ? (
                mentorship.map((m) => (
                <span key={m.startup.id} className="bg-yellow-500 text-white font-bold text-sm mr-2 px-2.5 py-0.5 rounded">
                    Advisor @ {m.startup.name}
                </span>
                ))
            ) : (
                <p className="text-gray-600">No mentorships found.</p>
            )}
            </div>
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
          {instagram_url ? (
            <a
              href={instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:text-pink-500 transition-colors"
            >
              <FaInstagram size={36} />
            </a>
          ) : (
            <FaInstagram
              size={36}
              className="text-pink-600 cursor-pointer hover:text-pink-500 transition-colors"
            />
          )}
        </div>
      </div>
    </div>
  );
}
