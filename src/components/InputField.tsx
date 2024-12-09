import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";
                
                
                
  type InputFieldProps = {
                
    label: string;
                
    type?: string;
                
    register: any;
                
    name: string;
                
    defaultValue?: string;
                
    error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
                
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
                
    className?: string;
                
  };

const InputField = ({
  label,
  type = "text",
  register,
  name,
  defaultValue,
  error,
  inputProps,
  className = "flex flex-col gap-2 w-full",
}: InputFieldProps) => {
  return (
    <div className={className}>
      <label className="text-xs text-gray-500">{label}</label>
      <input
        type={type}
        {...register(name)}
        placeholder={`   Fill in the ${label}`}
        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
        {...inputProps}
        defaultValue={defaultValue}
      />
      {error?.message && (
        <p className="text-xs text-red-400">{error.message.toString()}</p>
      )}
    </div>
  );
};

export default InputField;