interface FormInputProps {
    id: string;
    label: string;
    value: string;
    placeholder: string;
    unit: string;
    onChange: (value: string) => void;
    required?: boolean;
}

export default function FormInput({
    id,
    label,
    value,
    placeholder,
    unit,
    onChange,
    required = true,
}: FormInputProps) {
    return (
        <div className="form-input-container  text text--large" style={{
            
        }}>
                <label htmlFor={id} className="form-input-label-left">
                    {label.split('').map((char, i) => (
                        <span key={i}>
                            {char}
                            {i < label.length - 1 && <br />}
                        </span>
                    ))}
                </label>
            <input
                className="text text--large"
                type="number"
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                required={required}
            />
            <label htmlFor={id} className="form-input-label-right">
                {unit}
            </label>
        </div>
    );
}
