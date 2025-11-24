import { BodyPartGroup } from "@/data/bodyParts";

interface BodyPartSelectorProps {
    groups: BodyPartGroup[];
    selected: string[];
    onToggle: (partId: string) => void;
}

export default function BodyPartSelector({
    groups,
    selected,
    onToggle,
}: BodyPartSelectorProps) {
    return (
        <div className="body-parts-container">
            {/* 그룹 1: 손과 팔 */}
            <div className="major-group">
                {groups.slice(0, 2).map((group) => (
                    <div key={group.group} className="body-part-group">
                        <div className="checkbox-group">
                            {group.parts.map((part) => (
                                <button
                                    key={part.id}
                                    type="button"
                                    className={`body-part-button ${selected.includes(part.id) ? 'selected' : ''}`}
                                    onClick={() => onToggle(part.id)}
                                >
                                    {part.label}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* 그룹 2: 발과 다리 */}
            <div className="major-group">
                {groups.slice(2, 4).map((group) => (
                    <div key={group.group} className="body-part-group">
                        <div className="checkbox-group">
                            {group.parts.map((part) => (
                                <button
                                    key={part.id}
                                    type="button"
                                    className={`body-part-button ${selected.includes(part.id) ? 'selected' : ''}`}
                                    onClick={() => onToggle(part.id)}
                                >
                                    {part.label}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* 그룹 3: 몸통과 머리 */}
            <div className="major-group">
                {groups.slice(4, 6).map((group) => (
                    <div key={group.group} className="body-part-group">
                        <div className="checkbox-group">
                            {group.parts.map((part) => (
                                <button
                                    key={part.id}
                                    type="button"
                                    className={`body-part-button ${selected.includes(part.id) ? 'selected' : ''}`}
                                    onClick={() => onToggle(part.id)}
                                >
                                    {part.label}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
