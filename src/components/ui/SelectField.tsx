interface SelectFieldProps {
  disabled?: boolean;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

export default function SelectField({ disabled = false, label, value, onChange, options }: SelectFieldProps) {
  return (
    <label className="field">
      <span>{label}</span>
      <select disabled={disabled} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
