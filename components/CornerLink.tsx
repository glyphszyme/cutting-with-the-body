import Link from 'next/link';

interface CornerLinkProps {
    href?: string;
    onClick?: () => void;
    children: React.ReactNode;
}

export default function CornerLink({ href, onClick, children }: CornerLinkProps) {
    if (onClick) {
        return (
            <button 
                type="button"
                onClick={onClick} 
                className="corner-link corner-link-button"
            >
                {children}
            </button>
        );
    }
    
    return (
        <Link href={href || '#'} className="corner-link">
            {children}
        </Link>
    );
}
