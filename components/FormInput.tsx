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
        <div className="form-group" style={{
            backgroundColor: 'black',
            color: 'white',
            height: 67,
            margin: '10px 0',
        }}>
            <label htmlFor={id} style={{
                fontSize: '20px',
                left: '55px',
                position: 'absolute',
            }}>
                {label.split('').map((char, i) => (
                    <span key={i}>
                        {char}
                        {i < label.length - 1 && <br />}
                    </span>
                ))}
            </label>
            <input
                type="number"
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                style={{
                    width: '100px',
                    textAlign: 'right',
                    fontSize: '20px',
                    position: 'absolute',
                    right: '100px',
                }}
                required={required}
            />
            <label htmlFor={id} style={{
                fontSize: '20px',
                position: 'absolute',
                right: '55px',
            }}>
                {unit}
            </label>
        </div>
    );
}
