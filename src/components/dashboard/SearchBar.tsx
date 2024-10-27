import React from 'react';
import Image from 'next/image'; // Import Next.js Image component

const SearchBar: React.FC = () => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-4 justify-start text-[#0D062D] font-inter font-medium">
        <h1 className="text-[46px] font-semibold w-64">Home page</h1>
        <button className="rounded-md bg-white min-h-[47px] px-4 py-3 border border-[#787486]">
          Add startup
        </button>
        <div className="relative">
          <button className="rounded-md bg-white min-h-[47px] px-6 py-3 border border-[#787486]">
            Export
          </button>
          <div className="bg-white absolute right-2.5 bottom-8 w-3.5 h-5" />
        </div>
      </div>
      
      <div className="flex mt-7 gap-4 items-center text-[#787486] font-inter">
        <div className="flex-1 rounded-[10px] bg-white shadow-md min-w-[240px] gap-8 p-4 border border-[#B9BEC5] flex items-center">
          <Image 
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/f94425102c79f5c2c9439e5baac11f6d975166e2695dcfdc2b2be7be20901437?placeholderIfAbsent=true&apiKey=d4c1990e0e0f43419dec73e7bca3d520" 
            alt="Search icon" 
            width={28} 
            height={28} 
            className="object-contain" 
          />
          <input
            type="search"
            placeholder="Search for startups...."
            className="flex-1 text-2xl font-normal outline-none"
            aria-label="Search for startups"
          />
        </div>
        
        <div className="flex items-center gap-2.5">
          <select
            className="rounded-[10px] shadow-md w-[187px] p-3.5 border border-[#B9BEC5] appearance-none bg-white text-2xl font-normal"
            aria-label="Sort options"
          >
            <option>Sorted by</option>
          </select>
          <Image 
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/919583f5d0e4e3ccf6afa43be1b7466a12b36523741ea9bbdfc0e645edd81b49?placeholderIfAbsent=true&apiKey=d4c1990e0e0f43419dec73e7bca3d520" 
            alt="" 
            width={32} 
            height={32} 
            className="-ml-10 pointer-events-none object-contain" 
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
