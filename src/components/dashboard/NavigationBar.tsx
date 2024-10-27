import React from 'react';
import Image from 'next/image'; // Import Next.js Image component
import { UserProfile } from './types';

interface NavigationBarProps {
  userProfile: UserProfile;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ userProfile }) => {
  const navItems = [
    { icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/f9cc3b04011f691a01a72ff2af959b318ed47f30946a8773e99f2005f181dd06?placeholderIfAbsent=true&apiKey=d4c1990e0e0f43419dec73e7bca3d520', label: 'Home Page' },
    { icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/e6f374a8ac020cc31dfa81eeabfe4670367d3c8f925d6aef79faf416fd57855b?placeholderIfAbsent=true&apiKey=d4c1990e0e0f43419dec73e7bca3d520', label: 'Visualization' },
    { icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/6fc489278da8d6b41e2dd88576db0f0cce3013ffe46bc40b9502244792f54efc?placeholderIfAbsent=true&apiKey=d4c1990e0e0f43419dec73e7bca3d520', label: 'Messages' }
  ];

  return (
    <header className="bg-white flex w-full flex-col font-inter">
      <nav className="flex ml-3 w-full max-w-[1505px] gap-5 justify-between flex-wrap">
        <div className="flex items-end gap-[51px] text-lg text-[#787486] font-medium">
          <div className="flex gap-1 text-2xl text-[#0D062D] font-semibold whitespace-nowrap">
            <Image 
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/e9308dc79c9676e9e52ee2c3b9264328d669b46398d83241054200e89295a6cd?placeholderIfAbsent=true&apiKey=d4c1990e0e0f43419dec73e7bca3d520" 
              alt="Startupilot Logo" 
              width={75} 
              height={75} 
              className="object-contain" 
            />
            <span className="self-end mt-[38px]">Startupilot</span>
          </div>
          {navItems.map((item, index) => (
            <div key={index} className="flex mt-8 gap-2">
              <Image 
                src={item.icon} 
                alt="" 
                width={35} 
                height={35} 
                className="object-contain" 
              />
              <span className="my-auto">{item.label}</span>
            </div>
          ))}
        </div>
        <div className="self-end flex mt-7 items-start gap-3 font-normal text-right">
          <div className="flex flex-col">
            <span className="text-[#0D062D] text-base self-end">{userProfile.name}</span>
            <span className="text-[#787486] text-sm mt-3.5">{userProfile.location}</span>
          </div>
          <Image 
            src={userProfile.avatar} 
            alt="User avatar" 
            width={52} 
            height={52} 
            className="object-contain" 
          />
        </div>
      </nav>
      <Image 
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/df2200b05475bdac276519c96f824bfd93c3ae14d590aced98e8088487d17f38?placeholderIfAbsent=true&apiKey=d4c1990e0e0f43419dec73e7bca3d520" 
        alt="" 
        width={1505} 
        height={100} 
        className="w-full z-10 mt-10 object-contain" 
      />
    </header>
  );
};

export default NavigationBar;
