interface FormTextareaProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    required?: boolean;
    className?: string;
    rows?: number;
    placeholder?: string;
}

const FormTextarea: React.FC<FormTextareaProps> = ({
    label,
    value,
    onChange,
    required = false,
    className = "",
    rows = 4,
    placeholder = "",
}) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>} {/* Required indicator */}
            </label>
            <textarea
                value={value}
                onChange={onChange}
                required={required}
                rows={rows}
                placeholder={placeholder}
                className={`w-full px-3 py-2 border border-gray-400 hover:border-gray-300 focus:outline-0 focus:border-[0.5px] focus:border-gray-900 rounded shadow-sm text-sm resize-none dark:border-border_secondary dark:hover:border-hover_border ${className}`}
            />
        </div>
    );
};

export default FormTextarea;
