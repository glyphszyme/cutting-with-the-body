interface StepFooterProps {
    lines: string[];
}

export default function StepFooter({ lines }: StepFooterProps) {
    return (
        <div className="step-footer">
            {lines.map((line, index) => (
                <div key={index} className="text">{line}</div>
            ))}
        </div>
    );
}
