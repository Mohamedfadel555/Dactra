import { useState } from "react";
import { Field, ErrorMessage } from "formik";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";

export default function FormInputField({
  name,
  label,
  type = "text",
  placeholder,
  icon: Icon,
  className = "",
  options,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";
  const inputType = isPasswordField && showPassword ? "text" : type;
  const showPasswordToggle = isPasswordField;
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flex flex-col gap-[5px]">
      <label htmlFor={name} className="text-[#003465] font-[500] font-english">
        {label}
      </label>
      <div className="relative">
        {options ? (
          <Field
            as="select"
            id={name}
            name={name}
            className={`w-full h-[32px] border text-[#003465] border-[#BCBEC0] rounded-[5px] px-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:bg-blue-50 transition-all duration-300 ${className}`}
          >
            <option value="" disabled>
              {placeholder || "Select"}
            </option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Field>
        ) : (
          <Field
            type={inputType}
            id={name}
            name={name}
            max={type === "date" ? today : undefined}
            placeholder={placeholder}
            className={`w-full h-[32px] peer border placeholder:text-[#BCBEC0] placeholder:text-[15px] border-[#BCBEC0] rounded-[5px] pl-8 ${
              showPasswordToggle ? "pr-8" : ""
            } focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:bg-blue-50 transition-all duration-300 ${className}`}
          />
        )}
        {!options && Icon && (
          <Icon className="absolute transition-all duration-300 peer-focus:text-blue-500 left-2 top-1/2 peer-[]: -translate-y-1/2 text-[#BCBEC0]" />
        )}
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[#BCBEC0] hover:text-[#3E69FE] transition-colors duration-300"
          >
            {showPassword ? (
              <RiEyeOffLine className="text-[18px]" />
            ) : (
              <RiEyeLine className="text-[18px]" />
            )}
          </button>
        )}
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-[12px]"
      />
    </div>
  );
}
