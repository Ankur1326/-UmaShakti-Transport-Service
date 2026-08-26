interface FormInputProps {
  label: string;
  type?: string;
  value: string | number | null;
  min?: number;
  max?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
  disable?: boolean;

}

const FormInput: React.FC<FormInputProps> = ({
  label,
  type = "text",
  value,
  max = 100,
  min = 0,
  onChange,
  required = false,
  disable = false,
  placeholder = "",
  className = "",
}) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-text_secondary">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}  {/* Required indicator */}
      </label>
      <input
        type={type}
        min={min}
        max={max}
        value={value ?? ""}
        onChange={onChange}
        required={required}
        disabled={disable || false}
        placeholder={placeholder}
        className={`w-full px-3 py-2 ${className} pr-5 rounded-sm border focus:outline-0 focus:border-[0.5px] focus:border-gray-900 border-gray-400 hover:border-gray-300 bg-gray-50 w-full dark:bg-gray-800 dark:border-border_secondary dark:hover:border-hover_border dark:text-white transition-colors duration-200`}
      />
    </div>
  );
};

export default FormInput;
