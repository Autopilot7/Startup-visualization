import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";
                
                
                
  type InputFieldProps = {
                
    label: string;
                
    type?: string;
                
    register: any;
                
    name: string;
                
    error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
                
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
                
    className?: string;
                
  };

const InputField = ({
  label,
  type = "text",
  register,
  name,
  error,
  inputProps,
  className = "flex flex-col gap-2 w-full",
}: InputFieldProps) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        {...register(name)}
        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
        {...inputProps}
      />
      {error?.message && (
        <p className="text-xs text-red-400">{error.message as String}</p>
      )}
    </div>
  );
};

export default InputField;