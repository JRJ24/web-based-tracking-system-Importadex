import type { HTMLInputTypeAttribute } from "react";

interface TextFieldProps {
  disabled?: boolean;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: HTMLInputTypeAttribute;
}

export default function TextField({
  disabled = false,
  label,
  value,
  onChange,
  placeholder = "",
  required = false,
  type = "text",
}: TextFieldProps) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        disabled={disabled}
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
