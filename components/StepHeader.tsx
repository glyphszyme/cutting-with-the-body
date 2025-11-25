interface StepHeaderProps {
    stepNumber: number;
    title: string[];
}

export default function StepHeader({ stepNumber, title }: StepHeaderProps) {
    return (
        <div className="step-header">
            <div className="text">{stepNumber}</div>
            {title.map((line, index) => (
                <div key={index} className="text">{line}</div>
            ))}
        </div>
    );
}
