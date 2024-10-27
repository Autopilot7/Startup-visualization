import React from 'react';

interface CheckboxGroupProps {
  title: string;
  items: string[];
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ title, items }) => {
  return (
    <div className="flex w-[220px] max-w-full flex-col text-base text-[#111928] px-2">
      <h3 className="text-lg font-semibold">{title}</h3>
      {items.map((item, index) => (
        <label key={index} className="flex mt-4 items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            className="w-5 h-5 rounded border-[#DFE4EA] bg-white"
            aria-label={item}
          />
          <span className="self-stretch my-auto">{item}</span>
        </label>
      ))}
    </div>
  );
};

export default CheckboxGroup;